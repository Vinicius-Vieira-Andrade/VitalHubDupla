<<<<<<< HEAD
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

  useEffect(() => {
    console.log(`consulta:  ${consultaSelecionada}`);
    console.log(`route ${route.params}`);
    console.log(`/Consultas/BuscarPorId?id=${route.params.consultaId}`);
  }, [route]);
=======
import { useEffect, useState } from "react"
import { SendButton } from "../../components/Button/Button"
import { ButtonSend } from "../../components/Button/StyleButton"
import { BoxAgeEmail, BoxBtn, BoxDescription, BoxViewImageImport, Container, ScrollContainer, ViewImageImport } from "../../components/Container/StyleContainer"
import { CardBackLess, CardCancel, CardCancelLess, DescriptionDoc, DescriptionPassword } from "../../components/Descriptions/Descriptions"
import { ImagePrescription, ImagePrescriptionNull, ViewImage } from "../../components/Images/StyleImages"
import { HighInputBox, HighInputBoxGrey, InputBox, InputBoxGray } from "../../components/InputBox/InputBox"
import { Label } from "../../components/Label/Label"
import { TitleProfile } from "../../components/Title/StyleTitle"
import { ImportImages, Line, TitleImage } from "./Style"

import { CameraModal } from '../../components/Camera/CameraModal'

import * as MediaLibrary from "expo-media-library"
import api from "../../services/Services"
import { userDecodeToken } from "../../utils/Auth"

export const ViewPrescription = ({ navigation, route }) => {
    const [photo, setPhoto] = useState( false )
    const [showCameraModal, setShowCameraModal] = useState( false )
    
    const [prescription, setPrescription] = useState({})
    const [descricaoExame ,setDescricaoExame] = useState()
    const [uriCameraCapture, setUriCameraCapture] = useState( "" )

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

    // Inserir imagem no prontuário
      async function InserirExame() {
        const formData = new FormData()
        // formData.append("ConsultaId", prescription.id)
        formData.append("ConsultaId", '94DF9F3D-576A-40D4-ACB5-4FEBE3AE220C')
        formData.append("Image", {
            uri : uriCameraCapture,
            name :  `image.${uriCameraCapture.split('.').pop()}`,
            type :  `image/${uriCameraCapture.split('.').pop()}`,
        });

        await api.post('/Exame', formData, {
            headers : {
                "Content-Type": "multipart/form-data"
            }
        }).then( response => {
            setDescricaoExame( descricaoExame + "/n" + response.data.descricao )

            console.log(descricaoExame + "/n" + response.data.descricao)
        }).catch(error => {
            console.log(error, 'Falha ao Inserir');
        })
      }

      useEffect(() => {
        if ( uriCameraCapture ) {
          InserirExame();
        }
      }, [uriCameraCapture]);
>>>>>>> origin/mikael

  useEffect(() => {
    if (consultaSelecionada == null) {
      BuscarProntuario();
    }
  }, [consultaSelecionada]);

  return (
    <>
      <ScrollContainer>
        {consultaSelecionada != null ? (
          <Container>
            <ViewImage source={require("../../assets/ney.webp")} />

            <TitleProfile>
              {route.params.consultaMedico.idNavigation.nome}
            </TitleProfile>

<<<<<<< HEAD
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
=======
                    <TitleProfile>{prescription.name}</TitleProfile>
>>>>>>> origin/mikael

            <HighInputBoxGrey
              fieldHeight={350}
              placeholderTextColor={"#A1A1A1"}
              textLabel={"Descrição da consulta"}
              placeholder={"Descricão"}
              editable={true}
              fieldWidth={90}
              fieldValue={route.params.consulta.descricao}
            />

<<<<<<< HEAD
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
=======
                    <HighInputBoxGrey
                        fieldHeight={350}
                        placeholderTextColor={"#A1A1A1"}
                        textLabel={"Descrição da consulta"}
                        placeholder={"Descrição"}
                        editable={false}
                        fieldWidth={90}
                    />

                    <InputBoxGray
                        placeholderTextColor={"#A1A1A1"}
                        textLabel={"Diagnóstico do paciente"}
                        placeholder={"Diagnóstico"}
                        editable={false}
                        fieldWidth={90}
                    />

                    <HighInputBoxGrey
                        // fieldHeight={350}
                        placeholderTextColor={"#A1A1A1"}
                        textLabel={"Prescrição médica"}
                        placeholder={"Prescrição"}
                        editable={false}
                        fieldWidth={90}
                    />
>>>>>>> origin/mikael

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

<<<<<<< HEAD
            <Line />
=======
                        <ImportImages>
                        <ImagePrescription source={{ uri : prescription.foto }} />
                            {/* {route.params ? <ImagePrescription source={{ uri : prescription.foto }} /> : <TitleImage>{"[ ! ] Nenhuma foto informada"}</TitleImage>} */}
                        </ImportImages>
>>>>>>> origin/mikael

            <HighInputBoxGrey
              // fieldHeight={350}
              placeholderTextColor={"#A1A1A1"}
              placeholder={"Resultado do exame"}
              editable={true}
              fieldWidth={90}
            />

<<<<<<< HEAD
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
=======
                    <CameraModal
                        getMediaLibrary={true}
                        visible={showCameraModal}
                        setUriCameraCapture={setUriCameraCapture}
                        // setShowCameraModal={setShowCameraModal}
                        setShowModalCancel={setShowCameraModal}
                    />

                    <BoxBtn>
                        <SendButton onPress={ () => setShowCameraModal(true)} text={"Enviar"} />
                        <CardCancel onPressCancel={() => {navigation.replace("Main") }} text={"Cancelar"} />
                    </BoxBtn>

                    <Line />

                    <HighInputBoxGrey
                        // fieldHeight={350}
                        placeholderTextColor={"#A1A1A1"}
                        placeholder={descricaoExame}
                        editable={true}
                        fieldWidth={90}
                    />

                    <CardBackLess onPressCancel={() => { navigation.navigate("PatientConsultation") }} text={"Voltar"} />

                </Container>

            </ScrollContainer>
        </>
    )
}
>>>>>>> origin/mikael
