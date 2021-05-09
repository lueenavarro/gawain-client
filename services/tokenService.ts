import httpService from "./httpService";

const decodeAccessToken = async () => {
  try {
    return await httpService.get("/token/decode").then(res => res.data);
  } catch (error) {
    await refreshToken();
    return httpService.get("/token/decode").then(res => res.data);
  }
};

const refreshToken = () => httpService.get("/token/refresh");

export default {
  decodeAccessToken,
  refreshToken,
};
