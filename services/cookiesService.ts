import Cookies from "js-cookie"

const get = (name:string) => Cookies.get(name);
const set = (name: string, value: string) => {
    Cookies.set(name, value, {
        sameSite: "strict"
    });
}

export default {
    get,
    set
}