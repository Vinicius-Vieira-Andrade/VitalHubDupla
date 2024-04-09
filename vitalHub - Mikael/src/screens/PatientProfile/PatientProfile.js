import { useEffect, useState } from "react";
import {
  Container,
  ContainerCepCidade,
  ScrollContainer,
} from "../../components/Container/StyleContainer";
import { DescriptionPassword } from "../../components/Descriptions/Descriptions";
import {
  DescripritionEmail,
  DescripritionForgot,
} from "../../components/Descriptions/StyledDescriptions";
import { InputBox } from "../../components/InputBox/InputBox";
import { ImagemPerfilPaciente } from "../../components/Images/StyleImages";
import { TitleProfile } from "../../components/Title/StyleTitle";

import api from "../../services/Services";
import {
  BlockedSmallButton,
  ButtonLarge,
} from "../../components/Button/Button";
import { userDecodeToken, userTokenLogout } from "../../utils/Auth";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

export const PatientProfile = ({ navigation }) => {

  const [paciente, setPaciente] = useState({});
  const [medico, setMedico] = useState({});
  const [datanascimento, setDataNascimento] = useState("");
  const [cpf, setCpf] = useState("");
  const [logradouro, setLogradouro] = useState("");
  const [cep, setCep] = useState("");
  const [cidade, setCidade] = useState("");

  const [user, setUser] = useState({});

  //funcao q guarda e carrega os dados trazidos da api
  async function profileLoad() {
    const token = await userDecodeToken();

    if (token !== null) {
      
      // await searchUser(token);
      setUser(token);
    }

    else{
      console.error(error);
      // searchUser
    }
  }

  // 
  // async function searchUser(token) {
  //   const url = (token.role == "Medico" ? "Medicos" : "Pacientes");
  //   console.log('O usuário atual é -',token.role, '-',token.name, '-', token.id);

  //   console.log(token)

  //   if (token.role !== null) {
  //     const response = await api.get(`/${url}/BuscarPorId?id=${token.id}`)
  
  //     setPaciente(response.data)
  //     // setMedico(responseData)
  //     // setDataNascimento(responseData.paciente.datanascimento)
  //     // setCpf(responseData)
  //     setLogradouro(response.data.logradouro)
  //     // setCep(responseData.endereco.cep)
  //     setCidade(response.data.localidade)
  //   } else {
  //     console.log('Error');
  //   }
    
  // }
    
    // SE O USUÁRIO FOR PACIENTE 
    // if (token.role === "Paciente") {
    //   try {
    //     // console.log('Funcionou, o usuário retornado é Paciente') 
    //     // console.log('-', token.role, '-',user.id)
    //     // const response = 
    //     await api.get(`/${url}/BuscarPorId?id=${user.id}`)
    //     .then( response => {
    //       setPaciente(response.data);
          
    //     })


    //     // setDataNascimento(response.data)
    //     // setCpf(response.data)
    //     // setLogradouro(response.data.endereco.logradouro);
    //     // setCep(response.data.endereco.cep);
    //     // setCidade(response.data.endereco.cidade);
        
    //   } catch (error) {
    //     console.error('Paciente',error)
    //     // console.log(token)
    //   }
    // }
    
    // // SE O USUÁRIO FOR MEDICO 
    // else if (token.role === "Medico") {
    //   try {
    //     const response = await api.get(`/Medicos/BuscarPorId?id=${user.id}`);
    //     console.log('Funcionou, o usuário retornado é medico')

    //     setMedico(response.data);
    //     setDataNascimento(response.data)
    //     setCpf(response.data)
    //     setLogradouro(response.data.endereco.logradouro);
    //     setCep(response.data.endereco.cep);
    //     setCidade(response.data.endereco.cidade);
        
    //   } catch (error) {
    //     console.error('Medico',error)
    //   }
    // } 
    

    // // SE O USUÁRIO FOR INDEFINIDO
    // else {
    //   console.error('A função Search User Falhou.', error)
    // }
    // // console.log(paciente);
    // // console.log(medico);


  
  // await AsyncStorage.setItem("token", JSON.stringify())

  // const token = await userDecodeToken()
  // console.log(token)

  // if (token.role === "Paciente") {
  //     await api.get(`/Pacientes/${user.id}`);
  //     setPaciente(response.data);
  //     setCep(response.data.endereco.cep);
  //     setCidade(response.data.endereco.cidade);
  //     setLogradouro(response.data.endereco.logradouro);
  //     console.log('Funcionando!')
  // }
  // else{
  //   console.log("Não funcionou.")
  // }
  useEffect(() => {
    const getCep = async () => {
      if (cep !== "" && cep.length === 8) {
        try {
          const response = await api.get(`${cep}/json/`);

          if (response.data) {
            setLogradouro(response.data.logradouro);
            setCidade(response.data.localidade);
          } else {
            alert("Verifique o CEP digitado !!!");
          }
        } catch (error) {
          console.log("Ocorreu um erro ao buscar o CEP", error);
        }
      }
    };

    getCep();
  }, [cep]);

  const BuscarDadosUsuario = () => {
    const [usuario, setUsuario] = useState({});
   
    useEffect(() => {
       const buscarDados = async () => {
         try {
           const token = await userDecodeToken(); // Supondo que userDecodeToken é uma função que retorna o token do usuário
           const url = token.role === "Medico" ? "Medicos" : "Pacientes";
           const response = await axios.get(`/${url}/BuscarPorId?id=${token.id}`);
           setUsuario(response.data);
         } catch (error) {
           console.error('Erro ao buscar dados do usuário:', error);
         }
       };
   
       buscarDados();
    }, []);
  }

  useEffect(() => {
    profileLoad();
    // searchUser();
  }, []);

  return (
    <ScrollContainer>
      <Container>

        <ImagemPerfilPaciente source={require("../../assets/ney.webp")} />

        <TitleProfile>{user.name}</TitleProfile>

        <DescriptionPassword description={user.email} />

        <InputBox
          placeholderTextColor={"#A1A1A1"}
          textLabel={"Data de nascimento:"}
          // placeholder={token.paciente.datanascimento}
          // placeholder={"Ex. 04/05/1999"}
          keyboardType="numeric"
          editable={true}
          fieldWidth={90}
        />
        <InputBox
          placeholderTextColor={"#A1A1A1"}
          textLabel={"CPF"}
          placeholder={user.cpf}
          keyboardType="numeric"
          maxLength={11}
          editable={true}
          fieldWidth={90}
        />
        <InputBox
          placeholderTextColor={"#A1A1A1"}
          textLabel={"Endereço"}
          placeholder={logradouro}
          editable={false}
          fieldValue={logradouro}
          fieldWidth={90}
        />

        <ContainerCepCidade>
          <InputBox
            placeholderTextColor={"#A1A1A1"}
            textLabel={"CEP"}
            // placeholder={paciente.endereco.cep}
            maxLength={8}
            onChangeText={(text) => setCep(text)}
            keyboardType="numeric"
            editable={true}
            fieldWidth={40}
            fieldValue={cep}
          />
          <InputBox
            placeholderTextColor={"#49B3BA"}
            textLabel={"Cidade"}
            // placeholder={paciente.endereco.cidade}
            editable={false}
            fieldWidth={40}
            fieldValue={cidade}
          />
        </ContainerCepCidade>

        <ButtonLarge text={"Salvar"} />

        <ButtonLarge text={"Editar"} />

        <BlockedSmallButton
          text={"Sair do app"}
          onPress={() => {
            userTokenLogout();
            navigation.replace("Login");
          }} //rodando a funcao de logout presente no arquivo "Auth" e voltando para tela de login
        />
      </Container>
    </ScrollContainer>
  );
};