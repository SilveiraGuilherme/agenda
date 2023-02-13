import { Box, Button, TextField } from '@mui/material';
import Container from '@mui/material/Container';
import { useEffect, useState } from 'react';

export function LoginScreen() {
  const [email, setEmail] = useState('myname@agenda.com');
  const [password, setPassword] = useState('1234');

  function signIn(evt: React.FormEvent) {
    evt.preventDefault();
  }

  return (
    <Container maxWidth="sm">
      <h1>Agenda React</h1>
      <p>
        Type your email and password to access your agenda. To it out, use the
        email <kbd>myname@agenda.com</kbd> and the password <kbd>1234</kbd>.
      </p>
      <form onSubmit={signIn}>
        <TextField
          margin="normal"
          label="Email"
          fullWidth
          variant="outlined"
          value={email}
          onChange={evt => setEmail(evt.target.value)}
        ></TextField>
        <TextField
          type="password"
          margin="normal"
          label="Password"
          fullWidth
          variant="outlined"
          value={password}
          onChange={evt => setPassword(evt.target.value)}
        ></TextField>
        <Box textAlign="right" marginTop="16px">
          <Button variant="contained">Enter</Button>
        </Box>
      </form>
    </Container>
  );
}
