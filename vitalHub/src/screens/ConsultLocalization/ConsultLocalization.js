import { useState, useEffect, ActivityIndicator } from "react";
import {
  Container,
  ContainerCepCidade,
} from "../../components/Container/StyleContainer";
import { CardCancelLessLocal } from "../../components/Descriptions/Descriptions";
import { AgeTextCard } from "../../components/Descriptions/StyledDescriptions";
import { InputBox } from "../../components/InputBox/InputBox";
import Maps from "../../components/Maps/Maps";
import { TitleLocalization } from "../../components/Title/StyleTitle";
import api from "../../services/Services";

export const ConsultLocalization = ({ navigation, route }) => {
  const [clinicaSelecionada, setClinicaSelecionada] = useState(null);

  async function BuscarClinicaId() {
    await api
      .get(`/Clinica/BuscarPorId?id=${route.params.clinicaId}`)
      .then((response) => {
        setClinicaSelecionada(response.data);
        console.log("data", response.data);
        // console.log(clinicaSelecionada.endereco.cidade);
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
            <Maps latitude={clinicaSelecionada.endereco.latitude} longitude={clinicaSelecionada.endereco.longitude}/>

            <TitleLocalization>{clinicaSelecionada.nomeFantasia}</TitleLocalization>

            <AgeTextCard>{clinicaSelecionada.endereco.cidade}</AgeTextCard>

            <InputBox
              placeholderTextColor={"#33303E"}
              textLabel={"Endereço"}
              placeholder={"Ex. Rua Vicenso Silva, 58"}
              editable={true}
              fieldWidth={90}
              fieldValue={clinicaSelecionada.endereco.logradouro}
            />

            <ContainerCepCidade>
              <InputBox
                placeholderTextColor={"#33303E"}
                textLabel={"Número"}
                placeholder={"Ex. 570"}
                keyboardType="numeric"
                editable={true}
                fieldWidth={40}
                fieldValue={`${clinicaSelecionada.endereco.numero}`}
              />
              <InputBox
                placeholderTextColor={"#33303E"}
                textLabel={"Bairro"}
                placeholder={"Ex. Vila Ema"}
                editable={true}
                fieldWidth={40}
                fieldValue={clinicaSelecionada.endereco.cidade}
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
