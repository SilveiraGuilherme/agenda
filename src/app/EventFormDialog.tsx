import * as React from 'react';
import { useState, useEffect } from 'react';
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
import { createEventEndpoint, ICalendar, IEditingEvent } from './backend';

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<any, any>;
  },
  ref: React.Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

interface IEventFormDialogProps {
  event: IEditingEvent | null;
  calendars: ICalendar[];
  onCancel: () => void;
  onSave: () => void;
}

export function EventFormDialog(props: IEventFormDialogProps) {
  const [event, setEvent] = useState<IEditingEvent | null>(props.event);

  useEffect(() => {
    setEvent(props.event);
  }, [props.event]);

  function save(evt: React.FormEvent) {
    evt.preventDefault();
    if (event) {
      createEventEndpoint(event).then(props.onSave);
    }
  }

  return (
    <div>
      <Dialog
        open={!!event}
        TransitionComponent={Transition}
        keepMounted
        onClose={props.onCancel}
        aria-describedby="alert-dialog-slide-description"
      >
        <form onSubmit={save}>
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
                  onChange={evt =>
                    setEvent({ ...event, date: evt.target.value })
                  }
                ></TextField>
                <TextField
                  autoFocus
                  margin="normal"
                  label="Description"
                  fullWidth
                  variant="standard"
                  value={event.desc}
                  onChange={evt =>
                    setEvent({ ...event, desc: evt.target.value })
                  }
                ></TextField>
                <TextField
                  type="time"
                  margin="normal"
                  label="Time"
                  fullWidth
                  variant="standard"
                  value={event.time ?? ''}
                  onChange={evt =>
                    setEvent({ ...event, time: evt.target.value })
                  }
                ></TextField>
                <FormControl variant="standard" fullWidth>
                  <InputLabel id="select-calendar">Agenda</InputLabel>
                  <Select
                    labelId="select-calendar"
                    value={event.calendarId}
                    onChange={evt =>
                      setEvent({
                        ...event,
                        calendarId: evt.target.value as number,
                      })
                    }
                  >
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
            <Button type="button" onClick={props.onCancel}>
              Cancel
            </Button>
            <Button type="submit" color="primary">
              Save
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </div>
  );
}
