import Box from '@mui/material/Box';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import { ICalendar } from './backend';
import React from 'react';

interface ICalendarsViewProps {
  calendars: ICalendar[];
  toggleCalendar: (i: number) => void;
  calendarsSelected: boolean[];
}

export const CalendarsView = React.memo(function CalendarsView(
  props: ICalendarsViewProps
) {
  const { calendars, calendarsSelected, toggleCalendar } = props;
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
              onChange={() => toggleCalendar(i)}
            />
          }
          label={calendar.name}
        />
      ))}
    </Box>
  );
});
