import React, { useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, Platform } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { GoogleAuthProvider, getAuth, signInWithCredential } from '@react-native-firebase/auth';
import { GoogleSignin, statusCodes } from '@react-native-google-signin/google-signin';

// Define navigation stack type
type RootStackParamList = {
    MainScreen: undefined;
    SignUpScreen: undefined;
    // Add other screens as needed
};

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const SignUpScreen = () => {
    const navigation = useNavigation<NavigationProp>();

    const handleGoogleSignIn = async () => {
        try {
            await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
            const userInfo = await GoogleSignin.signIn();
            const idToken = userInfo.data.idToken;

            if (!idToken) throw new Error('Google Sign-In failed: no idToken returned');

            const credential = GoogleAuthProvider.credential(idToken);
            const auth = getAuth();
            await signInWithCredential(auth, credential);
            console.log('Google Sign-In successful!');
            navigation.navigate('MainScreen');
        } catch (error: any) {
            let errorMessage = 'An error occurred during Google Sign-In';
            if (error.code) {
                switch (error.code) {
                    case statusCodes.SIGN_IN_CANCELLED:
                        errorMessage = 'Sign-in was cancelled';
                        break;
                    case statusCodes.IN_PROGRESS:
                        errorMessage = 'Sign-in is already in progress';
                        break;
                    case statusCodes.PLAY_SERVICES_NOT_AVAILABLE:
                        errorMessage = 'Google Play Services is not available';
                        break;
                    default:
                        errorMessage = error.message || errorMessage;
                }
            }
            Alert.alert('Google Sign-In Failed', errorMessage);
        }
    };

    useEffect(() => {
        GoogleSignin.configure({
            webClientId: process.env.GOOGLE_WEB_CLIENT_ID || '488934875185-9lu62fnjjdmocg0p37ue4jjhbf2q6t6n.apps.googleusercontent.com',
            offlineAccess: false,
        });
    }, []);

    return (
        <View style={styles.container}>
            {/* Back Button */}
            <TouchableOpacity
                style={styles.backButton}
                onPress={() => navigation.goBack()}
                accessibilityLabel="Go back"
                accessibilityRole="button"
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
                accessibilityLabel="Continue with Google"
                accessibilityRole="button"
            >
                <Ionicons name="logo-google" size={20} color="#DB4437" style={{ marginRight: 10 }} />
                <Text style={styles.googleText}>Continue with Google</Text>
            </TouchableOpacity>
        </View>
    );
};

export default SignUpScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        paddingHorizontal: 24,
        justifyContent: 'center',
        alignItems: 'center',
    },
    backButton: {
        position: 'absolute',
        top: 50,
        left: 20,
    },
    title: {
        fontSize: 25,
        fontWeight: '600',
        marginBottom: 20,
        color: '#222',
        textAlign: 'center',
        lineHeight: 35,
    },
    welcomeText: {
        fontSize: 25,
        fontWeight: '600',
        textAlign: 'center',
        color: '#333',
        lineHeight: 35,
        marginBottom: 50,
        paddingHorizontal: 10,
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
        ...Platform.select({
            ios: {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.2,
                shadowRadius: 2,
            },
            android: {
                elevation: 3,
            },
        }),
    },
    googleText: {
        fontSize: 15,
        color: '#000',
        fontWeight: '500',
        lineHeight: 24,
    },
});