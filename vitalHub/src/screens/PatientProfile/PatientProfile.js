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

export const PatientProfile = ({ navigation }) => {
  const [cep, setCep] = useState("");
  const [logradouro, setLogradouro] = useState("");
  const [cidade, setCidade] = useState("");
  const [user, setUser] = useState({});

  //funcao q guarda e carrega os dados trazidos da api
  async function profileLoad() {
    const token = await userDecodeToken();

    if (token) {
      console.log("funcionou!");
      setUser(token);
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
  }, []);

  return (
    <ScrollContainer>
      <Container>
        <ImagemPerfilPaciente source={require("../../assets/sekiro_05-small.jpg")} />

        <TitleProfile>{user.name}</TitleProfile>

        <DescriptionPassword description={user.email} />

        <InputBox
          placeholderTextColor={"#A1A1A1"}
          textLabel={"Data de nascimento:"}
          placeholder={"Ex. 04/05/1999"}
          keyboardType="numeric"
          editable={true}
          fieldWidth={90}
        />
        <InputBox
          placeholderTextColor={"#A1A1A1"}
          textLabel={"CPF"}
          placeholder={"CPF..."}
          keyboardType="numeric"
          maxLength={11}
          editable={true}
          fieldWidth={90}
        />
        <InputBox
          placeholderTextColor={"#A1A1A1"}
          textLabel={"Endereço"}
          placeholder={"Endereço..."}
          editable={true}
          fieldValue={logradouro}
          fieldWidth={90}
        />

        <ContainerCepCidade>
          <InputBox
            placeholderTextColor={"#A1A1A1"}
            textLabel={"CEP"}
            placeholder={"CEP..."}
            maxLength={8}
            onChangeText={(text) => setCep(text)}
            keyboardType="numeric"
            editable={true}
            fieldWidth={40}
            fieldValue={cep}
          />
          <InputBox
            placeholderTextColor={"#A1A1A1"}
            textLabel={"Cidade"}
            placeholder={"Cidade..."}
            editable={true}
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
