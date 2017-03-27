import React, { Component } from 'react';
import Wallpager from './Wallpaper';
import Logo from './Logo';
import Form from './Form';
import ButtonSubmit from './ButtonSubmit';

export default class LoginScreen extends Component {

    constructor() {
        super();

        this.state = {
            username: null,
            roomname: null,
        };
    }

    

    render() {
        return (
            <Wallpager>
                <Logo />
                <Form 
                    userNameChange={value => this.setState({username: value}) }
                    roomNameChange={value => this.setState({roomname: value}) }/>

                <ButtonSubmit 
                    userNameValue={this.state.username}
                    roomNameValue={this.state.roomname} />
            </Wallpager>
        );
    }

}