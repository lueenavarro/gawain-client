import { cloneDeep } from "lodash";

export const sliceObjects = (object, start?: number, end?: number) => {
    const clone = cloneDeep(object);
    Object.keys(clone)
      .slice(start, end)
      .forEach((key) => delete clone[key]);
    return clone;
  };