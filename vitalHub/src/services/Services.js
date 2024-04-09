import axios from "axios";

//declarar a porta da api

const porta = '4466';

//declarar o ip da maquina 

const ipSenai = '172.16.39.109';
const ipCasa = '192.168.10.139';

//definir a url padrao
const apiUrlLocal = `http://${ipCasa}:${porta}/api`;

//trazer a configuracao do axios

const api = axios.create({
  baseURL: apiUrlLocal
});

export default api;