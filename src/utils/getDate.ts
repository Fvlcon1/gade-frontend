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

export const getLastSixMonths = () => {
    const now = new Date();
    const months = [];
    for (let i = 5; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      months.push({
        label: date.toLocaleString("default", { month: "short" }),
        value: date.toISOString().split('T')[0],
      });
    }
    return months;
  };

export default getDate