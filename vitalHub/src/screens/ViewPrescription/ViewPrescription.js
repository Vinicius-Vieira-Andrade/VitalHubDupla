import { useEffect, useState } from "react";
import { SendButton } from "../../components/Button/Button";
import { ButtonSend } from "../../components/Button/StyleButton";
import {
  BoxAgeEmail,
  BoxBtn,
  BoxDescription,
  BoxViewImageImport,
  Container,
  ScrollContainer,
  ViewImageImport,
} from "../../components/Container/StyleContainer";
import {
  CardBackLess,
  CardCancel,
  CardCancelLess,
  DescriptionDoc,
  DescriptionPassword,
} from "../../components/Descriptions/Descriptions";
import {
  ImagePrescription,
  ImagePrescriptionNull,
  ViewImage,
} from "../../components/Images/StyleImages";
import {
  HighInputBox,
  HighInputBoxGrey,
  InputBox,
  LargeInputTextBox,
} from "../../components/InputBox/InputBox";
import { Label } from "../../components/Label/Label";
import { TitleProfile } from "../../components/Title/StyleTitle";
import { ImportImages, Line, TitleImage } from "./Style";

import * as MediaLibrary from "expo-media-library";
import api from "../../services/Services";
import { ActivityIndicator } from "react-native";

export const ViewPrescription = ({ navigation, route }) => {
  const [consultaSelecionada, setConsultaSelecionada] = useState(null);
  const [prescription, setPrescription] = useState({})
  const [descricaoExame, setDescricaoExame] = useState()
  const [uriCameraCapture, setUriCameraCapture] = useState("")

  async function profileLoad() {
    const token = await userDecodeToken();

    if (token !== null) {
      setPrescription(token);
    }

    else {
      console.error(error, "Function Profile Load");
    }
  }

  useEffect(() => {
    profileLoad();
  }, []);

  async function BuscarProntuario() {
    await api
      .get(`/Consultas/BuscarPorId?id=${route.params.consultaId}`)
      .then((response) => {
        console.log(response.data);
        setConsultaSelecionada(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }


  // Inserir imagem no prontuário
  async function InserirExame() {
    const formData = new FormData()
    formData.append("ConsultaId", prescription.id)
    formData.append("Image", {
      uri: uriCameraCapture,
      name: `image.${uriCameraCapture.split('.').pop()}`,
      type: `image/${uriCameraCapture.split('.').pop()}`,
    });

    await api.post('/Exame', formData, {
      headers: {
        "Content-Type": "multipart/form-data"
      }
    }).then(response => {
      setDescricaoExame(descricaoExame + "/n" + response.data.descricao)

      console.log(descricaoExame + "/n" + response.data.descricao)
    }).catch(error => {
      console.log(error, 'Falha ao Inserir');
    })
  }


  useEffect(() => {
    console.log(`consulta:  ${consultaSelecionada}`);
    console.log(`route ${route.params}`);
    console.log(`/Consultas/BuscarPorId?id=${route.params.consultaId}`);
  }, [route]);

  useEffect(() => {
    if (consultaSelecionada == null) {
      BuscarProntuario();
    }
  }, [consultaSelecionada]);

  useEffect(() => {
    if (uriCameraCapture) {
      InserirExame();
    }
  }, [uriCameraCapture])

  return (
    <>
      <ScrollContainer>
        {consultaSelecionada != null ? (
          <Container>
            <ViewImage source={require("../../assets/ney.webp")} />

            <TitleProfile>
              {route.params.consultaMedico.idNavigation.nome}
            </TitleProfile>

            <BoxDescription>
              <DescriptionDoc
                description={
                  route.params.consultaMedico.especialidade.especialidade1
                }
              />
              <DescriptionDoc
                description={route.params.consulta.medicoClinica.medico.crm}
              />
            </BoxDescription>

            <HighInputBoxGrey
              fieldHeight={350}
              placeholderTextColor={"#A1A1A1"}
              textLabel={"Descrição da consulta"}
              placeholder={"Descricão"}
              editable={true}
              fieldWidth={90}
              fieldValue={route.params.consulta.descricao}
            />

            <InputBox
              placeholderTextColor={"#A1A1A1"}
              textLabel={"Diagnóstico do paciente"}
              placeholder={"Diagnóstico"}
              editable={true}
              fieldWidth={90}
              fieldValue={route.params.consulta.diagnostico}
            />

            <HighInputBoxGrey
              // fieldHeight={350}
              placeholderTextColor={"#A1A1A1"}
              textLabel={"Prescrição médica"}
              placeholder={"Prescrição"}
              editable={true}
              fieldWidth={90}
              fieldValue={"dipirona"}
            />

            <BoxViewImageImport>
              <Label textLabel={"Exames médicos"} />

              <ImportImages>
                {route.params ? (
                  <ImagePrescription source={{ uri: route.params.photoUri }} />
                ) : (
                  <TitleImage>{"[ ! ] Nenhuma foto informada"}</TitleImage>
                )}
              </ImportImages>
            </BoxViewImageImport>

            <BoxBtn>
              <SendButton
                onPress={() => {
                  navigation.navigate("Camera");
                }}
                text={"Enviar"}
              />
              <CardCancel
                onPressCancel={() => {
                  navigation.replace("Main");
                }}
                text={"Cancelar"}
              />
            </BoxBtn>

            <Line />

            <HighInputBoxGrey
              // fieldHeight={350}
              placeholderTextColor={"#A1A1A1"}
              placeholder={"Resultado do exame"}
              editable={true}
              fieldWidth={90}
            />

            <CardBackLess
              onPressCancel={() => {
                navigation.navigate("PatientConsultation");
              }}
              text={"Voltar"}
            />
          </Container>
        ) : (
          <ActivityIndicator />
        )}
      </ScrollContainer>
    </>
  );
};
