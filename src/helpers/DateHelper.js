import moment from 'moment';

export const getCurrentFormattedDate = (format) => {
  return moment().format(format);
};

export const formatDate = (date, dateFormat = null, format = null) => {
  return moment(date, dateFormat).format(format);
};

export const getWeekDays = () => {
  return moment.weekdays();
};

export const getCurrentDayOfWeek = (date = null) => {
  return moment(date).day();
};

export const getMonthDays = (date, format = null) => {
  return Array.from(Array(moment(date, format).daysInMonth()), (_, i) => i + 1);
};

export const momentify = (date = null) => {
  return moment(date);
};

//format YYYY-MM-D to JS date
export const weekDateFormatter = (date) => {
  return new Date(
    parseInt(date.split('-')[0]),
    parseInt(date.split('-')[1]) - 1,
    parseInt(date.split('-')[2]),
  );
};

export const getLastDayOfDate = (date) => {
  return moment(date).endOf('month').format('D');
};

export const addDaysToDate = (date, format, daysToAdd) => {
  return moment(date, format).add(daysToAdd, 'days');
};

export const subtractDaysToDate = (date, format, daysToAdd) => {
  return moment(date, format).subtract(daysToAdd, 'days');
};