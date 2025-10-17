import React, { useEffect } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    Image
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { GoogleSignin, statusCodes } from '@react-native-google-signin/google-signin';
import { useNavigation } from '@react-navigation/native';

type Props = {
    navigation: NativeStackNavigationProp<any>;
}

const SignUpScreen: React.FC<Props> = ({ navigation }) => {
    const navigate = useNavigation();

    const handleGoogleSignIn = async () => {
        try {
            await GoogleSignin.hasPlayServices();
            const userInfo = await GoogleSignin.signIn();
            console.log("Google User Info", userInfo);
            navigate.navigate('MainScreen');
        } catch (err: any) {
            if (err.code == statusCodes.SIGN_IN_CANCELLED) {
                console.log("User Cancelled the login flow")
            } else if (err.code == statusCodes.IN_PROGRESS) {
                console.log("Sign is in already progress")
            } else if (err.code == statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
                console.log("Play services not available or outdated");
            } else {
                console.log("Some other error:", err)
            }
        }
    }

    useEffect(() => {
        GoogleSignin.configure({
            webClientId: '517862917117-1mmne6ckir35ck4ps2tfoeul5b8duu06.apps.googleusercontent.com',
            offlineAccess: false
        })
    })

    return (
        <View style={styles.container}>
            {/* Back Button */}
            <TouchableOpacity
                style={styles.backButton}
                onPress={() => navigation.goBack()}
            >
                <Ionicons name="arrow-back" size={24} color="#000" />
            </TouchableOpacity>

            {/* Title */}
            <Text style={styles.title}>Sign Up</Text>

            {/* Welcome Text */}
            <Text style={styles.welcomeText}>
                Welcome! Manage, Track and Grow your Gym with WellVantage.
            </Text>

            {/* Google Sign In Button */}
            <TouchableOpacity
                style={styles.googleButton}
                onPress={handleGoogleSignIn}
                activeOpacity={0.8}
            >
                <Ionicons name="logo-google" size={20} color="#DB4437" style={{ marginRight: 10 }} />
                <Text style={styles.googleText}>Continue with Google</Text>
            </TouchableOpacity>
        </View>
    )
}

export default SignUpScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
        paddingHorizontal: 24,
        justifyContent: 'center',
        alignItems: 'center'
    },
    backButton: {
        position: 'absolute',
        top: 50,
        left: 20
    },
    title: {
        fontSize: 25,
        fontWeight: '600',
        marginTop: -330,
        marginBottom: 20,
        color: "#222",
        textAlign: 'center',
        lineHeight: 35
    },
    welcomeText: {
        fontSize: 25,
        fontWeight: '600',
        textAlign: 'center',
        color: '#333',
        lineHeight: 35,
        marginBottom: 50,
        marginTop: 100,
        paddingHorizontal: 10
    },
    googleButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#fff',
        width: 300,
        height: 45,
        borderRadius: 8,
        borderWidth: 0.5,
        borderColor: '#D9D9D9',
        borderStyle: 'solid',
        paddingVertical: 12,
        paddingHorizontal: 40,
        marginBottom: 20,

        // Shadow for iOS
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 2,

        // Shadow for Android
        elevation: 3,
    },
    googleText: {
        fontSize: 15,
        color: '#000',
        fontWeight: '500',
        lineHeight: 24,
    }
})