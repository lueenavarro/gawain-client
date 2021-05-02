import httpService from "./httpService";

const decodeAccessToken = async () => {
  try {
    return await httpService.get("/token/decode");
  } catch (error) {
    await refreshToken();
    return httpService.get("/token/decode");
  }
};

const refreshToken = () => httpService.get("/token/refresh");

export default {
  decodeAccessToken,
  refreshToken,
};
