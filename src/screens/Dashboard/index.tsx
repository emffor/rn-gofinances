import React, {useCallback, useEffect, useState} from 'react';
import { ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { useFocusEffect } from '@react-navigation/native';

import { HighlightCard } from '../../components/HighlightCard';
import { TransactionCard, TransactionCardProps } from '../../components/TransactionCard';

import { useTheme } from 'styled-components';

import {
  Container,
  Header,
  UserWrapper,
  UserInfo,
  Photo,
  User,
  UserGreeting,
  UserName,
  Icon,
  HighlightCards,
  Transactions,
  Title,
  TransactionList,
  LogoutButton,
  LoadContainer
} from './styles';

export interface DataListProps extends TransactionCardProps {
  id: string;
}
interface highLightProps {
  amount: string;
}
interface highLightData {
  entries: highLightProps,
  expensives: highLightProps,
  total: highLightProps
}

export function Dashboard() {
  const [isLoading, setIsLoading] = useState(true);
  const [transactions, setTransactions ] = useState<DataListProps[]>([]);
  const [highLightData, sethighLightCard] = 
  useState<highLightData>({} as highLightData);

  const theme = useTheme();

  //percorrer transações para poder fazer a formatação nela.
  async function loadTransactions() {
    const dataKey = '@gofinances:transactions';
    const response = await AsyncStorage.getItem(dataKey);
    const transactions = response ? JSON.parse(response) : [];

    let entriesTotal = 0;
    let expensiveTotal = 0;

    const transactionsFormatted: DataListProps[] = transactions
    .map((item: DataListProps) =>{
      if(item.type === 'positive') {
        entriesTotal += Number(item.amount); //incrementa item + total.
      } else {
        expensiveTotal -= Number(item.amount);
      }

      const amount = Number(item.amount).toLocaleString('pt-BR', {
        style: 'currency', //moeda,
        currency: 'BRL'
      });
      
      const date = Intl.DateTimeFormat('pt-BR', {
          day: '2-digit',
          month: '2-digit',
          year: '2-digit'
      }).format(new Date(item.date));

      return {
        id: item.id,
        name: item.name,
        amount: amount, 
        type: item.type, 
        category: item.category,
        date, 
      }
    });

    setTransactions(transactionsFormatted); 
    const total = entriesTotal + expensiveTotal;
    sethighLightCard({
      entries: {
        amount: entriesTotal.toLocaleString('pt-BR', {
          style: 'currency',
          currency: 'BRL'
        })
      },
      expensives:{
        amount: expensiveTotal.toLocaleString('pt-BR', {
          style: 'currency',
          currency: 'BRL'
        })
      },
      total: {
        amount: total.toLocaleString('pt-BR', {
          style: 'currency',
          currency: 'BRL'
        })
      }
    });
    //ver as lista atuais no console. console.log(transactionsFormatted)
    setIsLoading(false);
  }

  useEffect(() => {
    loadTransactions();
    
    /* //REMOVER LISTA ATUAL - obs: descomentar
    const dataKey = '@gofinances:transactions';
    AsyncStorage.removeItem(dataKey); */
  }, []);

  useFocusEffect(useCallback(() =>{
    loadTransactions();
  },[]));

  return (
    <Container>
      {
        isLoading ? 
        <LoadContainer>
          <ActivityIndicator 
            color={theme.colors.primary}
            size='large'
          />
        </LoadContainer> :
      <>
        <Header>
          <UserWrapper>

            <UserInfo>
              <Photo
                source={{ uri: 'https://github.com/emffor.png' }}
              />

              <User>
                <UserGreeting>Olá, </UserGreeting>
                <UserName>Rodrigo, </UserName>
              </User>

            </UserInfo>

          <LogoutButton onPress={() => {}}>
              <Icon name='power' />

          </LogoutButton>

          </UserWrapper>

        </Header>

        <HighlightCards>
          <HighlightCard
            type='up'
            title='Entradas'
            amount={highLightData.entries.amount}
            lastTransaction='Última entrada dia 13 de abril'
          />

          <HighlightCard
            type='down'
            title='Saídas'
            amount={highLightData.expensives.amount}
            lastTransaction='Última saída dia 03 de abril'
          />

          <HighlightCard
            type='total'
            title='Total'
            amount={highLightData.total.amount}
            lastTransaction='01 à 16 de abril'
          />

        </HighlightCards>

        <Transactions>
          <Title>Listagem</Title>

          <TransactionList
            data={transactions}
            keyExtractor={item => item.id}
            renderItem={({ item }) => <TransactionCard data={item} />}
          />
        </Transactions>
      </>
      }
    </Container>
  );
}

