import React, {useEffect, useState} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { HighlightCard } from '../../components/HighlightCard';
import { TransactionCard, TransactionCardProps } from '../../components/TransactionCard';

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
} from './styles';

//criada para usar na listagem no keyExtractor / o export para o styCompon
export interface DataListProps extends TransactionCardProps {
  id: string;
}

export function Dashboard() {
  const [ data, setData ] = useState<DataListProps[]>([]);

  //percorrer transações para poder fazer a formatação nela.
  async function loadTransactions() {
    const dataKey = '@gofinances:transactions';
    const response = await AsyncStorage.getItem(dataKey);
    const transactions = response ? JSON.parse(response) : [];


    /* 
      O retorno da transação sera um q é um vetor DataListProps[] e percorrer cada item e também vou tipar o item é um DataListProps e no final de tudo vou devolver uma lista de DataListProps. (usado para formatação de data, mas usado para uma moeda.)
    */
    const transactionsFormatted: DataListProps[] = transactions
    .map((item: DataListProps) =>{
      const amount = Number(item.amount).toLocaleString('pt-BR', {
        style: 'currency', //moeda,
        currency: 'BRL'
      });

      // const date = new Date(item.date)
      // .toLocaleString('pt-BR', {
      //   timeZone: 'UTC' 
      // }); outra forma de formatar data. da mesma abaixo.
      
      const date = Intl.DateTimeFormat('pt-BR', {
          day: '2-digit',
          month: '2-digit',
          year: '2-digit'
      }).format(new Date(item.date));

      return {
        id: item.id,
        name: item.name,
        amount: amount, //pode usar o o amount, igual no date sem usar date: date
        type: item.type, 
        category: item.category,
        date, 
      }
    });

    setData(transactionsFormatted); //Alterando o as formatações.

  }

  //deixar vazio o [] pq ira carregar uma unica vez.
  useEffect(() => {
    loadTransactions();
  }, []);

  return (
    <Container>
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
          amount='R$ 17.400,00'
          lastTransaction='Última entrada dia 13 de abril'
        />

        <HighlightCard
          type='down'
          title='Saídas'
          amount='R$ 1.259,00'
          lastTransaction='Última saída dia 03 de abril'
        />

        <HighlightCard
          type='total'
          title='Total'
          amount='R$ 16.141,00'
          lastTransaction='01 à 16 de abril'
        />


      </HighlightCards>

      <Transactions>
        <Title>Listagem</Title>

        <TransactionList
          data={data}
          keyExtractor={item => item.id}
          renderItem={({ item }) => <TransactionCard data={item} />}
        />

        {/* <TransactionCard data={data[0]}/>  tinha q ser passado com esse zero pq tem q pegar o primeiro objeto*/}


      </Transactions>

    </Container>
  );
}

