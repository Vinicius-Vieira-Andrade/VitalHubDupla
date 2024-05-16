import { Alert, StatusBar } from "react-native";
import { ButtonNormal } from "../../components/Button/Button";
import { NormalButton } from "../../components/Button/StyleButton";
import { ButtonText } from "../../components/ButtonText/StyleButtonText";
import { Container } from "../../components/Container/StyleContainer";
import { DescriptionPassword } from "../../components/Descriptions/Descriptions";
import { Input } from "../../components/Input/Input";
import { Cancel } from "../../components/Link/Link";
import { Title } from "../../components/Title/StyleTitle";
import { LogoCreateAccount } from "../../components/Images/StyleImages";
import { useState } from "react";
import api from "../../services/Services";
import * as yup from "yup";

export const CreateAccount = ({ navigation }) => {
  const [confirmPass, setConfirmPass] = useState("");
  const [user, setUser] = useState({
    //id do tipo usuario paciente cadastrado no banco
    idTipoUsuario: "AAEB024B-C861-41B3-8603-878F3C70A241",
    nome: "",
    email: "",
    senha: "",
    rg: "",
  });

  //senai
  // const [tipoUser, setTipoUser] = useState(
  //   "AAEB024B-C861-41B3-8603-878F3C70A241"
  // );
  //casa
  // const [tipoUser, setTipoUser] = useState(
  //   "97E4A35A-5CFD-4AC3-AEC0-BC240DA1E392"
  // );

  const schema = yup.object().shape({
    senha: yup
      .string()
      .min(6, "A senha deve ter no mínimo 6 caracteres")
      .required("A senha é obrigatória"),
    confirmPass: yup
      .string()
      .oneOf([yup.ref("senha"), null], "As senhas devem coincidir")
      .required("A confirmação de senha é obrigatória"),
  });

  // async function GetEmail() {
  //   await api
  //     .get(`Usuario/BuscaEmail?email=a${user.email}`)
  //     .then((response) => {
  //       console.log(response.data);
  //     })
  //     .catch((error) => {
  //       console.log(`erro ${error}`);
  //     });

    async function Cadastrar() {
      console.log(user);

      var form = new FormData();
      form.append("idTipoUsuario", user.idTipoUsuario);
      form.append("nome", user.nome);
      form.append("email", user.email);
      form.append("senha", user.senha);
      // form.append("dataNascimento", user.dataNascimento);
      // form.append("rg", user.rg);
      // form.append("cpf", user.cpf);

      await schema.validate(
        { senha: user.senha, confirmPass },
        { abortEarly: false }
      );
      // await schema.validate({ senha: user.senha }, { abortEarly: false });

      await api
        .post("/Pacientes", form, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        })
        .then((response) => {
          console.log("Sucesso!");
          console.log(response);
          navigation.replace("Login");
        })
        .catch((error) => {
          console.log("Erro de validação", error);
          navigation.replace("Login");
        });
    }

    return (
      <Container>
        <StatusBar
          translucent
          backgroundColor="transparent"
          barStyle="dark-content"
        />

        <LogoCreateAccount
          source={require("../../assets/VitalHub_Logo1.png")}
        />

        <Title>Criar Conta</Title>

        <DescriptionPassword
          description={
            "Insira seu endereço de e-mail e senha para realizar seu cadastro."
          }
        />

        <Input
          placeholder={"Nome"}
          placeholderTextColor={"#49B3BA"}
          onChangeText={(txt) => setUser({ ...user, nome: txt })}
        />

        <Input
          placeholder={"E-mail"}
          placeholderTextColor={"#49B3BA"}
          onChangeText={(txt) => setUser({ ...user, email: txt })}
        />

        <Input
          placeholder={"RG"}
          placeholderTextColor={"#49B3BA"}
          onChangeText={(txt) => setUser({ ...user, rg: txt })}
        />

        <Input
          placeholder={"Senha"}
          placeholderTextColor={"#49B3BA"}
          secureTextEntry={true}
          onChangeText={(txt) => setUser({ ...user, senha: txt })}
        />

        <Input
          placeholder={"Confirmar senha"}
          placeholderTextColor={"#49B3BA"}
          secureTextEntry={true}
          onChangeText={(txt) => {
            setConfirmPass(txt);
          }}
        />

        <ButtonNormal
          onPress={() => {
            if (
              user.senha === confirmPass &&
              user.senha !== null &&
              confirmPass !== null
            ) {
              Cadastrar();
            } else {
              Alert.alert(
                "Erro de Autenticação!",
                "As senhas não coincidem. Por favor, verifique-as e tente novamente."
              );
            }
          }}
          text={"Cadastrar"}
        />

        <Cancel
          onPress={() => {
            navigation.navigate("Login");
          }}
        />
      </Container>
    );
  };
