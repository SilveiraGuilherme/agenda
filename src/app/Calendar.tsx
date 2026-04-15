import TableContainer from '@mui/material/TableContainer';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Box from '@mui/material/Box';
import Icon from '@material-ui/core/Icon';
import { ICalendar, IEvent } from './backend';
import { getToday } from './dateFunctions';
import React from 'react';
import { ICalendarScreenAction } from './calendarScreenReducer';

const DAYS_OF_THE_WEEK = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];

interface ICalendarProps {
  weeks: ICalendarCell[][];
  dispatch: React.Dispatch<ICalendarScreenAction>;
}

export const Calendar = React.memo(function Calendar(props: ICalendarProps) {
  const { weeks } = props;

  function handleClick(evt: React.MouseEvent, date: string) {
    if (evt.target === evt.currentTarget) {
      props.dispatch({ type: 'new', payload: date });
    }
  }

  return (
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
                  const todayStyle = {
                    backgroundColor: '#1976d2',
                    color: 'white',
                  };
                  const dayOfMonthStyle = {
                    display: 'inline-block',
                    width: '24px',
                    lineHeight: '24px',
                    fontWeigth: 500,
                    marginBottom: '4px',
                    borderRadius: '50%',
                  };
                  return (
                    <TableCell
                      sx={{
                        borderLeft: 1,
                        borderColor: 'grey.300',
                        verticalAlign: 'top',
                        overflow: 'hidden',
                        height: '8.5rem',
                        padding: '8px 4px',
                      }}
                      align="center"
                      key={cell.date}
                      onClick={me => handleClick(me, cell.date)}
                    >
                      <Box
                        sx={
                          cell.date === getToday()
                            ? { ...dayOfMonthStyle, ...todayStyle }
                            : dayOfMonthStyle
                        }
                      >
                        {cell.dayOfMonth}
                      </Box>
                      <Box
                        sx={{
                          maxHeight: '5.8rem',
                          overflowY: 'scroll',
                          overflowX: 'hidden',
                          scrollbarWidth: 'auto',
                          scrollbarGutter: 'stable',
                          '&::-webkit-scrollbar': {
                            width: '5px',
                          },
                          '&::-webkit-scrollbar-thumb': {
                            backgroundColor: '#999',
                            borderRadius: '4px',
                            minHeight: '40px',
                          },
                          '&::-webkit-scrollbar-track': {
                            backgroundColor: 'transparent',
                          },
                        }}
                      >
                        {[...cell.events].sort(compareEventsByTime).map(event => {
                          const color = event.calendar.color;
                          const displayTime = event.time || '12:30';
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
                              onClick={() =>
                                props.dispatch({ type: 'edit', payload: event })
                              }
                            >
                              <Icon style={{ color }} fontSize="inherit">
                                watch_later
                              </Icon>
                              <Box component={'span'} margin="0 4px">
                                {displayTime}
                              </Box>
                              <span>{event.desc}</span>
                            </Box>
                          );
                        })}
                      </Box>
                    </TableCell>
                  );
                })}
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
});

export type IEventWithCalendar = IEvent & { calendar: ICalendar };

export interface ICalendarCell {
  date: string;
  dayOfMonth: number;
  events: IEventWithCalendar[];
}

function compareEventsByTime(a: IEventWithCalendar, b: IEventWithCalendar) {
  const timeA = a.time || '99:99';
  const timeB = b.time || '99:99';
  return timeA.localeCompare(timeB);
}
