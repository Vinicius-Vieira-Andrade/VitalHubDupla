import { BlockedButton, ButtonNormal } from "../../components/Button/Button"
import { BoxAgeEmail, Container, ScrollContainer } from "../../components/Container/StyleContainer"
import { DescriptionPassword, RecordsCancelButton } from "../../components/Descriptions/Descriptions"
import { CancelButtonRecords } from "../../components/Descriptions/StyledDescriptions"
import { HighInputBox, HighInputBoxGrey, LargeInputGray, LargeInputTextBox, } from "../../components/InputBox/InputBox"
import { ImagemPerfilPaciente } from "../../components/Images/StyleImages"
import { TitleProfile } from "../../components/Title/StyleTitle"
import { useEffect, useState } from "react"
import api from "../../services/Services"
import { ActivityIndicator, TouchableOpacity } from "react-native"
import moment from "moment"
import { InputHighGrey } from "../../components/Input/StyleInput"
import { Text } from "react-native-svg"



export const MedicalRecords = ({ navigation, route }) => {


    const [user, setUser] = useState();
    const [consultaSelecionada, setConsultaSelecionada] = useState(null);
    const [description, setDescription] = useState('');
    const [diagnosis, setDiagnosis] = useState('');
    const [prescription, setPrescription] = useState('');
    const [stateEdit, setStateEdit] = useState(false);

    async function BuscarProntuario() {
        await api
            .get(`/Consultas/BuscarPorId?id=${route.params.consultaSelecionada.id}`)
            .then((response) => {
                console.log(response.data);
                setConsultaSelecionada(response.data);
            })
            .catch((error) => {
                console.log(error);
            });
    }

    useEffect(() => {
        // BuscarProntuario()
    }, [route])

    useEffect(() => {
        console.log("etaaaaaaa");
        console.log(consultaSelecionada);
    })

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

    useEffect(() => {
        BuscarProntuario()
    }, [])

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



                        {/* primeiro ternario dos inputs */}
                        {stateEdit == false ? (
                            <>
                                <HighInputBoxGrey
                                    fieldHeight={350}
                                    placeholderTextColor={"#4E4B59"}
                                    textLabel={'Descrição da consulta'}
                                    placeholder={consultaSelecionada.descricao}
                                    editable={false}
                                    fieldWidth={90}
                                />

                                <LargeInputGray
                                    placeholderTextColor={"#4E4B59"}
                                    textLabel={"Diagnóstico do paciente"}
                                    placeholder={consultaSelecionada.diagnostico}
                                    editable={false}
                                    fieldWidth={90}
                                />

                                <HighInputBoxGrey
                                    fieldHeight={350}
                                    placeholderTextColor={"#4E4B59"}
                                    textLabel={'Prescrição médica'}
                                    placeholder={'Prescrição médica'}
                                    editable={false}
                                    fieldWidth={90}
                                />
                            </>
                        ) : (
                            <>
                                <HighInputBox
                                    fieldHeight={350}
                                    placeholderTextColor={"#34898F"}
                                    textLabel={"Descrição da consulta"}
                                    placeholder={consultaSelecionada.descricao}
                                    editable={true}
                                    fieldWidth={90}

                                    onChangeText={p => setDescription(p)}
                                />

                                <LargeInputTextBox
                                    placeholderTextColor={"#34898F"}
                                    textLabel={"Diagnóstico do paciente"}
                                    placeholder={consultaSelecionada.diagnostico}
                                    editable={true}
                                    fieldWidth={90}

                                    onChangeText={p => setDiagnosis(p)}
                                />

                                <HighInputBox
                                    fieldHeight={350}
                                    placeholderTextColor={"#34898F"}
                                    textLabel={"Prescrição médica"}
                                    placeholder={"Prescrição médica"}
                                    editable={true}
                                    fieldWidth={90}
                                />
                            </>
                        )}

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