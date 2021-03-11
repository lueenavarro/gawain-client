import { formatDate, formatDateForApi, formatDateTime } from "utils/dateTime";

test("return date using default format", () => {
  expect(formatDate("2020-02-28")).toBe("February 28, 2020");
});

test("return falsy date", () => {
  expect(formatDate(null)).toBe(null);
  expect(formatDate(undefined)).toBe(undefined);
});

test("return datetime using default format", () => {
  expect(formatDateTime(new Date("2020-02-28 05:50:02 AM"))).toBe(
    "February 28, 2020, 5:50 AM"
  );
});

test("return falsy datetime", () => {
  expect(formatDateTime(null)).toBe(null);
  expect(formatDateTime(undefined)).toBe(undefined);
});

test("return datetime using default format", () => {
  expect(formatDateForApi(new Date("2020-02-28"))).toBe("2020-02-28");
});

test("return falsy datetime", () => {
  expect(formatDateForApi(null)).toBe(null);
  expect(formatDateForApi(undefined)).toBe(undefined);
});
