import httpService from "./httpService";

const decodeAccessToken = async () => {
  try {
    return await httpService.get("/token/decode").then(res => res.data);
  } catch (error) {
    await getNewAccessToken();
    return httpService.get("/token/decode").then(res => res.data);
  }
};

const getNewAccessToken = () => httpService.get("/token/refresh");

export default {
  decodeAccessToken,
  getNewAccessToken,
};
