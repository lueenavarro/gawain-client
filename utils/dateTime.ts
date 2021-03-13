import moment from "moment";

export const formatDate = (date: string | Date, format = "MMMM D, YYYY") =>
  date ? moment(date).format(format) : date;

export const formatDateTime = (
  date: string | Date,
  format = "MMMM D, YYYY, h:mm A"
) => (date ? moment(date).format(format) : date);

export const formatDateForApi = (date: string | Date, format = "YYYY-MM-DD") =>
  date ? moment(date).format(format) : date;

export const addDays = (date: Date, days: number) => {
  const result = new Date(date.getTime());
  result.setDate(result.getDate() + days);
  return result;
};
