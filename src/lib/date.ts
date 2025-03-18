import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';

dayjs.extend(customParseFormat);

export function formatDate(dateString: string | Date, format: string = 'DD-MM-YYYY'): string {
  return dayjs(dateString).format(format);
}

export function formatTime(dateString: string | Date, format: string = 'hh:mm:ss A'): string {
  return dayjs(dateString).format(format);
}

export function formatDateWithTime(dateString: string | Date, format: string = 'DD-MM-YYYY hh:mm:ss A'): string {
  return dayjs(dateString).format(format);
}

export function convertDate(dateString: string, format: string = 'DD-MM-YYYY'): Date {
  return dayjs(dateString, format).toDate();
}
