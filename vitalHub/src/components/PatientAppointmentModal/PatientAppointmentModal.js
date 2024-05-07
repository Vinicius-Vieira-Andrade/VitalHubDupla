import { ActivityIndicator, Modal } from "react-native";
import {
  ButtonLargeConfirmModal,
  ButtonLargeModal,
  ButtonLargeSelect,
} from "../Button/Button";
import {
  ModalContent,
  PatientModal,
} from "../CancellationModal/StyleCancelationModal";
import { CardCancelLess } from "../Descriptions/Descriptions";
import { DescriptionModalRecord } from "../Descriptions/StyledDescriptions";
import { ImageModalRecord } from "../Images/StyleImages";
import { TitleModal, TitleModalRecord } from "../Title/StyleTitle";
import { BoxAgeEmailModal } from "./StylePatientAppointmentModal";
<<<<<<< HEAD
import { useEffect, useState } from "react";
=======
>>>>>>> origin/mikael

export const PatientAppointmentModal = ({
  navigation,
  visible,
<<<<<<< HEAD
  roleUsuario,
  consulta,
  setShowModal = null,
  ...rest
}) => {
  // if (!consulta) {
  //   return null;
  // }

  function handlePress(rota) {
    // setShowModalAppoitment(false)
    navigation.replace(rota, { clinicaId: consulta.clinicaId });
  }

  console.log(` deu bom?${consulta}`);

=======
  setShowModal = null,
  ...rest
}) => {
>>>>>>> origin/mikael
  return (
    <Modal {...rest} visible={visible} transparent={true} animationType="fade">
      {consulta != null ? (
        <PatientModal>
          <ModalContent>
            <ImageModalRecord
              source={require("../../assets/CardRecordPatient(doctorImage).png")}
            />

            <TitleModalRecord>
              {consulta.medico.idNavigation.nome}
            </TitleModalRecord>

            <BoxAgeEmailModal>
              <DescriptionModalRecord>{}</DescriptionModalRecord>
              <DescriptionModalRecord>
                {consulta.medico.crm}
              </DescriptionModalRecord>
            </BoxAgeEmailModal>

<<<<<<< HEAD
            <ButtonLargeConfirmModal
              onPress={() => {
                // navigation.navigate("ConsultLocalization");
                handlePress("ConsultLocalization");
                setShowModal(false);
              }}
              text={"Ver Local da Consulta"}
            />
=======
          <ButtonLargeConfirmModal
            onPress={() => {
              navigation.navigate("ConsultLocalization");
              setShowModal(false);
            }}
            text={"Ver Local da Consulta"}
          />
>>>>>>> origin/mikael

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
