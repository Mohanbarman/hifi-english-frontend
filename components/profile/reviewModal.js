import React, {useState, useContext} from 'react';
import {View, Text, StyleSheet, ToastAndroid, TextInput} from "react-native";
import {Rating, Button} from 'react-native-elements';
import {ThemeContext} from "../../context/theme";
import {AuthContext} from "../../context/auth";
import {gql, useMutation} from "@apollo/client"


const SUBMIT_REVIEW = gql`
    mutation SUBMIT_REVIEW($toUserId:String!, $rating:String!, $comment:String) {
        submitReview(toUserId: $toUserId, rating: $rating, comment: $comment) {
            ok
        }
    }
`

const ReviewModal = () => {
    const [rating, setRating] = useState(3);
    const [comment, setComment] = useState('');
    const {profile, remoteUserId:toUserId, setRemoteUserId, setIsReviewModalVisible} = useContext(AuthContext);
    let {colors} = useContext(ThemeContext);
    const [submitReview, {loading:isLoading}] = useMutation(SUBMIT_REVIEW);

    const ratingHandler = (rating) => {
        setRating(rating);
    }

    const commentHandler = (value) => {
        setComment(value);
    }

    const handleSubmit = () => {
        console.log(rating, comment);
        submitReview({variables: {rating, comment, toUserId}})
            .then(r => {
                console.log(r)
                setRemoteUserId(undefined);
                setIsReviewModalVisible(false);
                ToastAndroid.show('Review sent', ToastAndroid.LONG);
            })
            .catch(console.log)
    }

    return (
        <View style={styles.container}>
            <Text style={styles.heading}>How was your call ?</Text>
            <View style={styles.separator}/>
            <View style={styles.ratingContainer}>
                <Text style={styles.ratingHeading}>
                    Rate your experience with the {profile?.role?.toLowerCase() === 'student' ? 'teacher' : 'student'}
                </Text>
                <Rating
                    showRating
                    type='star'
                    ratingCount={5}
                    imageSize={30}
                    onFinishRating={ratingHandler}
                    style={{paddingVertical: 30, borderWidth: 0}}
                    fractions={1}
                />

                <View style={styles.commentContainer}>
                    <TextInput
                        placeholder={'Comment'}
                        multiline={true}
                        numberOfLines={3}
                        onChangeText={commentHandler}
                        value={comment}
                        maxLength={150}
                        style={styles.textArea}
                    />
                </View>

                <Button
                    title={"Submit"}
                    buttonStyle={{backgroundColor: colors.secondary, ...styles.submit}}
                    containerStyle={{width: 300}}
                    loading={isLoading}
                    titleStyle={{textTransform: "uppercase"}}
                    onPress={handleSubmit}
                />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    submit: {
        marginTop: 30,
        marginBottom: 10,
        borderRadius: 30,
        padding: 15,
    },
    container: {
        padding: 20,
        paddingHorizontal: 30,
        borderRadius: 20,
        overflow: 'hidden',
        backgroundColor: 'white',
        display: 'flex',
        alignItems: 'center',
    },
    heading: {
        color: '#572bd8',
        fontSize: 25,
    },
    separator: {
        height: 1,
        width: 300,
        borderColor: '#f2f2f2',
        borderWidth: 1,
        marginVertical: 20,
    },
    ratingHeading: {
        fontSize: 17,
        color: '#48454e',
    },
    commentContainer: {
        padding: 10,
        paddingHorizontal: 15,
        width: 300,
        borderColor: '#f2f2f2',
        borderWidth: 2,
        borderRadius: 15,
    },
    textArea: {
        height: 90,
        fontSize: 14,
        color: '#333',
        justifyContent: 'flex-start',
        textAlignVertical: "top",
    },
    ratingContainer: {
        display: 'flex',
        alignItems: 'center',
    }
})


export default ReviewModal;