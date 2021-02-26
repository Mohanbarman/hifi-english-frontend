/*
 * @author Gaurav Kumar
 */

import React, {useContext, useState} from "react";
import {View, Text, StyleSheet, ImageBackground, StatusBar, Modal} from "react-native";
import {DefaultTheme, NavigationContainer} from "@react-navigation/native";
import {createDrawerNavigator} from "@react-navigation/drawer";
import {AuthContext} from "../context/auth";
import FrontScreen from "../assets/images/frontscreen.png";
import {Button, Overlay} from "react-native-elements";
import {createStackNavigator} from "@react-navigation/stack";
import AuthenticationWrapper from "./authentication-wrapper";
import ResetPassword from "./reset-pass";
import OnBoarding from "./on-boarding";
import Student from "./profile/student";
import Teacher from "./profile/teacher";
import Plan from "./plans/plan";
import PlanList from "./plans/plan-list";
import Wallet from "./profile/wallet";
import HifiDrawerContent from "./HifiDrawerContent";
import {ThemeContext} from "../context/theme";
import EditProfile from "./profile/edit-profile";
import ChangePass from "./profile/change-pass";
import UploadDocument from "./upload_document";
import Call from "./Call";
// import VideoScreen from "./calling/src/components/VideoScreen";
import CallScreen from "./calling/CallScreen";
// import {AgoraContext} from "../context/AgoraContext";
import {NetworkContext} from "../context/networkProvider";
import InternetNotConnected from "./internet-not-connected";
import CallScreenRoute from "./calling/CallScreenRoute";
import OTPWrapper from "./OtpWrapper";
import ReviewModal from "./profile/reviewModal";
import ContactUs from "./profile/contactUs";


const Drawer = createDrawerNavigator();
const Stack = createStackNavigator();

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: "column",
        alignItems: "flex-start",
    },
    backgroundImage: {
        flex: 1,
        resizeMode: "cover",
        justifyContent: "flex-start",
        padding: 20,
    },
    appName: {
        marginTop: 45,
        fontSize: 46,
        color: "white",
        textAlign: "center"
    },
    appDescription: {
        marginTop: 15,
        color: "#E1DDF5",
        textAlign: "center",
        fontSize: 14,
        paddingLeft: 25,
        paddingRight: 25
    },
    buttonContainer: {
        flex: 1,
        justifyContent: "flex-end",
        alignItems: "center"
    },
    loginBtn: {
        fontSize: 22,
        fontWeight: "500",
        borderRadius: 28,
        paddingLeft: 20,
        paddingRight: 20,
        paddingTop: 15,
        paddingBottom: 15,
        backgroundColor: "#FF7D3B"
    },
    signUp: {
        fontSize: 22,
        fontWeight: "500",
        borderRadius: 28,
        paddingLeft: 20,
        paddingRight: 20,
        paddingTop: 15,
        paddingBottom: 15,
        backgroundColor: "white"
    },
    footer: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        marginTop: 10
    }
});

const Home = (props) => {
    const {
        isAuthenticated,
        profile,
        isReviewModalVisible,
        setIsReviewModalVisible,
        setRemoteUserId
    } = useContext(AuthContext);
    let {colors} = useContext(ThemeContext);
    const {isInternetConnected} = useContext(NetworkContext);

    return (
        <>
            {!isInternetConnected && <InternetNotConnected/>}

            {isInternetConnected &&
            <View style={{flex: 1}}>
                <StatusBar
                    backgroundColor={colors.primary}
                    barStyle="light-content"
                />
                <Overlay
                    overlayStyle={{backgroundColor: 'transparent', padding: 0, margin: 0, borderRadius: 20}}
                    isVisible={isReviewModalVisible}
                    onBackdropPress={() => {
                        setIsReviewModalVisible(p => !p);
                        setRemoteUserId(undefined);
                    }}>
                    <ReviewModal/>
                </Overlay>
                <NavigationContainer>
                    {/*<Overlay isVisible={videoScreen} fullScreen={true} overlayStyle={{padding: 0}}>*/}
                    {/*    <CallScreenRoute/>*/}
                    {/*</Overlay>*/}
                    {isAuthenticated === true &&
                    <>
                        <Drawer.Navigator initialRouteName={"Profile"}
                                          drawerContent={props => <HifiDrawerContent {...props} />}
                                          drawerStyle={{backgroundColor: colors.primary, width: "90%"}}>
                            <Drawer.Screen
                                name="Profile"
                                component={profile?.role?.toLowerCase() === 'student' ? Student : Teacher}/>
                            <Drawer.Screen name="EditProfile" component={EditProfile}/>
                            <Drawer.Screen name="ChangePassword" component={ChangePass}/>
                            <Drawer.Screen name="Subscriptions" component={PlanList}/>
                            <Drawer.Screen name="Plan" component={Plan}/>
                            {/*<Drawer.Screen name="Teacher" component={Teacher}/>*/}
                            <Drawer.Screen name="Wallet" component={Wallet}/>
                            <Drawer.Screen name="OnBoarding" component={OnBoarding}/>
                            <Drawer.Screen name="UploadDocument" component={UploadDocument}/>
                            <Drawer.Screen name="Call" component={CallScreenRoute}/>
                            <Drawer.Screen name="ContactUs" component={ContactUs}/>
                        </Drawer.Navigator>
                    </>
                    }
                    {isAuthenticated === false &&
                    <Stack.Navigator initialRouteName={"Home"} headerMode={"none"}>
                        <Stack.Screen name={"Home"} component={Screen}/>
                        <Stack.Screen name={"AuthenticationWrapper"} component={AuthenticationWrapper}/>
                        <Stack.Screen name={"ResetPassword"} component={ResetPassword}/>
                        <Stack.Screen name={"OtpWrapper"} component={OTPWrapper}/>
                    </Stack.Navigator>
                    }
                </NavigationContainer>
            </View>
            }
        </>
    )
};

const Screen = (props) => {
        let {isAuthenticated} = useContext(AuthContext);
        const {navigation} = props;
        return (
            <View style={styles.container}>
                <ImageBackground source={FrontScreen} style={styles.backgroundImage}>
                    <Text style={styles.appName}>HiFi English</Text>
                    <Text style={styles.appDescription}>Learn English from experts straightaway from the convenience of
                        your Home</Text>
                    <View style={styles.buttonContainer}>
                        <Button title={"LOGIN"} buttonStyle={styles.loginBtn}
                                containerStyle={{width: 200}}
                                titleStyle={{color: "white"}}
                                onPress={() => navigation.navigate("AuthenticationWrapper", {screen: "login"})}/>
                        <Button title={"SIGN UP"} buttonStyle={styles.signUp}
                                containerStyle={{marginTop: 20, width: 200}}
                                titleStyle={{color: "#572CD8"}}
                                type={"outline"}
                                onPress={() => navigation.navigate("AuthenticationWrapper", {
                                    screen: "signup",
                                    role: "student"
                                })}/>
                    </View>
                    <View style={styles.footer}>
                        <Text style={{fontSize: 15, color: "#FFFFFF"}}>Want to Teach English? </Text>
                        <Button title={"Apply as Tutor"} type={"clear"} titleStyle={{color: "#FF7D3B"}}
                                onPress={() => navigation.navigate("AuthenticationWrapper", {
                                    screen: "signup",
                                    role: "teacher"
                                })}/>
                    </View>
                </ImageBackground>
            </View>
        );
    }
;


export default Home;
