import { mask } from "remask"

export const cpfPattern = (value) => {
    return mask(value, '999.999.999-99')
}

export const cepPattern = (value) => {
    return mask(value, '99999-999')
}

export const rgPattern = (value) => {
    return mask(value, '99.999.999-9')
}

