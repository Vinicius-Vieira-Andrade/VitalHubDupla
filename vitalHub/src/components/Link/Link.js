import { CancelButton } from "../Descriptions/StyledDescriptions"
import { TextLink, TextLinkAccount, ViewLink } from "./StyleLink"

export const LinkAccount = ({
    onPress
}) => {
    return (
        <ViewLink>
            <TextLink>Não tem uma conta? <TextLinkAccount onPress={onPress}>Crie uma conta agora!</TextLinkAccount></TextLink>
        </ViewLink>
    )
}

export const Cancel = ({
    onPress
}) => {
    return (
        <CancelButton onPress={onPress}>Cancelar</CancelButton>
    )
}

