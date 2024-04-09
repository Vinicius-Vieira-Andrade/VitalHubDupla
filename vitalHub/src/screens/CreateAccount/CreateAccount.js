import { StatusBar } from 'react-native'
import { ButtonNormal } from '../../components/Button/Button'
import { NormalButton } from '../../components/Button/StyleButton'
import { ButtonText } from '../../components/ButtonText/StyleButtonText'
import { Container } from '../../components/Container/StyleContainer'
import { DescriptionPassword } from '../../components/Descriptions/Descriptions'
import { Input } from '../../components/Input/Input'
import { Cancel } from '../../components/Link/Link'
import { Title } from '../../components/Title/StyleTitle'
import { LogoCreateAccount } from '../../components/Images/StyleImages'
import { useState } from 'react'
import api from '../../services/Services'


export const CreateAccount = ({ navigation }) => {

    const [email, setEmail] = useState("");
    const [senha, setSenha] = useState("");
    const [nome, setNome] = useState("");

    const [tipoUser, setTipoUser] = useState("AAEB024B-C861-41B3-8603-878F3C70A241")


    async function Cadastrar() {
        await api.post(`/Pacientes`,{
            email: email,
            senha: senha,
            nome: nome,
            idTipoUsuario: tipoUser,
        }).then(response => {
            console.log(response.data);
            alert('cadastrado com sucesso!')
            navigation.replace("Login")
        })
    }

    return (

        <Container>

            <StatusBar translucent backgroundColor="transparent" barStyle="dark-content" />

            <LogoCreateAccount source={require('../../assets/VitalHub_Logo1.png')} />

            <Title>Criar Conta</Title>

            <DescriptionPassword description={"Insira seu endereço de e-mail e senha para realizar seu cadastro."} />

            <Input
                placeholder={"Nome"}
                placeholderTextColor={'#49B3BA'}
                onChangeText={(txt) =>  setNome(txt)}
                fieldValue={nome}
            />

            <Input
                placeholder={"Usuário ou E-mail"}
                placeholderTextColor={'#49B3BA'}
                onChangeText={(txt) =>  setEmail(txt)}
                fieldValue={email}
            />
            <Input
                placeholder={"Senha"}
                placeholderTextColor={'#49B3BA'}
                secureTextEntry={true}
                fieldValue={senha}
                onChangeText={(txt) =>  setSenha(txt)}

            />
            <Input
                placeholder={"Confirmar senha"}
                placeholderTextColor={'#49B3BA'}
                secureTextEntry={true}
                fieldValue={senha}
            />

            <ButtonNormal onPress={() => Cadastrar()} text={"Cadastrar"} />

            <Cancel onPress={() => { navigation.navigate("Login") }} />

        </Container>
    )

}