import httpService from "./httpService";

const signup = async (user) =>
  httpService.post("/user/signup", user).then((res) => res.data);

const login = async (user) =>
  httpService.post("/user/login", user).then((res) => res.data);

const findUser = async (email: string) =>
  httpService
    .get("/user", {
      params: { email },
    })
    .then((res) => res.data);

export default { signup, login, findUser };
