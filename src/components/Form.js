import React, {Component, PropTypes} from 'react';
import Dimensions from 'Dimensions';
import {
    StyleSheet,
    KeyboardAvoidingView,
    View,
} from 'react-native';

import UserInput from './UserInput';

import usernameImage from '../images/username.png';

export default class Form extends Component {
    render() {
        return (
            <KeyboardAvoidingView behavior='padding'
                style={styles.container}>

                <UserInput source={usernameImage}
                    secureTextEntry={false}
                    placeholder='用户名'
                    autoCapitalize={'none'}
                    returnKeyType={'done'}
                    autoCorrect={false} />

                <UserInput source={usernameImage}
                    secureTextEntry={false}
                    placeholder='房间号'
                    returnKeyType={'done'}
                    autoCapitalize={'none'}
                    autoCorrect={false} />

            </KeyboardAvoidingView>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
    }
});

