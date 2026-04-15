const MONTHS = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

export function getToday() {
  const now = new Date();
  const year = now.getFullYear();
  const month = (now.getMonth() + 1).toString().padStart(2, '0');
  const day = now.getDate().toString().padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function formatMonth(isoMonth: string) {
  const [year, month] = isoMonth.split('-');
  return `${MONTHS[parseInt(month) - 1]} ${year}`;
}

export function addMonths(month: string, increment: number) {
  const jsDate = new Date(month + '-01T12:00:00');
  jsDate.setMonth(jsDate.getMonth() + increment);
  return `${jsDate.getFullYear()}-${(jsDate.getMonth() + 1)
    .toString()
    .padStart(2, '0')}`;
}
