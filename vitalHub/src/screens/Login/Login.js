import {
  Title,
  TitleInvalidInputAlert,
} from "../../components/Title/StyleTitle";
import { Container } from "../../components/Container/StyleContainer";
import { Logo } from "../../components/Images/StyleImages";
import { Input } from "../../components/Input/Input";
import { LinkMedium } from "../../components/TextMedium/TextMedium";
import { LinkAccount } from "../../components/Link/Link";

import { ButtonGoogle, ButtonNormal } from "../../components/Button/Button";
import { ActivityIndicator, Alert, StatusBar } from "react-native";
import { useState } from "react";

import api from "../../services/Services";

import AsyncStorage from "@react-native-async-storage/async-storage";
import { userDecodeToken } from "../../utils/Auth";
import { LogBox } from 'react-native';

LogBox.ignoreAllLogs();  // Ignore log notification by message

// import { faL } from "@fortawesome/free-solid-svg-icons";

export const Login = ({ navigation }) => {
  const [email, setEmail] = useState();
  // const [email, setEmail] = useState("stefany@gmail.com");
  // const [email, setEmail] = useState("viniividrade@gmail.com");
  // const [email, setEmail] = useState("paciente@gmail.com");
  // const [senha, setSenha] = useState("Senai@134");
  const [senha, setSenha] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const [isInputDataValid, setIsInputDataValid] = useState(true); // Guardo o estado do input (se estiver errado, mostrar mensagem de erro)

  async function Login() {
    // Desativa o retorno de input inválido
    await api
      .post("/Login", {
        email: email,
        senha: senha,
      })
      .then(async (response) => {
        setIsInputDataValid(true);
        console.log(response.data.token);

        await AsyncStorage.setItem("token", JSON.stringify(response.data));

        const token = await userDecodeToken();

        if (token.role === "paciente") {
          navigation.replace("Main");
        } else {
          navigation.replace("DoctorMain");
        }
      })
      .catch((error) => {
        // Ativa o retorno de input inválido
        setIsInputDataValid(false);
        console.log(error);
      });
  }

  return (
    <Container>
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle="dark-content"
      />

      <Logo source={require("../../assets/VitalHub_Logo1.png")} />

      <Title>Entrar ou criar conta</Title>

      {isInputDataValid === false ? (
        <TitleInvalidInputAlert>
          Email ou senha inválidos!
        </TitleInvalidInputAlert>
      ) : null}

      <Input
        placeholder={"E-mail"}
        placeholderTextColor={"#49B3BA"}
        fieldValue={email}
        onChangeText={(txt) => setEmail(txt)}
        isInsertedInputValid={isInputDataValid}
      />

      <Input
        placeholder={"Senha"}
        placeholderTextColor={"#49B3BA"}
        secureTextEntry={true}
        fieldValue={senha}
        onChangeText={(txt) => setSenha(txt)}
        isInsertedInputValid={isInputDataValid}
      />

      <LinkMedium
        textLink={"Esqueceu sua senha ?"}
        onPress={() => navigation.navigate("ForgotPassword")}
      />

      <ButtonNormal onPress={() => Login()} text={"Entrar"} />

      {/* Indicador de Loading */}
      <ActivityIndicator
        animating={isLoading}
        hidesWhenStopped={false}
        size="large"
      />

      <ButtonGoogle
        // onPress={() => navigation.replace("DoctorMain")}
        onPress={() =>
          Alert.alert(
            "Erro",
            "erro ao estabelecer conexão com serviços Google."
          )
        }
        text={"Entrar com Google"}
      />

      <LinkAccount onPress={() => navigation.replace("CreateAccount")} />
    </Container>
  );
};
