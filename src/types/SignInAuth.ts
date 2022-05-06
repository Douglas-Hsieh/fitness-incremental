import * as AppleAuth from 'expo-apple-authentication';
import { User as GoogleUser } from '@react-native-google-signin/google-signin';
import { Platform } from 'react-native';

export type SignInAuth = GoogleUser | AppleAuth.AppleAuthenticationCredential;

export function isGoogleUser(signInAuth: SignInAuth): signInAuth is GoogleUser {
  return Platform.OS === 'android';
}

export function isAppleUser(signInAuth: SignInAuth): signInAuth is AppleAuth.AppleAuthenticationCredential {
  return Platform.OS === 'ios';
}

export function getSignInAuthCredentials(signInAuth: SignInAuth) {
  let idToken, serverAuthCode;
  if (isGoogleUser(signInAuth)) {
    idToken = signInAuth.idToken;
    serverAuthCode = signInAuth.serverAuthCode;
  } else if (isAppleUser(signInAuth)){
    idToken = signInAuth.identityToken;
    serverAuthCode = signInAuth.authorizationCode;
  } else {
    throw Error('Sign In Auth Credentials is not Google or Apple')
  }

  return { idToken, serverAuthCode }
}