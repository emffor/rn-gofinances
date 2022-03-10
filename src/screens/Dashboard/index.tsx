import React from 'react';

import { HighlightCard } from '../../components/HighlightCard';

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
} from './styles';


export function Dashboard(){
  return (
    <Container>
      <Header>
        <UserWrapper>

          <UserInfo>
              <Photo 
                  source={{ uri: 'https://github.com/emffor.png'}}
              />

              <User>
                <UserGreeting>Olá, </UserGreeting>
                <UserName>Rodrigo, </UserName>
              </User>

          </UserInfo>

          <Icon name='power'/>

        </UserWrapper>

      </Header>

      <HighlightCard>
        
      </HighlightCard>

    </Container>
  );
}

