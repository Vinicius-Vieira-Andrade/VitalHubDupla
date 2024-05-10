import { ActivityIndicator, Modal } from "react-native";
import { ButtonLargeSelect } from "../Button/Button";
import {
  ModalContent,
  PatientModal,
} from "../CancellationModal/StyleCancelationModal";
import { CardCancelLess } from "../Descriptions/Descriptions";
import { DescriptionModalRecord } from "../Descriptions/StyledDescriptions";
import { ImageModalRecord } from "../Images/StyleImages";
import { TitleModal, TitleModalRecord } from "../Title/StyleTitle";
import { BoxAgeEmailModal } from "./StyleAppointmentModal";
import { useEffect, useState } from "react";
import moment from "moment";
import { LargeInputGray } from "../InputBox/InputBox";

export const AppointmentModal = ({
  navigation,
  consultaSelecionada,
  visible,
  setShowModalAppointment = null,
  ...rest
}) => {
  const [consultaAtt, setConsultaAtt] = useState();

  return (
    <Modal {...rest} visible={visible} transparent={true} animationType="fade">
      {consultaSelecionada != null && (
        <PatientModal>
          <ModalContent>
            <ImageModalRecord
              source={require("../../assets/ImageModalRecord.png")}
            />

            <TitleModalRecord>
              {consultaSelecionada.paciente.idNavigation.nome}
            </TitleModalRecord>

            <BoxAgeEmailModal>
              <DescriptionModalRecord>{`${
                moment().year() -
                moment(consultaSelecionada.paciente.dataNascimento).format(
                  "YYYY"
                )
              } anos`}</DescriptionModalRecord>
              <DescriptionModalRecord>
                {consultaSelecionada.paciente.idNavigation.email}
              </DescriptionModalRecord>
            </BoxAgeEmailModal>

            <ButtonLargeSelect
              onPress={() => {
                navigation.navigate("MedicalRecords", {
                  consultaSelecionada: consultaSelecionada,
                });
              }}
              text={"Inserir Prontuário"}
            />

            <CardCancelLess
              onPressCancel={() => setShowModalAppointment(false)}
              text={"Cancelar"}
            />
          </ModalContent>
        </PatientModal>
      )}
    </Modal>
  );
};
