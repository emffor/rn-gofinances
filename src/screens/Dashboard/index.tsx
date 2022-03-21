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

//criada para usar na listagem no keyExtractor / o export para o styCompon
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

    /* 
    
      O retorno da transação sera um q é um vetor DataListProps[] e percorrer cada item e também vou tipar o item é um DataListProps e no final de tudo vou devolver uma lista de DataListProps. (usado para formatação de data, mas usado para uma moeda.)
    */
    const transactionsFormatted: DataListProps[] = transactions
    .map((item: DataListProps) =>{
      //soma do total.
      if(item.type === 'positive') {
        entriesTotal += Number(item.amount); //incrementa item + total.
      } else {
        expensiveTotal -= Number(item.amount);
      }

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

    setTransactions(transactionsFormatted); 
    const total = entriesTotal + expensiveTotal;
    //Alterando o as formatações.
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
    setIsLoading(false); //carregamento do isLoading a bolinha.
  }

  //deixar vazio o [] pq ira carregar uma unica vez.
  useEffect(() => {
    loadTransactions();
    
    /* //FUNÇÃO PARA LIMPAR UMA COLEÇÃO DO ASYNC STORAGE - 2º FORMA DE REMOVER. é so descomentar
    const dataKey = '@gofinances:transactions';
    AsyncStorage.removeItem(dataKey); */
  }, []);

  /* Passando a função, precisa dizer pra aplicação que quando voltar pra tela tal ele recarregue a 'listagem' ou qualquer outra pagina que queira. Dispara a função. useCallback vai cuidar pra q n tenha renders desnecessário. */
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
        {/* undefined HighlightData.entries.amount */}
        {/*remoção do highLightData?.entries?.amount => pq agora tem adição do isLoading*/}
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

          {/* <TransactionCard data={data[0]}/>  tinha q ser passado com esse zero pq tem q pegar o primeiro objeto*/}
        </Transactions>
      </>
      }
    </Container>
  );
}

