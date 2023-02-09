import TableContainer from '@mui/material/TableContainer';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Box from '@mui/material/Box';
import Icon from '@material-ui/core/Icon';
import { ICalendar, IEvent } from './backend';

const DAYS_OF_THE_WEEK = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];

interface ICalendarProps {
  weeks: ICalendarCell[][];
}

export default function Calendar(props: ICalendarProps) {
  const { weeks } = props;
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
  );
}

export type IEventWithCalendar = IEvent & { calendar: ICalendar };

export interface ICalendarCell {
  date: string;
  dayOfMonth: number;
  events: IEventWithCalendar[];
}