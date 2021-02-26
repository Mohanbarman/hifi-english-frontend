/*
 * @author Gaurav Kumar
 */

/*
 * @author Gaurav Kumar
 */

import React, {useContext, useState} from "react";
import {Icon, ListItem, Overlay,  Rating} from "react-native-elements";
import {Text, TouchableHighlight, View, StyleSheet, FlatList, ScrollView, Switch} from "react-native";
import UserAvatar from "../../assets/images/useravatar.png";
import {ThemeContext} from "../../context/theme";
import {useNavigation} from "@react-navigation/core";

const styles = StyleSheet.create({
    totalEarningWrapper: {
        borderRadius: 45,
        borderColor: "#D8CEF780",
        borderWidth: 2,
        margin: 15,
        paddingTop: 10,
        paddingBottom: 25,
        paddingLeft: 20,
        paddingRight: 15,
        flex: 1,
        alignItems: "center",
        justifyContent: "space-between"
    }
});

const TotalEarnings = (props) => {
    let {colors} = useContext(ThemeContext);
    const [ready, setReady] = useState(true);
    let navigation = useNavigation();
    return (
        <TouchableHighlight underlayColor={"transparent"} onPress={() => navigation.navigate("Wallet")}>
            <View style={styles.totalEarningWrapper}>
                <Text style={{color: colors.primary, fontSize: 20, fontWeight: "bold", marginBottom: 10}}>Total
                    Earnings</Text>
                <View style={{
                    flexDirection: "row",
                    width: "100%",
                    alignItems: "center",
                    justifyContent: "space-between"
                }}>

                    <Icon name={"account-balance-wallet"} color={colors.primary} size={40}/>
                    <View>
                        <Text style={{color: "#A490E0", fontSize: 18}}>Balance</Text>
                        <Text style={{color: "#242134", fontSize: 20}}>Rs. 650</Text>
                    </View>
                    <Icon name={"av-timer"} color={colors.primary} size={40}/>
                    <View>
                        <Text style={{color: "#A490E0", fontSize: 18}}>Minutes</Text>
                        <Text style={{color: "#242134", fontSize: 20}}>500 min</Text>
                    </View>
                    <Icon name={"keyboard-arrow-right"} reverse
                          reverseColor={"white"}
                          size={20}
                          color={colors.secondary}
                          iconStyle={{fontSize: 35}}/>
                </View>
            </View>
        </TouchableHighlight>
    );
};

export default TotalEarnings;
