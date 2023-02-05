import TableContainer from '@mui/material/TableContainer';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Icon from '@material-ui/core/Icon';
import { useEffect, useState } from 'react';
import {
  getCalendarsEndpoint,
  getEventsEndpoint,
  ICalendar,
  IEvent,
} from './backend';
import { useParams } from 'react-router-dom';
import CalendarsView from './CalendarsView';
import CalendarHeader from './CalendarHeader';

const DAYS_OF_THE_WEEK = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];

export default function CalendarScreen() {
  const { month } = useParams<{ month: string }>();

  const [calendars, setCalendars] = useState<ICalendar[]>([]);
  const [calendarsSelected, setCalendarsSelected] = useState<boolean[]>([]);
  const [events, setEvents] = useState<IEvent[]>([]);
  const weeks = generateCalendar(
    month + '-01',
    events,
    calendars,
    calendarsSelected
  );
  const firstDay = weeks[0][0].date;
  const lastDay = weeks[weeks.length - 1][6].date;

  useEffect(() => {
    Promise.all([
      getCalendarsEndpoint(),
      getEventsEndpoint(firstDay, lastDay),
    ]).then(([calendars, events]) => {
      setCalendarsSelected(calendars.map(() => true));
      setCalendars(calendars);
      setEvents(events);
    });
  }, [firstDay, lastDay]);

  function toggleCalendar(i: number) {
    const newValue = [...calendarsSelected];
    newValue[i] = !newValue[i];
    setCalendarsSelected(newValue);
  }

  return (
    <Box display="flex" height="100%" alignItems="stretch">
      <Box component={'section'} width="12em" padding="8px 16px">
        <h2>Agenda React</h2>
        <Button variant="contained">New Event</Button>
        <CalendarsView
          calendars={calendars}
          toggleCalendar={toggleCalendar}
          calendarsSelected={calendarsSelected}
        />
      </Box>
      <Box display="flex" flex="1" flexDirection="column">
        <CalendarHeader month={month} />
        <TableContainer style={{ flex: '1' }} component={'section'}>
          <Table
            sx={{
              minHeight: '100%',
              borderRight: 1,
              borderTop: 1,
              borderColor: 'grey.300',
              tableLayout: 'fixed',
            }}
            aria-label="simple table"
          >
            <TableHead>
              <TableRow>
                {DAYS_OF_THE_WEEK.map(day => {
                  return (
                    <TableCell
                      sx={{
                        borderLeft: 1,
                        borderColor: 'grey.300',
                      }}
                      align="center"
                      key={day}
                    >
                      {day}
                    </TableCell>
                  );
                })}
              </TableRow>
            </TableHead>
            <TableBody>
              {weeks.map((week, i) => {
                return (
                  <TableRow key={i}>
                    {week.map(cell => {
                      return (
                        <TableCell
                          sx={{
                            borderLeft: 1,
                            borderColor: 'grey.300',
                            verticalAlign: 'top',
                            overflow: 'hidden',
                            padding: '8px 4px',
                          }}
                          align="center"
                          key={cell.date}
                        >
                          <Box
                            component={'div'}
                            sx={{
                              fontWeight: 500,
                              marginBottom: '4px',
                            }}
                          >
                            {cell.dayOfMonth}
                          </Box>
                          {cell.events.map(event => {
                            const color = event.calendar.color;
                            return (
                              <Box
                                component={'button'}
                                key={event.id}
                                sx={{
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'left',
                                  background: 'none',
                                  border: 'none',
                                  cursor: 'pointer',
                                  whiteSpace: 'nowrap',
                                  margin: '4px 0',
                                }}
                              >
                                {event.time && (
                                  <>
                                    <Icon style={{ color }} fontSize="inherit">
                                      watch_later
                                    </Icon>
                                    <Box component={'span'} margin="0 4px">
                                      {event.time}
                                    </Box>
                                  </>
                                )}
                                {event.time ? (
                                  <span>{event.desc}</span>
                                ) : (
                                  <span
                                    style={{
                                      display: 'inline-block',
                                      backgroundColor: color,
                                      color: 'white',
                                      padding: '2px 4px',
                                      borderRadius: '4px',
                                    }}
                                  >
                                    {event.desc}
                                  </span>
                                )}
                              </Box>
                            );
                          })}
                        </TableCell>
                      );
                    })}
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </Box>
  );
}

type IEventWithCalendar = IEvent & { calendar: ICalendar };

interface ICalendarCell {
  date: string;
  dayOfMonth: number;
  events: IEventWithCalendar[];
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
    for (let i = 0; i < DAYS_OF_THE_WEEK.length; i++) {
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
