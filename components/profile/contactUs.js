import React, {useState, useContext} from 'react';
import {ScrollView, View, StyleSheet, Text, ToastAndroid} from "react-native";
import {Button, Header, Input} from "react-native-elements";
import {TextInput} from "react-native";
import {ThemeContext} from "../../context/theme";
import {gql, useMutation} from "@apollo/client";
import Toast from "react-native-simple-toast";


const SUBMIT_FEEDBACK = gql`
    mutation SUBMIT_FEEDBACK($subject:String!, $message:String!) {
        submitFeedback(subject: $subject, message: $message) {
            ok
        }
    }
`

const ContactUs = ({navigation}) => {
    const {colors} = useContext(ThemeContext);
    const [subject, setSubject] = useState('');
    const [message, setMessage] = useState('');
    const [submitFeedback, {loading}] = useMutation(SUBMIT_FEEDBACK);

    const handleSubmit = async () => {
        try {
            await submitFeedback({variables: {subject, message}});
            ToastAndroid.show('Message sent', ToastAndroid.LONG);
            setSubject('');
            setMessage('');
        } catch (e) {
            ToastAndroid.show('Something went wrong', ToastAndroid.LONG);
        }
    }

    return (
        <View style={styles.container}>
            <Header
                leftComponent={{ icon: 'navigate-before', color: '#707070', onPress: () => navigation.goBack() }}
                backgroundColor={"transparent"}
                containerStyle={{ borderBottomWidth: 0, paddingLeft: 0, paddingRight: 0 }}
            />
            <Text style={styles.header}>Contact us</Text>
            <Input
                inputContainerStyle={styles.input}
                placeholder={"Subject*"}
                value={subject}
                onChangeText={(e) => setSubject(e)}
            />
            <View style={styles.messageContainer}>
                <TextInput
                    style={styles.messageInput}
                    inputContainerStyle={{borderColor: 'transparent'}}
                    placeholder={"Message*"}
                    value={message}
                    onChangeText={(e) => setMessage(e)}
                    multiline
                    maxLength={150}
                    numberOfLines={10}
                />
            </View>

            <Button
                title={"Submit"}
                buttonStyle={{backgroundColor: colors.secondary, ...styles.submit}}
                containerStyle={{width: 300}}
                loading={loading}
                titleStyle={{textTransform: "uppercase"}}
                onPress={handleSubmit}
                disabled={subject.length < 1 || message.length < 1}
            />

        </View>
    )
}

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
    header: {
        marginTop: 15,
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
        borderColor: "#707070"
    },
    messageContainer: {
        width: '95%',
        borderColor: "#707070",
        borderWidth: 1,
        borderRadius: 12,
        display: 'flex',
        padding: 20,
    },
    messageInput: {
        fontSize: 18,
        padding: 0,
        height: 200,
        borderWidth: 0,
        borderColor: 'transparent',
        justifyContent: 'flex-start',
        textAlignVertical: "top",
    },
    submit: {
        marginTop: 30,
        marginBottom: 10,
        borderRadius: 30,
        padding: 15,
    },
})

export default ContactUs;