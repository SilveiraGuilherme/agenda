import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import { useEffect, useMemo, useReducer, useCallback } from 'react';
import {
  getCalendarsEndpoint,
  getEventsEndpoint,
  ICalendar,
  IEvent,
  IEditingEvent,
} from './backend';
import { useParams } from 'react-router-dom';
import { CalendarsView } from './CalendarsView';
import { CalendarHeader } from './CalendarHeader';
import { Calendar, ICalendarCell, IEventWithCalendar } from './Calendar';
import { EventFormDialog } from './EventFormDialog';
import { getToday } from './dateFunctions';

interface ICalendarScreenState {
  calendars: ICalendar[];
  calendarsSelected: boolean[];
  events: IEvent[];
  editingEvent: IEditingEvent | null;
}

type ICalendarScreenAction =
  | {
      type: 'load';
      payload: {
        events: IEvent[];
        calendars?: ICalendar[];
      };
    }
  | {
      type: 'new';
      payload: string;
    }
  | {
      type: 'edit';
      payload: IEditingEvent;
    }
  | {
      type: 'closeDialog';
    }
  | {
      type: 'toggleCalendar';
      payload: number;
    };

function reducer(
  state: ICalendarScreenState,
  action: ICalendarScreenAction
): ICalendarScreenState {
  switch (action.type) {
    case 'load':
      const calendars = action.payload.calendars ?? state.calendars;
      const selected = action.payload.calendars
        ? action.payload.calendars.map(() => true)
        : state.calendarsSelected;
      return {
        ...state,
        events: action.payload.events,
        calendars,
        calendarsSelected: selected,
      };
    case 'new':
      return {
        ...state,
        editingEvent: {
          date: action.payload,
          desc: '',
          calendarId: state.calendars[0].id,
        },
      };
    case 'edit':
      return {
        ...state,
        editingEvent: action.payload,
      };
    case 'closeDialog':
      return {
        ...state,
        editingEvent: null,
      };
    case 'toggleCalendar':
      const calendarsSelected = [...state.calendarsSelected];
      calendarsSelected[action.payload] = !calendarsSelected[action.payload];
      return {
        ...state,
        calendarsSelected,
      };
    default:
      return state;
  }
}

export default function CalendarScreen() {
  const { month } = useParams<{ month: string }>();

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
    getEventsEndpoint(firstDay, lastDay).then(() => {
      dispatch({ type: 'load', payload: { events } });
    });
  }

  const toggleCalendar = useCallback((i: number) => {
    dispatch({ type: 'toggleCalendar', payload: i });
  }, []);

  const openNewEvent = useCallback((date: string) => {
    dispatch({ type: 'new', payload: date });
  }, []);

  const editEvent = useCallback((event: IEvent) => {
    dispatch({ type: 'edit', payload: event });
  }, []);

  const closeDialog = useCallback(() => {
    dispatch({ type: 'closeDialog' });
  }, []);

  return (
    <Box display="flex" height="100%" alignItems="stretch">
      <Box component={'section'} width="12em" padding="8px 16px">
        <h2>Agenda React</h2>
        <Button variant="contained" onClick={() => openNewEvent(getToday())}>
          New Event
        </Button>
        <CalendarsView
          calendars={calendars}
          toggleCalendar={toggleCalendar}
          calendarsSelected={calendarsSelected}
        />
      </Box>
      <Box component={'section'} display="flex" flex="1" flexDirection="column">
        <CalendarHeader month={month} />
        <Calendar
          weeks={weeks}
          onClickDay={openNewEvent}
          onClickEvent={editEvent}
        />
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
