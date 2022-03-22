import React, { useEffect } from 'react';
import { HistoryCard } from '../../components/HistoryCard';
import AsyncStorage from '@react-native-async-storage/async-storage';

import {
Container,
Header,
Title
} from './styles';

export function Resume(){
  //Função que puxa os dados assíncronos.
  async function loadData() {
    const dataKey = '@gofinances:transactions';
    const response = await AsyncStorage.getItem(dataKey);
    const responseFormatted = response ? JSON.parse(response) : [];

    console.log(responseFormatted);
  }

  //Mostrar a função
  useEffect(() => {
    loadData();
  }, []);

  return (
    <Container>
        <Header>
            <Title>Resumo por categoria</Title>
        </Header>

        <HistoryCard 
            title='Compras'
            amount='R$ 150,00'
            color='red'
        />
    </Container>
  );
}