import AsyncStorage from "@react-native-async-storage/async-storage";
import { jwtDecode } from "jwt-decode";
import { encode, decode } from "base-64";

if (!global.atob) {
  global.atob = decode;
}

if (!global.btoa) {
  global.btoa = encode;
}


export const userDecodeTokenClean = async () => {

  // const tokenn = await AsyncStorage.getItem("token");
  // const token = await JSON.parse(AsyncStorage.getItem("token")).token;
  const token = JSON.parse(await AsyncStorage.getItem("token")).token

  if (token === null) {
    return null;
  }
  return token;
};



export const userDecodeToken = async () => {

  //  const tokenn = await AsyncStorage.getItem("token");
  // const token = await JSON.parse(AsyncStorage.getItem("token")).token;
  const token = JSON.parse(await AsyncStorage.getItem("token")).token

  if (token === null) {
    return null;
  }

  //decodifica o token recebido
  const decode = jwtDecode(token);

  return {
    name: decode.name,
    email: decode.email,
    role: decode.role,
    user: decode.jti,
    //  token: decode.token
  };
};
export const userTokenLogout = async () => {
  const token = await AsyncStorage.removeItem("token");
  console.log(token);
};
