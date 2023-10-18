import {MONTHS, DateType} from '../const';

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

export const formatDate = (date, type) => {
  switch (type) {
    case DateType.YEAR:
      return getFullYear(date);
    case DateType.FULL:
      return getFullDate(date);
    case DateType.DATE_TIME:
      return getFullDateTime(date);
  }
};

