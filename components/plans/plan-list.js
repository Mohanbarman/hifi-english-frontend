/*
 * @author Gaurav Kumar
 */

import React, {useContext, useEffect} from "react";
import {Header} from "react-native-elements";
import {SafeAreaView, ScrollView, StyleSheet, Text, View} from "react-native";
import {AnimatedCircularProgress} from "react-native-circular-progress";
import Subscriptions from "../profile/subscriptions";
import {ThemeContext} from "../../context/theme";
import {AuthContext} from "../../context/auth";
import {formatDistanceToNow} from 'date-fns'

const styles = StyleSheet.create({
    container: {
        height: "100%"
    },
    planWrapper: {
        paddingBottom: 54,
        paddingLeft: 35,
        paddingRight: 35,
        borderBottomLeftRadius: 45,
        borderBottomRightRadius: 45,
        marginBottom: 15
    },
    planTitle: {
        fontSize: 24,
        textAlign: "center",
        marginBottom: 10
    },
    planDescription: {
        fontSize: 14,
        color: "#707070",
        textAlign: "center"
    },
    planDetailsWrapper: {
        borderRadius: 45,
        backgroundColor: "white",
        flexDirection: "row",
        borderColor: "#D8CEF780",
        borderWidth: 2,
        padding: 20,
        margin: 15,
        alignItems: "center"
    },
    sessions: {
        fontSize: 17,
        fontWeight: "bold",
        marginBottom: 6
    },
    amount: {
        fontSize: 14
    },
    crossedAmount: {
        fontSize: 13,
        textDecorationLine: "line-through",
        color: "#707070",
        paddingLeft: 10
    },
    upgradeBtn: {
        fontSize: 22,
        fontWeight: "500",
        borderRadius: 28,
        paddingLeft: 20,
        paddingRight: 20,
        paddingTop: 15,
        paddingBottom: 15,
        width: 275,
        marginTop: 30,
        marginLeft: "auto",
        marginRight: "auto",
    },
    footerText: {
        fontSize: 15,
        color: "#707070",
        textAlign: "center",
        marginTop: "auto",
        padding: 20
    },
    currentPlanTitle: {
        fontSize: 20,
        textAlign: "center"
    },
});
const PlanList = (props) => {
    let { navigation } = props;
    let { colors } = useContext(ThemeContext);
    let { profile, videoScreen } = useContext(AuthContext);
    useEffect(() => {
        if (videoScreen) {
            navigation.navigate("Call");
        }
    }, [videoScreen])
    return (
        <SafeAreaView style={{ backgroundColor: colors.primary }}>
            <ScrollView>
                <View style={styles.container}>
                    <View style={[styles.planWrapper, { backgroundColor: "white" }]}>
                        <Header
                            leftComponent={{
                                icon: 'navigate-before',
                                color: "#707070",
                                onPress: () => navigation.goBack()
                            }}
                            backgroundColor={"white"}
                            containerStyle={{ borderBottomWidth: 0, paddingLeft: 0, paddingRight: 0 }}
                        />
                        <Text style={[styles.planTitle, { color: colors.primary }]}>Subscription Plan</Text>
                        <Text style={styles.planDescription}>Learn English from experts straightaway from the
                        convenience of
                            your Home, Book an appointment in less than 60 seconds and get on the schedule</Text>
                    </View>
                    <View style={styles.planDetailsWrapper}>
                        <View>
                            <AnimatedCircularProgress
                                size={75} width={5}
                                fill={Math.max(100 - Math.floor(100 * profile?.numberOfSessions / profile?.subscription?.sessions), 0)}
                                tintColor={colors.secondary}
                                backgroundColor="#572CD833"
                                padding={10}
                                rotation={0}>
                                {(progress) => (
                                    <Text>
                                        {parseInt(progress)}%
                                    </Text>
                                )}
                            </AnimatedCircularProgress>
                            <Text style={{ textAlign: "center" }}>Completed</Text>
                        </View>

                        <View style={{ alignItems: "center", marginLeft: "auto", marginRight: "auto", width: "70%" }}>
                            <Text
                                style={[styles.currentPlanTitle, { color: colors.primary }]}>{profile?.subscription?.title}</Text>
                            <View style={{ flexDirection: "row", marginTop: 15 }}>
                                <View style={{ width: "50%", alignItems: "center" }}>
                                    <Text style={{ color: "#A490E0", fontSize: 15, marginBottom: 3 }}>Sessions</Text>
                                    <Text
                                        style={{ color: "#242134", fontSize: 18 }}>{profile?.numberOfSessions} left</Text>
                                </View>
                                <View style={{ width: "50%", alignItems: "center" }}>
                                    <Text style={{ color: "#A490E0", fontSize: 15, marginBottom: 3 }}>Validity</Text>
                                    <Text style={{
                                        color: "#242134",
                                        fontSize: 18
                                    }}>{formatDistanceToNow(new Date(profile?.validityDate)).replace('about ', '') + ' left'}</Text>
                                </View>
                            </View>
                        </View>
                    </View>
                    <View>
                        <Subscriptions colorScheme={1} {...props} />
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

export default PlanList;
