/*
 * @author Gaurav Kumar
 */

import React, {useState} from "react";
import {Icon, ListItem, Overlay, Rating, Input, Button} from "react-native-elements";
import {Text, TouchableHighlight, View, StyleSheet, FlatList, ScrollView} from "react-native";
import UserAvatar from "../../assets/images/useravatar.png";

const styles = StyleSheet.create({
    connectToExpert: {
        borderRadius: 45,
        margin: 15,
        paddingTop: 1,
        paddingBottom: 1,
        paddingLeft: 20,
        paddingRight: 20,
        flex: 1,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between"
    },
    feedBackTitle: {
        fontSize: 16,
        fontWeight: "bold",
        color: "#242134",
        textAlign: "center",
        marginTop: 18,
        marginBottom: 15
    },
    ratingSubtitleWrapper: {
        flexDirection: "row", justifyContent: "space-between",
        borderBottomWidth: 1,
        borderColor: "#D8CEF77F",
        paddingBottom: 20,
        paddingLeft: 20,
        paddingRight: 20,
    },
    ratingSubtitle: {
        fontSize: 12,
        color: "#A490E0"
    },
    feedBackInput: {
        borderWidth: 1,
        borderRadius: 12,
        paddingLeft: 10,
        paddingRight: 10,
        borderColor: "#707070",
        height: 100,
        marginTop: 18,
    },
    submitBtn: {
        fontSize: 22,
        fontWeight: "500",
        borderRadius: 28,
        paddingLeft: 20,
        paddingRight: 20,
        paddingTop: 15,
        paddingBottom: 15,
        backgroundColor: "#FF7D3B"
    }
});

const StudentFeedback = (props) => {
    let {theme} = props;
    const [overlayVisible, setOverlay] = useState(true);
    return (
        <View>
            <TouchableHighlight style={{height: 100}} onPress={() => setOverlay(true)}>
                <View style={[styles.connectToExpert, {backgroundColor: theme.color.secondary}]}>
                    <Text style={{color: "white", fontSize: 18}}>Connect with an expert</Text>
                    <Icon name={"phone"} reverseColor={"#42BC1F"} color={"white"} reverse={true} size={25}
                          iconStyle={{fontSize: 35}}/>
                </View>
            </TouchableHighlight>
            <Overlay isVisible={overlayVisible} onBackdropPress={() => setOverlay(false)} width={"auto"}
                     overlayStyle={{borderRadius: 30, borderColor: "#D8CEF77F"}}
                     windowBackgroundColor={"#FFFFFF"}>
                <View style={{minWidth: 300, paddingLeft: 10, paddingRight: 10}}>
                    <Text style={{
                        color: theme.color.primary,
                        textAlign: "center",
                        fontSize: 20,
                        borderBottomWidth: 1,
                        borderColor: "#D8CEF77F",
                        paddingBottom: 20,
                        paddingTop: 20
                    }}>How was your call?</Text>
                    <Text style={styles.feedBackTitle}>Audio Quality</Text>
                    <Rating imageSize={40} ratingCount={5} reviews ratingColor={"#FF7D3B"} type={"custom"} style={{}}/>
                    <View style={styles.ratingSubtitleWrapper}>
                        <Text style={styles.ratingSubtitle}>Not Good</Text>
                        <Text style={styles.ratingSubtitle}>Very Good</Text>
                    </View>
                    <Text style={styles.feedBackTitle}>How was the Expert</Text>
                    <Rating imageSize={40} ratingCount={5} reviews ratingColor={"#FF7D3B"} type={"custom"}/>
                    <View style={styles.ratingSubtitleWrapper}>
                        <Text style={styles.ratingSubtitle}>Not Good</Text>
                        <Text style={styles.ratingSubtitle}>Very Good</Text>
                    </View>
                    <Input inputContainerStyle={styles.feedBackInput} placeholder={"Leave a comment"}/>
                    <View style={{alignItems:"center", marginBottom:15}}>
                        <Button title={"Submit"}
                                buttonStyle={styles.submitBtn}
                                containerStyle={{width: 200}}
                                titleStyle={{color: "white"}}/>
                    </View>
                </View>
            </Overlay>
        </View>
    );
};

export default StudentFeedback;
