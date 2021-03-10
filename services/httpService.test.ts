import axios from "axios";
import { toast } from "react-toastify";
import "./httpService";

jest.mock("axios", () => ({
  __esModule: true,
  default: {
    interceptors: {
      request: { use: jest.fn(() => {}) },
      response: { use: jest.fn(() => {}) },
    },
  },
}));

const fakeError = {
  response: {
    status: undefined,
  },
};

const mockRequestCallback = (axios.interceptors.request.use as jest.Mock).mock
  .calls[0][0];
const mockResponseErrorCallback = (axios.interceptors.response.use as jest.Mock)
  .mock.calls[0][1];
const toastErrorSpy = jest.spyOn(toast, "error");

beforeEach(() => {
  toastErrorSpy.mockClear();
});

test("request error interceptor", () => {
  expect(mockRequestCallback({})).toStrictEqual({
    baseURL: "http://localhost:5000",
  });
});

test("unexpected error on response interceptor", () => {
  fakeError.response.status = 500;

  mockResponseErrorCallback(fakeError).catch(() => {});
  expect(toastErrorSpy).toHaveBeenCalled();
});

test("expected error on response interceptor", () => {
  fakeError.response.status = 400;

  mockResponseErrorCallback(fakeError).catch(() => {});
  expect(toastErrorSpy).not.toHaveBeenCalled();
});
