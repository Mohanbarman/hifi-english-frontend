/*
 * @author Gaurav Kumar
 */

import React, { useContext, useState } from "react";
import { Input, Button } from "react-native-elements";
import { View, Text, StyleSheet, ScrollView, TouchableHighlight, Alert } from "react-native";
import { ThemeContext } from "../context/theme";
import { gql, useMutation } from "@apollo/client";
import { set } from "react-native-reanimated";
import {
    CodeField,
    Cursor,
    useBlurOnFulfill,
    useClearByFocusCell,
} from 'react-native-confirmation-code-field';


const styles = StyleSheet.create({
    resetContainer: {
        flex: 1,
        flexDirection: 'column',
        backgroundColor: '#fff',
        justifyContent: 'flex-start',
        width: "100%",
        height: "100%",
        paddingBottom: 20,
        paddingRight: 20,
        paddingLeft: 20,
        paddingTop: 20,
        alignItems: "center"
    },
    container: {
        display: "flex",
        flex: 1,
        flexDirection: 'column',
        backgroundColor: '#fff',
        justifyContent: 'flex-start',
        width: "100%",
        height: "100%",
        alignItems: "center"
    },
    btnContainer: {
        marginTop: 70,
        justifyContent: 'space-evenly',
        flexDirection: 'row',
        width: "100%"
    },
    activeBtn: {
        fontSize: 12,
        fontWeight: "500",
        borderRadius: 30,
        paddingLeft: 30,
        paddingRight: 30,
        paddingTop: 15,
        paddingBottom: 15,
        backgroundColor: "#572CD8",
        borderColor: "#572CD8",
        borderWidth: 2
    },
    inActiveBtn: {
        fontSize: 12,
        fontWeight: "500",
        borderRadius: 30,
        paddingLeft: 30,
        paddingRight: 30,
        paddingTop: 15,
        paddingBottom: 15,
        backgroundColor: "transparent",
        borderColor: "#572CD8",
        borderWidth: 2,
    },
    header: {
        marginTop: 95,
        marginBottom: 20,
        fontSize: 30,
        color: "#572CD8",
        textAlign: "center"
    },
    input: {
        borderWidth: 1,
        borderRadius: 12,
        paddingLeft: 10,
        paddingRight: 10,
        borderColor: "#707070",
    },
    otpInput: {
        width: 70,
        height: 50,
    },
    continueBtn: {
        fontSize: 22,
        fontWeight: "500",
        borderRadius: 28,
        paddingLeft: 20,
        paddingRight: 20,
        paddingTop: 15,
        paddingBottom: 15,
        backgroundColor: "#572CD8",
        width: 300,
        marginTop: 30
    },
    socialContainer: {
        flexDirection: "row"
    },
    forgotPass: {
        color: "#FF7D3B",
        marginBottom: 20
    },
    genderContainer: {
        justifyContent: 'space-evenly',
        flexDirection: 'row',
        width: "100%"
    },
    footerText: {
        fontSize: 15,
        color: "#707070",
        textAlign: "center",
        marginTop: "auto"
    },
    otpWrapper: {
        flexDirection: "row",
        justifyContent: "space-between",
        width: "80%",
        margin: 30,
    },

    cell: {
        width: 60,
        height: 60,
        lineHeight: 60,
        fontSize: 24,
        borderWidth: 2,
        borderColor: '#00000030',
        textAlign: 'center',
        marginBottom: 30,
        marginHorizontal: 10,
        borderRadius: 10,
    },
    focusCell: {
        borderColor: '#707070',
    },

});

const ResetPassword = (props) => {
    const [linkSent, setLinkSent] = useState(false);
    const [email, setEmail] = useState("");
    let { colors } = useContext(ThemeContext);
    return (
        <View style={styles.resetContainer}>
            {linkSent ?
                <OTPWrapper {...props} linkSent={setLinkSent} email={email} />
                :
                <ResetEmailGenerator linkSent={setLinkSent} email={email} setEmail={setEmail}{...props} />
            }
        </View>
    )
};

