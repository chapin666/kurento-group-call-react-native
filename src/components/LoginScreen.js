import React, { Component, PropTypes } from 'react';
import Wallpager from './Wallpaper';
import Logo from './Logo';
import Form from './Form';
import ButtonSubmit from './ButtonSubmit';

export default class LoginScreen extends Component {

    render() {
        return (
            <Wallpager>
                <Logo />
                <Form />
                <ButtonSubmit />
            </Wallpager>
        );
    }

}