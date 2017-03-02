import React, { Component } from 'react';
import { 
    View,
    Text,
    ScrollView,
    StyleSheet
} from 'react-native';

import { RTCView } from 'react-native-webrtc';

export default class UserList extends Component {
    
    render() {
        return (
            <View style={styles.root}>
                <View style={styles.titleContainer}>
                    <Text style={styles.title}>Room members</Text>
                </View>

                <View style={styles.contentContainer}>
                    <ScrollView horizontal>

                        <View style={styles.userCard}>
                            <RTCView  style={styles.userCamera} streamURL={this.props.videoURL} />
                            <Text style={styles.userCardTitle}>username</Text>
                        </View>

                        <View style={styles.userCard}>
                            <RTCView  style={styles.userCamera} streamURL={this.props.videoURL} />
                            <Text style={styles.userCardTitle}>username</Text>
                        </View>

                        <View style={styles.userCard}>
                            <RTCView  style={styles.userCamera} streamURL={this.props.videoURL} />
                            <Text style={styles.userCardTitle}>username</Text>
                        </View>

                        <View style={styles.userCard}>
                            <RTCView  style={styles.userCamera} streamURL={this.props.videoURL} />
                            <Text style={styles.userCardTitle}>username</Text>
                        </View>
                        
                    </ScrollView>
                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    root: {
        flex: 1
    },
    titleContainer: {
        flex: 0.1,
        paddingHorizontal: 20,
        paddingVertical: 5
    },
    title: {
        fontSize: 15
    },
    contentContainer: {
        flex: 1
    },
    userCard: {
        height: 150,
        width: 110,
        marginHorizontal: 5,
        backgroundColor: '#cccccc'
    },
    userCamera: {
        flex: 1
    },
    userCardTitle: {
        position: 'absolute',
        bottom: 2,
        right: 25,
        color: 'red'
    }
});
