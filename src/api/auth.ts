import { API_URL } from "../config/config"
import { User } from "../shared/users.interface"
import { createUser } from "./users"
import { Platform } from "react-native";

const endpoint = API_URL

export const login = async (idToken: string): Promise<User> => {
  return await fetch(`${endpoint}/login`, {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      idToken: idToken,
      os: Platform.OS,
    }),
  })
    .then(res => {
      if (!res.ok) {
        return Promise.reject(`login failed with status ${res.status}`)
      }
      return res
    })
    .then(res => res.json())
    .then(res => res.data)
}

interface SignInProps {
  idToken: string;
  serverAuthCode: string | null;
}

export async function signIn({ idToken, serverAuthCode }: SignInProps) {
  let user;

  try {
    user = await login(idToken)
  } catch(error) {
    user = await createUser(idToken, serverAuthCode)
      .then(() => login(idToken))
  }

  return user
}