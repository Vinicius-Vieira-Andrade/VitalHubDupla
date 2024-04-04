// ERRO NA FUNÇÃO DE FECHAR O MODAL
// MODAL FUNCIONANDO CORRETAMENTE
// SÓ FALTA CONFIGURAR O MODAL


import { Modal } from "react-native";
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
import { BoxAgeEmailModal } from "./StyleClinicAppointmentModal";
import { CancellationModal } from "../CancellationModal/CancellationModal";
import { useState } from "react";

export const ClinicAppointmentModal = ({
  navigation,
  visible,
  setShowModal = null,
  ...rest
}) => {
  const [showModalCancel, setShowModalCancel] = useState(false);

  return (
    <Modal {...rest} visible={visible} navigation transparent={true} animationType="fade">
      <PatientModal>
        <ModalContent>
          <ImageModalRecord
            source={require("../../assets/CardRecordPatient(doctorImage).png")}
          />

          <TitleModalRecord>Clinic</TitleModalRecord>

          <BoxAgeEmailModal>
            <DescriptionModalRecord>Endereço</DescriptionModalRecord>
            <DescriptionModalRecord>Numéro</DescriptionModalRecord>
          </BoxAgeEmailModal>

          {/* <ButtonLargeConfirmModal
            onPress={() => {
              navigation.navigate("ConsultLocalization");
              setShowModal(false);
            }}
            text={"Ver Local da Consulta"}
          /> */}

          <CardCancelLess
            // onPress={() => navigation.navigate("SelectClinic")}
            onPressCancel={() =>{
              // navigation.navigate("SelectClinic");
              CancellationModal()
            }} 
            text={"Cancelar"}
          />

      <CancellationModal
        navigation={navigation}
        visible={showModalCancel}
        setShowModalCancel={setShowModalCancel}
      />
        </ModalContent>
      </PatientModal>
    </Modal>
  );
};
