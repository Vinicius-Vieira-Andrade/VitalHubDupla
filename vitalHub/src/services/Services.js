import axios from "axios";

//declarar a porta da api

const porta = '4466';

//declarar o ip da maquina 

const ip = '172.16.39.109';

//definir a url padrao
const apiUrlLocal = `http://${ip}:${porta}/api`;

//trazer a configuracao do axios

const api = axios.create({
  baseURL: apiUrlLocal
});

export default api;