import { format, isThisYear, isToday } from 'date-fns';

export function getDateString(date: Date):string {
   const parsedDate = new Date(date);

   if (isToday(parsedDate)) {
      return format(parsedDate, 'p');
   } else if (isThisYear(parsedDate)) {
      return format(parsedDate, 'MMM d');
   } else {
      return format(parsedDate, 'MMM d, yyyy');
   }
}
