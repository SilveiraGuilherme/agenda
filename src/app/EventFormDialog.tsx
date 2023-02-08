import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Slide from '@mui/material/Slide';
import { TransitionProps } from '@mui/material/transitions';
import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from '@mui/material';
import { ICalendar } from './backend';

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<any, any>;
  },
  ref: React.Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export interface IEditingEvent {
  id?: number;
  date: string;
  time?: string;
  desc: string;
  calendarId: number;
}

interface IEventFormDialogProps {
  event: IEditingEvent | null;
  calendars: ICalendar[];
  onClose: () => void;
}

export function EventFormDialog(props: IEventFormDialogProps) {
  const { event } = props;
  return (
    <div>
      <Dialog
        open={!!event}
        TransitionComponent={Transition}
        keepMounted
        onClose={props.onClose}
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogTitle>Create Event</DialogTitle>
        <DialogContent>
          {event && (
            <>
              <TextField
                type="date"
                margin="normal"
                label="Date"
                fullWidth
                variant="standard"
                value={event.date}
              ></TextField>
              <TextField
                autoFocus
                margin="normal"
                label="Description"
                fullWidth
                variant="standard"
                value={event.desc}
              ></TextField>
              <TextField
                type="time"
                margin="normal"
                label="Time"
                fullWidth
                variant="standard"
                value={event.time}
              ></TextField>
              <FormControl variant="standard" fullWidth>
                <InputLabel id="select-calendar">Agenda</InputLabel>
                <Select labelId="select-calendar" value={event.calendarId}>
                  {props.calendars.map(calendar => (
                    <MenuItem key={calendar.id} value={calendar.id}>
                      {calendar.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={props.onClose}>Cancel</Button>
          <Button onClick={props.onClose} color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
