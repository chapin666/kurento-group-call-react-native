import React, { Component } from 'react';
import {
    StyleSheet,
    KeyboardAvoidingView
} from 'react-native';

import UserInput from './UserInput';

import usernameImage from '../images/username.png';

export default class Form extends Component {

    render() {
        return (
            <KeyboardAvoidingView behavior='padding' style={styles.container}>

                <UserInput
                    source={usernameImage}
                    secureTextEntry={false}
                    placeholder='用户昵称'
                    autoCapitalize={'none'}
                    returnKeyType={'done'}
                    autoCorrect={false}
                    callback={value => this.props.userNameChange(value)}
                />

                <UserInput
                    source={usernameImage}
                    secureTextEntry={false}
                    placeholder='房间号码'
                    returnKeyType={'done'}
                    autoCapitalize={'none'}
                    autoCorrect={false}
                    callback={value => this.props.roomNameChange(value)}
                />

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

