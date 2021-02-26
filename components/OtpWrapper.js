import { gql, useMutation } from "@apollo/client";
import {
    CodeField,
    Cursor,
    useBlurOnFulfill,
    useClearByFocusCell,
} from 'react-native-confirmation-code-field';
import { ThemeContext } from "../context/theme";
import React, { useContext, useEffect, useState } from "react";
import { Avatar, Button, Input, Overlay, SocialIcon } from "react-native-elements";
import { StyleSheet, Text, TouchableHighlight, View, ScrollView, StatusBar, Alert, ToastAndroid } from "react-native";


const styles = StyleSheet.create({
    header: {
        marginTop: 15,
        marginBottom: 20,
        fontSize: 44,
        color: "#572CD8",
        textAlign: "center"
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
    otpContainer: {
        display: 'flex',
        alignItems: 'center',
    },
    otpWrapper: {
        marginBottom: 30,
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

const VERIFY_OTP = gql`
    mutation VERIFY_OTP($email:String!, $otp:Int!){
        verifyOtp(email: $email, otp:$otp){
            user{
                id
                name
                email
            }
        }
    }
`;

const RESEND_OTP = gql`
    mutation RESENDOTP($email: String!) {
        generateNewOtp(email: $email) {
            user {
                email
            }
        }
    }
`;

const OTPWrapper = ({ navigation, route: { params: { email } }, setActiveTab }) => {
    let { colors } = useContext(ThemeContext);
    const [reset, { data, loading, error }] = useMutation(VERIFY_OTP);

    const [value, setValue] = useState('');
    const ref = useBlurOnFulfill({ value, cellCount: 4 });
    const [props, getCellOnLayoutHandler] = useClearByFocusCell({ value, setValue });

    const [resendOtp] = useMutation(RESEND_OTP);

    return (
        <View style={styles.otpContainer}>
            <Text style={styles.header}>Enter OTP</Text>
            <Text>Otp successfully sent to {email}</Text>

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


            <Button title={"Continue"} buttonStyle={styles.continueBtn}
                titleStyle={{ color: "white", textTransform: "uppercase" }}
                loading={loading}
                onPress={() => {
                    reset({ variables: { email: email?.toLowerCase(), otp: value } })
                        .then(({ data }) => {
                            Alert.alert('Success', 'Our team will contact you soon');
                            navigation.navigate("AuthenticationWrapper", { screen: "login" });
                            console.log(data);
                        })
                        .catch(e => {
                            console.log(e);
                            Alert.alert('Attention', e?.message)
                        })
                }} />
            <TouchableHighlight onPress={() => {
                resendOtp({ variables: { email: email?.toLowerCase() } })
                    .then(({ data }) => {
                        Alert.alert('Otp send', `Otp sent to ${email} sucessfully`);
                        console.log(data);
                    })
            }}
                underlayColor={{ color: colors.secondary }}
                style={{ marginTop: 25 }}>
                <Text style={{ color: colors.secondary, fontSize: 18 }}>Resend OTP</Text>
            </TouchableHighlight>
        </View>
    );
};


export default OTPWrapper;