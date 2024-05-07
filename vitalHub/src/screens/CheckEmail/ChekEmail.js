import { StatusBar } from "react-native"
import { ButtonNormal } from "../../components/Button/Button"
import { BoxNumeric, Container } from "../../components/Container/StyleContainer"
import { CodeResend, EmailDescription, } from "../../components/Descriptions/Descriptions"
import { NumericInput } from "../../components/Input/Input"
import { Close, Logo } from "../../components/Images/StyleImages"
import { Title } from "../../components/Title/StyleTitle"
import { useRef, useState } from "react"
import { DescripritionEmail, EmailText } from "../../components/Descriptions/StyledDescriptions"
import api from "../../services/Services"
import { RedefinePassword } from "../RedefinePassword/RedefinePassword"


export const CheckEmail = ({ navigation, route }) => {

    const [codigo, setCodigo] = useState("")

    const inputs = [useRef(null), useRef(null), useRef(null), useRef(null)]

    function focusNextInput(index) {
        if (index < inputs.length - 1 && inputs[index + 1].current) {
          inputs[index + 1].current.focus();
        }
      }
      
      function focusPrevInput(index) {
        if (index > 0 && inputs[index - 1].current) {
          inputs[index - 1].current.focus();
        }
      }
      

    async function ValidarCodigo() {
        await api.post(`/RecuperarSenha/CodePasswordValidate?email=${route.params.emailRecuperacao}&codigo=${codigo}`)
        .then(() => {
            navigation.replace("RedefinePassword", {emailRecuperacao : route.params.emailRecuperacao})
        }).catch(error => {
            console.log(error)
        } )
    }

    return (

        <Container>

            <StatusBar translucent backgroundColor="transparent" barStyle="dark-content" />

            {/* <Close source={require('../../assets/x-top-screen.png')} /> */}

            <Logo source={require('../../assets/VitalHub_Logo1.png')} />

            <Title>Verifique seu e-mail</Title>

            {/* <EmailDescription /> */}
            <DescripritionEmail>Digite o código de 4 dígitos enviado para <EmailText>{route.params.emailRecuperacao}</EmailText></DescripritionEmail>

            <BoxNumeric>
                {/* <NumericInput keyboardType="numeric" maxLength={1} placeholder={"0"} placeholderTextColor={"#34898F"} /> */}
                {
                    [0, 1, 2, 3].map((index) => (
                        <NumericInput 
                        key={index}
                        ref={ inputs[index] }
                        keyboardType="numeric" 
                        maxLength={1} 
                        placeholder={"0"} 
                        placeholderTextColor={"#34898F"} 
                        carretHidden={true}
                        onChangeText={(txt) => {
                            // Verifica se o campo é vazio
                            if (txt == "") {
                                focusPrevInput( index )
                            } else {
                                const codigoInformado = [...codigo]
                                codigoInformado[index] = txt
                                setCodigo( codigoInformado.join('') )
                                focusNextInput( index )
                            }
                        }}
                        />
                    ))
                }
            </BoxNumeric>

            <ButtonNormal text={"Confirmar"} onPress={() => ValidarCodigo()} />

            <CodeResend text={"Reenviar Código"} />

        </Container>

    )
}
