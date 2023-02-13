import { Box, Button, TextField } from '@mui/material';
import Container from '@mui/material/Container';
import { useEffect, useState } from 'react';
import { IUser, signInEndpoint } from './backend';

interface ILoginScreenProps {
  onSignIn: (user: IUser) => void;
}

export function LoginScreen(props: ILoginScreenProps) {
  const [email, setEmail] = useState('danilo@email.com');
  const [password, setPassword] = useState('1234');
  const [error, setError] = useState('');

  function signIn(evt: React.FormEvent) {
    evt.preventDefault();
    signInEndpoint(email, password).then(props.onSignIn, e => {
      setError('Email not found or incorrect password');
    });
  }

  return (
    <Container maxWidth="sm">
      <h1>Agenda React</h1>
      <p>
        Type your email and password to access your agenda. To it out, use the
        email <kbd>danilo@email.com</kbd> and the password <kbd>1234</kbd>.
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
        {error && (
          <Box
            sx={{
              backgroundColor: '#f2aeae',
              borderRadius: '4px',
              padding: '16px',
              marginTop: '16px',
            }}
          >
            {error}
          </Box>
        )}
        <Box textAlign="right" marginTop="16px">
          <Button type="submit" variant="contained">
            Enter
          </Button>
        </Box>
      </form>
    </Container>
  );
}
