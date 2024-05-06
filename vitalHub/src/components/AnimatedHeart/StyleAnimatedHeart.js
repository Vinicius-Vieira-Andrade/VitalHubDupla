import LottieView from "lottie-react-native";
import styled from "styled-components";
import clinicLottie from "../../assets/lottieCross.json";


export const LottieHeart = styled(LottieView).attrs({
  source: clinicLottie,
  autoPlay: true,
  loop: true,
  
})`
  width: 250px;
  height: 300px;
`;

export const ContainerLottieStyle = styled.View`
  width: 250px;
  height: 300px;
`;