const OTPWrapper = ({ theme, navigation, linkSent, email }) => {
    const [otpVerified, setOtpVerified] = useState(false);
    let { colors } = useContext(ThemeContext);
    const [reset, { data, loading, error }] = useMutation(RESET_PASS);

    const [value, setValue] = useState('');
    const ref = useBlurOnFulfill({ value, cellCount: 4 });
    const [props, getCellOnLayoutHandler] = useClearByFocusCell({ value, setValue });

    const [password, setPassword] = useState('');
    if (otpVerified) {
        return <NewPassword />
    } else {
        return (
            <View style={styles.container}>
                <Text style={styles.header}>Enter OTP</Text>
                {/* <View style={styles.otpWrapper}> */}
                <Text style={{ fontSize: 15 }}>Otp successfully sent to {email}</Text>
                <CodeField
                    ref={ref}
                    {...props}
                    value={value}
                    onChangeText={setValue}
                    cellCount={4}
                    rootStyle={styles.otpWrapper}
                    keyboardType="number-pad"
                    textContentType="oneTimeCode"
                    renderCell={({ index, symbol, isFocused }) => (
                        <Text
                            key={index}
                            style={[styles.cell, isFocused && styles.focusCell]}
                            onLayout={getCellOnLayoutHandler(index)}>
                            {symbol || (isFocused ? <Cursor /> : null)}
                        </Text>
                    )}
                />

                {/* </View> */}
                <Text style={[styles.header, { marginTop: 10, marginBottom: 10 }]}>Enter Password</Text>
                <Input inputContainerStyle={styles.input} placeholder={"New Password"} value={password}
                    onChangeText={v => setPassword(v)} secureTextEntry={true} />
                <Button title={"Continue"} buttonStyle={styles.continueBtn}
                    titleStyle={{ color: "white", textTransform: "uppercase" }}
                    loading={loading}
                    onPress={() => {
                        reset({ variables: { email: email?.toLowerCase(), otp: value, password } })
                            .then(({ data }) => {
                                Alert.alert('Success', 'Your password changed successfully');
                                navigation.navigate("AuthenticationWrapper", { screen: "login" });
                                console.log(data);
                            })
                            .catch(e => {
                                console.log(e);
                                Alert.alert('Attention', e?.message)
                            })
                    }} />
                <TouchableHighlight onPress={() => linkSent(false)}
                    underlayColor={{ color: colors.secondary }}
                    style={{ marginTop: 25 }}>
                    <Text style={{ color: colors.secondary, fontSize: 18 }}>Resend OTP</Text>
                </TouchableHighlight>
            </View>
        );
    }
};

const NewPassword = (props) => {
    return (
        <View style={styles.container}>
            <Text style={styles.header}>Enter OTP</Text>
            <Input inputContainerStyle={styles.input} placeholder={"New Password"} />
            <Input inputContainerStyle={styles.input} placeholder={"Confirm Password"} />
            <Button title={"Confirm"} buttonStyle={styles.continueBtn}
                titleStyle={{ color: "white", textTransform: "capitalize" }}
            />
        </View>
    );
}

const RESET_PASS = gql`
    mutation RESET_PASS($email:String!, $password:String!, $otp:Int!){
        resetPassword(email: $email, password: $password, otp:$otp){
            user{
                city
                email
                id
            }
        }
    }
`;

const GENERATE_OTP = gql`
    mutation GENERATE_OTP($email:String!){
        generateNewOtp(email: $email){
            user{
                id
                email
            }
        }
    }
`;

const ResetEmailGenerator = ({ linkSent, email, setEmail }) => {
    const [reset, { data, loading, error }] = useMutation(GENERATE_OTP);
    // const [email, setEmail] = useState("");
    return (
        <View style={styles.container}>
            <Text style={styles.header}>Reset Password</Text>
            <Input inputContainerStyle={styles.input} placeholder={"Email"} onChangeText={v => setEmail(v)} />
            {/*<Input inputContainerStyle={styles.input} placeholder={"Phone no."}/>*/}
            <Button title={"Continue"} buttonStyle={styles.continueBtn}
                titleStyle={{ color: "white", textTransform: "uppercase" }}
                loading={loading}
                onPress={() => {
                    reset({ variables: { email: email?.toLowerCase() } })
                        .then(({ data }) => {
                            linkSent(true);
                            console.log(data);
                        })
                        .catch(e => {
                            console.log(e);
                            Alert.alert('Attention', e?.message)
                        })
                }} />
            <Text style={styles.footerText}>
                NOTE: We will send you a link with an option to reset your password
            </Text>
        </View>
    );
};

export default ResetPassword;