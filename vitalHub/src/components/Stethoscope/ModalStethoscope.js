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


  // FUNCÃO RESPONSAVEL POR GUARDAR O DADO CIDADE PARA FILTRAR NA HORA DA LISTAGEM ( async storage )
  const storeCity = async (cidade) => {
    try {
      await AsyncStorage.setItem('selectedCity', cidade);
      
    } catch (error) {
      console.error(error);
    }
  };

  // FUNÇÃO PARA LIDAR COM CHAMADA DE NOTIFICAÇÃO
  const handleCallNotifications = async () => {
    // OBTEM STATUS DA PERMISSÃO
    const {status} = await Notifications.getPermissionsAsync();
    // VERIFICA SE O USUÁRIO CONCEDEU PERMISSÃO
    if (status !== "granted") {
      alert("Você não deixou as notificações ativas.")
      return;
    }

    // AGENDA UMA NOTIFICAÇÃO 
    await Notifications.scheduleNotificationAsync({
      content : {
        title : "Notificação recebida.",
        body : "Selecione a clínica mais próxima de você!",
        color: '#49B3BA'
      },
      trigger : null,
    })
  }
 

  return (
    <Modal {...rest} visible={visible} transparent={true} animationType="fade">
      <StethoscopeModal>
        <ModalStetContent>
          <TitleModal>Agendar Consulta</TitleModal>

          <ContainerLabel>
            <Label textLabel={"Qual o nível da consulta"} />
            <ButtonHomeContainerStet>
              <FilterButtonStet
                onPress={() => {
                  setSelected({ rotina: true });
                }}
                selected={selected.rotina}
                text={"Rotina"}
              />

              <FilterButtonStet
                onPress={() => {
                  setSelected({ exame: true });
                }}
                selected={selected.exame}
                text={"Exame"}
              />

              <FilterButtonStet
                onPress={() => {
                  setSelected({ urgencia: true });
                }}
                selected={selected.urgencia}
                text={"Urgencia"}
              />
            </ButtonHomeContainerStet>
          </ContainerLabel>

          <LargeInputTextBoxStet
            // fieldValue={clinics}
            // onChangeText={(txt) => setClinics(txt)}
            onChangeText={storeCity}
            placeholderTextColor={"#34898F"}
            textLabel={"Informe a localização desejada"}
            placeholder={"Informe a localização"}
            editable={true}
          />

          <FlexButtons>
          <ButtonLargeSelect
            onPress={() => {
              navigation.navigate("SelectClinic");
              setShowModalStethoscope(false);
              handleCallNotifications();
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
