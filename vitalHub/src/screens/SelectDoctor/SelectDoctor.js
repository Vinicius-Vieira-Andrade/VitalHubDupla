import { StatusBar } from "react-native";
import {
  Container,
  FlatContainerSelect,
  ScrollContainer,
} from "../../components/Container/StyleContainer";
import { TitleSelect } from "../../components/Title/StyleTitle";
import { CardSelectDoctor } from "../../components/Cards/Cards";
import { ButtonLarge, ButtonLargeSelect } from "../../components/Button/Button";
import { CancelLessMargin } from "../../components/Descriptions/StyledDescriptions";
import { CardCancelLessLocal } from "../../components/Descriptions/Descriptions";
import { useEffect, useState } from "react";
import api from "../../services/Services";

export const SelectDoctor = ({ navigation, route }) => {
  // Criar o state para receber a lista de médicos (Array)
  const [doctorList, setDoctorList] = useState([]); // Lista de medicos

  const [medico, setMedico] = useState();

  // Criar a função para obter a lista de médicos da api e setar no state
  async function getAllDoctors() {
    // Instanciação da nossa conexão da api
    await api
      .get(
        `/Medicos/BuscarPorIdClinica?id=${route.params.agendamento.clinicaId}`
      )
      // Quando houver uma resposta...
      .then((response) => {
        setDoctorList(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  // Criar um effect para chamada da função
  useEffect(() => {
    getAllDoctors();
    console.log("Selecionar Médico - OBJETO TRAZIDO:");
    console.log(route.params);
  }, []);

//   useEffect(() => {
//     console.log(route);
//   }, [route]);

  // Armazena o id recebido da funcao "handleSelect"
  const [selectedCardId, setSelectedCardId] = useState();

  // Funcao q guarda o id do medico selecionado no state
  const handleSelectedCard = (id) => {
    setSelectedCardId(id); //setando o id recebido no state
  };

  async function handleContinue() {
    navigation.replace("SelectDate", {
      agendamento: {
        ...route.params.agendamento,
        ...medico,
      },
    });
  }

  return (
    <Container>
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle="dark-content"
      />

      <TitleSelect>Selecionar Médico</TitleSelect>

      <FlatContainerSelect
        data={doctorList} // Lista de dados
        keyExtractor={(item) => item.id} // Ids de cada index
        renderItem={({ item }) => (
          // Componente renderizado
          <CardSelectDoctor
            doctor={item}
            selectedCardId={selectedCardId}
            onCardPress={handleSelectedCard} // ao clicar do card aciona a funcao que guardara o id do mesmo
            setMedico={setMedico}
          />
        )}
        showsVerticalScrollIndicator={false}
      />

      <ButtonLargeSelect
        onPress={() => {
          handleContinue();
          // navigation.navigate("SelectDate")
        }}
        text={"Continuar"}
      />

      <CardCancelLessLocal
        onPressCancel={() => navigation.replace("Main")}
        text={"Cancelar"}
      />
    </Container>
  );
};
