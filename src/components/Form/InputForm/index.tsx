import React from 'react';

import { Control, Controller } from "react-hook-form";
import { TextInputProps } from 'react-native';
import { Input } from '../Input';

import {
Container
} from './styles';

interface Props extends TextInputProps {
    control: Control;
    name: string;
}

export function InputForm({
    control, name, ...rest
}: Props){
  return (
    <Container>
        {/* controla o input para mandar so na hora de enviar */}
        <Controller 
            control={control} //o formulário q controla esse input
            render={({ field: { onChange,  value}}) => (
                <Input 
                    onChangeText={onChange}
                    value={value}
                    {...rest}
                />
            )} //qual input que eu vou renderizar q vai ser controlado.
               //sera renderizado como input controlado.
            name={name}
        />
           
        
        
    </Container>
  );
}