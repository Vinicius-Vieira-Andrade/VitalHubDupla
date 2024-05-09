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
import { InputBox, InputBoxGray } from "../../components/InputBox/InputBox";
import { ImagemPerfilPaciente } from "../../components/Images/StyleImages";
import { TitleProfile } from "../../components/Title/StyleTitle";

import api from "../../services/Services";
import {
  BlockedButton,
  BlockedSmallButton,
  ButtonLarge,
  ButtonNormal,
} from "../../components/Button/Button";
import { userDecodeToken, userTokenLogout } from "../../utils/Auth";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

import { MaterialCommunityIcons } from '@expo/vector-icons'
import { ButtonCamera, ViewImageProfile } from "./style";
import { ActivityIndicator, View } from "react-native";
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

  const [uriCameraCapture, setUriCameraCapture] = useState("")
  const [showCameraModal, setShowCameraModal] = useState(false)
  const [role, setRole] = useState()


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


  async function PutPaciente() {

    await api.put(`/Pacientes?idUsuario=${user.option.id}`, {
      dataNascimento: user.option.dataNascimento,
      cpf: user.option.cpf,
      logradouro,
      numero,
      cep,
      cidade
    }).then(response => {
      alert('Alterações salvas com sucesso!!')
    })
  }

  async function PutMedico() {
    await api.put(`/Medicos?idUsuario=${user.option.id}`, {
      especialidade: user.option.especialidade,
      crm: user.option.crm,
      logradouro,
      numero,
      cidade,
      cep,
    }).then(response => {
      alert('Alterações salvas com sucesso!!')
    })
  }

  async function GetUser() {
    try {
      const token = await userDecodeToken();
      // console.log(token.role)
      if (token.role != null) {
        setRole(token)
        // console.log("Deu Certo!", token);
        const url = await token.role === "medico" ? "Medicos" : "Pacientes";
        const response = await api.get(`${url}/BuscarPorId?id=${token.user}`);
        setUser({ ...user, option: response.data });
      }
    } catch (error) {
      console.error('Erro ao buscar dados do usuário:', error);
    }
  }

  // Função responsavel por liberar para que o usuário edite os dados pessoais
  const [edit, setEdit] = useState(false)


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
    // console.log(user);
  }, []);

  useEffect(() => {
    console.log();
    console.log(`USUARIOOOOO`);
    console.log(user);
  }, [user])

  useEffect(() => {
    console.log("aidsssss");
    console.log(user.id);
  })

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

  // useEffect(() => {
  //   if (uriCameraCapture !== null) {
  //     AlterarFotoPerfil();
  //   }
  // }, [uriCameraCapture]);




  return (
    <ScrollContainer>

      {user.option != null ? (
        <Container>
          <CameraModal
            getMediaLibrary={true}
            visible={showCameraModal}
            setUriCameraCapture={setUriCameraCapture}
            setShowModalCancel={setShowCameraModal}
          />

          <ViewImageProfile>
            <ImagemPerfilPaciente source={{ uri: user && user.option.idNavigation ? user.option.idNavigation.foto : 'Foto não encontrada!' }} />

            <ButtonCamera onPress={() => setShowCameraModal(true)}>
              <MaterialCommunityIcons name="camera-plus" size={20} color='#FBFBFB' />
            </ButtonCamera>
          </ViewImageProfile>



          <TitleProfile>{user && user.option.idNavigation ? user.option.idNavigation.nome : 'Nome não encontrado!'}</TitleProfile>

          <DescriptionPassword description={user && user.option.idNavigation ? user.option.idNavigation.email : 'Email não encontrado!'} />

          {edit == false ? (
            <>
              <InputBoxGray
                placeholderTextColor={"#A1A1A1"}
                textLabel={role.role == 'medico' ? "Especialidade" : "Data de nascimento"}
                placeholder={role.role == 'medico' ? user.option.especialidade.especialidade1 : moment(user.option.dataNascimento).format("DD/MM/YYYY")}
                fieldValue={role.role == 'medico' ? user.option.especialidade.especialidade1 : moment(user.option.dataNascimento).format("DD/MM/YYYY")}
                keyboardType="numeric"
                editable={false}
                fieldWidth={90}
              />
              <InputBoxGray

                placeholderTextColor={"#A1A1A1"}
                textLabel={role.role == 'medico' ? 'CRM' : 'CPF'}
                placeholder={role.role == 'medico' ? user.option.crm : user.option.cpf}
                fieldValue={role.role == 'medico' ? user.option.crm : user.option.cpf}
                keyboardType="numeric"
                maxLength={11}
                editable={false}
                fieldWidth={90}
              />

              <InputBoxGray
                placeholderTextColor={"#A1A1A1"}
                textLabel={"Endereço"}
                placeholder={user && user.option.endereco ? user.option.endereco.logradouro : 'endereço não encontrado!'}
                fieldValue={user && user.option.endereco ? user.option.endereco.logradouro : 'endereço não encontrado!'}
                editable={false}
                fieldWidth={90}
              />

              <ContainerCepCidade>
                <InputBoxGray
                  placeholderTextColor={"#A1A1A1"}
                  textLabel={"CEP"}
                  placeholder={user && user.option.endereco ? user.option.endereco.cep : 'Cep não encontrado!'}
                  fieldValue={user && user.option.endereco ? user.option.endereco.cep : 'Cep não encontrado!'}
                  maxLength={8}
                  onChangeText={(text) => setCep(text)}
                  keyboardType="numeric"
                  editable={false}
                  fieldWidth={40}
                />
                <InputBoxGray
                  placeholderTextColor={"#A1A1A1"}
                  placeholder={user.option.endereco ? user.option.endereco.cidade : 'Cidade não encontrada!'}
                  fieldValue={user.option.endereco ? user.option.endereco.cidade : 'Cidade não encontrada!'}
                  textLabel={"Cidade"}
                  editable={false}
                  fieldWidth={40}
                // placeholder={(user.role === 'Medico') ? user.endereco? user.endereco.numero : user.endereco? user.endereco.cidade}
                />
              </ContainerCepCidade>
            </>
          ) : (
            <>
              <InputBox
                placeholderTextColor={"#49B3BA"}
                textLabel={role.role == 'medico' ? "Especialidade" : "Data de nascimento"}
                placeholder={"Insira sua data de nascimento"}

                keyboardType="numeric"
                editable={true}
                fieldWidth={90}
              />
              <InputBox

                placeholderTextColor={"#49B3BA"}
                style={{ borderRadius: 5, borderColor: '#49B3BA' }}
                textLabel={role.role == 'medico' ? 'CRM' : 'CPF'}
                placeholder={"insira seu CPF"}

                keyboardType="numeric"
                maxLength={11}
                editable={true}
                fieldWidth={90}
              />

              <InputBox
                placeholderTextColor={"#49B3BA"}
                style={{ borderRadius: 5, borderColor: '#49B3BA' }}
                textLabel={"Endereço"}
                placeholder={"Insira seu endereço"}

                editable={true}
                fieldWidth={90}
              />

              <ContainerCepCidade>
                <InputBox
                  placeholderTextColor={"#49B3BA"}
                  style={{ borderRadius: 5, borderColor: '#49B3BA' }}
                  textLabel={"CEP"}
                  placeholder={"Insira seu CEP"}

                  maxLength={8}
                  onChangeText={(text) => setCep(text)}
                  keyboardType="numeric"
                  editable={true}
                  fieldWidth={40}
                />
                <InputBox
                  placeholderTextColor={"#49B3BA"}
                  style={{ borderRadius: 5, border: 'solid 2px #49B3BA', }}
                  placeholder={"Insira sua cidade"}
                  textLabel={"Cidade"}
                  editable={true}
                  fieldWidth={40}
                // placeholder={(user.role === 'Medico') ? user.endereco? user.endereco.numero : user.endereco? user.endereco.cidade}
                />
              </ContainerCepCidade>
            </>
          )}

          <ButtonLarge text={"Salvar"} onPress={() => { user.option.role == 'medico' ? PutMedico() : PutPaciente() }} />

          {edit == false ? (
            <ButtonNormal onPress={() => { edit == false ? (setEdit(true)) : (setEdit(false)) }} text={"Editar"} />
          ) : (
            <BlockedButton onPress={() => { setEdit(false) }}
              text={"Editar"}
            />
          )}


          {/* <ButtonLarge text={"Editar"} onPress={() => { EditProfile() }} /> */}

          <BlockedSmallButton
            text={"Sair do app"}
            onPress={() => {
              userTokenLogout();
              navigation.replace("Login");
            }} //rodando a funcao de logout presente no arquivo "Auth" e voltando para tela de login
          />
        </Container>
      ) : (
        <ActivityIndicator />
      )}

    </ScrollContainer>
  );
};