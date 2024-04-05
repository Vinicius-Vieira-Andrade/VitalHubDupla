// ERRO NA FUNÇÃO DE FECHAR O MODAL
// MODAL FUNCIONANDO CORRETAMENTE
// SÓ FALTA CONFIGURAR O MODAL


import { Modal } from "react-native";
import {
  ButtonLargeConfirmModal,
  ButtonLargeModal,
  ButtonLargeSelect,
} from "../../../components/Button/Button";
import {
  ModalContent,
  PatientModal,
} from "../../../components/CancellationModal/StyleCancelationModal";
import { CardCancelLess } from "../../../components/Descriptions/Descriptions";
import { DescriptionModalRecord } from "../../../components/Descriptions/StyledDescriptions";
import { ImageModalRecord } from "../../../components/Images/StyleImages";
import { TitleModal, TitleModalRecord } from "../../../components/Title/StyleTitle";
import { BoxAgeEmailModal } from "./StyleClinicAppointmentModal";
import { useState } from "react";

import { CardCancelLessLocal } from "../../../components/Descriptions/Descriptions";

export const ClinicAppointmentModal = ({
  clinic,
  navigation,
  visible,
  setShowModal = null,
  ...rest
}) => {
  const [showModalCancel, setShowModalCancel] = useState(false);
  // const [clinic, setClinic] = useState();

  return (
    <Modal {...rest} visible={visible} navigation transparent={true} animationType="fade">
      <PatientModal>
        <ModalContent>
          {/* <ImageModalRecord

            // source={require("../../assets/CardRecordPatient(doctorImage).png")}
          /> */}

          <TitleModalRecord>Clinic</TitleModalRecord>

          <BoxAgeEmailModal>
            <DescriptionModalRecord>Endereço</DescriptionModalRecord>
            <DescriptionModalRecord>Numéro</DescriptionModalRecord>
          </BoxAgeEmailModal>


          <CardCancelLessLocal
            onPressCancel={() => {
              setShowModal;
              navigation.replace("SelectClinic");
              console.log('Fechou!')
          }}
            text={"Voltar"}
          />

        </ModalContent>
      </PatientModal>
    </Modal>
  );
};
