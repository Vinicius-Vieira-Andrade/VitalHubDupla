import { Modal } from "react-native";
import { TitleModal } from "../Title/StyleTitle";
import {
  ButtonLargeSelect,
  FilterButton,
  FilterButtonStet,
} from "../Button/Button";
import { LargeInputTextBox, LargeInputTextBoxStet } from "../InputBox/InputBox";
import {
  ButtonHomeContainer,
  ButtonHomeContainerStet,
} from "../Container/StyleContainer";
import {
  ContainerLabel,
  FlexButtons,
  ModalStetContent,
  StethoscopeModal,
} from "./StyleSthetoscope";
import { useState } from "react";
import { Label } from "../Label/Label";
import { CardCancelLess } from "../Descriptions/Descriptions";

import AsyncStorage from "@react-native-async-storage/async-storage"

// EXPO NOTIFICATIONS
import * as Notifications from 'expo-notifications' 

// SOLICITA PERMISSÕES DE NOTIFICAÇÃO AO INICIAR O APP
  Notifications.requestPermissionsAsync(); 

// DEFINE COMO AS NOTIFICAÇÕES DEVEM SER TRATADAS QUANDO RECEBIDAS
  Notifications.setNotificationHandler({
  handleNotification: async () => ({
    // MOSTRAR O ALERTA QUANDO A NOTIFICAÇÃO FOR RECEBIDA
    shouldShowAlert : true,
    // REPRODUS SOM AO RECEBER NOTIFICAÇÃO
    shouldPlaySound : false,
    // NÚMERO DE NOTIFICAÇÕES NO ÍCONE DO APP
    shouldSetBadge : false,
  })
})


export const ModalStethoscope = ({
  navigation,
  visible,
  setShowModalStethoscope,
  ...rest
}) => {
  
  const [selected, setSelected] = useState({
    rotina: false,
    exame: false,
    urgencia: false,
  });

  const [agendamento, setAgendamento] = useState(null);

  async function handleContinue() {
    setShowModalStethoscope(false);
    navigation.replace("SelectClinic", { agendamento: agendamento }); // passando os dados de agendamento para a proxima tela
  }

  return (
    <Modal {...rest} visible={visible} transparent={true} animationType="fade">
      <StethoscopeModal>
        <ModalStetContent>
          <TitleModal>Agendar Consulta</TitleModal>

          <ContainerLabel>
            <Label textLabel={"Qual o nível da consulta?"} />
            <ButtonHomeContainerStet>
              <FilterButtonStet
                // 24EB7167-0157-4FC4-879B-D44E107657CF
                onPress={() => {
                  setSelected({ rotina: true });
                  setAgendamento({
                    //criando objeto
                    ...agendamento, //Manter as informacoes que ja existem no state

                    // prioridadeId: "45E8A79C-9601-4793-A1F2-29B36BF4DE99",
                    prioridadeId: "24EB7167-0157-4FC4-879B-D44E107657CF",
                    prioridadeLabel: "Rotina",
                  });
                }}
                selected={selected.rotina}
                text={"Rotina"}
              />

              <FilterButtonStet
                // 93D3C848-0005-411A-96F2-782C3CC5FAC1
                onPress={() => {
                  setSelected({ exame: true });
                  setAgendamento({
                    //criando objeto
                    ...agendamento, //Manter as informacoes que ja existem no state

                    // prioridadeId: "0C64E546-FD08-4511-AC06-212CD5B83243",
                    prioridadeId: "93D3C848-0005-411A-96F2-782C3CC5FAC1",
                    prioridadeLabel: "Exame",
                  });
                }}
                selected={selected.exame}
                text={"Exame"}
              />

              <FilterButtonStet
                // 1D4077CB-ED4D-443F-93DF-1FAC788CFFCC
                onPress={() => {
                  setSelected({ urgencia: true });
                  setAgendamento({
                    //criando objeto
                    ...agendamento, //Manter as informacoes que ja existem no state

                    // prioridadeId: "EB6FDF22-EA0B-4182-B73C-B5160E7767B9",
                    prioridadeId: "1D4077CB-ED4D-443F-93DF-1FAC788CFFCC",
                    prioridadeLabel: "Urgência",
                  });
                }}
                selected={selected.urgencia}
                text={"Urgencia"}
              />
            </ButtonHomeContainerStet>
          </ContainerLabel>

          <LargeInputTextBoxStet
            placeholderTextColor={"#34898F"}
            textLabel={"Informe a localização desejada"}
            placeholder={"Informe a localização"}
            fieldValue={agendamento != null ? agendamento.localizacao : null}
            onChangeText={(txt) =>
              setAgendamento({
                ...agendamento,
                localizacao: txt,
              })
            }
            editable={true}
          />

          <FlexButtons>
            <ButtonLargeSelect
              onPress={() => {
                // navigation.navigate("SelectClinic");
                // setShowModalStethoscope(false);
                handleContinue();
              }}
              text={"Continuar"}
            />


            <CardCancelLess
              onPressCancel={() => setShowModalStethoscope(false)}
              text={"Cancelar"}
            />
          </FlexButtons>
        </ModalStetContent>
      </StethoscopeModal>
    </Modal>
  );
};
