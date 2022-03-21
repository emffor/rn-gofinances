import React, {useState, useEffect} from 'react';
import { useForm } from "react-hook-form";
import { useNavigation } from '@react-navigation/native';

import { 
  Modal, 
  TouchableWithoutFeedback, 
  Keyboard,
  Alert,
} from 'react-native';

import { CategorySelectButton } from '../../components/Form/CategorySelectButton';
import { CategorySelect } from '../CategorySelect';
import { Button } from '../../components/Form/Button';

import AsyncStorage from '@react-native-async-storage/async-storage';
import { InputForm } from '../../components/Form/InputForm';
import uuid from 'react-native-uuid';
import { TransactionTypeButton } from '../../components/Form/TransactionTypeButton';

import {
    Container,
    Header,
    Title,
    Form,
    Fields,
    TransactionsTypes
} from './styles';

import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup'
interface FormData {
  name: string;
  amount: string;
}

type NavigationProps = {
  navigate: (screen:string) => void;
}


const schema = Yup.object().shape({
  name: Yup
  .string()
  .required('Nome é obrigatório'),
  amount: Yup
  .number()
  .typeError('informe um valor numérico')
  .positive('O valor não pode ser Negativo.')
  .required('O valor é obrigatório')
})

export function Register(){
  const [transactionType, setTransactionType] = useState('');

  const [categoryModalOpen, setCategoryModalOpen] = useState(false);
  const [category, setCategory] = useState({
      key: 'category',
      name: 'Categoria',
  });

  
  const navigation = useNavigation<NavigationProps>(); 

  //estado dos inputs
  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');

  function handleTransactionTypeSelect(type: 'positive' | 'negative'){
    setTransactionType(type)
  }

  function handleOpenSelectCategoryModal(){
    setCategoryModalOpen(true);
  }

  function handleCloseSelectCategoryModal(){
    setCategoryModalOpen(false);
  }

  const {
    control, 
    handleSubmit,
    reset,
    formState: { errors } //desestruturando error do FormState
  } = useForm({
    //força q o valor do formulário siga um padrão.
    resolver: yupResolver(schema)
  });

  async function handleRegister(form: FormData) {
    if (!transactionType)
      return Alert.alert('Selecione o tipo da transação');
      
     if (category.key === 'category')
      return Alert.alert('Selecione a categoria');

    const newTransaction = {
      id: String(uuid.v4()),
      name: form.name, 
      amount: form.amount,
      type: transactionType,
      category: category.key,
      date: new Date(),
    }
    
    try {
      const dataKey = '@gofinances:transactions';
      const data = await AsyncStorage.getItem(dataKey);
      const currentData = data ? JSON.parse(data) : [];
      
      //um array de objetos
      const dataFormatted = [
        ...currentData,
        newTransaction
      ];
      
      await AsyncStorage.setItem(dataKey, JSON.stringify(dataFormatted)); 

      reset();
      setTransactionType('')
      setCategory({
        key: 'category',
        name: 'Categoria'
      });

      navigation.navigate('Listagem');

    } catch (error) {
      console.log(error);
      Alert.alert("Não foi possível salvar");
    }
  }

  //FUNÇÃO PARA LIMPAR UMA COLEÇÃO DO ASYNC STORAGE
/*      useEffect(() => {
        async function removeAll() {
          await AsyncStorage.removeItem(dataKey);
        } 
        removeAll(); 
    },[]); */


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
              <InputForm 
                name='name'
                control={control} 
                placeholder="Nome"
                autoCapitalize='sentences' //primeira letra maiúscula
                autoCorrect={false}
                error={errors.name && errors.name.message}
              />

              <InputForm 
                name='amount'
                control={control} //como q ele vai identificar
                placeholder="Preço"
                keyboardType='numeric'
                error={errors.amount && errors.amount.message}
              />

              <TransactionsTypes>
                <TransactionTypeButton 
                  title='Income' type='up'
                  onPress={() => handleTransactionTypeSelect('positive')}
                  isActive={transactionType === 'positive'} 
                />
                <TransactionTypeButton 
                  title='Outcome' type='down' 
                  onPress={() => handleTransactionTypeSelect('negative')} 
                  isActive={transactionType === 'negative'}
                />
              </TransactionsTypes>

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