import axios from "axios";

//declarar a porta da api

const porta = '4466';

//declarar o ip da maquina 

<<<<<<< HEAD
const ipSenai = '172.16.39.109';

=======
const ip = '172.16.39.88';
>>>>>>> origin/mikael

//definir a url padrao
const apiUrlLocal = `http://${ipSenai}:${porta}/api`;

//trazer a configuracao do axios

const api = axios.create({
  baseURL: apiUrlLocal
});

export default api;