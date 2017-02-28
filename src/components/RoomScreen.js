import React, { Component, PropTypes } from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default class RoomScreen extends Component {
    
    render() {
        return (
            <View style={styles.container}>
                <Text>Welcome to LYCAM+</Text>
            </View>
        );
    }

}

const styles = StyleSheet.create({
   container: {
        flex: 1,
		alignItems: 'center',
		justifyContent: 'center',
    }
});