import React, {useState} from 'react';
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

//importando tudo com q tem dentro de Yup // Validação.

import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup'
interface FormData {
  name: string;
  amount: string;
}

type NavigationProps = {
  navigate: (screen:string) => void;
}

//Nome é obrigatório
//name: Yup.vaiSerUmaString().tipoVaiSerObrigatário('message)
//amount: Yup.TemQSerUmNumber().CasoErroDeTipo(message)

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

  //tipado para evitar erro de tipagem
  const navigation = useNavigation<NavigationProps>();

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
    handleSubmit,
    reset,
    formState: { errors } //desestruturando error do FormState
  } = useForm({
    //força q o valor do formulário siga um padrão.
    resolver: yupResolver(schema)
  });

  async function handleRegister(form: FormData) {

    //! significa se nao tiver nada !transactionType
    if (!transactionType)
      return Alert.alert('Selecione o tipo da transação');
      
     if (category.key === 'category')
      return Alert.alert('Selecione a categoria');
    
    //id é gerado pelo back - mas não como ñ tem.... usa o uidd
    const newTransaction = {
      id: String(uuid.v4()),
      name: form.name, 
      amount: form.amount,
      transactionType,
      category: category.key,
      date: new Date(),
    }
    
    //1- passa uma chave / 2- passa a coleção @nomedoapp / 3- passa a chave pro AsyncStorage no setItem(chave, passa objeto convertido pra texto com JSON.stringify

    try {
       //chave do AsyncStorage
      //se esse botão tiver selecionado vai ter o fundo e remove a borda.
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

  //função remove dados da lista
  //   useEffect(() => {
  //     //FUNÇÃO PARA LIMPAR UMA COLEÇÃO DO ASYNC STORAGE
  //     // async function removeAll() {
  //     //   await AsyncStorage.removeItem(dataKey);
  //     // } 

  //     // removeAll(); 
  //  },[]);


  return (
  <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
    <Container>
      
        <Header>
            <Title>
                Cadastro
            </Title>
        </Header>

      {/*ESSE INPUTFORM É USADO COM HOOK FORM PARA CONTROLE  */}
    <Form>
       <Fields>
              <InputForm 
                name='name'
                control={control} //como q ele vai identificar
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