import React, { useEffect } from "react"
import { SafeAreaView, View, Text } from "react-native"
import EStyleSheet from "react-native-extended-stylesheet"
import colors from "../../assets/colors/colors"
import { Background } from "../components/BackgroundImage"
import { APP_NAME, WEB_CLIENT_ID } from "../../assets/data/Constants"
import {
  GoogleSignin,
  GoogleSigninButton,
  statusCodes,
} from '@react-native-google-signin/google-signin';
import { GOOGLE_FIT_AUTHORIZATION_OPTIONS } from "../fitness-api/google-fit"
import { isGoogleUser, SignInAuth } from "../types/SignInAuth"

interface AndroidLoginScreenProps {
  signInAuth: SignInAuth | undefined;
  setSignInAuth: React.Dispatch<React.SetStateAction<SignInAuth | undefined>>;
}

export const AndroidLoginScreen = ({signInAuth, setSignInAuth}: AndroidLoginScreenProps) => {

  const googleSignIn = async () => {
    try {
      const googleUser = await GoogleSignin.signIn();
      setSignInAuth(googleUser)
    } catch (error: any) {
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        console.log('googleSignIn cancelled')
      } else if (error.code === statusCodes.IN_PROGRESS) {
        console.log('googleSignIn in progress')
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        console.log('googleSignIn play services not available')
      } else {
        console.log(error.code)
        console.log("googleSignIn error")
      }
    }
  }

  useEffect(() => {
    GoogleSignin.configure({
      scopes: GOOGLE_FIT_AUTHORIZATION_OPTIONS.scopes,
      webClientId: WEB_CLIENT_ID,
      offlineAccess: true,
    });
  }, [])

  useEffect(() => {
    if (!signInAuth || !isGoogleUser(signInAuth)) {
      return
    }
    
    const {scopes} = signInAuth
    if (!scopes) {
      console.log("This shouldn't happen.")
      alert("You must give permissions for this app to work correctly.")
      return
    }
    GOOGLE_FIT_AUTHORIZATION_OPTIONS.scopes.forEach(scope => {
      if (!scopes.includes(scope)) {
        alert(`You must give permission for: ${scope}`)
      }
    })

    console.log('signInAuth', signInAuth)
  }, [signInAuth])

  return (
    <SafeAreaView style={styles.container}>
      <Background/>
      
      <View style={styles.screenWrapper}>
        <View style={styles.title}>
          <Text style={styles.titleText}>{APP_NAME}</Text>
        </View>

        <GoogleSigninButton
          style={{ width: 312, height: 48 }}
          size={GoogleSigninButton.Size.Wide}
          color={GoogleSigninButton.Color.Light}
          onPress={googleSignIn}
        />

      </View> 

    </SafeAreaView>
  )
}

const styles = EStyleSheet.create({
  container: {
    flex: 1,
  },
  screenWrapper: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-around',
  },

  titleText: {
    fontFamily: 'oleo-script',
    color: colors.black,
    fontSize: '4rem',
  },
  button: {
    backgroundColor: colors.white,
    borderRadius: 5,
    padding: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    width: 32,
    height: 32,
  },
  buttonText: {
    marginLeft: 10,
  }
})

