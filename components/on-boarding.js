/*
 * @author Gaurav Kumar
 */

import React, { useContext, useEffect, useState } from "react";
import { Button } from "react-native-elements";
import { View, Text, StyleSheet, ImageBackground } from "react-native";
import Screen0Image from "../assets/images/screen0.png";
import Screen1Image from "../assets/images/screen1.png";
import { ThemeContext } from "../context/theme";
import { useNavigation } from "@react-navigation/core";
import { AuthContext } from "../context/auth";

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        backgroundColor: '#fff',
        justifyContent: 'flex-start',
        width: "100%",
        height: "100%",
        alignItems: "center",
    },
    backgroundImage: {
        flex: 1,
        resizeMode: "cover",
        justifyContent: "flex-end",
    },
    textContainer: {
        width: "100%",
        paddingTop: 40,
        paddingLeft: 40,
        paddingRight: 40,
        borderTopLeftRadius: 45,
        borderTopRightRadius: 45,
        backgroundColor: "#572CD8"
    },
    title: {
        fontSize: 35,
        textAlign: "center",
        color: "white",
        marginBottom: 30
    },
    subTitle: {
        fontSize: 15,
        textAlign: "center",
        color: "#E1DDF5",
        marginBottom: 50
    },
    screenNavigation: {
        justifyContent: "space-between",
        flexDirection: "row",
        paddingBottom: 15
    }
});

const OnBoarding = (props) => {
    const [step, setStep] = useState(0);
    let navigation = useNavigation();
    const skipToEnd = () => {
        navigation.goBack();
    }
    let screens = {
        "0": <Screen0 {...props} next={() => setStep(prev => (prev + 1) % 2)} skip={skipToEnd} />,
        "1": <Screen1 {...props} next={() => setStep(prev => (prev + 1) % 2)} skip={skipToEnd} finish={() => {
            setStep(0);
            skipToEnd();
        }} />,
    };
    const { videoScreen } = useContext(AuthContext);
    useEffect(() => {
        if (videoScreen) {
            navigation.navigate("Call");
        }
    }, [videoScreen])
    return screens[step];
};

const Screen0 = ({ theme, next, skip }) => {
    let { colors } = useContext(ThemeContext);
    return (
        <View style={styles.container}>
            <ImageBackground source={Screen0Image} style={styles.backgroundImage}>
                <View style={styles.textContainer}>
                    <Text style={styles.title}>Overcome the English Barrier</Text>
                    <Text style={styles.subTitle}>Talk and practice English with experts straightaway from the
                        convenience of you home</Text>
                    <View style={styles.screenNavigation}>
                        <Button title={"Skip"} titleStyle={{ color: colors.secondary }} type={"clear"}
                            onPress={skip} />
                        <Button title={"Next"} titleStyle={{ color: "white" }} type={"clear"}
                            icon={{
                                name: "keyboard-arrow-right",
                                size: 30,
                                color: "white",
                                iconStyle: {
                                    backgroundColor: colors.secondary,
                                    borderRadius: 15
                                }
                            }}
                            iconRight={true}
                            onPress={next} />
                    </View>
                </View>
            </ImageBackground>
        </View>
    )
};

const Screen1 = ({ finish }) => {
    let { colors } = useContext(ThemeContext);
    return (
        <View style={styles.container}>
            <ImageBackground source={Screen1Image} style={styles.backgroundImage}>
                <View style={styles.textContainer}>
                    <Text style={styles.title}>Let experts help you</Text>
                    <Text
                        style={styles.subTitle}>{`No more hesitation to talk in English or of making mistakes while speaking.\n\nDevelop confidence exponentially and become the champ.`}</Text>
                    <View style={{ alignItems: "flex-end", paddingBottom: 15 }}>
                        <Button
                            title={"Finish"}
                            titleStyle={{ color: colors.secondary }}
                            type={"clear"}
                            onPress={finish} />
                    </View>
                </View>
            </ImageBackground>
        </View>
    )
};

export default OnBoarding;
