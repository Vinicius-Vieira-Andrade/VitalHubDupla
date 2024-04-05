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
import { LargeButton, NormalButton } from "../../components/Button/StyleButton";
import { ButtonText } from "../../components/ButtonText/StyleButtonText";

import api from "../../services/Services";
import {
  BlockedSmallButton,
  ButtonLarge,
} from "../../components/Button/Button";
import { userDecodeToken, userTokenLogout } from "../../utils/Auth";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const PatientProfile = ({ navigation }) => {
  const [cep, setCep] = useState("");
  const [logradouro, setLogradouro] = useState("");
  const [endereco, setEndereco] = useState("");
  const [cidade, setCidade] = useState("");
  const [user, setUser] = useState({});
  const [paciente, setPaciente] = useState({});
  const [medico, setMedico] = useState({});

  //funcao q guarda e carrega os dados trazidos da api
  async function profileLoad() {
    const token = await userDecodeToken();

    if (token) {
      console.log("funcionou!");
      setUser(token);
    }
  }

  // NÃO ESTÁ FUNCIONANDO, MÉTODO EM DESENVOLVIMENTO.
  // SÓ RETORNA A ROLE DO PACIETE
  async function searchUser() {
    console.log(user.role)
    // if (token.role === "Paciente") {
    //   console.log('Paci')
      
    // } else if (token.role === "Medico") {
    //   console.log('Medi')
      
    // } else {
    //   console.log('Falhou')
       
    // } 
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
  }

  // useEffect(() => {
  //   const fetchUserData = async () => {
  //     if (user.role === "Paciente") {
  //       const response = await api.get(`Paciente/BuscarPorId?id=${user.id}`);
  //       // await api.get(`/Pacientes/${user.id}`);
  //         setPaciente(response.data);
  //         setCep(response.data.endereco.cep);
  //         setCidade(response.data.endereco.cidade);
  //         setLogradouro(response.data.endereco.logradouro);
  //         console.log('Funcionando!')

  //     } else if (user.role === "Medico") {
  //       // const response = 
  //       await api.get(`/Medicos/${user.id}`);
  //         setMedico(response.data);
  //         setCep(response.data.endereco.cep);
  //         setCidade(response.data.endereco.cidade);
  //         setLogradouro(response.data.endereco.logradouro);
  //         console.log('Funcionando! agora')
  //     } else {
  //       console.log("Error, função não está funcionando.")
  //       console.log(user)
  //     }
  //   }
  //   fetchUserData();
  // }, [user]);



  // useEffect(() => {
  //   const fetchPatientData = async (id) => {
  //     //  const response = await api.get(`/Pacientes/${user.id}`);
  //     if (id !== null && user.role === 'Paciente') {
  //       try {
  //         const response = 
  //         await api.get(`Paciente/BuscarPorId?id=${id}`);
  //         setPaciente(response.data);
  //         console.log(user.role)
  //         setCep(response.data.endereco.cep);
  //         setCidade(response.data.endereco.cidade);
  //         setLogradouro(response.data.endereco.logradouro);
  //        console.log('Funcionando!')
  //       } catch (error) {
  //         console.log('Falha de merda')
  //       }

  //      }
  //      else{
  //       console.log("Falhou.")
  //      }
  //   };


    // const fetchMedicalData = async () => {
    //    const response = await api.get(`/Medicos/${user.id}`);
    //    if (response.data) {
    //      setMedico(response.data);
    //      setCep(response.data.endereco.cep);
    //      setCidade(response.data.endereco.cidade);
    //      setLogradouro(response.data.endereco.logradouro);
    //      console.log('Funcionando! agora')
    //     }
    //     else{
    //      console.log("Falhou. agora")
    //     }
    // };
   
    // if (user.role === "Paciente") {
    //    fetchPatientData();
    // }
    // if (user.role === "Medico") {
    //    fetchMedicalData();
    // }
  //   else{
  //     console.log("Falhou...")
  //     console.log(user.role)
  //     // console.log(response.data)
  //   }
  //  }, [user]);

  //  useEffect(() => {
  //   const fetchData = async () => {
  //      if (user && user.role) {
  //        if (user.role === "Paciente") {
  //          await fetchPatientData();
  //        } else if (user.role === "Medico") {
  //          await fetchMedicalData();
  //        } else {
  //          console.log("Role não reconhecida.");
  //        }
  //      } else {
  //        console.log("User ou user.role não definidos.");
  //      }
  //   };
   
  //   fetchData();
  //  }, [user]);
   
   

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

  useEffect(() => {
    profileLoad();
    searchUser();
  }, []);

  return (
    <ScrollContainer>
      <Container>

        <ImagemPerfilPaciente source={require("../../assets/ney.webp")} />

        <TitleProfile>{user.name}</TitleProfile>

        <DescriptionPassword description={user.email} />

        {/* {user == "Paciente" ? (
            <>
              
        <InputBox
          placeholderTextColor={"#A1A1A1"}
          textLabel={"Data de nascimento:"}
          placeholder={paciente.IdNavigation.datanascimento}
          // placeholder={"Ex. 04/05/1999"}
          keyboardType="numeric"
          editable={true}
          fieldWidth={90}
        />
        <InputBox
          placeholderTextColor={"#A1A1A1"}
          textLabel={"CPF"}
          placeholder={paciente.IdNavigation.cpf}
          keyboardType="numeric"
          maxLength={11}
          editable={true}
          fieldWidth={90}
        />
        <InputBox
          placeholderTextColor={"#A1A1A1"}
          textLabel={"Endereço"}
          placeholder={paciente.endereco.logradouro}
          editable={false}
          fieldValue={logradouro}
          fieldWidth={90}
        />

        <ContainerCepCidade>
          <InputBox
            placeholderTextColor={"#A1A1A1"}
            textLabel={"CEP"}
            placeholder={paciente.endereco.cep}
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
            placeholder={paciente.endereco.cidade}
            editable={false}
            fieldWidth={40}
            fieldValue={cidade}
          />
        </ContainerCepCidade>
            </>
          ) : user == "Medico" ? (
            <>
              
        <InputBox
          placeholderTextColor={"#A1A1A1"}
          textLabel={"Data de nascimento:"}
          placeholder={doctor.IdNavigation.datanascimento}
          // placeholder={"Ex. 04/05/1999"}
          keyboardType="numeric"
          editable={true}
          fieldWidth={90}
        />
        <InputBox
          placeholderTextColor={"#A1A1A1"}
          textLabel={"CPF"}
          placeholder={doctor.IdNavigation.cpf}
          keyboardType="numeric"
          maxLength={11}
          editable={true}
          fieldWidth={90}
        />
        <InputBox
          placeholderTextColor={"#A1A1A1"}
          textLabel={"Endereço"}
          placeholder={doctor.endereco.logradouro}
          editable={false}
          fieldValue={logradouro}
          fieldWidth={90}
        />

        <ContainerCepCidade>
          <InputBox
            placeholderTextColor={"#A1A1A1"}
            textLabel={"CEP"}
            placeholder={doctor.endereco.cep}
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
            placeholder={doctor.endereco.cidade}
            editable={false}
            fieldWidth={40}
            fieldValue={cidade}
          />
        </ContainerCepCidade>
            </>
          ) : (
            <></>
          ) 
          } */}

          
        <InputBox
          placeholderTextColor={"#A1A1A1"}
          textLabel={"Data de nascimento:"}
          placeholder={paciente.datanascimento}
          // placeholder={"Ex. 04/05/1999"}
          keyboardType="numeric"
          editable={true}
          fieldWidth={90}
        />
        <InputBox
          placeholderTextColor={"#A1A1A1"}
          textLabel={"CPF"}
          // placeholder={paciente.IdNavigation.cpf}
          keyboardType="numeric"
          maxLength={11}
          editable={true}
          fieldWidth={90}
        />
        <InputBox
          placeholderTextColor={"#A1A1A1"}
          textLabel={"Endereço"}
          placeholder={endereco.logradouro}
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
