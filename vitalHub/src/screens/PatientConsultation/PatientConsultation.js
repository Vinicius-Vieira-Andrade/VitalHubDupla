import { StatusBar } from "react-native";
import {
  BoxDataHome,
  BoxHome,
  ButtonHomeContainer,
  Container,
  FlatContainer,
  MoveIconBell,
} from "../../components/Container/StyleContainer";
import { Header } from "../../components/Header/StyledHeader";
import { ImagemHome } from "../../components/Images/StyleImages";
import { NameTitle, WelcomeTitle } from "../../components/Title/Title";
import { Ionicons } from "@expo/vector-icons";
import Calendar from "../../components/Calendar/Calendar";

import { FilterButton } from "../../components/Button/Button";
import { useEffect, useState } from "react";
import { Card } from "../../components/Cards/Cards";
import { CancellationModal } from "../../components/CancellationModal/CancellationModal";

import { FontAwesome6 } from "@expo/vector-icons";
import { Stethoscope } from "../../components/Stethoscope/StyleSthetoscope";
import { ModalStethoscope } from "../../components/Stethoscope/ModalStethoscope";
import { PatientAppointmentModal } from "../../components/PatientAppointmentModal/PatientAppointmentModal";
import { userDecodeToken } from "../../utils/Auth";
import api from "../../services/Services";
import moment from "moment";
import { LogBox } from 'react-native';

LogBox.ignoreAllLogs() // Ignore log notification by message

