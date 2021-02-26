/*
 * @author Gaurav Kumar
 */

import React, { useContext, useState } from "react";
import { Button, Icon } from "react-native-elements";
import { View, StyleSheet, Text, TouchableHighlight } from "react-native";
import Recordings from "./recordings";
import Assignments from "./assignments";
import Subscriptions from "./subscriptions";
import { ThemeContext } from "../../context/theme";
import { useNavigation } from "@react-navigation/core";

const styles = StyleSheet.create({
    tabsButtonWrapper: {
        flexDirection: "row",
        margin: 15,
        justifyContent: "space-around",
        alignItems: 'flex-start',
    },
    tabButton: {
        justifyContent: "center",
        marginRight: 10,
        width: 87,
        alignItems: "center"
    },
    tabIcon: {
        borderWidth: 2,
        borderColor: "#D8CEF780",
        borderRadius: 20,
        height: 70,
        width: 70,
        justifyContent: "center",
    }
});
const TabsWrapper = (props) => {
    let { colors } = useContext(ThemeContext);
    let navigation = useNavigation();
    const tabs = {
        1: <Subscriptions colorScheme={0} {...props} />,
        2: <Assignments {...props} />
    };
    const [activeTab, setActiveTab] = useState(1);

    return (
        <View>
            <View style={styles.tabsButtonWrapper}>
                <TouchableHighlight style={{ justifyContent: "center", width: 87 }} underlayColor={"white"}
                    onPress={() => navigation.navigate("OnBoarding")}>
                    <View style={styles.tabButton}>
                        <Icon name={"help-outline"}
                            containerStyle={[styles.tabIcon, { backgroundColor: activeTab === 0 ? colors.primary : "white" }]}
                            size={35}
                            color={activeTab === 0 ? "white" : colors.primary} />
                        <Text style={{ textAlign: "center", color: colors.primary }}>Demo</Text>
                    </View>
                </TouchableHighlight>
                <TouchableHighlight onPress={() => setActiveTab(1)} style={{ justifyContent: "center", width: 87 }}
                    underlayColor={"white"}>
                    <View style={styles.tabButton}>
                        <Icon name={"card-membership"}
                            containerStyle={[styles.tabIcon, { backgroundColor: activeTab === 1 ? colors.primary : "white" }]}
                            size={35}
                            color={activeTab === 1 ? "white" : colors.primary} />
                        <Text style={{ textAlign: "center", color: colors.primary }}>Subscription Plan</Text>
                    </View>
                </TouchableHighlight>
                {/* <TouchableHighlight onPress={() => setActiveTab(2)} style={{ justifyContent: "center", width: 87 }}
                    underlayColor={"white"}>
                    <View style={styles.tabButton}>
                        <Icon name={"record-voice-over"}
                            containerStyle={[styles.tabIcon, { backgroundColor: activeTab === 2 ? colors.primary : "white" }]}
                            size={35}
                            color={activeTab === 2 ? "white" : colors.primary} />
                        <Text style={{ textAlign: "center", color: colors.primary }}>My Recordings</Text>
                    </View>
                </TouchableHighlight> */}
                <TouchableHighlight onPress={() => setActiveTab(2)} style={{ justifyContent: "center", width: 87 }}
                    underlayColor={"white"}>
                    <View style={styles.tabButton}>
                        <Icon name={"assignment"}
                            containerStyle={[styles.tabIcon, { backgroundColor: activeTab === 2 ? colors.primary : "white" }]}
                            size={35}
                            color={activeTab === 2 ? "white" : colors.primary} />
                        <Text style={{ textAlign: "center", color: colors.primary }}>My Assignments</Text>
                    </View>
                </TouchableHighlight>
            </View>
            {tabs[activeTab]}
        </View>
    );
};

export default TabsWrapper;
