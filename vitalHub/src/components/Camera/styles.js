import styled from "styled-components";


export const LastPhoto = styled.Image`
width: 50px;
height: 50px;
border-radius: 5px;

justify-Content: center;
align-Items: center;
`

export const LastTouchable = styled.TouchableOpacity`
width: 53px;
height: 53px;
border-radius: 5px;
border: 2px solid #49B3BA;

justify-Content: center;
align-Items: center;
margin: 15px;
`

export const EndCamera = styled.Text`
margin: 20px;
font-size: 16px;
font-family: 'MontserratAlternates_600SemiBold';
color: #C81D25;
`
export const Flip = styled.Text`
    /* marginBottom: 20, */
align-Self: center;
margin: 10px;
font-size: 14px;
font-family: 'Quicksand_500Medium';
color:  white;
`
export const CaptureButtom = styled.TouchableOpacity.attrs({
    shadowColor: "#000",
    shadowOffset: {
	width: 0,
	height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,

    elevation: 3,
})`
border: 2px solid #496BBA;
padding: 20px;
margin: 20px;
border-Radius: 15px;
background-Color: #49B3BA;

justify-Content: 'center';
align-Items: 'center';

`