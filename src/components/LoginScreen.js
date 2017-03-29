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

    /*componentDidMount () {
        if (InCallManager.recordPermission !== 'granted') {
            InCallManager.requestRecordPermission()
            .then((requestedRecordPermissionResult) => {
                console.log("InCallManager.requestRecordPermission() requestedRecordPermissionResult: ", requestedRecordPermissionResult);
            })
            .catch((err) => {
                console.log("InCallManager.requestRecordPermission() catch: ", err);
            });
        }

        if (InCallManager.cameraPermission !== 'granted') {
            InCallManager.requestCameraPermission()
            .then((requestedCameraPermissionResult) => {
                console.log("InCallManager.requestCameraPermission() requestedCameraPermissionResult: ", requestedCameraPermissionResult);
            })
            .catch((err) => {
                console.log("InCallManager.requestCameraPermission() catch: ", err);
            });
        }

    }*/
    

    

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