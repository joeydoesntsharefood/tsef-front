import { formatInTimeZone } from 'date-fns-tz';

export const changeTimeZone = (
  data: Date
): string =>
  formatInTimeZone(
    data,
    'UTC',
    'dd/MM/yyyy HH:mm:ss'
  );
