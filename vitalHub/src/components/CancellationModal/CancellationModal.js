import { Modal } from "react-native";
import { TitleModal, TitleModalRecord } from "../Title/StyleTitle";
import { DescriptionCancel } from "../Descriptions/StyledDescriptions";
import { ButtonLargeSelect } from "../Button/Button";
import { CardCancelLess } from "../Descriptions/Descriptions";
import { ModalContent, PatientModal } from "./StyleCancelationModal";
import { handleCallNotifications } from "../Notifications/Notifications";
import api from "../../services/Services";
import { useEffect } from "react";

export const CancellationModal = ({
  navigation,
  visible,
  onBtnContinuePress,
  consultId,
  setShowModalCancel = null,
  ...rest
}) => {
  // Seta o status da consulta para "cancelado"
  async function cancelConsult() {
    console.log(
      `/Consultas/Status?idConsulta=${consultId}&status=Canceladas`
    );
     await api
    //   .put(`/Consultas/Status`, {
    //     idConsulta: consultId,
    //     status: "Canceladas",
    //   })
      .put(`/Consultas/Status?idConsulta=${consultId}&status=Canceladas`)
      .then((response) => {
        console.log(response.data);
      })
      .catch((error) => console.log(error));
  }

  return (
    <Modal {...rest} visible={visible} transparent={true} animationType="fade">
      {/* container */}
      <PatientModal>
        <ModalContent>
          <TitleModal>Cancelar Consulta</TitleModal>

          <DescriptionCancel>
            Ao cancelar essa consulta, abrirá uma possível disponibilidade no
            seu horário, deseja mesmo cancelar essa consulta?
          </DescriptionCancel>

          <ButtonLargeSelect
            onPress={() => {
              cancelConsult();
              setShowModalCancel(false),
                handleCallNotifications({
                  title: "Consulta cancelada !!!",
                  body: "Consulta cancelada com sucesso.",
                });
            }}
            text={"Continuar"}
          />

          <CardCancelLess
            onPressCancel={() => setShowModalCancel(false)}
            text={"Cancelar"}
          />
        </ModalContent>
      </PatientModal>
    </Modal>
  );
};
