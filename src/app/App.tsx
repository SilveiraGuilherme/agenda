import CalendarScreen from './CalendarScreen';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from 'react-router-dom';
import { getToday } from './dateFunctions';

function App() {
  const month = getToday().substring(0, 7);
  return (
    <Router>
      <Switch>
        <Route path={'/calendar/:month'}>
          <CalendarScreen />
        </Route>
        <Redirect to={{ pathname: '/calendar/' + month }}></Redirect>
      </Switch>
    </Router>
  );
}

export default App;
