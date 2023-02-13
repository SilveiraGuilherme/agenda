export interface ICalendar {
  id: number;
  name: string;
  color: string;
}

export interface IEditingEvent {
  id?: number;
  date: string;
  time?: string;
  desc: string;
  calendarId: number;
}

export interface IEvent extends IEditingEvent {
  id: number;
}

//LOCAL HOST: const baseURL = 'http://localhost:8080';
//REMOTE: const baseURL = 'https://agenda-backend-silveiraguilherme.glitch.me/';
const baseURL = 'http://localhost:8080';

export function getCalendarsEndpoint(): Promise<ICalendar[]> {
  return fetch(`${baseURL}/calendars`).then(handleResponse);
}

export function getEventsEndpoint(from: string, to: string): Promise<IEvent[]> {
  return fetch(
    `${baseURL}/events?date_gte=${from}&date_lte=${to}&_sort=date,time`
  ).then(handleResponse);
}

export function createEventEndpoint(event: IEditingEvent): Promise<IEvent> {
  return fetch(`${baseURL}/events`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(event),
  }).then(handleResponse);
}

export function updateEventEndpoint(event: IEditingEvent): Promise<IEvent> {
  return fetch(`${baseURL}/events/${event.id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(event),
  }).then(handleResponse);
}

export function deleteEventEndpoint(eventId: number): Promise<void> {
  return fetch(`${baseURL}/events/${eventId}`, {
    method: 'DELETE',
  }).then(handleResponse);
}

export function getUserEndpoint(): Promise<void> {
  return fetch(`${baseURL}/auth/user`, {}).then(handleResponse);
}

function handleResponse(resp: Response) {
  if (resp.ok) {
    return resp.json();
  } else {
    throw new Error(resp.statusText);
  }
}
