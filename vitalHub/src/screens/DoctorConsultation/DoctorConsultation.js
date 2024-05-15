import { ActivityIndicator, StatusBar } from "react-native";
import {
  BoxDataHome,
  BoxHome,
  ButtonHomeContainer,
  Container,
  FlatContainer,
  MoveIconBell,
  ScrollContainer,
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
import { AppointmentModal } from "../../components/AppointmentModal/AppointmentModal";
import moment from "moment";
import { userDecodeToken } from "../../utils/Auth";
import api from "../../services/Services";

export const DoctorConsultation = ({ navigation }) => {
  const [user, setUser] = useState([]);
  const [dataConsulta, setDataConsulta] = useState("");
  const [schedule, setSchedule] = useState([]);
  const [consultaState, setConsultaState] = useState("Agendadas");
  const [photo, setPhoto] = useState();
  const [role, setRole] = useState();
  const [consultaSelecionada, setConsultaSelecionada] = useState();

  const image = require("../../assets/ImageCard.png");

  async function profileLoad() {
    const token = await userDecodeToken();

    console.log("boa");
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

  async function GetSchedule() {
    await api
      .get(`/Medicos/BuscarPorData?data=${dataConsulta}&id=${user.user}`)
      .then((response) => {
        setSchedule(response.data);

        console.log(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }



  async function ChangeStatusSchedule() {
    await api.put(`/Consultas/Status?idConsulta=${consultaSelecionada.id}&status=${consultaSelecionada.situacao}`)
    .then((response) => {
      console.log(response.data)

    })
  }

  useEffect(() => {
    console.log("profileLoad");
    profileLoad();
  }, []);

  useEffect(() => {
    if (dataConsulta != "") {
      GetSchedule();
    }
  }, [dataConsulta]);

  useEffect(() => {
    console.log("consuultaSelecionada");
    console.log(consultaSelecionada);
  }, [consultaSelecionada]);

  useEffect(() => {
    GetUser();
  }, []);

  useEffect(() => {
    console.log("user?");
    console.log(user);
  }, [user]);

  useEffect(() => {
    console.log("Photo?");
    console.log(photo);
  }, [photo]);

  // STATES PARA OS MODAIS

  const [showModalCancel, setShowModalCancel] = useState(false);
  const [showModalAppointment, setShowModalAppointment] = useState(false);

  // RETURN

  return (
    <Container>
      <StatusBar translucent backgroundColor="transparent" />
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
              hour={moment(item.dataConsulta).format('HH:mm')}
              name={item.paciente.idNavigation.nome}
              age={
                item.paciente.dataNascimento != null
                  ? `${moment().diff(
                      item.paciente.dataNascimento,
                      "years"
                    )} anos`
                  : "--"
              }
              routine={item.situacao.situacao}
              url={item.paciente.idNavigation.foto}
              status={consultaState}
              onPressCancel={() => {setShowModalCancel(true)}}
              onPressAppointment={() => {
                setConsultaSelecionada(item);
                setShowModalAppointment(true);
                console.log("oi" + item);
                console.log(consultaSelecionada);
              }}
            />
          )
        }
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
      />

      <CancellationModal
        visible={showModalCancel}
        setShowModalCancel={setShowModalCancel}
      />

      <AppointmentModal
        navigation={navigation}
        visible={showModalAppointment}
        setShowModalAppointment={setShowModalAppointment}
        consultaSelecionada={consultaSelecionada}
      />

      {/* <Card url={require('../../assets/ImageCard.png')} name={"Niccole Sarge"} age={"22 anos"} routine={"Rotina"} hour={"14:00"}/>

                <Card url={require('../../assets/ImageCardMale.png')} name={"Richard Kosta"} age={"28 anos"} routine={"Urgência"} hour={"15:00"}/>

                <Card url={require('../../assets/ney.webp')} name={"Neymar Jr"} age={"33 anos"} routine={"Rotina"} hour={"17:00"}/> */}
    </Container>
  );
};
