import { useEffect, useState } from "react"
import { SendButton } from "../../components/Button/Button"
import { ButtonSend } from "../../components/Button/StyleButton"
import { BoxAgeEmail, BoxBtn, BoxDescription, BoxViewImageImport, Container, ScrollContainer, ViewImageImport } from "../../components/Container/StyleContainer"
import { CardBackLess, CardCancel, CardCancelLess, DescriptionDoc, DescriptionPassword } from "../../components/Descriptions/Descriptions"
import { ImagePrescription, ImagePrescriptionNull, ViewImage } from "../../components/Images/StyleImages"
import { HighInputBox, HighInputBoxGrey, InputBox } from "../../components/InputBox/InputBox"
import { Label } from "../../components/Label/Label"
import { TitleProfile } from "../../components/Title/StyleTitle"
import { ImportImages, Line, TitleImage } from "./Style"

import { CameraModal } from '../../components/Camera/CameraModal'

import * as MediaLibrary from "expo-media-library"
import api from "../../services/Services"

export const ViewPrescription = ({ navigation, route }) => {
    const [photo, setPhoto] = useState( false )
    const [uriCameraCapture, setUriCameraCapture] = useState( false )
    const [showCameraModal, setShowCameraModal] = useState( false )

    const [descricaoExame ,setDescricaoExame] = useState()

    // Inserir imagem no prontuário
      async function InserirExame() {
        const formData = new FormData()
        formData.append("ConsultaId", prontuario.id)
        formData.append("Imagem", {
            uri : uriCameraCapture,
            name :  `image.${ uriCameraCapture.split('.').pop() }`,
            type :  `image/${ uriCameraCapture.split('.').pop() }`,
        });
        await api.post('/Exame', formData, {
            "Content-Type": "multipart/form-data"
        }).then(response => {
            console.log(response)
            setDescricaoExame( descricaoExame + "/n" + response.data.descricao )
        }).catch(error => {
            console.log(error);
        })
      }

      useEffect(() => {
        if ( uriCameraCapture ) {
          InserirExame();
        }
      }, [uriCameraCapture]);

    return (
        <>
            <ScrollContainer>

                <Container>

                    <ViewImage source={require("../../assets/ney.webp")} />

                    <TitleProfile>Dr. Ney</TitleProfile>

                    <BoxDescription>
                        <DescriptionDoc description={"Cliníco geral"} />
                        <DescriptionDoc description={"CRM-15286"} />
                    </BoxDescription>

                    <HighInputBoxGrey
                        fieldHeight={350}
                        placeholderTextColor={"#A1A1A1"}
                        textLabel={"Descrição da consulta"}
                        placeholder={"Descrição"}
                        editable={true}
                        fieldWidth={90}
                    />

                    <InputBox
                        placeholderTextColor={"#A1A1A1"}
                        textLabel={"Diagnóstico do paciente"}
                        placeholder={"Diagnóstico"}
                        editable={true}
                        fieldWidth={90}
                    />

                    <HighInputBoxGrey
                        // fieldHeight={350}
                        placeholderTextColor={"#A1A1A1"}
                        textLabel={"Prescrição médica"}
                        placeholder={"Prescrição"}
                        editable={true}
                        fieldWidth={90}
                    />

                    <BoxViewImageImport>

                        <Label textLabel={"Exames médicos"} />

                        <ImportImages>
                            {route.params ? <ImagePrescription source={{ uri : route.params.photoUri }} /> : <TitleImage>{"[ ! ] Nenhuma foto informada"}</TitleImage>}
                        </ImportImages>

                    </BoxViewImageImport>

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
                        placeholder={"Resultado do exame"}
                        editable={true}
                        fieldWidth={90}
                    />

                    <CardBackLess onPressCancel={() => { navigation.navigate("PatientConsultation") }} text={"Voltar"} />

                </Container>

            </ScrollContainer>
        </>
    )
}