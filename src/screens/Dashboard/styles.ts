import styled from 'styled-components/native';
import theme from '../../global/styles/theme';

export const Container = styled.View`
    flex: 1;
    justify-content: center;
    align-items: center;
    /* background-color: ${(props) => props.theme.colors.primary} */
    background-color: ${({theme}) => theme.colors.background};
`;

export const Title = styled.Text`
    font-size: 50px;
    font-weight: bold;
    color: ${({ theme }) => theme.colors.title};
`;