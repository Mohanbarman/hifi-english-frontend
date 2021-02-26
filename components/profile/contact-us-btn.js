/*
 * @author Gaurav Kumar
 */

/*
 * @author Gaurav Kumar
 */

import React, { useContext, useState } from "react";
import { Button } from "react-native-elements";
import { Text, TouchableHighlight, View, StyleSheet, Linking } from "react-native";
import { ThemeContext } from "../../context/theme";

const styles = StyleSheet.create({
    totalEarningWrapper: {
        borderRadius: 45,
        borderColor: "#D8CEF780",
        borderWidth: 2,
        margin: 15,
        paddingTop: 10,
        paddingBottom: 15,
        paddingLeft: 20,
        paddingRight: 20,
        flex: 1,
        alignItems: "center",
        justifyContent: "space-between"
    },
    contactBtn: {
        fontSize: 22,
        fontWeight: "500",
        borderRadius: 28,
        paddingLeft: 20,
        paddingRight: 20,
        paddingTop: 15,
        paddingBottom: 15,
        backgroundColor: "#FF7D3B",
        textTransform: "uppercase",
        alignItems: "center"
    }
});

const ContactUsBtn = (props) => {
    let { theme, navigation } = props;
    const [ready, setReady] = useState(true);
    let { colors } = useContext(ThemeContext);

    return (
        <View>
            <TouchableHighlight>
                <View style={styles.totalEarningWrapper}>
                    <Text style={{ color: colors.primary, fontSize: 20, fontWeight: "bold", marginBottom: 15 }}>Have any queries?</Text>
                    <Button title={"Contact Us"} buttonStyle={styles.contactBtn}
                        onPress={() => {
                            navigation.navigate('ContactUs');
                        }}
                        titleStyle={{ color: "white", fontSize: 20, textTransform: "uppercase" }}
                        containerStyle={{ width: 250 }} />
                </View>
            </TouchableHighlight>
        </View>
    );
};

export default ContactUsBtn;
