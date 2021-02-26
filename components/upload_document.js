import React, { useContext, useEffect, useState } from "react";
import { StyleSheet, Text, View, SafeAreaView, ScrollView, Alert } from "react-native";
import { Avatar, Button, Header, Input } from "react-native-elements";
import { AuthContext } from "../context/auth";
import { gql, useMutation, useQuery } from "@apollo/client";
import storage from '@react-native-firebase/storage';
import FilePickerManager from 'react-native-file-picker';
import ProgressDialog from 'react-native-progress-dialog';

/* ********* GRAPH-QL ********* */
const UPDATE_DOCUMENTS = gql`
    mutation UPDATE_USER($documents:JSONString) {
        updateUser(documents: $documents) {
            profile {
                documents
            }
        }
    }
`

const GET_DOCUMENTS = gql`
    query DOCUMENTS {
        viewer {
           documents 
        }
    }
`

export default function UploadDocument(props) {
    let { navigation } = props;
    const [selectedFile, setSelectedFile] = useState(undefined);
    const [progressVisible, setProgressVisible] = useState(false);
    const [progress, setProgress] = useState(0);

    const [update] = useMutation(UPDATE_DOCUMENTS);
    const { loading, error, data, refetch } = useQuery(GET_DOCUMENTS);
    const [documents, setDocuments] = useState(undefined);
    const { videoScreen } = useContext(AuthContext);
    useEffect(() => {
        console.log(data?.viewer?.documents, '::: docs');
        if (!loading && data?.viewer?.documents !== null) {
            setDocuments(JSON.parse(data?.viewer?.documents).documents);
        }
    }, [loading, data]);

    useEffect(() => {
        if (videoScreen) {
            navigation.navigate("Call");
        }
    }, [videoScreen])

    // Add download url of document
    const appendDocument = (url, filename) => {
        const fdata = data?.viewer?.documents;
        const dataJson = fdata ? JSON.parse(fdata) : { 'documents': [] };
        console.log(dataJson, ':: dataJson');

        const urlObj = { 'name': filename, 'url': url };
        dataJson.documents.push(urlObj);

        update({ variables: { documents: JSON.stringify(dataJson) } })
            .then(r => console.log(refetch()))
            .catch(e => Alert.alert('Error', e?.message));
    }

    const uploadFile = async () => {
        FilePickerManager.showFilePicker(null, (response) => {
            if (response.didCancel) {
                console.log('User cancelled file picker');
                return
            }
            else if (response.error) {
                console.log('FilePickerManager Error: ', response.error);
                return
            }

            const { fileName, path } = response;
            const upFileName = `${Date.now()}-${fileName}`;
            let reference = storage().ref(upFileName);
            let task = reference.putFile(path);

            setProgressVisible(true);

            // Update progress bar on state_changed
            task.on('state_changed', (snapshot) => {
                setProgress(Math.floor((snapshot.bytesTransferred / snapshot.totalBytes) * 100));
            })

            task.then(async (r) => {
                setProgressVisible(false);
                const url = await reference.getDownloadURL();
                appendDocument(url, r.metadata.name);
            }).catch((e) => {
                Alert.alert('Upload failed', e?.message);
            })

        });

    }

    return (
        <View style={styles.container}>
            <ProgressDialog visible={progressVisible} label={`${progress} % Uploaded..`} />
            <Header
                leftComponent={{ icon: 'navigate-before', color: '#707070', onPress: () => navigation.goBack() }}
                backgroundColor={"transparent"}
                containerStyle={{ borderBottomWidth: 0, paddingLeft: 0, paddingRight: 0 }}
            />

            <Text style={styles.header}>Upload Document</Text>

            <View style={styles.uploadContainer}>
                {documents ? documents.map((i, index) => <Text style={styles.fileNames} key={i.url}>{index + 1}. {i.name}</Text>) : <Text style={styles.noDocs}>No documents</Text>}
                <Button buttonStyle={styles.uploadButton} title="Upload document" onPress={uploadFile} />
            </View>

        </View>
    )
}

const styles = StyleSheet.create({
    noDocs: {
        fontSize: 20,
        color: 'black',
    },
    fileNames: {
        fontSize: 20,
        marginVertical: 5,
        color: 'black',
    },
    uploadedDocs: {
        fontSize: 25,
        fontWeight: '600',
        color: 'black',
        marginBottom: 10,
    },
    container: {
        height: '100%',
        paddingHorizontal: 30,
        display: 'flex',
        alignItems: 'center',
    },
    header: {
        marginTop: 15,
        marginBottom: 20,
        fontSize: 30,
        color: "#572CD8",
        textAlign: "center"
    },
    uploadButton: {
        fontSize: 22,
        fontWeight: "500",
        borderRadius: 28,
        paddingHorizontal: 30,
        paddingVertical: 15,
        backgroundColor: "#FF7D3B",
        textTransform: "uppercase",
        alignItems: "center",
        textAlign: 'center',
        alignSelf: 'center',
        marginHorizontal: 'auto',
        marginTop: 30,
    },
    uploadContainer: { // backgroundColor: 'blue',
        // display: 'flex',
        // alignItems: 'flex-start',
        // justifyContent: 'flex-end',
        marginTop: 60,
        width: '100%',
    },
    selectedFileText: {
        marginBottom: 40,
        fontSize: 20,
        color: '#262626',
    },
})