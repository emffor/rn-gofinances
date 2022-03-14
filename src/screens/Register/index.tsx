import React, {useState} from 'react';
import { Modal, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { useForm } from "react-hook-form";

import { Button } from '../../components/Form/Button';
import { CategorySelectButton } from '../../components/Form/CategorySelectButton';
import { Input } from '../../components/Form/Input';
import { InputForm } from '../../components/Form/InputForm';
import { TransactionTypeButton } from '../../components/Form/TransactionTypeButton';

import { CategorySelect } from '../CategorySelect';

import {
    Container,
    Header,
    Title,
    Form,
    Fields,
    TransactionsTypes
} from './styles';

interface FormData {
  name: string;
  amount: string;
}

export function Register(){
  //se esse botao tiver selecionado vai ter o fundo e remove a borda.
  const [transactionType, setTransactionType] = useState('');

  const [categoryModalOpen, setCategoryModalOpen] = useState(false);
  const [category, setCategory] = useState({
      key: 'category',
      name: 'Categoria',
  });



  //estado dos inputs
  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');

  function handleTransactionTypeSelect(type: 'up' | 'down'){
    setTransactionType(type)
  }

  function handleOpenSelectCategoryModal(){
    setCategoryModalOpen(true);
  }

  function handleCloseSelectCategoryModal(){
    setCategoryModalOpen(false);
  }

  //desestruturar o estado 
  //control(assina formulário) //handleSubmit função q pega todos valores envia em uma unica vez.

  const {
    control, 
    handleSubmit 
  } = useForm();

  function handleRegister(form: FormData) {
    const data = {
      name: form.name, 
      amount: form.amount,
      transactionType,
      category: category.key
    }
    console.log(data);
  }

  //PODE USAR ESSA DE BAIXO
  // function handleRegister() {
  //   // como se a gente tivesse enviando esses dados para serem salvos no device
  //   const data = {
  //     name, 
  //     amount,
  //     transactionType,
  //     category: category.key
  //   }
  //   // console.log(name, amount);
  //   console.log(data);
  // }

  // TESTE de CONSOLE //função que verifica que muda conteúdo.
  // //usa assim: onChangeText={text => handleInputChange(text)}
  // function handleInputChange(text: string){
  //   console.log(text);
  // }

  // <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
  // FAZ COM O QUE AO CLICAR EM QUALQUER PARTE DA TELA ELE FECHE O TECLADO

  return (
  <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
    <Container>
      
        <Header>
            <Title>
                Cadastro
            </Title>
        </Header>

    <Form>
       <Fields>
               {/* <Input 
                placeholder='Nome'
                onChangeText={setName}
              /> 

               <Input 
                placeholder='Preço'
                onChangeText={setAmount}
              />   
               ESSE INPUTFORM É USADO COM HOOK FORM PARA CONTROLE  */}
              <InputForm 
                name='name'
                control={control} //como q ele vai identificar
                placeholder="Nome"
                autoCapitalize='sentences' //primeira letra maiúscula
                autoCorrect={false}
              />

              <InputForm 
                name='amount'
                control={control} //como q ele vai identificar
                placeholder="Preço"
                keyboardType={'numeric'}
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
              
              {/* seleção da categoria */}
              <CategorySelectButton 
                  title={category.name} 
                  onPress={handleOpenSelectCategoryModal}
              />

        </Fields>

            <Button 
              title='Enviar'
              onPress={handleSubmit(handleRegister)}
              // onPress={handleRegister}
            />

            {/* visible={false} */}
            <Modal visible={categoryModalOpen}>

              <CategorySelect 
                  category={category} //o estado passando pro modal 
                  setCategory={setCategory} //função q atualiza o estado
                  closeSelectCategory={handleCloseSelectCategoryModal}
              />

            </Modal>
      </Form>
    </Container>
    </TouchableWithoutFeedback>
  );
}