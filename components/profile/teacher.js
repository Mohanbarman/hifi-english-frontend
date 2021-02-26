/*
 * @author Gaurav Kumar
 */

import React, { useContext, useEffect } from "react";
import { Icon, Header } from "react-native-elements";
import { Text, View, StyleSheet, SafeAreaView, TouchableHighlight, Image, ScrollView } from "react-native";
import Avatar from "../../assets/images/useravatar.png";
import { AnimatedCircularProgress } from "react-native-circular-progress";
import TabsWrapper from "./tabs-wrapper";
import ConnectWithExperts from "./connect-with-experts";
import StudentFeedback from "../feedback/student-feedback";
import CallbackRequests from "./callback-requests";
import ReadyForCall from "./ready-to-take-call";
import TotalEarnings from "./total-earnings";
import TrainingCenter from "./training-center";
import ContactUsBtn from "./contact-us-btn";
import { ThemeContext } from "../../context/theme";
import { AuthContext } from "../../context/auth";
import { useNavigation } from "@react-navigation/core";

const styles = StyleSheet.create({
    profileWrapper: {
        paddingBottom: 54,
        paddingLeft: 35,
        paddingRight: 35,
        borderBottomLeftRadius: 45,
        borderBottomRightRadius: 45,
        marginBottom: 15
    },
    avatar: {
        height: 76,
        width: 76,
        borderRadius: 76,
    },
    userDetailsWrapper: {
        marginTop: 35,
        width: "100%",
        flexDirection: "row",
        alignItems: "center"
    },
    planDetailsWrapper: {
        borderRadius: 45,
        backgroundColor: "white",
        flexDirection: "row",
        borderColor: "#D8CEF780",
        borderWidth: 2,
        padding: 20,
        margin: 15
    },
    planTitle: {
        fontSize: 20,
        textAlign: "center"
    },
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
    header: {
        paddingLeft: 35,
        paddingRight: 35,
        borderBottomColor: 'transparent',
    }
});

const Teacher = (props) => {
    let { navigation } = props;
    let { colors } = useContext(ThemeContext);
    let { profile, videoScreen } = useContext(AuthContext);
    useEffect(() => {
        if (videoScreen) {
            navigation.navigate("Call");
        }
    }, [videoScreen])
    return (
        <SafeAreaView style={{ backgroundColor: "white" }}>
            <ScrollView style={{ height: "100%" }}>
                <Header
                    leftComponent={{ icon: 'menu', color: '#fff', size: 30, onPress: () => navigation.openDrawer() }}
                    centerComponent={{ text: 'HIFI ENGLISH', style: { color: '#fff' } }}
                    backgroundColor={colors.primary}
                    containerStyle={styles.header}
                />
                <View style={[styles.profileWrapper, { backgroundColor: colors.primary }]}>
                    <View style={styles.userDetailsWrapper}>
                        <View style={{ width: "70%" }}>
                            {/* <Text style={{ color: "white", fontSize: 22 }}>Expert Teacher</Text> */}
                            <Text style={{ color: "white", fontSize: 22 }}>{profile?.name}</Text>
                        </View>
                        <View style={{ width: "30%" }}>
                            <Image source={{ uri: profile?.profileImageUrl ?? Image.resolveAssetSource(Avatar).uri }} style={styles.avatar} />
                        </View>
                    </View>
                    {/* <Text style={{ color: colors.secondary, textAlign: "center", fontSize: 16, marginTop: 40 }}>Total */}
                    {/* Earnings</Text> */}
                    {/* <Text style={{ color: "white", textAlign: "center", fontSize: 45 }}>Rs. 12,905</Text> */}
                </View>
                <CallbackRequests />
                <ReadyForCall />
                {/*<TotalEarnings/>*/}
                {/*<TrainingCenter />*/}
                <ContactUsBtn {...props} />
            </ScrollView>
        </SafeAreaView>
    );
};

export default Teacher;
