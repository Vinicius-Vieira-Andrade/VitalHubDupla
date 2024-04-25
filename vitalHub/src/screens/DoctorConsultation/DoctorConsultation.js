import { StatusBar } from "react-native";
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

  const currentDate = moment();
  const currentYear = currentDate.year();

  //STATE PARA O ESTADO DOS CARDS FLATLIST, BOTOES FILTRO
  // const [selected, setSelected] = useState({
  //   agendadas: true,
  //   realizadas: false,
  //   canceladas: false,
  // });

  const [consultaSelecionada, setConsultaSelecionada] = useState()

  const image = require("../../assets/ImageCard.png");

  //   1 - Logout === ok
  //   2 - dados na tela de perfil
  //   3 - dados no Header quando logar

  async function ProfileLoad() {
    const token = await userDecodeToken();

    console.log("boa");
    if (token) {
      console.log(token);
      setUser(token);
      setDataConsulta(moment().format("YYYY-MM-DD"));
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

  useEffect(() => {
    ProfileLoad();
  }, []);

  useEffect(() => {
    if (dataConsulta != "") {
      GetSchedule();
    }
  }, [dataConsulta]);

  // STATES PARA OS MODAIS

  const [showModalCancel, setShowModalCancel] = useState(false);
  const [showModalAppointment, setShowModalAppointment] = useState(false);


  // RETURN

  return (
    <Container>

      <StatusBar translucent backgroundColor="transparent" />
      <Header>
        <BoxHome>
          <ImagemHome source={require("../../assets/DoctorImage.png")} />

          <BoxDataHome>
            <WelcomeTitle textTitle={"Bem vindo"} />

            <NameTitle textTitle={user.name} />
          </BoxDataHome>
        </BoxHome>

        <MoveIconBell>
          <Ionicons name="notifications" size={25} color="white" />
        </MoveIconBell>
      </Header>

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
              name={item.paciente.idNavigation.nome}
              // age={"20"}
              age={currentYear - item.paciente.dataNascimento}
              routine={item.situacao.situacao}
              url={image}
              status={consultaState}
              onPressCancel={() => setShowModalCancel(true)}
              onPressAppointment={() => {
                setConsultaSelecionada(item)
                setShowModalAppointment(true)
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
