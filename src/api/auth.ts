import { SERVER_URL } from "../config"

const endpoint = `${SERVER_URL}`

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
}