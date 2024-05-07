import AsyncStorage from "@react-native-async-storage/async-storage";
import { jwtDecode } from "jwt-decode";
import { encode, decode } from "base-64";
import api from "../services/Services";

if (!global.atob) {
  global.atob = decode;
}

if (!global.btoa) {
  global.btoa = encode;
}

export const userDecodeToken = async ( procurarFoto = false ) => {
  const token = await AsyncStorage.getItem("token");
  // const token = await JSON.parse(AsyncStorage.getItem("token")).token;

  if (token === null) {
    return null;
  }

  //decodifica o token recebido
  const decode = jwtDecode(token);

  // Buscar dados do perfil do usuario
  let fotoUsuario = '../../assets/ProfileImage.png';
  if ( procurarFoto ) {
    await api.get(`/Usuario/BuscarPorId?id=${decode.jti}`)
    .then( response => {
      fotoUsuario = response.data.foto
    }).catch(error => {
      console.log(error);
    })
  }

  return {
    name: decode.name,
    email: decode.email,
    role: decode.role,
    id: decode.jti,
    foto: fotoUsuario,
    token: token,
  };
  
};
export const userTokenLogout = async () => {
  const token = await AsyncStorage.removeItem("token");
  console.log(token);
};
