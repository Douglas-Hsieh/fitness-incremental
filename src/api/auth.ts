import { API_URL } from "../config"

const endpoint = API_URL

export const logIn = async (uuid: string) => {
  return await fetch(`${endpoint}/login`, {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      uuid: uuid,
    }),
  })
    .then(res => res.json())
    .then(res => res.data)
}