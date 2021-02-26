/*
 * @author Gaurav Kumar
 */

import React, { useContext, useEffect, useState } from "react";
import { ThemeContext } from "../../context/theme";
import { Alert, ScrollView, StyleSheet, Text, ToastAndroid, View } from "react-native";
import { Avatar, Button, Header, Input } from "react-native-elements";
import { gql, useMutation } from '@apollo/client';
import { AuthContext } from "../../context/auth";


const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: 'transparent',
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
    marginBottom: 10,
    fontSize: 24,
    color: "white",
    textAlign: "left",
    width: "100%"
  },
  input: {
    borderWidth: 1,
    borderRadius: 12,
    paddingLeft: 10,
    paddingRight: 10,
    marginLeft: -11,
    borderColor: "#707070",
    backgroundColor: "white"
  },
  subHeader: {
    color: "rgba(255,255,255,0.68)",
    fontSize: 14,
    width: "100%",
    marginBottom: 20
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
  }
});


const CHANGE_PASSWORD = gql`
    mutation CHANGE_PASSWORD($oldPassword:String!, $newPassword:String!) {
        changePassword(oldPassword: $oldPassword, newPassword: $newPassword) {
            user {
                email
            }
        }
    }
`


const ChangePass = (props) => {
  let { navigation } = props;
  let { colors } = useContext(ThemeContext);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [changePassword] = useMutation(CHANGE_PASSWORD);
  const { videoScreen } = useContext(AuthContext);

  const resetPass = () => {
    if (oldPassword.length < 1) {
      Alert.alert('Error', 'Please fill old password')
      return 0;
    }
    if (newPassword.length < 1) {
      Alert.alert('Error', 'Please fill new Password');
      return 0;
    }
    if (newPassword === oldPassword) {
      Alert.alert('Error', 'Old password is same as new password');
      return 0;
    }

    setLoading(true);
    changePassword({ variables: { oldPassword: oldPassword.trim(), newPassword: newPassword.trim() } })
      .then(r => {
        ToastAndroid.show('Password successfully changed', ToastAndroid.LONG);
      })
      .catch(e => {
        ToastAndroid.show(e?.message, ToastAndroid.LONG);
      }).finally(() => {
        setLoading(false);
        setOldPassword('');
        setNewPassword('');
      })
  };
  useEffect(() => {
    if (videoScreen) {
      navigation.navigate("Call");
    }
  }, [videoScreen])
  return (
    <ScrollView style={{ backgroundColor: colors.primary }}>
      <View style={styles.container}>
        {/*<SafeAreaView/>*/}
        <Header
          leftComponent={{ icon: 'navigate-before', color: 'white', onPress: () => navigation.goBack() }}
          backgroundColor={"transparent"}
          containerStyle={{ borderBottomWidth: 0, paddingLeft: 0, paddingRight: 0 }}
        />
        <Text style={styles.header}>Change Password</Text>
        <Text style={styles.subHeader}>To change your password enter current and new password</Text>
        <Input inputContainerStyle={styles.input} placeholder={"Old Password"} secureTextEntry={true}
          value={oldPassword} onChangeText={setOldPassword} />
        <Input inputContainerStyle={styles.input} placeholder={"New Password"} secureTextEntry={true}
          value={newPassword} onChangeText={setNewPassword} />
        <Button title={"Confirm"}
          loading={loading}
          buttonStyle={[styles.activeBtn, {
            backgroundColor: colors.secondary,
            borderColor: colors.secondary
          }]}
          containerStyle={{ width: 200 }}
          titleStyle={{ textTransform: "uppercase" }}
          onPress={resetPass} />
      </View>
    </ScrollView>
  );

};

export default ChangePass;
