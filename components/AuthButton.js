import React from "react";
import styled from "styled-components";
import constants from "../constants";
import PropTypes from 'prop-types';
import {ActivityIndicator} from "react-native";

const Touchable = styled.TouchableOpacity ``;
const Container = styled.View `
    background-color:${props => props.theme.blueColor};
    padding: 10px;
    margin: 0px 50px;
    border-radius:5px;
    width: ${constants.width / 1.7};
`;
const Text = styled.Text `
    color:white;
    text-align:center;
    font-weight:600;
`;

const AuthButton = ({
    text,
    onPress,
    loading = false
}) => (
    <Touchable onPress={onPress} disabled={loading}>
        <Container>
            {
                loading
                    ? <ActivityIndicator color={"white"}/>
                    : <Text>{text}</Text>
            }
        </Container>
    </Touchable>
);

AuthButton.propTypes = {
    loading: PropTypes.bool,
    text: PropTypes.string.isRequired,
    onPress: PropTypes.func.isRequired

}
export default AuthButton;