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

export const PatientConsultation = ({ navigation }) => {
  const [user, setUser] = useState({});
  const [ConsultaSelecionada, setConsultaSelecionada] = useState(null);
  const [dataConsulta, setDataConsulta] = useState("");

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

  async function GetScheduleById() {
    await api
      .get(`/Consultas/BuscarPorId?id=c55266df-9f14-4585-9dc4-51240d832ca0`)
      .then((response) => {
        setSchedule({ ...user, user: response.data });
        console.log("ById foiiiiii");
        console.log(schedule);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  // talvez n seja necessario esse metodo
  // async function GetPatientById(idUser) {
  //   const response = await api
  //     .get(`/Pacientes/BuscarPorId?id=${idUser.id}`)
  //     .then(response => {
  //       setDocPhoto(response.data);
  //     });
  // }

  async function GetSchedule() {
    await api
      .get(`/Pacientes/BuscarPorData?data=${dataConsulta}&id=${user.user}`)
      .then((response) => {
        setSchedule(response.data);
      })
      .catch((error) => {
        console.log(error);
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
    console.log("user?");
    console.log(user);
  }, [user]);

  useEffect(() => {
    console.log("Poto?");
    console.log(photo);
  }, [photo]);

  useEffect(() => {
    GetUser();
  }, []);

  useEffect(() => {
    if (schedule != null) {
      console.log("SCHEDULE");
      console.log(schedule);
    }
  }, [schedule]);

  useEffect(() => {
    if (schedule != null) {
      GetScheduleById();
    }
  }, []);

  useEffect(() => {
    console.log("scheduleUser");
    console.log(scheduleUser);
  }, [scheduleUser]);

  useEffect(() => {
    console.log(schedule.id);
  }, [schedule]);

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
              hour={"14:00"}
              name={item.medicoClinica.medico.idNavigation.nome}
              age={item.medicoClinica.medico.crm}
              routine={item.situacao.situacao}
              url={item.medicoClinica.medico.idNavigation.foto}
              status={consultaState}
              onPressCancel={() => setShowModalCancel(true)}
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
