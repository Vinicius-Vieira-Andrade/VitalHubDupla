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
import { userDecodeToken, userDecodeTokenClean } from "../../utils/Auth";
import api from "../../services/Services";
import moment from "moment";

export const PatientConsultation = ({ navigation }) => {
  const [user, setUser] = useState([]);
  const [dataConsulta, setDataConsulta] = useState("");
  const [ConsultaSelecionada, setConsultaSelecionada] = useState(null);

  //STATE PARA O ESTADO DOS CARDS FLATLIST, BOTOES FILTRO
  const [selected, setSelected] = useState({
    agendadas: true,
    realizadas: false,
    canceladas: false,
  });
  const [consultaState, setConsultaState] = useState("Agendadas");

  const [schedule, setSchedule] = useState([]);

  const image = require("../../assets/CardDoctorImage.png");

  // STATES PARA OS MODAIS
  const [state, setState] = useState("");

  const [showModalCancel, setShowModalCancel] = useState(false);
  const [showModalAppointment, setShowModalAppointment] = useState(false);
  const [showModalStethoscope, setShowModalStethoscope] = useState(false);

  const [showModal, setShowModal] = useState(false);

  const [role, setRole] = useState("");

  function MostrarModal(modal, consulta) {
    setConsultaSelecionada(consulta);

    if (modal == "Canceladas") {
      setShowModalCancel(true);
    } else if (modal == "Realizadas") {
      setShowModalAppointment(true);
    } else {
      setShowModalStethoscope(true);
    }
  }

  async function GetSchedule() {
    // const url = (user.role == 'paciente' ? 'Pacientes' : 'Medicos')

    // console.log(`/${url}/BuscarPorData?data=${dataConsulta}&id=${user.user}`);

    await api
      .get(`/Pacientes/BuscarPorData?data=${dataConsulta}&id=${user.user}`)
      .then((response) => {
        setSchedule(response.data);

        console.log(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
    // try {
    //   const token = await userDecodeToken()

    //   if (token) {
    //     const req = await api.get("/Consultas", {
    //       headers: { Authorization: `Bearer ${token}` }
    //     })
    //     setSchedule(req.data);
    //     console.log(req.data);
    //   }

    //   else{
    //     console.log("token não encontrado!");
    //   }

    // } catch (error) {
    //   console.log(error);
    // }
  }

  async function ProfileLoad() {
    const token = await userDecodeToken();

    if (token) {
      console.log(token);
      setUser(token);

      setDataConsulta(moment().format("YYYY-MM-DD"));
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

  return (
    <Container>
      <Header>
        <StatusBar translucent backgroundColor="transparent" />

        <BoxHome>
          <ImagemHome source={require("../../assets/PatientHomeImage.png")} />

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
              // paciente={item}
              navigation={navigation}
              hour={"14:00"}
              name={item.medicoClinica.medico.idNavigation.nome}
              // date={item.dataConsulta}
              age={item.medicoClinica.medico.crm}
              routine={item.situacao.situacao}
              url={image}
              status={consultaState}
              onPressCancel={() => setShowModalCancel(true)}
              onPressAppointment={() => {
                navigation.navigate("ViewPrescription");
              }}
              onPressAppointmentCard={() => {
                setConsultaSelecionada(item.medicoClinica.medico);
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
