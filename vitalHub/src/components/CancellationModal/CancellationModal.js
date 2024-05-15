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
  // Setta o status da consulta para "cancelado"
  async function cancelConsult() {
    await api
      .put(`/Consultas/Status`, {
        id: consultId,
        situacaoId: "82BF29CA-72B4-4AF0-8D0B-FC391DB60E95",
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