export const PatientConsultation = ({ navigation }) => {
  const [user, setUser] = useState({});
  const [ConsultaSelecionada, setConsultaSelecionada] = useState(null);
  const [dataConsulta, setDataConsulta] = useState("");
  const [consultId, setConsultId] = useState();

  const [consultaState, setConsultaState] = useState("Agendadas");

  const [schedule, setSchedule] = useState([]);

  // STATES PARA OS MODAIS

  const [showModalCancel, setShowModalCancel] = useState(false);
  const [showModalAppointment, setShowModalAppointment] = useState(false);
  const [showModalStethoscope, setShowModalStethoscope] = useState(false);
  const [photo, setPhoto] = useState();
  const [role, setRole] = useState();
  const [showModal, setShowModal] = useState(false);
  const [docPhoto, setDocPhoto] = useState();
  const [scheduleUser, setScheduleUser] = useState([]);

  // async function GetScheduleById() {
  //   await api
  //     .get(`/Consultas/BuscarPorId?id=${schedule.id}`)
  //     .then((response) => {
  //       setSchedule(...schedule, response.data);
  //     })
  //     .catch((error) => {
  //       console.log(error);
  //     });
  // }



  function isDateTimePassed(dateTime) {
    // Convertendo a string de data/hora para um objeto Date
    const timestamp = new Date(Date.parse(dateTime));

    // Obter o momento atual
    const now = new Date();

    // Subtrair o valor DateTime fornecido do momento atual
    const differenceInMilliseconds = now.getTime() - timestamp.getTime();

    // Verificar se o valor DateTime fornecido é anterior ao momento atual
    if (differenceInMilliseconds > 0) {
      return true; // O valor DateTime já passou
    }

    // Se o valor DateTime é o mesmo dia, verificar o horário
    if (differenceInMilliseconds === 0) {
      const nowHour = now.getHours();
      const nowMinutes = now.getMinutes();
      const nowSeconds = now.getSeconds();
      const dateTimeHour = timestamp.getHours();
      const dateTimeMinutes = timestamp.getMinutes();
      const dateTimeSeconds = timestamp.getSeconds();

      // Comparar os horários
      if (
        nowHour >
        dateTimeHour(nowHour === dateTimeHour && nowMinutes > dateTimeMinutes)(
          nowHour === dateTimeHour &&
            nowMinutes === dateTimeMinutes &&
            nowSeconds >= dateTimeSeconds
        )
      ) {
        return true; // O horário já passou
      }
    }

    return false; // O valor DateTime não passou
  }



  async function GetSchedule() {
    await api
      .get(`/Pacientes/BuscarPorData?data=${dataConsulta}&id=${user.user}`)
      .then((response) => {
        setSchedule(response.data);
        // setScheduleUser(response.data.medicoClinica.medico);

        // Muda o status da consulta para 'realizada', se a data já tiver passado
        response.data
          .forEach((consult) => {
            console.log(consult.dataConsulta);

            if (consult.situacaoId != "B95A1627-D4A6-4B23-A7F2-898A4103FE5E") {
              if (isDateTimePassed(consult.dataConsulta)) {
                api
                  .put(`/Consultas/Status?idConsulta=${consult.id}&status=Realizadas`)
                  .catch((error) => console.log(error));
              }
            }
          })
          .catch((error) => {
            console.log(error);
          });
      });
  }

  async function ProfileLoad() {
    const token = await userDecodeToken();

    if (token) {
      console.log(token);
      setUser(token);

      setDataConsulta(moment().format("YYYY-MM-DD"));
    }
  }

  async function GetUser() {
    try {
      const token = await userDecodeToken();
      // console.log(token.role)
      if (token.role != null) {
        setRole(token);
        const url = (await token.role) === "medico" ? "Medicos" : "Pacientes";
        const response = await api.get(`${url}/BuscarPorId?id=${token.user}`);
        setPhoto(response.data.idNavigation.foto);
      }
    } catch (error) {
      console.error("Erro ao buscar dados do usuário:", error);
    }
  }

  useEffect(() => {
    ProfileLoad();
  }, []);

  useEffect(() => {
    if (dataConsulta != "") {
      //essa verificacao serve para ser feita depois que o profileload for carregado, como o effect n é async, é sync, se as duas ocorrem ao mesmo tempo  da um bug satanico na mente do computadorkkkkkk
      GetSchedule();
    }
  }, [dataConsulta]);

  useEffect(() => {
    GetUser();
  }, [user]);

  return (
    <Container>
      {user != null ? (
        <Header>
          <BoxHome>
            <ImagemHome source={{ uri: photo }} />
            <BoxDataHome>
              <WelcomeTitle textTitle={"Bem vindo"} />

              <NameTitle textTitle={user.name} />
            </BoxDataHome>
          </BoxHome>

          <MoveIconBell>
            <Ionicons name="notifications" size={25} color="white" />
          </MoveIconBell>
        </Header>
      ) : null}

      <Calendar setDataConsulta={setDataConsulta} />

      <ButtonHomeContainer>
        <FilterButton
          onPress={() => {
            setConsultaState("Agendadas");
          }}
          selected={consultaState == "Agendadas" ? true : false}
          text={"Agendadas"}
        />

        <FilterButton
          onPress={() => {
            setConsultaState("Realizadas");
          }}
          selected={consultaState == "Realizadas" ? true : false}
          text={"Realizadas"}
        />

        <FilterButton
          onPress={() => {
            setConsultaState("Canceladas");
          }}
          selected={consultaState == "Canceladas" ? true : false}
          text={"Canceladas"}
        />
      </ButtonHomeContainer>

      <FlatContainer
        data={schedule}
        renderItem={({ item }) =>
          item.situacao.situacao == consultaState && (
            <Card
              navigation={navigation}
              hour={moment(item.dataConsulta).format("HH:mm")}
              name={item.medicoClinica.medico.idNavigation.nome}
              age={item.medicoClinica.medico.crm}
              routine={item.situacao.situacao}
              url={item.medicoClinica.medico.idNavigation.foto}
              status={consultaState}
              onPressCancel={() => {
                setShowModalCancel(true);
                setConsultId(item.id);
              }}
              onPressAppointment={() => {
                setConsultaSelecionada(item.medicoClinica);
                navigation.navigate("ViewPrescription", {
                  consultaId: item.id,
                  consultaMedico: item.medicoClinica.medico,
                  consulta: item,
                });
                console.log("item" + item.receita);
              }}
              onPressAppointmentCard={() => {
                setConsultaSelecionada(item.medicoClinica);
                setShowModal(
                  item.situacao.situacao === "Agendadas" ? true : false
                );
              }}
            />
          )
        }
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
      />

      <Stethoscope onPress={() => setShowModalStethoscope(true)}>
        <FontAwesome6 name="stethoscope" size={32} color={"white"} />
      </Stethoscope>

      <CancellationModal
        visible={showModalCancel}
        setShowModalCancel={setShowModalCancel}
        consultId={consultId}
      />

      <ModalStethoscope
        navigation={navigation}
        visible={showModalStethoscope}
        setShowModalStethoscope={setShowModalStethoscope}
      />

      <PatientAppointmentModal
        navigation={navigation}
        visible={showModal}
        setShowModal={setShowModal}
        consulta={ConsultaSelecionada}
        roleUsuario={user.role}
      />

      {/* <Main />  */}
    </Container>
  );
};
