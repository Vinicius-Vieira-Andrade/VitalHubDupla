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

import { MaterialCommunityIcons } from '@expo/vector-icons'
import { ButtonCamera, ViewImageProfile } from "./style";
import { View } from "react-native";
import { CameraModal } from "../../components/Camera/CameraModal";

import moment from "moment";

export const PatientProfile = ({ navigation }) => {

  const [paciente, setPaciente] = useState({});
  const [medico, setMedico] = useState({});
  const [datanascimento, setDataNascimento] = useState("");
  const [cpf, setCpf] = useState("");
  const [logradouro, setLogradouro] = useState("");
  const [cep, setCep] = useState("");
  const [cidade, setCidade] = useState("");

  const [user, setUser] = useState({});

  const [photoo, setPhotoo] = useState(null);

  const [uriCameraCapture, setUriCameraCapture] = useState("")
  const [showCameraModal, setShowCameraModal] = useState(false)

  //funcao q guarda e carrega os dados trazidos da api
  async function profileLoad() {
    const token = await userDecodeToken();

    if (token != null) {
      setUser(token);
    }

    else {
      console.error(error, "Function Profile Load");
    }
  }

  async function GetUser() {
    try {
      const token = await userDecodeToken();
      // console.log(token.role)
      if (token.role != null) {
        // console.log("Deu Certo!", token);
        const url = await token.role === "Medico" ? "Medicos" : "Pacientes";
        const response = await api.get(`${url}/BuscarPorId?id=${token.id}`);
        setUser(response.data);
      } else {
        console.error('ELSE', 'Erro ao buscar dados do usuário:', error);
      }
    } catch (error) {
      console.error('Erro ao buscar dados do usuário:', error);
    }
  }

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
    GetUser();
    console.log(user.role);
  }, []);

  async function AlterarFotoPerfil() {
    const formData = new FormData();
      formData.append("Arquivo", {
        uri: uriCameraCapture,
        name: `image.${uriCameraCapture.split(".")[1]}`,
        type: `image/${uriCameraCapture.split(".")[1]}`,
      });

    await api.put(`/Usuario/AlterarFotoPerfil?id=${user.id}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data"
      }
    }).then(async response => {
      console.log(response)
      await setUser({
        ...user,
        foto: uriCameraCapture
      })
    }).catch(error => {
      console.log(error, "Não funcionou!");
    });
  }

  useEffect(() => {
    if (uriCameraCapture !== null) {
      AlterarFotoPerfil();
    }
  }, [uriCameraCapture]);

  useEffect(() => {
    console.log(user.role);
  }, [])

  return (
    <ScrollContainer>
      <Container>

        <CameraModal
          getMediaLibrary={true}
          visible={showCameraModal}
          setUriCameraCapture={setUriCameraCapture}
          setShowModalCancel={setShowCameraModal}
        />

        <ViewImageProfile>
          <ImagemPerfilPaciente source={{uri: user && user.idNavigation? user.idNavigation.foto: 'Foto não encontrada!' }} />

          <ButtonCamera onPress={() => setShowCameraModal(true)}>
            <MaterialCommunityIcons name="camera-plus" size={20} color='#FBFBFB' />
          </ButtonCamera>
        </ViewImageProfile>



        <TitleProfile>{user && user.idNavigation? user.idNavigation.nome: 'Nome não encontrado!' }</TitleProfile>

        <DescriptionPassword description={user && user.idNavigation? user.idNavigation.email: 'Email não encontrado!' } />

        <InputBox
          placeholderTextColor={"#A1A1A1"}
          textLabel={"Data de nascimento:"}
          placeholder={moment(user.dataNascimento).format("DD/MM/YYYY")}
          keyboardType="numeric"
          editable={false}
          fieldWidth={90}
        />
        <InputBox
          placeholderTextColor={"#A1A1A1"}
          textLabel={"CPF"}
          placeholder={user.role == 'Paciente' ? user.cpf : user.crm}
          keyboardType="numeric"
          maxLength={11}
          editable={false}
          fieldWidth={90}
        />

        <InputBox
          placeholderTextColor={"#A1A1A1"}
          textLabel={"Endereço"}
          placeholder={user && user.endereco? user.endereco.logradouro : 'endereço não encontrado!' }
          editable={false}
          fieldWidth={90}
        />

        <ContainerCepCidade>
          <InputBox
            placeholderTextColor={"#A1A1A1"}
            textLabel={"CEP"}
            placeholder={user && user.endereco? user.endereco.cep : 'Cep não encontrado!'}
            maxLength={8}
            onChangeText={(text) => setCep(text)}
            keyboardType="numeric"
            editable={false}
            fieldWidth={40}
          />
          <InputBox
            placeholderTextColor={"#A1A1A1"}
            placeholder={user.endereco? user.endereco.cidade : 'Cidade não encontrada!'}
            textLabel={"Cidade"}
            editable={false}
            fieldWidth={40}
            // placeholder={(user.role === 'Medico') ? user.endereco? user.endereco.numero : user.endereco? user.endereco.cidade}
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