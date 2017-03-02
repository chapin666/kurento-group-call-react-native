import React, { Component } from 'react';
import { Router, Scene } from 'react-native-router-flux';

import LoginScreen from './LoginScreen';
import RoomScreen from './RoomScreen';
import VideoScreen from './VideoScreen';

export default class Main extends Component {
    
    render() {
        return (
            <Router>
                <Scene key='root'>

                    <Scene
                        key='loginScreen'
                        component={LoginScreen}
                        animation='fade'
                        hideNavBar={true}
                        initial={true} 
                    />

                    <Scene
                        key='roomScreen'
                        component={RoomScreen}
                        animation='fade'
                        hideNavBar={true} 
                    />

                    <Scene
                        key='videoScreen'
                        component={VideoScreen}
                        animation='fade'
                        hideNavBar={true} 
                    />
                          
                </Scene>
            </Router>
        );
    }

}
