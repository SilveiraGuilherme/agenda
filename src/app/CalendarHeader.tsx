import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Icon from '@material-ui/core/Icon';
import { Link } from 'react-router-dom';
import { addMonths, formatMonth } from './dateFunctions';
import { UserMenu } from './UserMenu';

interface ICalendarHeaderProps {
  month: string;
  onSignOut: () => void;
}

export default function CalendarHeader(props: ICalendarHeaderProps) {
  const { month } = props;
  return (
    <Box
      component={'section'}
      display="flex"
      alignItems="center"
      padding="8px 16px"
      borderLeft="1px solid rgb(224, 224, 224)"
    >
      <IconButton
        aria-label="Previous month"
        component={Link}
        to={`/calendar/${addMonths(month, -1)}`}
      >
        <Icon>chevron_left</Icon>
      </IconButton>
      <IconButton
        aria-label="Next month"
        component={Link}
        to={`/calendar/${addMonths(month, 1)}`}
      >
        <Icon>chevron_right</Icon>
      </IconButton>
      <Box component="h3" flex="1" paddingLeft="16px">
        {formatMonth(month)}
      </Box>
      <Box>
        <UserMenu onSignOut={props.onSignOut} />
      </Box>
    </Box>
  );
}
