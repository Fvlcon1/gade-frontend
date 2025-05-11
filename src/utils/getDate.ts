import { months, shortMonthNames } from "./constants"
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(relativeTime);
  
const getShortMonth = (date : Date) => {
  const monthIndex = dayjs(date).month();
  return shortMonthNames[monthIndex];
};

export const getRelativeTime = (date : Date) => {
  return dayjs(date).fromNow();
};

export const getTime = (date : Date) => {
    return dayjs(date).format('h:mm A');
};

const getDate = (date: Date, options?: { shortmonth?: boolean }) => {
    const {shortmonth} = options ?? {
        shortmonth : false
    }
    if(shortmonth)
        return `${getShortMonth(date)} ${date.getDate()}, ${date.getFullYear()}`
    return `${months[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`
}

export default getDate