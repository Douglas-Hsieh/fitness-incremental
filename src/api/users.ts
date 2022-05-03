import { User } from "../shared/users.interface"
import { API_URL } from "../config/config"
import path from 'path'
import { Platform } from "react-native"

const endpoint = path.join(API_URL, 'users')

export const getUser = async (userId: string): Promise<User> => {
  return fetch(`${endpoint}/${userId}`)
    .then(res => res.json())
    .then(res => res.data)
}

export const createUser = async (idToken: string, serverAuthCode: string | null): Promise<User> => {
  return fetch(`${endpoint}`, {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      idToken: idToken,
      serverAuthCode: serverAuthCode,
      os: Platform.OS,
      timezoneOffsetMinutes: new Date().getTimezoneOffset(),
    }),
  }).then(res => res.json())
    .then(res => res.data)
}

export const updateUser = async (user: Partial<User>): Promise<User> => {
  return fetch(`${endpoint}/${user.id}`, {
    method: 'PUT',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      timezoneOffsetMinutes: new Date().getTimezoneOffset(),
      expoPushToken: user.expoPushToken,
    }),
  }).then(res => res.json())
    .then(res => res.data)
}