import { ActivityIndicator, StyleSheet, View } from "react-native";
import { InputHigh, InputHighGrey, InputNumeric, InputProfile, InputText, InputTextLarge } from "./StyleInput";
import RNPickerSelect from 'react-native-picker-select';
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faCaretDown } from "@fortawesome/free-solid-svg-icons";
import moment from "moment";
import { useEffect, useState } from "react";


// import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
// import { faCaretDown } from '@fortawesome/free-solid-svg-icons'

export function Input({
    placeholder,
    fieldValue,
    onChangeText,
    keyboardType,
    maxLength,
    placeholderTextColor,
    editable = true,
    secureTextEntry = false,
    // Input inválido
    isInsertedInputValid = true
}) {
    return (
        <InputText
            editable={editable}
            placeholder={placeholder}
            keyboardType={keyboardType}
            placeholderTextColor={placeholderTextColor}
            maxLength={maxLength}
            value={fieldValue}
            onChangeText={onChangeText}
            secureTextEntry={secureTextEntry}
            isInsertedInputValid={isInsertedInputValid}
        />
    )
}



export const InputSelect = ({ setHoraSelecionada }) => {
    const dataAtual = moment().format('YYYY-MM-DD')
    const [arrayOptions, setArrayOptions] = useState(null)

    async function loadOptions() {
        // Capturar a quantidade que faltam para as 24h
        const horasRestantes = moment(dataAtual).add(24, 'hours').diff(moment(), "hours")

        // Criar um laço que rode a quantidade de horas
        const options = Array.from({ length: horasRestantes }, (_, index) => {
            let valor = new Date().getHours() + (index + 1)


            // Pra cada hora será uma nova option
            return {
                label: `${valor}:00`, value: valor
            }
        })


        setArrayOptions(options);

    }

    useEffect(() => {
        loadOptions();
    }, [])


    const pickerStyles = {
        inputIOS: style.pickerInput,
        inputAndroid: style.pickerInput,
        placeholder: { color: '#34898F', },
    };
    const placeholder = {
        label: 'Selecionar horário',
        value: null,
        color: '#34898F',
    };

    return (
        <View style={{ width: 356 }}>


            {arrayOptions ?
                (<RNPickerSelect
                    useNativeAndroidPickerStyle={false}
                    style={style}
                    Icon={() => {
                        return <FontAwesomeIcon icon={faCaretDown} color='#34898F' size={22} />
                    }}
                    placeholder={{
                        label: 'Selecione um horario',
                        value: null,
                        color: '#34898F'
                    }}
                    onValueChange={(value) => setHoraSelecionada(value)}
                    items={
                        arrayOptions
                    }
                />) : <ActivityIndicator />}

        </View>
    )
}

const style = StyleSheet.create({
    inputIOS: {
        fontSize: 16,
        padding: 16,
        borderWidth: 2,
        borderColor: '#60BFC5',
        borderRadius: 5,
        color: '#34898F',
        alignContent: 'center',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: 'MontserratAlternates_600SemiBold'
    },
    inputAndroid: {
        fontSize: 16,
        padding: 16,
        borderWidth: 2,
        borderColor: '#60BFC5',
        borderRadius: 5,
        color: '#34898F',
        alignItems: 'center',
        justifyContent: 'center',

        fontFamily: 'MontserratAlternates_600SemiBold'
    },
    iconContainer: {
        top: '31%',
        marginRight: 10
    },
    placeholder: {
        color: '#34898F',
    }
})


export function NumericInput({
    placeholder,
    fieldValue,
    onChangeText,
    keyboardType = 'numeric',
    maxLength,
    placeholderTextColor,
    editable = true
}) {
    return (
        <InputNumeric
            editable={editable}
            placeholder={placeholder}
            keyboardType={keyboardType}
            placeholderTextColor={placeholderTextColor}
            maxLength={maxLength}
            value={fieldValue}
            onChangeText={onChangeText}
        />
    )
}

export function ProfileInput({
    placeholder,
    fieldValue,
    onChangeText,
    keyboardType,
    maxLength,
    placeholderTextColor,
    editable = true
}) {
    return (
        <InputProfile
            editable={editable}
            placeholder={placeholder}
            keyboardType={keyboardType}
            placeholderTextColor={placeholderTextColor}
            maxLength={maxLength}
            value={fieldValue}
            onChangeText={onChangeText}
        />
    )
}

export function HighInput({
    placeholder,
    fieldValue,
    onChangeText,
    keyboardType,
    maxLength,
    placeholderTextColor,
    editable = true,
    secureTextEntry = false
}) {
    return (
        <InputHigh
            editable={editable}
            placeholder={placeholder}
            keyboardType={keyboardType}
            placeholderTextColor={placeholderTextColor}
            maxLength={maxLength}
            value={fieldValue}
            onChangeText={onChangeText}
            secureTextEntry={secureTextEntry}
        />
    )
}

export function HighInputGrey({
    placeholder,
    fieldValue,
    onChangeText,
    keyboardType,
    maxLength,
    placeholderTextColor,
    editable = true,
    secureTextEntry = false
}) {
    return (
        <InputHighGrey
            editable={editable}
            placeholder={placeholder}
            keyboardType={keyboardType}
            placeholderTextColor={placeholderTextColor}
            maxLength={maxLength}
            value={fieldValue}
            onChangeText={onChangeText}
            secureTextEntry={secureTextEntry}
        />
    )
}

export function LargeInput({
    placeholder,
    fieldValue,
    onChangeText,
    keyboardType,
    maxLength,
    placeholderTextColor,
    editable = true,
    secureTextEntry = false,
    isInsertedInputValid = true
}) {
    return (
        <InputTextLarge
            editable={editable}
            placeholder={placeholder}
            keyboardType={keyboardType}
            placeholderTextColor={placeholderTextColor}
            maxLength={maxLength}
            value={fieldValue}
            onChangeText={onChangeText}
            secureTextEntry={secureTextEntry}
            isInsertedInputValid={isInsertedInputValid}
        />
    )
}