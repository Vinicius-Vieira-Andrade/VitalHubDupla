import { useEffect, useState } from "react";
import {
  Container,
  ContainerCepCidade,
} from "../../components/Container/StyleContainer";
import { CardCancelLessLocal } from "../../components/Descriptions/Descriptions";
import { AgeTextCard } from "../../components/Descriptions/StyledDescriptions";
import { MapImage } from "../../components/Images/StyleImages";
import { InputBox } from "../../components/InputBox/InputBox";
import Maps from "../../components/Maps/Maps";
import { Title, TitleLocalization } from "../../components/Title/StyleTitle";
import api from "../../services/Services";
import { ActivityIndicator } from "react-native";

export const ConsultLocalization = ({ navigation, route }) => {
  const [clinicaSelecionada, setClinicaSelecionada] = useState(null);

  async function BuscarClinicaId() {
    await api
      .get(`/Clinica/BuscarPorId?id=${route.params.clinicaId}`)
      .then((response) => {
        setClinicaSelecionada(response.data);
        console.log(response.data);
        console.log(clinicaSelecionada.endereco.cidade);
      })
      .catch((error) => {
        console.log(error);
      });
  }
  
  useEffect(() => {
    if (clinicaSelecionada == null) {
      BuscarClinicaId();
    }
  }, [clinicaSelecionada]);
  return (
    <Container>
      {
        clinicaSelecionada != null ? (
          <>          
            <Maps latitude={clinicaSelecionada.latitude} longitude={clinicaSelecionada.longitude}/>

            <TitleLocalization>Clínica Natureh</TitleLocalization>

            <AgeTextCard>São Paulo, SP</AgeTextCard>

            <InputBox
              placeholderTextColor={"#33303E"}
              textLabel={"Endreço"}
              placeholder={"Ex. Rua Vicenso Silva, 58"}
              // keyboardType="numeric"
              editable={true}
              fieldWidth={90}
            />

            <ContainerCepCidade>
              <InputBox
                placeholderTextColor={"#33303E"}
                textLabel={"Número"}
                placeholder={"Ex. 570"}
                keyboardType="numeric"
                editable={true}
                fieldWidth={40}
              />
              <InputBox
                placeholderTextColor={"#33303E"}
                textLabel={"Bairro"}
                placeholder={"Ex. Vila Ema"}
                editable={true}
                fieldWidth={40}
              />
            </ContainerCepCidade>

            <CardCancelLessLocal
              onPressCancel={() => {
                navigation.replace("Main");
              }}
              text={"Voltar"}
            />
          </>
        ) : (
          <ActivityIndicator />
        ) //loading
      }
    </Container>
  );
};
