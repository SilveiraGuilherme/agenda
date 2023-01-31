import TableContainer from '@mui/material/TableContainer';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';

const DAYS_OF_THE_WEEK = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'];

export default function CalendarScreen() {
  return (
    <TableContainer component={'section'}>
      <Table
        sx={{
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
  );
}
