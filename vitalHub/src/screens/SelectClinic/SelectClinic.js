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

export const SelectCLinic = ({ navigation, route }) => {

  const [clinics, setClinics] = useState([]); // Lista de clínicas

  const [clinica, setClinica] = useState();


  async function getAllClinics() {
    await api.get(`/Clinica/BuscarPorCidade?cidade=${route.params.agendamento.localizacao}`)
      .then(response => {
        setClinics(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }


  useEffect(() => {
    console.log("recebaa");
    console.log(route);
  }, [route]) // vendo se recebemos os dados do route, do modal que guardamos os dados de agendamento



  useEffect(() => {
    getAllClinics();
  }, []);

  const [selectedCardId, setSelectedCardId] = useState(); //state q armazena o id da clinica selecionada pelo usuario

  // funcao q guarda o id da clínica selecionada no state
  const handleSelectedCard = (id) => {
    setSelectedCardId(id); //altera state q irá armazenar o id da clinica

    // console.log(clinics);
  };

  async function handleContinue() {
    navigation.replace("SelectDoctor", {
      ...route.params.agendamento,
      ...clinica
    })
  }


  return (
    <Container>
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle="dark-content"
      />

      <TitleSelect>Selecionar clínica</TitleSelect>

      <FlatContainerSelect
        data={clinics}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <CardSelectClinic
            clinic={item}
            selectedCardId={selectedCardId}
            onCardPress={handleSelectedCard}
            setClinica={setClinica}
          />
        )}
        showsVerticalScrollIndicator={false}
      />

      <ButtonLargeSelect
        onPress={() => {
          handleContinue();
          // navigation.navigate("SelectDoctor");
        }}
        text={"Continuar"}
      />

      <CardCancelLess
        onPressCancel={() => navigation.replace("Main")}
        text={"Cancelar"}
      />

    </Container>
  );
};
