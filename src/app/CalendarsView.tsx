import Box from '@mui/material/Box';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import { ICalendar } from './backend';
import React from 'react';
import { ICalendarScreenAction } from './calendarScreenReducer';

interface ICalendarsViewProps {
  calendars: ICalendar[];
  calendarsSelected: boolean[];
  dispatch: React.Dispatch<ICalendarScreenAction>;
}

export const CalendarsView = React.memo(function CalendarsView(
  props: ICalendarsViewProps
) {
  const { calendars, calendarsSelected } = props;
  return (
    <Box marginTop="64px">
      <h3>Agendas</h3>
      {calendars.map((calendar, i) => (
        <FormControlLabel
          key={calendar.id}
          control={
            <Checkbox
              style={{ color: calendar.color }}
              checked={calendarsSelected[i]}
              onChange={() =>
                props.dispatch({ type: 'toggleCalendar', payload: i })
              }
            />
          }
          label={calendar.name}
        />
      ))}
    </Box>
  );
});
