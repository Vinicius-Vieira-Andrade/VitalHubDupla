import axios from "axios";

//declarar a porta da api

const porta = '4466';

//declarar o ip da maquina 

const ip = '192.168.21.50';

//definir a url padrao
const apiUrlLocal = `http://${ip}:${porta}/api`;

//trazer a configuracao do axios

const api = axios.create({
  baseURL: apiUrlLocal
});

export default api;