import TableContainer from '@mui/material/TableContainer';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import IconButton from '@mui/material/IconButton';
import Icon from '@material-ui/core/Icon';
import { getEventsEndpoint, IEvent } from './backend';
import { useEffect, useState } from 'react';

const DAYS_OF_THE_WEEK = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];

export default function CalendarScreen() {
  const [events, setEvents] = useState<IEvent[]>([]);
  const weeks = generateCalendar(getToday(), events);
  const firstDay = weeks[0][0].date;
  const lastDay = weeks[weeks.length - 1][6].date;

  useEffect(() => {
    getEventsEndpoint(firstDay, lastDay).then(setEvents);
  }, [firstDay, lastDay]);

  return (
    <Box display="flex" height="100%" alignItems="stretch">
      <Box component={'section'} width="12em" padding="8px 16px">
        <h2>Agenda React</h2>
        <Button variant="contained">New Event</Button>
        <Box marginTop="64px">
          <h3>Agendas</h3>
          <FormControlLabel
            control={<Checkbox color="secondary" />}
            label="Personal"
          />
          <FormControlLabel
            control={<Checkbox color="success" />}
            label="Work"
          />
        </Box>
      </Box>
      <TableContainer component={'section'}>
        <Box
          display="flex"
          alignItems="center"
          padding="8px 16px"
          borderLeft="1px solid rgb(224, 224, 224)"
        >
          <IconButton aria-label="Previous month">
            <Icon>chevron_left</Icon>
          </IconButton>
          <IconButton aria-label="Next month">
            <Icon>chevron_right</Icon>
          </IconButton>
          <Box component="h3" flex="1" paddingLeft="16px">
            January 2023
          </Box>
          <Box>
            <IconButton aria-label="User">
              <Icon>person</Icon>
            </IconButton>
          </Box>
        </Box>
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
                                <Icon fontSize="inherit">watch_later</Icon>
                              )}
                              {event.time && (
                                <Box component={'span'} margin="0 4px">
                                  {event.time}
                                </Box>
                              )}
                              <span>{event.desc}</span>
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
  );
}

interface ICalendarCell {
  date: string;
  dayOfMonth: number;
  events: IEvent[];
}

function generateCalendar(
  date: string,
  allEvents: IEvent[]
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

      week.push({
        dayOfMonth: currentDay.getDate(),
        date: isoDate,
        events: allEvents.filter(e => e.date === isoDate),
      });
      currentDay.setDate(currentDay.getDate() + 1);
    }
    weeks.push(week);
  } while (currentDay.getMonth() === currentMonth);

  return weeks;
}

function getToday() {
  return '2021-06-03';
}
