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

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<any, any>;
  },
  ref: React.Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

interface IEventFormDialogProps {
  open: boolean;
  onClose: () => void;
}

export function EventFormDialog(props: IEventFormDialogProps) {
  return (
    <div>
      <Dialog
        open={props.open}
        TransitionComponent={Transition}
        keepMounted
        onClose={props.onClose}
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogTitle>Create Event</DialogTitle>
        <DialogContent>
          <TextField
            type="date"
            margin="normal"
            label="Date"
            fullWidth
            variant="standard"
          ></TextField>
          <TextField
            autoFocus
            margin="normal"
            label="Description"
            fullWidth
            variant="standard"
          ></TextField>
          <TextField
            type="time"
            margin="normal"
            label="Time"
            fullWidth
            variant="standard"
          ></TextField>
        </DialogContent>
        <FormControl variant="standard" sx={{ mx: 3, minWidth: 120 }}>
          <InputLabel id="select-calendar">Agenda</InputLabel>
          <Select labelId="select-calendar">
            <MenuItem value={1}>Personal</MenuItem>
            <MenuItem value={2}>Work</MenuItem>
          </Select>
        </FormControl>
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
