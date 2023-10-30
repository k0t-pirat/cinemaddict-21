import { DateType, MONTHS } from '../const/date';

const TIME_MINUTES = 60;

export const formatDuration = (duration) => {
  const minutes = duration % TIME_MINUTES;
  const hours = (duration - minutes) / TIME_MINUTES;

  return hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`;
};

const addLeadingZeroes = (rawNumber) => Number(rawNumber) < 10 ? `0${rawNumber}` : rawNumber;

const getFullYear = (date) => (new Date(date)).getFullYear();
const getFullDate = (date) => {
  const formattedDate = new Date(date);
  return `${formattedDate.getDate()} ${MONTHS[formattedDate.getMonth()]} ${formattedDate.getFullYear()}`;
};
const getFullDateTime = (date) => {
  const formattedDate = new Date(date);
  const fullDate = `${formattedDate.getFullYear()}/${addLeadingZeroes(formattedDate.getMonth() + 1)}/${addLeadingZeroes(formattedDate.getDate())}`;
  const dateTime = `${addLeadingZeroes(formattedDate.getHours())}:${addLeadingZeroes(formattedDate.getMinutes())}`;
  return `${fullDate} ${dateTime}`;
};

const getUserDateString = (diff, str) => `${diff} ${str}${diff > 1 ? 's' : ''} ago`;

const getUserDate = (date) => {
  const nowDate = new Date();
  const formattedDate = new Date(date);
  const nowDateInfo = {
    year: nowDate.getFullYear(),
    month: nowDate.getMonth(),
    day: nowDate.getDate(),
    hours: nowDate.getHours(),
    minutes: nowDate.getMinutes(),
  };
  const dateInfo = {
    year: formattedDate.getFullYear(),
    month: formattedDate.getMonth(),
    day: formattedDate.getDate(),
    hours: formattedDate.getHours(),
    minutes: formattedDate.getMinutes(),
  };

  if (nowDateInfo.year !== dateInfo.year) {
    return getUserDateString(nowDateInfo.year - dateInfo.year, 'year');
  } else if (nowDateInfo.month !== dateInfo.month) {
    return getUserDateString(nowDateInfo.month - dateInfo.month, 'month');
  } else if (nowDateInfo.day !== dateInfo.day) {
    return getUserDateString(nowDateInfo.day - dateInfo.day, 'day');
  } else if (nowDateInfo.hours !== dateInfo.hours) {
    return getUserDateString(nowDateInfo.hours - dateInfo.hours, 'hour');
  } else if (nowDateInfo.minutes !== dateInfo.minutes) {
    if (nowDateInfo.minutes - dateInfo.minutes > 15) {
      return getUserDateString(nowDateInfo.minutes - dateInfo.minutes, 'minute');
    } else {
      return 'a few minutes ago';
    }
  } else {
    return 'now';
  }
};

export const formatDate = (date, type) => {
  switch (type) {
    case DateType.YEAR:
      return getFullYear(date);
    case DateType.FULL:
      return getFullDate(date);
    case DateType.DATE_TIME:
      return getFullDateTime(date);
    case DateType.USER:
      return getUserDate(date);
  }
};

