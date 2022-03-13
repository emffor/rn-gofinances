import React from 'react';
import { TouchableOpacityProps } from 'react-native';

import {
    Container,
    Icon,
    Title

} from './styles';

interface Props extends TouchableOpacityProps {
    title: string;
    type: 'up' | 'down';
}

const icons = {
    up: 'arrow-up-circle',
    down: 'arrow-down-circle'
}

export function TransactionTypeButton({title, type, ...rest} : Props){
  return (
    <Container {...rest}>
        {/* dentro de um array */}
        <Icon 
            name={icons[type]}
            type={type}
        /> 
        <Title>{title}</Title>
    </Container>
  );
}