import { User } from "../shared/users.interface"
import { SERVER_URL } from "../config"

export const endpoint = `${SERVER_URL}/users`

export const getUser = async (userId: string): Promise<User> => {
  return fetch(`${endpoint}/${userId}`)
    .then(res => res.json())
    .then(res => res.data)
}

export const createUser = async (): Promise<User> => {
  return fetch(`${endpoint}`, {
    method: 'POST',
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
      expoPushToken: user.expoPushToken,
    }),
  }).then(res => res.json())
    .then(res => res.data)
}