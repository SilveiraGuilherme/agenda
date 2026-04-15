import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import { useEffect, useMemo, useReducer, useCallback, useState } from 'react';
import {
  getCalendarsEndpoint,
  getEventsEndpoint,
  ICalendar,
  IEvent,
} from './backend';
import { useParams } from 'react-router-dom';
import { CalendarsView } from './CalendarsView';
import { CalendarHeader } from './CalendarHeader';
import { Calendar, ICalendarCell, IEventWithCalendar } from './Calendar';
import { EventFormDialog } from './EventFormDialog';
import { getToday } from './dateFunctions';
import { reducer } from './calendarScreenReducer';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@material-ui/core/Icon';

function useCalendarScreenState(month: string) {
  const [state, dispatch] = useReducer(reducer, {
    calendars: [],
    calendarsSelected: [],
    events: [],
    editingEvent: null,
  });
  const { events, calendars, calendarsSelected, editingEvent } = state;

  const weeks = useMemo(() => {
    return generateCalendar(
      month + '-01',
      events,
      calendars,
      calendarsSelected
    );
  }, [month, events, calendars, calendarsSelected]);

  const firstDay = weeks[0][0].date;
  const lastDay = weeks[weeks.length - 1][6].date;
  useEffect(() => {
    Promise.all([
      getCalendarsEndpoint(),
      getEventsEndpoint(firstDay, lastDay),
    ]).then(([calendars, events]) => {
      dispatch({ type: 'load', payload: { calendars, events } });
    });
  }, [firstDay, lastDay]);

  function refreshEvents() {
    getEventsEndpoint(firstDay, lastDay).then(fetchedEvents => {
      dispatch({ type: 'load', payload: { events: fetchedEvents } });
    });
  }

  return {
    weeks,
    calendars,
    dispatch,
    refreshEvents,
    calendarsSelected,
    editingEvent,
  };
}

export default function CalendarScreen() {
  const { month } = useParams<{ month: string }>();
  const [drawerOpen, setDrawerOpen] = useState(false);

  const {
    weeks,
    calendars,
    dispatch,
    refreshEvents,
    calendarsSelected,
    editingEvent,
  } = useCalendarScreenState(month);

  const closeDialog = useCallback(() => {
    dispatch({ type: 'closeDialog' });
  }, [dispatch]);

  const sidebarContent = (
    <Box component={'section'} padding="8px 16px" width="12em">
      <h2>Agenda React</h2>
      <Button
        fullWidth
        variant="contained"
        onClick={() => {
          dispatch({ type: 'new', payload: getToday() });
          setDrawerOpen(false);
        }}
      >
        New Event
      </Button>
      <CalendarsView
        calendars={calendars}
        dispatch={dispatch}
        calendarsSelected={calendarsSelected}
      />
    </Box>
  );

  return (
    <Box display="flex" height="100%" alignItems="stretch">
      {/* Desktop Sidebar */}
      <Box
        component={'section'}
        width="12em"
        padding="8px 16px"
        sx={{ display: { xs: 'none', md: 'block' } }}
      >
        <h2>Agenda React</h2>
        <Button
          fullWidth
          variant="contained"
          onClick={() => dispatch({ type: 'new', payload: getToday() })}
        >
          New Event
        </Button>
        <CalendarsView
          calendars={calendars}
          dispatch={dispatch}
          calendarsSelected={calendarsSelected}
        />
      </Box>

      {/* Mobile Drawer */}
      <Drawer
        anchor="left"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
      >
        {sidebarContent}
      </Drawer>

      {/* Main Calendar Section */}
      <Box component={'section'} display="flex" flex="1" flexDirection="column">
        {/* Hamburger Menu for Mobile */}
        <Box sx={{ display: { xs: 'flex', md: 'none' }, alignItems: 'center', paddingLeft: '8px' }}>
          <IconButton
            onClick={() => setDrawerOpen(true)}
            size="large"
          >
            <MenuIcon fontSize="inherit">menu</MenuIcon>
          </IconButton>
        </Box>

        <CalendarHeader month={month} />
        <Calendar weeks={weeks} dispatch={dispatch} />
        <EventFormDialog
          event={editingEvent}
          onCancel={closeDialog}
          onSave={() => {
            closeDialog();
            refreshEvents();
          }}
          calendars={calendars}
        />
      </Box>
    </Box>
  );
}

function generateCalendar(
  date: string,
  allEvents: IEvent[],
  calendars: ICalendar[],
  calendarsSelected: boolean[]
): ICalendarCell[][] {
  const weeks: ICalendarCell[][] = [];
  const jsDate = new Date(date + 'T12:00:00');
  const currentMonth = jsDate.getMonth();

  const currentDay = new Date(jsDate.valueOf());
  currentDay.setDate(1);
  const dayOfWeek = currentDay.getDay();
  currentDay.setDate(1 - dayOfWeek);

  do {
    const week: ICalendarCell[] = [];
    for (let i = 0; i < 7; i++) {
      const monthStr = (currentDay.getMonth() + 1).toString().padStart(2, '0');
      const dayStr = currentDay.getDate().toString().padStart(2, '0');
      const isoDate = `${currentDay.getFullYear()}-${monthStr}-${dayStr}`;

      const events: IEventWithCalendar[] = [];
      for (const event of allEvents) {
        if (event.date === isoDate) {
          const calIndex = calendars.findIndex(
            cal => cal.id === event.calendarId
          );
          if (calendarsSelected[calIndex]) {
            events.push({ ...event, calendar: calendars[calIndex] });
          }
        }
      }
      week.push({
        dayOfMonth: currentDay.getDate(),
        date: isoDate,
        events,
      });
      currentDay.setDate(currentDay.getDate() + 1);
    }
    weeks.push(week);
  } while (currentDay.getMonth() === currentMonth);

  return weeks;
}
