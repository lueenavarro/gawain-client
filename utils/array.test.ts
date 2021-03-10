import { insert } from "./array";
import { getMiddle } from "utils/array";

test("insert element to array", () => {
  expect(insert([1, 2, 3], 1, "x")).toStrictEqual([1, "x", 2, 3]);
});

test("insert will throw error", () => {
  expect(() => insert([1, 2, 3], -1, "x")).toThrowError();
});

test("return middle array", () => {
  expect(getMiddle([1, 2, 3])).toStrictEqual([2]);
  expect(getMiddle([1, 2])).toStrictEqual([]);
  expect(getMiddle(null)).toStrictEqual([]);
});
