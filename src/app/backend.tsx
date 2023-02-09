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

//const baseURL = 'http://localhost:8080';
const baseURL = 'https://agenda-backend-silveiraguilherme.glitch.me/';

export function getCalendarsEndpoint(): Promise<ICalendar[]> {
  return fetch(`${baseURL}/calendars`).then(resp => {
    return resp.json();
  });
}

export function getEventsEndpoint(from: string, to: string): Promise<IEvent[]> {
  return fetch(
    `${baseURL}/events?date_gte=${from}&date_lte=${to}&_sort=date,time`
  ).then(resp => {
    return resp.json();
  });
}

export function createEventEndpoint(event: IEditingEvent): Promise<IEvent> {
  return fetch(`${baseURL}/events`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(event),
  }).then(resp => {
    return resp.json();
  });
}

export function updateEventEndpoint(event: IEditingEvent): Promise<IEvent> {
  return fetch(`${baseURL}/events/${event.id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(event),
  }).then(resp => {
    return resp.json();
  });
}

export function deleteEventEndpoint(eventId: number): Promise<void> {
  return fetch(`${baseURL}/events/${eventId}`, {
    method: 'DELETE',
  }).then(resp => {
    return resp.json();
  });
}
