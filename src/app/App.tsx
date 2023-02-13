import CalendarScreen from './CalendarScreen';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from 'react-router-dom';
import { getToday } from './dateFunctions';
import { getUserEndpoint, IUser } from './backend';
import { useEffect, useState } from 'react';
import { LoginScreen } from './LoginScreen';
import { userContext } from './authContext';

function App() {
  const month = getToday().substring(0, 7);
  const [user, setUser] = useState<IUser | null>(null);

  useEffect(() => {
    getUserEndpoint().then(setUser, () => setUser(null));
  }, []);

  function signOut() {
    setUser(null);
  }

  if (user) {
    return (
      <userContext.Provider value={user}>
        <Router>
          <Switch>
            <Route path={'/calendar/:month'}>
              <CalendarScreen onSignOut={signOut} />
            </Route>
            <Redirect to={{ pathname: '/calendar/' + month }}></Redirect>
          </Switch>
        </Router>
      </userContext.Provider>
    );
  } else {
    return <LoginScreen onSignIn={setUser} />;
  }
}

export default App;
