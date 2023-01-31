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

const DAYS_OF_THE_WEEK = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'];

export default function CalendarScreen() {
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
                    x
                  </TableCell>
                );
              })}
            </TableRow>
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
                    y
                  </TableCell>
                );
              })}
            </TableRow>
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
                    z
                  </TableCell>
                );
              })}
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
