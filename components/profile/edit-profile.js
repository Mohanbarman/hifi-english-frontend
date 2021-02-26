/*
 * @author Gaurav Kumar
 */

import React, { useContext, useEffect, useState } from "react";
import { ThemeContext } from "../../context/theme";
import { StyleSheet, Text, View, SafeAreaView, ScrollView, Alert } from "react-native";
import { Avatar, Button, Header, Input } from "react-native-elements";
import UserAvatar from "../../assets/images/useravatar.png";
// import RNPickerSelect from "react-native-picker-select";
import DateTimePicker from '@react-native-community/datetimepicker';
import { AuthContext } from "../../context/auth";
import {launchImageLibrary} from 'react-native-image-picker';
import { gql, useMutation } from "@apollo/client";
import storage from '@react-native-firebase/storage';
import AsyncStorage from '@react-native-community/async-storage';
import DropDownPicker from "react-native-dropdown-picker";

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        backgroundColor: '#fff',
        justifyContent: 'flex-start',
        width: "100%",
        height: "100%",
        alignItems: "center",
        paddingBottom: 35,
        paddingRight: 35,
        paddingLeft: 35,
        paddingTop: 0,
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
        borderColor: "#707070"
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
        width: "100%",
        marginBottom: 20
    }
});

const UPDATE_PROFILE = gql`
    mutation UPDATEUSER(
        $name:String, 
        $gender:String, 
        $profession:String, 
        $level:String, 
        $languageKnown:String, 
        $hobbies:String, 
        $dob:String, 
        $city:String, 
        $phone:String, 
        $state:String, 
        $email:String, 
        $profileImageUrl:String,
        $accountNumber: String,
        $ifscCode: String,
        $upiId: String,
    ){
        updateUser(
            name: $name, 
            gender: $gender, 
            profession: $profession, 
            level: $level, 
            languageKnown: $languageKnown, 
            hobbies: $hobbies, 
            dob: $dob, 
            city: $city, 
            phoneNumber: $phone,
            state: $state, 
            email: $email, 
            profileImageUrl: $profileImageUrl
            accountNumber: $accountNumber,
            ifscCode: $ifscCode,
            upiId: $upiId,
        ){
            profile{
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
                accountNumber
                ifscCode
                upiId
                preferredTime
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


const EditProfile = (props) => {
    let { theme, navigation } = props;
    const [update, { data, error, loading }] = useMutation(UPDATE_PROFILE);
    const [isLoading, setIsLoading] = useState(false);
    let { profile, setProfile, videoScreen } = useContext(AuthContext);
    const [name, setName] = useState(profile?.name);
    const [email, setEmail] = useState(profile?.email);
    const [phone, setPhone] = useState(profile?.phone);
    const [gender, setGender] = useState(profile?.gender ? profile.gender : "M");
    const [level, setLevel] = useState(profile?.level ? profile?.level?.toLowerCase() : "beginner");
    const [profession, setProfession] = useState(profile?.profession);
    const [city, setCity] = useState("");
    const [state, setState] = useState("");
    const [dob, setDob] = useState(new Date());
    const [profileImageRemote, setProfileImageRemote] = useState(profile?.profileImageUrl);
    const [profileImageLocal, setProfileImageLocal] = useState();
    const [showDOB, setShowDOB] = useState(false);

    // Account details only used in teacher
    const [accountNumber, setAccountNumber] = useState(profile?.accountNumber);
    const [ifscCode, setIfscCode] = useState(profile?.ifscCode);
    const [upiId, setUpiId] = useState(profile?.upiId);

    const [imageMeta, setImageMeta] = useState({});
    let { colors } = useContext(ThemeContext);


    const submitForm = () => {
        setIsLoading(true);
        if (profileImageLocal) {
            uploadImage(imageMeta.uri, imageMeta.fileName)
                .then((url) => {
                    updateDetails(url);
                    setProfileImageRemote(url);
                })
                .catch(e => Alert.alert('Error', e));
        } else {
            updateDetails(profileImageRemote);
        }
    };


    const uploadImage = (uri, imageName) => new Promise(async (resolve, reject) => {
        const [fileExt] = imageName.split('.').slice(-1);
        const fileName = `${Date.now()}.${fileExt}`;
        let reference = storage().ref(fileName);
        let task = await reference.putFile(uri).catch(e => reject(e.message));

        let url = await storage().ref(task.metadata.name).getDownloadURL();
        resolve(url);
    })


    const updateDetails = (profileImage) => {
        update({ variables: { name, email, phone, gender: gender.toLowerCase(), level, profession, city, state, dob: `${dob?.getFullYear()}-${dob?.getMonth() + 1}-${dob?.getDate()}`, profileImageUrl: profileImage, accountNumber, ifscCode, upiId } })
            .then(({ data }) => {
                console.log(data?.updateUser?.profile, ' ? profile');
                setProfile(data?.updateUser?.profile);
                AsyncStorage.setItem('profile', JSON.stringify(data?.updateUser?.profile));
                Alert.alert("Profile updated successfully");
                setIsLoading(false);
                setProfileImageLocal(undefined);
            })
            .catch(e => {
                console.log(e);
                Alert.alert(e?.message);
            })
    }


    const pickImage = () => {
        let options = {
            title: 'Select Avatar',
            storageOptions: {
                skipBackup: true,
                path: 'images',
            }
        }
        launchImageLibrary(options, (response) => {

            console.log(response);

            if (response.uri) {
                setProfileImageLocal(response.uri);
                setImageMeta(response);
            }

            if (response.didCancel) {
                console.log('User cancelled image picker');
            } else if (response.errorCode) {
                console.log(response.errorCode);
            }
        });
    }

    useEffect(() => {
        if (videoScreen) {
            navigation.navigate("Call");
        }
    }, [videoScreen])

    return (
        <ScrollView>
            <View style={styles.container}>
                {/*<SafeAreaView/>*/}
                <Header
                    leftComponent={{ icon: 'navigate-before', color: '#707070', onPress: () => navigation.goBack() }}
                    backgroundColor={"transparent"}
                    containerStyle={{ borderBottomWidth: 0, paddingLeft: 0, paddingRight: 0 }}
                />
                <Text style={styles.header}>Edit Profile</Text>
                <Avatar rounded
                    size={"xlarge"}
                    source={{ uri: profileImageLocal ?? profileImageRemote }}
                    containerStyle={{ marginBottom: 35 }}
                    onPress={pickImage}
                />
                <Input inputContainerStyle={styles.input} placeholder={"Your name"} value={name} disabled={true} />
                <Input inputContainerStyle={styles.input} placeholder={"Email"} value={email} disabled={true} />
                <Input inputContainerStyle={styles.input} placeholder={"Phone Number"} value={phone}
                    keyboardType='numeric'
                    maxLength={10}
                    onChangeText={value => setPhone(value)} />
                <Input inputContainerStyle={styles.input} placeholder={"DOB (DD/MM/YYYY)"}
                    value={`${dob?.getDate()}/${dob?.getMonth() + 1}/${dob?.getFullYear()}`}
                    onKeyPress={() => setShowDOB(true)}
                    rightIcon={{
                        name: "event",
                        onPress: () => setShowDOB(true)
                    }} />
                {showDOB && <DateTimePicker
                    testID="dateTimePicker"
                    value={dob}
                    mode={"date"}
                    is24Hour={false}
                    display="default"
                    maximumDate={Date.now()}
                    onChange={(e, date) => {
                        if (date)
                            setDob(date)
                        setShowDOB(false)
                    }}
                />}
                <View style={styles.genderContainer}>
                    <Button title="Male" buttonStyle={gender === 'M' ? styles.activeBtn : styles.inActiveBtn}
                        type="outline"
                        titleStyle={{
                            color: gender === 'M' ? "white" : colors.primary,
                            textTransform: "uppercase",
                            fontSize: 12
                        }} />
                    <Button title="Female" buttonStyle={gender === 'F' ? styles.activeBtn : styles.inActiveBtn}
                        type="outline"
                        titleStyle={{
                            color: gender === 'F' ? "white" : colors.primary,
                            textTransform: "uppercase",
                            fontSize: 12
                        }} />
                    <Button title="Other" buttonStyle={gender === 'O' ? styles.activeBtn : styles.inActiveBtn}
                        type="outline"
                        titleStyle={{
                            color: gender === 'O' ? "white" : colors.primary,
                            textTransform: "uppercase",
                            fontSize: 12
                        }} />
                </View>
                {profile?.role?.toLowerCase() === 'student' && profile?.preferredTime !== null && (
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
                            {label: profile?.preferredTime, value: profile?.preferredTime}
                        ]}
                        labelStyle={{fontSize: 17}}
                        dropDownStyle={{
                            backgroundColor: 'white',
                            textAlign: 'left',
                        }}
                        defaultValue={profile?.preferredTime}
                        disabled={true}
                        // onChangeItem={item => setPreferredTime(item.value)}
                    />

                )}
                {/* <RNPickerSelect
                    placeholder={{label: "Current English Level", value: level}}
                    style={{
                        viewContainer: {
                            ...styles.input,
                            marginTop: 20,
                            marginBottom: 20,
                            marginLeft: 10,
                            marginRight: 10,
                            paddingLeft: 0,
                        },
                        placeholder: {
                            color: "#0000004F"
                        }
                    }}
                    onValueChange={(value) => setLevel(value)}
                    items={[{label: "Beginner", value: "beginner"},
                        {label: "Intermediate", value: "intermediate"},
                        {label: "Advanced", value: "advanced"}]}/> */}
                <Input
                    inputContainerStyle={styles.input}
                    placeholder={"Profession"}
                    value={profession}
                    onChangeText={value => setProfession(value)} />
                <Input
                    inputContainerStyle={styles.input}
                    placeholder={"City"}
                    value={city}
                    onChangeText={value => {
                        if (!/\d/.test(value) || value.length < 1) {
                            setCity(value);
                        }
                    }} />
                <Input
                    inputContainerStyle={styles.input}
                    placeholder={"State"}
                    value={state}
                    onChangeText={value => {
                        if (!/\d/.test(value) || value.length < 1) {
                            setState(value);
                        }
                    }} />

                {profile?.role?.toLowerCase() === 'teacher' &&
                    <>
                        <Input inputContainerStyle={styles.input} placeholder={"Account number"} value={accountNumber}
                            onChangeText={value => setAccountNumber(value)} />
                        <Input inputContainerStyle={styles.input} placeholder={"IFSC code"} value={ifscCode}
                            onChangeText={value => setIfscCode(value)} />
                        <Input inputContainerStyle={styles.input} placeholder={"UPI Id"} value={upiId}
                            onChangeText={value => setUpiId(value)} />
                    </>
                }

                <Button title={"Submit"} buttonStyle={[styles.activeBtn, {
                    backgroundColor: colors.secondary,
                    borderColor: colors.secondary
                }]} containerStyle={{ width: 200 }}
                    loading={isLoading}
                    titleStyle={{ textTransform: "uppercase" }}
                    onPress={submitForm} />
            </View>
        </ScrollView>
    );
};

export default EditProfile;
