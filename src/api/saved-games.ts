import { API_URL } from "../config/config"
import path from 'path'
import { Platform } from "react-native"
import { GameState } from "../../assets/data/GameState"

const endpoint = path.join(API_URL, 'saved-games')

export async function upsertSavedGame(idToken: string | null, gameState: GameState) {
  return fetch(`${endpoint}`, {
    method: 'PUT',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      idToken: idToken,
      os: Platform.OS,
      gameStateSerialized: JSON.stringify(gameState),
    })
  })
}
