import {getVersion} from "pokemongo-game-master"

export default async gamemasterVersion => {
  console.log("Fetching gamemaster")
  const gamemaster = await getVersion(gamemasterVersion, "json")
  return gamemaster
}