import { StatusBar, Text } from "react-native";
import { ButtonLargeSelect } from "../../components/Button/Button";
import { LargeButtonSelect } from "../../components/Button/StyleButton";
import { CardSelectClinic } from "../../components/Cards/Cards";
import {
  Container,
  FlatContainerSelect,
  ScrollContainer,
} from "../../components/Container/StyleContainer";
import { TitleSelect } from "../../components/Title/StyleTitle";
import { CancelLessMargin } from "../../components/Descriptions/StyledDescriptions";
import { CardCancelLess } from "../../components/Descriptions/Descriptions";
import { useEffect, useState } from "react";
import api from "../../services/Services";

import Location from "../../components/Stethoscope/ModalStethoscope";
import { err } from "react-native-svg";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { ClinicAppointmentModal } from './ClinicAppointmentModal/ClinicAppointmentModal'

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

export const SelectCLinic = ({ navigation, onCardClick }) => {

  const [showModalCancel, setShowModalCancel] = useState(false);

  // CONTADOR DE CLIQUE
  const [clickCount, setClickCount] = useState(0);

  // ADICIONA 1 AO CONTADOR
  const handleClick = () => {
     setClickCount(prevCount => prevCount + 1);
  };
  
  // FUNÇÃO DO CONTADOR
// FUNÇÃO DO CONTADOR
const executeAfterTwoClicks = () => {
  if (clickCount === 1) {
     // Aqui você coloca a lógica que deseja executar após dois cliques
     console.log('Executando após dois cliques');
     // Mostra o modal após dois cliques
     setShowModalCancel(true);
     // Resetar o contador para o próximo ciclo de cliques
     setClickCount(0);
  } else {
     console.log("Falha em executar a função, clique novamente.")
  }
 };
 

  // CONSTANTE RESPONSAVEL POR ARMAZENAR O DADO CIDADE
  const [cidade, setCidade] = useState('');

  // FUNÇÃO RESPONSAVEL POR LISTAR AS CLINICAS DISPONIVEIS EM CADA CIDADE.
    async function getAllClinics(cidade) {
      // LISTA AS CLINICAS DE ACORDO COM O PARÂMETRO NOME DA CIDADE.
      if (cidade !== null) {
          try {
            const response = await api.get(`Clinica/BuscarPorCidade?cidade=${cidade}`);
            setCidade(response.data);
            console.log("Listar por Cidade")
            await AsyncStorage.removeItem('selectedCity')
          } catch (error) {
            console.log('Falha em Listar Clinica por Cidade.');
          }
      // LISTA TODAS AS CLINICAS DE TODAS AS CIDADES.
      } else if (cidade === null) {
          await api.get("Clinica/ListarTodas")
            .then(response => {
            setCidade(response.data);
            console.log("Listar Todas.", )
          })
            .catch((error) => {
            console.log('Falha em Listar Todas');
          });
      } else {
        <Text>AAAAAA</Text>
        console.log('Nenhuma cidade encontrada')
      }
    }
 
  useEffect(() => {
     const getCityAndClinics = async () => {
       try {
         const cidade = await AsyncStorage.getItem('selectedCity');
         getAllClinics(cidade);
       } catch (error) {
         console.error(error);
       }
     };
 
     getCityAndClinics();
  }, []);

  // ARMAZENA O ID DA CLINICA SELECIONADA PELO USUARIO
  const [selectedCardId, setSelectedCardId] = useState(); 

    // FUNCÃO QUE NOTIFICA O USUÁRIO APÓS SELECIONAR CLINICA
    const handleSelectedCard = async (id) => {
      // ALTERA O STATE QUE ARMAZENA O ID DA CLINICA
      setSelectedCardId(id);
      // console.log(clinic)
     
      // ENVIA NOTIFICAÇÕES AO CLICAR DUAS VEZES
      if (clickCount === 1) {
        await Notifications.scheduleNotificationAsync({
           content: {
             title: "Clinica selecionada com sucesso!",
             body: "Agradecemos imensamente por escolher nossa clínica para o seu cuidado. Estamos aqui para oferecer os melhores serviços e atendimento excepcional para sanar às suas necessidades de saúde. Obrigado pela confiança depositada em nós.",
             color: '#49B3BA',
             vibrate: true,
           },
           trigger: null,

          });
          console.log("Notificação enviada com sucesso!")
      } else {
        console.log("Falha em enviar notificação.")
      }
     };
     


  return (
    <Container>
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle="dark-content"
      />

      <TitleSelect>Selecionar clínica</TitleSelect>

      <FlatContainerSelect
        data={cidade}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <CardSelectClinic
            clinic={item}
            selectedCardId={selectedCardId}
            onCardPress={() => {handleSelectedCard(); executeAfterTwoClicks(); handleClick();}}
          />
        )}
        showsVerticalScrollIndicator={false}
      />

      <ButtonLargeSelect
        onPress={() => {
          navigation.navigate("SelectDoctor");
        }}
        text={"Continuar"}
      />

      <CardCancelLess
        onPressCancel={() => navigation.replace("Main")}
        text={"Cancelar"}
      />

      <ClinicAppointmentModal
        navigation={navigation}
        visible={showModalCancel}
        setShowModalCancel={setShowModalCancel}
      />

    </Container>
  );
};
