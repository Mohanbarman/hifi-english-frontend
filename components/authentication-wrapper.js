/*
 * @author Gaurav Kumar
 */

import React, {useContext, useEffect, useState} from "react";
import {Avatar, Button, Input, Overlay, SocialIcon} from "react-native-elements";
import {StyleSheet, Text, TouchableHighlight, View, ScrollView, StatusBar, Alert, ToastAndroid} from "react-native";
import UserAvatar from "../assets/images/useravatar.png";
// import RNPickerSelect from 'react-native-picker-select';
import {AuthContext} from "../context/auth";
import {ThemeContext} from "../context/theme";
import {gql, useMutation} from "@apollo/client";
import AsyncStorage from '@react-native-community/async-storage';
import DropDownPicker from 'react-native-dropdown-picker';
// import * as Facebook from 'expo-facebook';
// import * as Google from 'expo-google-app-auth';
import ConnectyCube from "react-native-connectycube";
import OTPWrapper from './OtpWrapper';
import DateTimePicker from "@react-native-community/datetimepicker";


const styles = StyleSheet.create({
    authContainer: {
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
        marginTop: 15,
        marginBottom: 20,
        fontSize: 44,
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


const AuthenticationWrapper = (props) => {
    let {route} = props;
    const [activeTab, setActiveTab] = useState(route?.params?.screen === 'signup' ? 1 : 0);
    let {colors} = useContext(ThemeContext);

    useEffect(() => {
        console.log(route?.params?.screen === 'signup' ? 1 : 0);
        setActiveTab(route?.params?.screen === 'signup' ? 1 : 0)
    }, [route?.params?.screen]);

    return (
        <View style={styles.authContainer}>
            <View style={styles.btnContainer}>
                <Button title="Login" buttonStyle={activeTab === 0 ? styles.activeBtn : styles.inActiveBtn}
                        type="outline"
                        titleStyle={{
                            color: activeTab === 0 ? "white" : colors.primary,
                            fontSize: 15,
                            textTransform: "uppercase"
                        }}
                        onPress={() => setActiveTab(0)}/>
                <Button title="Sign Up" buttonStyle={activeTab === 1 ? styles.activeBtn : styles.inActiveBtn}
                        type="outline"
                        titleStyle={{
                            color: activeTab === 1 ? "white" : colors.primary,
                            textTransform: "uppercase",
                            fontSize: 15
                        }}
                        onPress={() => setActiveTab(1)}/>
            </View>
            <ScrollView showsVerticalScrollIndicator={false}>
                {activeTab === 0
                    ? <Login {...props} toggleTab={() => setActiveTab(1)}/>
                    : <SignUp {...props} toggleTab={() => setActiveTab(0)} setActiveTab={setActiveTab}/>}
            </ScrollView>
        </View>
    );
};

const REGISTER = gql`
    mutation REGISTER(
        $email:String!,
        $name:String!,
        $pass:String!,
        $gender:String,
        $level:String,
        $profession:String,
        $hobbies:String,
        $langKnown:String,
        $city:String,
        $state:String,
        $phone:String,
        $role:String,
        $preferredTime:String,
    ){
        signUp(
            email:$email,
            name:$name,
            password:$pass,
            gender:$gender,
            level:$level,
            profession:$profession,
            hobbies:$hobbies,
            languageKnown:$langKnown,
            city:$city,
            state:$state,
            phoneNumber:$phone,
            role:$role,
            preferredTime:$preferredTime,
        ){
            profile{
                id
                email
                name
                dateJoined
                lastLogin
                isAdmin
                isActive
                isStaff
                isSuperuser
                dob
                phone
                subscription{
                    id
                    title
                    discountPrice
                    days
                    sessions
                    minutes
                }
                role
            }
        }
    }
`;

const SignUp = (props) => {
    let {route, toggleTab, navigation, setActiveTab} = props;
    const [registered, setRegistered] = useState(false);
    const [gender, setGender] = useState("m");
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [level, setLevel] = useState("beginner");
    const [profession, setProfession] = useState("");
    const [hobbies, setHobbies] = useState("");
    const [langKnown, setLangKnown] = useState("");
    const [city, setCity] = useState("");
    const [state, setState] = useState("");
    const [pass, setPass] = useState("");
    const [cnfPass, setCnfPass] = useState("");
    const {colors} = useContext(ThemeContext);
    const [dob, setDob] = useState(undefined);
    const [showDOB, setShowDOB] = useState(false);
    const [register, {data, error, loading}] = useMutation(REGISTER);

    const [preferredTime, setPreferredTime] = useState(null);

    const registerUser = () => {
        register({
            variables: {
                name,
                email: email?.toLowerCase(),
                phone,
                gender,
                level,
                profession,
                hobbies,
                langKnown,
                city,
                state,
                pass,
                role: route?.params?.role,
                dob: `${dob?.getFullYear()}-${dob?.getMonth() + 1}-${dob?.getDate()}`,
                preferredTime,
            }
        })
            .then(({data}) => {
                console.log(data);
                setRegistered(true);
                navigation.navigate('OtpWrapper', {email});
            })
            .catch(e => {
                console.log(email);
                console.log(e);
                Alert.alert('Attention', e?.message);
            })
        // toggleTab();
    };

    return (
        <View style={styles.container}>
            <Text style={styles.header}>Sign Up</Text>
            <Input inputContainerStyle={styles.input} placeholder={"Your name"} value={name}
                   errorMessage={name?.length > 0 ? "" : "Name shouldn't be empty"}
                   onChangeText={value => setName(value)}/>
            <Input
                inputContainerStyle={styles.input}
                placeholder={"DOB (DD/MM/YYYY)"}
                value={dob ? `${dob?.getDate()}/${dob?.getMonth() + 1}/${dob?.getFullYear()}` : undefined}
                errorMessage={!dob ? 'Date of birth is required' : ''}
                rightIcon={{
                    name: "event",
                    onPress: () => {
                        setShowDOB(true);
                    }
                }}/>
            {showDOB && <DateTimePicker
                testID="dateTimePicker"
                value={dob ? dob : new Date()}
                mode={"date"}
                is24Hour={false}
                display="default"
                maximumDate={Date.now()}
                onChange={(e, date) => {
                    if (date) setDob(date)
                    setShowDOB(false)
                }}
            />}
            <Input inputContainerStyle={styles.input} placeholder={"Phone Number"} value={phone}
                   keyboardType='numeric'
                   maxLength={10}
                   onChangeText={value => setPhone(value)}/>
            <View style={styles.genderContainer}>
                <Button title="Male" buttonStyle={gender === 'm' ? styles.activeBtn : styles.inActiveBtn}
                        type="outline"
                        titleStyle={{
                            color: gender === 'm' ? "white" : colors.primary,
                            textTransform: "uppercase",
                            fontSize: 12
                        }}
                        onPress={() => setGender('m')}/>
                <Button title="Female" buttonStyle={gender === 'f' ? styles.activeBtn : styles.inActiveBtn}
                        type="outline"
                        titleStyle={{
                            color: gender === 'f' ? "white" : colors.primary,
                            textTransform: "uppercase",
                            fontSize: 12
                        }}
                        onPress={() => setGender('f')}/>
                <Button title="Other" buttonStyle={gender === 'o' ? styles.activeBtn : styles.inActiveBtn}
                        type="outline"
                        titleStyle={{
                            color: gender === 'o' ? "white" : colors.primary,
                            textTransform: "uppercase",
                            fontSize: 12
                        }}
                        onPress={() => setGender('o')}/>
            </View>
            <Input inputContainerStyle={[styles.input, {marginTop: 20}]} placeholder={"Profession"} value={profession}
                   onChangeText={value => setProfession(value)}/>
            <Input inputContainerStyle={styles.input} placeholder={"Hobbies"} value={hobbies}
                   onChangeText={value => setHobbies(value)}/>

            <DropDownPicker
                placeholder="Preferred time"
                placeholderStyle={{fontSize: 17}}
                style={{
                    borderWidth: 1,
                    borderColor: "#707070",
                    borderRadius: 40,
                }}
                containerStyle={{
                    height: 50,
                    marginHorizontal: 10,
                    marginBottom: 25,
                    alignSelf: 'stretch',
                }}
                items={[
                    {label: "9 AM - 12 PM", value: "9 AM - 12 PM"},
                    {label: "12 PM - 3 PM", value: "12 PM - 3 PM"},
                    {label: "3 PM - 6 PM", value: "3 PM - 6 PM"},
                    {label: "6 PM - 9 PM", value: "6 PM - 9 PM"},
                    {label: "9 PM - 11 PM", value: "9 PM - 11 PM"},
                ]}
                labelStyle={{fontSize: 17}}
                dropDownStyle={{
                    backgroundColor: 'white',
                    textAlign: 'left',
                }}
                defaultValue={null}
                onChangeItem={item => setPreferredTime(item.value)}
            />

            {route?.params?.role === 'teacher' ?
                <Input inputContainerStyle={[styles.input]} placeholder={"Proficient language known"}
                       value={langKnown}
                       onChangeText={value => setLangKnown(value)}/>
                :
                <DropDownPicker
                    placeholder="English Level"
                    style={{
                        borderWidth: 1,
                        borderColor: "#707070",
                        borderRadius: 40,
                    }}
                    containerStyle={{
                        height: 50,
                        marginHorizontal: 10,
                        marginBottom: 25,
                        alignSelf: 'stretch',
                        // borderWidth: 1,
                        // paddingLeft: 10,
                        // paddingRight: 10,
                        // borderColor: "#707070",

                    }}
                    items={[
                        {label: "Beginner", value: "beginner"},
                        {label: "Intermediate", value: "intermediate"},
                        {label: "Advanced", value: "advanced"},
                    ]}
                    dropDownStyle={{
                        backgroundColor: 'white',
                        textAlign: 'left',
                    }}
                    defaultValue="beginner"
                    onChangeItem={item => setLevel(item.value)}
                    labelStyle={{fontSize: 17}}
                />
                // <RNPickerSelect
                //     placeholder={{ label: 'Select your English Level' }}
                //     style={{
                //         viewContainer: {
                //             ...styles.input,
                //             marginBottom: 20,
                //             marginLeft: 10,
                //             marginRight: 10,
                //             paddingLeft: 0,
                //         },
                //         placeholder: {
                //             color: "#0000004F"
                //         }
                //     }}
                //     value={level}
                //     onValueChange={(value) => {
                //         setLevel(value);
                //         console.log(value);
                //     }}
                //     items={[
                //         { label: "Beginner", value: "beginner" },
                //         { label: "Intermediate", value: "intermediate" },
                //         { label: "Advanced", value: "advanced" }
                //     ]} />

            }
            <Input inputContainerStyle={styles.input} placeholder={"Email"} value={email}
                   errorMessage={email?.length > 0 ? "" : "Email shouldn't be empty"}
                   onChangeText={value => setEmail(value)}/>
            <Input inputContainerStyle={styles.input} placeholder={"Password"} value={pass} secureTextEntry={true}
                   errorMessage={pass?.length > 0 ? "" : "Password shouldn't be empty"}
                   onChangeText={value => setPass(value)}/>
            <Input inputContainerStyle={styles.input} placeholder={"Confirm Password"} value={cnfPass}
                   secureTextEntry={true}
                   errorMessage={pass === cnfPass ? "" : "Password doesn't match"}
                   onChangeText={value => setCnfPass(value)}/>
            <Input inputContainerStyle={styles.input} placeholder={"City"} value={city}
                   onChangeText={value => {
                       if (!/\d/.test(value) || value.length < 1) {
                           setCity(value);
                       }
                   }}/>
            <Input inputContainerStyle={styles.input} placeholder={"State"} value={state}
                   onChange={v => console.log(v)}
                   onChangeText={value => {
                       if (!/\d/.test(value) || value.length < 1) {
                           setState(value);
                       }
                   }}/>

            <Button title={"SignUp"} buttonStyle={styles.activeBtn} containerStyle={{width: 300}}
                    titleStyle={{textTransform: "uppercase"}}
                    onPress={registerUser}
                    loading={loading}
                    disabled={
                        email?.length <= 0
                        || pass?.length <= 0
                        || name?.length <= 0
                        || pass !== cnfPass
                        || !dob
                    }/>
        </View>
    );
};


const LOGIN = gql`
    mutation LOGIN($email:String!, $password:String!){
        login(email:$email, password:$password){
            payload
            token
            refreshExpiresIn
            user{
                id
                email
                gender
                city
                dateJoined
                dob
                hobbies
                isActive
                isAdmin
                isStaff
                isSuperuser
                languageKnown
                lastLogin
                level
                name
                phone
                profession
                role
                state
                online
                numberOfSessions
                webrtcId
                webrtcPassword
                validityDate
                profileImageUrl
                preferredTime
                accountNumber
                ifscCode
                upiId
                callDuration
                subscription{
                    id
                    days
                    title
                    minutes
                    sessions
                    discountPrice
                    price
                }
            }
        }
    }
`;
const Login = (props) => {
    let {navigation} = props;
    let {login, setAuthenticated, setProfile, setConnectycubeConnected} = useContext(AuthContext);
    let {colors} = useContext(ThemeContext);
    const [username, setUsername] = useState("");
    const [pass, setPass] = useState("");
    const [auth, {data, loading, error}] = useMutation(LOGIN);
    const submitForm = () => {
        if (username?.length > 0 && pass?.length > 0) {
            auth({
                variables: {
                    email: username?.toLowerCase(),
                    password: pass,
                }
            })
                .then(({data}) => {
                    AsyncStorage.setItem("exp", JSON.stringify(data?.login?.payload?.exp * 1000))
                        .then(exp => {
                            AsyncStorage.setItem("profile", JSON.stringify(data?.login?.user))
                                .then(() => {
                                    setProfile(data?.login?.user);
                                    setAuthenticated(true);

                                    ToastAndroid.show('Connecting to server', ToastAndroid.LONG);
                                    ConnectyCube.createSession({
                                        id: data?.login?.user?.webrtcId,
                                        password: data?.login?.user?.webrtcPassword
                                    })
                                        .then((r) => {
                                            ConnectyCube.chat.connect({
                                                userId: data?.login?.user?.webrtcId,
                                                password: data?.login?.user?.webrtcPassword,
                                            }).then((x) => {
                                                ToastAndroid.show('Connected to the server', ToastAndroid.LONG);
                                                setConnectycubeConnected(true);
                                            }).catch(e => {
                                                ToastAndroid.show(e?.message, ToastAndroid.LONG);
                                            });
                                        })
                                        .catch((e) => console.log('error e : ', e))

                                })
                            console.log(data?.login?.payload?.exp * 1000 - new Date().getTime())
                            setTimeout(() => {
                                AsyncStorage.removeItem("exp");
                                AsyncStorage.removeItem("profile");
                                setAuthenticated(false);
                                setProfile(undefined);
                                Alert.alert("Your session expired");
                            }, data?.login?.payload?.exp * 1000 - new Date().getTime())
                        })
                        .catch(e => Alert.alert(e?.message))
                })
                .catch(e => {
                    Alert.alert('Attention', e?.message);
                    console.log(e);
                })
        } else {

        }
    };
    return (
        <View style={styles.container}>
            <Text style={styles.header}>Login</Text>
            <Input placeholder="Email" inputContainerStyle={styles.input} value={username} keyboardType="email-address"
                   onChangeText={value => setUsername(value)}/>
            <Input placeholder="Password" inputContainerStyle={styles.input} value={pass}
                   onChangeText={value => setPass(value)} secureTextEntry={true}/>
            <View style={{alignItems: "flex-end", width: "100%"}}>
                <TouchableHighlight onPress={() => navigation.navigate("ResetPassword")}
                                    underlayColor={{color: colors.secondary}}>
                    <Text style={styles.forgotPass}>Forgot password?</Text>
                </TouchableHighlight>
            </View>
            <Button title={"CONTINUE"} buttonStyle={styles.continueBtn} onPress={submitForm}
                    loading={loading}
                    disabled={username?.length <= 0 && pass?.length <= 0}/>
        </View>
    );
};

export default AuthenticationWrapper;
