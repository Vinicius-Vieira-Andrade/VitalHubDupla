import { BlockedButton, ButtonNormal } from "../../components/Button/Button"
import { BoxAgeEmail, Container, ScrollContainer } from "../../components/Container/StyleContainer"
import { DescriptionPassword, RecordsCancelButton } from "../../components/Descriptions/Descriptions"
import { CancelButtonRecords } from "../../components/Descriptions/StyledDescriptions"
import { HighInputBox, LargeInputTextBox } from "../../components/InputBox/InputBox"
import { ImagemPerfilPaciente } from "../../components/Images/StyleImages"
import { TitleProfile } from "../../components/Title/StyleTitle"
import { useEffect, useState } from "react"
import api from "../../services/Services"
import { ActivityIndicator } from "react-native"
import moment from "moment"



export const MedicalRecords = ({ navigation, route }) => {


    const [user, setUser] = useState();
    const [consultaSelecionada, setConsultaSelecionada] = useState(null);
    const [description, setDescription] = useState('');
    const [diagnosis, setDiagnosis] = useState('');
    const [prescription, setPrescription] = useState('');
    const [stateEdit, setStateEdit] = useState(false);

    // async function BuscarProntuario() {
    //     await api
    //         .get(`/Consultas/BuscarPorId?id=${route.params.consultaId}`)
    //         .then((response) => {
    //             console.log(response.data);
    //             setConsultaSelecionada(response.data);
    //         })
    //         .catch((error) => {
    //             console.log(error);
    //         });
    // }

    // useEffect(() => {
    //     // BuscarProntuario()
    // }, [route])

    useEffect(() => {
        if (route.params) {
            setConsultaSelecionada(route.params.consultaSelecionada)
        }
    }, [route])


    async function Update() {

        await api.put(`/Consultas/Prontuario`,
            {
                consultaId: consultaSelecionada.id,
                descricao: description,
                diagnostico: diagnosis,
                medicamento: prescription
            }

        ).then(response => {

            console.log(`boa: ${response}`);
            // setConsultaSelecionada(response.data)

        }).catch(error => {
            console.log(error)
        })

    }

    return (

        <ScrollContainer>

            {consultaSelecionada != null ? (
                <>
                    <ImagemPerfilPaciente source={require('../../assets/ney.webp')} />

                    <Container>


                        <TitleProfile>{consultaSelecionada.paciente.idNavigation.nome}</TitleProfile>

                        <BoxAgeEmail>

                            <DescriptionPassword description={`${moment().year() - moment(consultaSelecionada.paciente.dataNascimento).format("YYYY")} anos`} />
                            <DescriptionPassword description={consultaSelecionada.paciente.idNavigation.email} />

                        </BoxAgeEmail>



                        <HighInputBox
                            fieldHeight={350}
                            placeholderTextColor={"#34898F"}
                            textLabel={"Descrição da consulta"}
                            placeholder={consultaSelecionada.descricao}
                            editable={stateEdit}
                            fieldWidth={90}

                            onChangeText={p => setDescription(p)}
                        />

                        <LargeInputTextBox
                            placeholderTextColor={"#34898F"}
                            textLabel={"Diagnóstico do paciente"}
                            placeholder={consultaSelecionada.diagnostico}
                            editable={stateEdit}
                            fieldWidth={90}

                            onChangeText={p => setDiagnosis(p)}
                        />

                        <HighInputBox
                            fieldHeight={350}
                            placeholderTextColor={"#34898F"}
                            textLabel={"Prescrição médica"}
                            placeholder={"Prescriçao médica"}
                            editable={stateEdit}
                            fieldWidth={90}
                            

                        />

                        <ButtonNormal onPress={() => { setStateEdit(false), Update() }} text={"Salvar"} />

                        {stateEdit == false ? (
                            <ButtonNormal onPress={() => { stateEdit == false ? (setStateEdit(true)) : (setStateEdit(false)) }} text={"Editar"} />
                        ) : (
                            <BlockedButton onPress={() => { setStateEdit(false) }}
                                text={"Editar"}
                            />
                        )}



                        <RecordsCancelButton onPress={() => {
                            navigation.replace("DoctorMain");
                        }}
                            text={"Cancelar"}
                        />

                    </Container>
                </>
            ) : (<ActivityIndicator />)}



        </ScrollContainer>

    )
}