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

import { MaterialCommunityIcons } from "@expo/vector-icons";
import { ButtonCamera, ViewImageProfile } from "./style";
import { ActivityIndicator, View } from "react-native";
import { CameraModal } from "../../components/Camera/CameraModal";
import { mask, unMask } from 'remask'

import moment from "moment";
import { cepPattern, cpfPattern } from "../../utils/masks";
// import { get } from "react-native/Libraries/TurboModule/TurboModuleRegistry";
import { LogBox } from 'react-native';

LogBox.ignoreAllLogs() // Ignore log notification by message

export const PatientProfile = ({ navigation }) => {
  const [datanascimento, setDataNascimento] = useState("");
  const [cpf, setCpf] = useState("");
  const [logradouro, setLogradouro] = useState("");
  const [cep, setCep] = useState("");
  const [cidade, setCidade] = useState("");
  const [especialidade, setEspecialidade] = useState("");
  const [crm, setCrm] = useState("");

  const [user, setUser] = useState({});

  const [uriCameraCapture, setUriCameraCapture] = useState("");
  const [showCameraModal, setShowCameraModal] = useState(false);
  const [role, setRole] = useState();

  //funcao q guarda e carrega os dados trazidos da apii
  async function profileLoad() {
    const token = await userDecodeToken();

    if (token != null) {
      setUser(token);
    } else {
      console.error(error, "Function Profile Load");
    }
  }

  async function PutPaciente() {
    console.log({
      dataNascimento: datanascimento,
      cpf: cpf,
      logradouro,
      cep,
      cidade,
    });
    console.log(user.option.especialidade);
    await api
      .put(`/Pacientes?idUsuario=${user.option.id}`, {
        dataNascimento: datanascimento,
        cpf: cpf,
        logradouro,
        cep,
        cidade,
      })
      .then((response) => {
        alert("Alterações salvas com sucesso!!");
        GetUser();
        setEdit(false);
      })
      .catch((error) => console.log(error));
  }

  async function PutMedico() {
    await api
      .put(`/Medicos?idUsuario=${user.option.id}`, {
        crm: crm,
        logradouro,
        cidade,
        cep,
      })
      .then((response) => {
        alert("Alterações salvas com sucesso!!");
        GetUser();
        setEdit(false);
      })
      .catch((error) => console.log(error));
  }

  async function GetUser() {
    try {
      const token = await userDecodeToken();
      // console.log(token.role)
      if (token.role != null) {
        setRole(token);
        // console.log("Deu Certo!", token);
        const url = (await token.role) === "medico" ? "Medicos" : "Pacientes";
        const response = await api.get(`${url}/BuscarPorId?id=${token.user}`);
        setUser({ ...user, option: response.data });
      }
    } catch (error) {
      console.error("Erro ao buscar dados do usuário:", error);
    }
  }

  // state responsavel por liberar para que o usuário edite os dados pessoais
  const [edit, setEdit] = useState(false);

  useEffect(() => {
    const GetCep = async () => {
      if (cep !== "" && cep.length === 9) {
        console.log(`https://viacep.com.br/ws/${unMask(cep)}/json/`);
        await axios
          .get(`https://viacep.com.br/ws/${unMask(cep)}/json/`)
          .then((response) => {
            console.log("achei o ceeeppp");
            console.log(response.data);
            setLogradouro(response.data.logradouro);
            setCidade(response.data.localidade);
          })
          .catch(console.log("Ocorreu um erro ao buscar o CEP", error));
      }
    };
    cep != undefined
      ? GetCep()
      : console.log(
          "ta igual metodo void, retornando vazio HAAHAHAHAAAHAHAHAHAHAHAHA"
        );
  }, [cep]);

  useEffect(() => {
    console.log("profileload");
    profileLoad();
  }, []);

  useEffect(() => {
    console.log("getuser");
    GetUser();
  }, []);

  useEffect(() => {
    console.log(`USUARIOOOOO`);
    console.log(user);
  }, [user]);

  async function AlterarFotoPerfil() {
    const formData = new FormData();
    formData.append("Arquivo", {
      uri: uriCameraCapture,
      name: `image.${uriCameraCapture.split(".")[1]}`,
      type: `image/${uriCameraCapture.split(".")[1]}`,
    });

    await api
      .put(`/Usuario/AlterarFotoPerfil?id=${user.option.id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then(async (response) => {
        console.log(response);
        await setUser({
          ...user,
          foto: uriCameraCapture,
        });
        GetUser()
      })
      .catch((error) => {
        console.log(error, "Não funcionou!");
      });
  }

  // async function PutProfile() {
  //   {
  //     role.role === "paciente"
  //       ? await api
  //           .put(`/Pacientes?idUsuario=${user.option.id}`, {
  //             dataNascimento: datanascimento,
  //             cpf: cpf,
  //             logradouro,
  //             cep,
  //             cidade,
  //           })
  //           .then((response) => {
  //             alert("Alterações salvas com sucesso!!");
  //             GetUser();
  //             setEdit(false);
  //           })
  //           .catch((error) => console.log(error))
  //       : await api
  //           .put(`/Medicos`, {
  //             crm: crm,
  //             logradouro,
  //             cidade,
  //             cep,
  //           })
  //           .then((response) => {
  //             alert("Alterações salvas com sucesso!!");
  //             GetUser();
  //             setEdit(false);
  //           })
  //           .catch((error) => console.log(error));
  //   }
  // }

  useEffect(() => {
    if (uriCameraCapture !== null) {
      AlterarFotoPerfil();
    }
  }, [uriCameraCapture]);

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
            <ImagemPerfilPaciente
              source={{
                uri:
                  user && user.option.idNavigation
                    ? user.option.idNavigation.foto
                    : "Foto não encontrada!",
              }}
            />

            <ButtonCamera onPress={() => setShowCameraModal(true)}>
              <MaterialCommunityIcons
                name="camera-plus"
                size={20}
                color="#FBFBFB"
              />
            </ButtonCamera>
          </ViewImageProfile>

          <TitleProfile>
            {user && user.option.idNavigation
              ? user.option.idNavigation.nome
              : "Nome não encontrado!"}
          </TitleProfile>

          <DescriptionPassword
            description={
              user && user.option.idNavigation
                ? user.option.idNavigation.email
                : "Email não encontrado!"
            }
          />

          {edit == false ? (
            <>
              <InputBoxGray
                placeholderTextColor={"#A1A1A1"}
                textLabel={
                  role.role == "medico" ? "Especialidade" : "Data de nascimento"
                }
                placeholder={
                  role.role == "medico"
                    ? user.option.especialidade.especialidade1
                    : user.option.dataNascimento != null
                    ? moment(user.option.dataNascimento).format("DD/MM/YYYY")
                    : ""
                }
                fieldValue={
                  role.role == "medico"
                    ? user.option.especialidade.especialidade1
                    : user.option.dataNascimento != null
                    ? moment(user.option.dataNascimento).format("DD/MM/YYYY")
                    : ""
                }
                keyboardType={role.role === "medico" ? "default" : "numeric"}
                editable={false}
                fieldWidth={90}
              />
              <InputBoxGray
                placeholderTextColor={"#A1A1A1"}
                textLabel={role.role == "medico" ? "CRM" : "CPF"}
                placeholder={
                  role.role == "medico" ? user.option.crm : cpfPattern(user.option.cpf)
                }
                fieldValue={
                  role.role == "medico" ? user.option.crm : cpfPattern(user.option.cpf)

                }
                keyboardType="numeric"
                maxLength={14}
                editable={false}
                fieldWidth={90}
              />

              <InputBoxGray
                placeholderTextColor={"#A1A1A1"}
                textLabel={"Logradouro"}
                placeholder={
                  user.option.endereco
                    ? user.option.endereco.logradouro
                    : "endereço não encontrado!"
                }
                fieldValue={
                  user.option.endereco
                    ? user.option.endereco.logradouro
                    : "endereço não encontrado!"
                }
                editable={false}
                fieldWidth={90}
              />

              <ContainerCepCidade>
                <InputBoxGray
                  placeholderTextColor={"#A1A1A1"}
                  textLabel={"CEP"}
                  placeholder={
                    user.option.endereco
                      ? user.option.endereco.cep
                      : "Cep não encontrado!"
                  }
                  fieldValue={
                    user.option.endereco
                      ? cepPattern(user.option.endereco.cep)
                      : "Cep não encontrado!"
                  }
                  maxLength={9}
                  // onChangeText={(text) => setCep(text)}
                  keyboardType="numeric"
                  editable={false}
                  fieldWidth={40}
                />
                <InputBoxGray
                  placeholderTextColor={"#A1A1A1"}
                  placeholder={
                    user.role === "medico" && user.option.endereco
                      ? user.option.endereco.cidade
                      : "Cidade não encontrada!"
                  }
                  fieldValue={
                    user.option.endereco != null
                      ? user.option.endereco.cidade
                      : "Cidade não encontrada!"
                  }
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
                textLabel={
                  role.role == "medico" ? "Especialidade" : "Data de nascimento"
                }
                placeholder={
                  role.role == "medico"
                    ? "Não é possível alterar essa opção"
                    : "Insira sua data de nascimento"
                }
                keyboardType={role.role === "medico" ? "default" : "numeric"}
                onChangeText={(txt) => {
                  role.role === "medico"
                    ? setEspecialidade(txt)
                    : setDataNascimento(txt);
                }}
                fieldValue={role.role === 'medico' ? user.option.especialidade.especialidade1 : datanascimento}
                editable={role.role === "medico" ? false : true}
                fieldWidth={90}
              />

              <InputBox
                placeholderTextColor={"#49B3BA"}
                style={{ borderRadius: 5, borderColor: "#49B3BA" }}
                textLabel={role.role == "medico" ? "CRM" : "CPF"}
                placeholder={
                  role.role === "medico"
                    ? "insira seu CRM (somente números)"
                    : "insira seu CPF"
                }
                keyboardType="numeric"
                onChangeText={(txt) => {
                  role.role === "medico" ? setCrm(txt) : setCpf(txt);
                }}
                fieldValue={role.role === 'medico' ? crm : cpfPattern(cpf)}
                maxLength={role.role === "medico" ? 6 : 14}
                editable={true}
                fieldWidth={90}
              />

              <InputBox
                placeholderTextColor={"#49B3BA"}
                style={{ borderRadius: 5, borderColor: "#49B3BA" }}
                textLabel={"Logradouro"}
                placeholder={"Insira sua rua"}
                fieldValue={logradouro}
                onChangeText={(txt) => setLogradouro(txt)}
                editable={true}
                fieldWidth={90}
              />

              <ContainerCepCidade>
                <InputBox
                  placeholderTextColor={"#49B3BA"}
                  style={{ borderRadius: 5, borderColor: "#49B3BA" }}
                  textLabel={"CEP"}
                  placeholder={"Insira seu CEP"}
                  onChangeText={(txt) => setCep(txt)}
                  maxLength={9}
                  fieldValue={cepPattern(cep)}
                  keyboardType="numeric"
                  editable={true}
                  fieldWidth={40}
                />
                <InputBox
                  placeholderTextColor={"#49B3BA"}
                  style={{ borderRadius: 5, border: "solid 2px #49B3BA" }}
                  placeholder={"Insira sua cidade"}
                  textLabel={"Cidade"}
                  onChangeText={(txt) => setCidade(txt)}
                  fieldValue={cidade}
                  editable={true}
                  fieldWidth={40}
                  // placeholder={(user.role === 'Medico') ? user.endereco? user.endereco.numero : user.endereco? user.endereco.cidade}
                />
              </ContainerCepCidade>
            </>
          )}

          {/* <ButtonLarge
            text={"Salvar"}
            onPress={() => {
              role.role == "medico"
                ? (PutMedico(), GetUser())
                : (PutPaciente(), GetUser());
            }}
          /> */}
          <ButtonLarge
            text={"Salvar"}
            onPress={() => {
              {
                role.role === "medico" ? PutMedico() : PutPaciente();
              }
            }}
          />

          {edit == false ? (
            <ButtonNormal
              onPress={() => {
                edit == false ? setEdit(true) : setEdit(false);
              }}
              text={"Editar"}
            />
          ) : (
            <BlockedButton
              onPress={() => {
                setEdit(false);
              }}
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
