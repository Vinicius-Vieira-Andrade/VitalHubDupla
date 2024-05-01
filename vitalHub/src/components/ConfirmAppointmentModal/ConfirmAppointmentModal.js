import { ActivityIndicator, Modal } from "react-native";
import {
  ModalContent,
  PatientModal,
} from "../CancellationModal/StyleCancelationModal";
import { Title, TitleModalSchedule } from "../Title/StyleTitle";
import {
  DescriptionConfirmModal,
  SmallDescriptionModal,
} from "../Descriptions/StyledDescriptions";
import {
  BoxDescriptions,
  BoxMedicoConsulta,
} from "./StyleConfirmAppointmentModal";
import { Label } from "../Label/Label";
import { LabelDescription } from "../Label/StyleLabel";
import {
  CardCancelLess,
  DescripritionModalSmall,
  DescripritionModalSmall2,
} from "../Descriptions/Descriptions";
import {
  ButtonLargeConfirmModal,
  ButtonLargeModal,
  ButtonLargeSelect,
} from "../Button/Button";

import AsyncStorage from "@react-native-async-storage/async-storage";
import { userDecodeToken, userTokenLogout } from "../../utils/Auth";
import { useEffect, useState } from "react";
import moment from "moment";
import api from "../../services/Services";

export const ConfirmAppointmentModal = ({
  navigation,
  agendamento,
  visible,
  route,
  setShowModal = null,
  ...rest
}) => {

  const [profilePacient, setProfilePacient] = useState(null);

  async function loadProfilePatient() {
    const token = userDecodeToken();
    setProfilePacient(token);
  }


  useEffect(() => {
    console.log(profilePacient);
  })

  useEffect(() => {
    loadProfilePatient();
  }, [])

  async function handleConfirmSchedule() {
    console.log({
      ...agendamento,
      pacienteId: profilePacient.user,
      situacaoId: "A1B44600-EA61-4F99-BD68-772316505491",
    });
    await api
      .post(`/Consultas/Cadastrar`, {
        ...agendamento,
        pacienteId: profilePacient.user,
        situacaoId: "A1B44600-EA61-4F99-BD68-772316505491",
      })
      .then(async () => {
        await setShowModal(false);

        navigation.replace("Main");
      })
      .catch((error) => {
        console.log(error);
      });
  }

  return (
    <Modal {...rest} visible={visible} transparent={true} animationType="fade">
      {agendamento != null ? (
        <PatientModal>
          <ModalContent>
            <Title>Agendar Consulta</Title>

            <DescriptionConfirmModal>
              Consulte os dados selecionados para a sua consulta
            </DescriptionConfirmModal>

            <BoxDescriptions>
              <LabelDescription>Data da consulta</LabelDescription>

              <DescripritionModalSmall
                 text={moment(agendamento.data).format("DD/MM/YYYY  HH:mm")}
              />

              <LabelDescription>Médico(a) da consulta</LabelDescription>

              <DescripritionModalSmall2 text={agendamento.medicoLabel} />

              <DescripritionModalSmall text={agendamento.especialidade} />

              <LabelDescription>Local da consulta</LabelDescription>

              <DescripritionModalSmall text={agendamento.localizacao} />

              <LabelDescription>Tipo da consulta</LabelDescription>

              <DescripritionModalSmall text={agendamento.prioridadeLabel} />
            </BoxDescriptions>

            <ButtonLargeConfirmModal
              onPress={() => {
                handleConfirmSchedule();
              }}
              text={"Confirmar"}
            />

            <CardCancelLess
              onPressCancel={() => setShowModal(false)}
              text={"Cancelar"}
            />
          </ModalContent>
        </PatientModal>
      ) : (
        <ActivityIndicator />
      )}
    </Modal>
  );
};
