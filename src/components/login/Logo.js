
import React, { Component } from 'react';
import {
    StyleSheet,
    View,
    Image
} from 'react-native';

import logoImg from '../../images/logo.png';

export default class Logo extends Component {
    render() {
        return (
            <View style={styles.container}>
                <Image source={logoImg} resizeMode='contain' />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 2,
		alignItems: 'center',
		justifyContent: 'center',
    }
});
