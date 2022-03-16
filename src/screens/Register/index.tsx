import React, {useState} from 'react';
import { 
  Modal, 
  TouchableWithoutFeedback, 
  Keyboard,
  Alert,
} from 'react-native';
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

//importando tudo com q tem dentro de Yup // Validação
import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup'

interface FormData {
  name: string;
  amount: string;
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
    handleSubmit,
    formState: { errors } //desestruturando error do FormState
  } = useForm({
    //força q o valor do formulário siga um padrão.
    resolver: yupResolver(schema)
  });

  function handleRegister(form: FormData) {
    //! significa se nao tiver nada !transactionType
    if (!transactionType)
      return Alert.alert('Selecione o tipo da transação');
      
     if (category.key === 'category')
      return Alert.alert('Selecione a categoria');
    

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
               ESSE INPUTFORM É USADO COM HOOK FORM PARA CONTROLE  */}
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