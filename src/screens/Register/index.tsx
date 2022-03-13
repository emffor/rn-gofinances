import React, {useState} from 'react';
import { Button } from '../../components/Form/Button';
import { CategorySelect } from '../../components/Form/CategorySelect';
import { Input } from '../../components/Form/Input';
import { TransactionTypeButton } from '../../components/Form/TransactionTypeButton';

import {
    Container,
    Header,
    Title,
    Form,
    Fields,
    TransactionsTypes
} from './styles';

export function Register(){
  //se esse botao tiver selecionado vai ter o fundo e remove a borda.
  const [transactionType, setTransactionType] = useState('');

  function handleTransactionTypeSelect(type: 'up' | 'down'){
    setTransactionType(type)
  }

  return (
    <Container>
        <Header>
            <Title>
                Cadastro
            </Title>
        </Header>

    <Form>
       <Fields>
            <Input 
                placeholder='Nome'
              />

              <Input 
                placeholder='Preço'
              />  
              <TransactionsTypes>
                <TransactionTypeButton 
                  title='Income' type='up'
                  onPress={() => handleTransactionTypeSelect('up')}
                  //estou fazendo comparação ai esse retorno é verdadeiro ou falso.
                  isActive={transactionType === 'up'} 
                />
                <TransactionTypeButton 
                  title='Outcome' type='down' 
                  onPress={() => handleTransactionTypeSelect('down')} 
                  isActive={transactionType === 'down'}
                />
              </TransactionsTypes>
              
              <CategorySelect title='Categoria' />

        </Fields>

            <Button title='Enviar'/>

      </Form>
    </Container>
  );
}