import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';

dayjs.extend(customParseFormat);

export function formatDate(dateString: string | Date): string {
  return dayjs(dateString).format('DD-MM-YYYY');
}

export function formatTime(dateString: string | Date): string {
  return dayjs(dateString).format('hh:mm:ss A');
}

export function formatDateWithTime(dateString: string | Date): string {
  return dayjs(dateString).format('DD-MM-YYYY hh:mm:ss A');
}

export function convertDate(dateString: string): Date {
  return dayjs(dateString, 'DD-MM-YYYY').toDate();
}
