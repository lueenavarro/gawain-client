import { concat, slice } from "lodash";

export const insert = (array: Array<any>, index: number, item: any) => {
  if (index < 0) {
    throw new Error("Invalid index");
  }

  return concat(slice(array, 0, index), item, slice(array, index));
};

export const getMiddle = (array: Array<any>) => slice(array, 1, -1);

export const range = (start: number, stop: number, step = 1) =>
Array(Math.ceil((stop - start) / step)).fill(start).map((x, y) => x + y * step)