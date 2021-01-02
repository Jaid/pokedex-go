import fsp from "@absolunet/fsp"
import makeDir from "make-dir"
import path from "path"
import {getLatestVersionName} from "pokemongo-game-master"
import readFileJson from "read-file-json"
import yargs from "yargs"

import fetchGamemaster from "../src/lib/fetchGamemaster"
import fetchPokemonData from "../src/lib/fetchPokemonData"

async function job(argv) {
  let gamemaster
  let pokemonData
  const gamemasterVersion = await getLatestVersionName()
  console.log(`Gamemaster Version ${gamemasterVersion}`)
  const gamemasterFolder = path.join(__dirname, "..", "dist", "gamemaster", gamemasterVersion)
  const gamemasterFile = path.join(gamemasterFolder, "gamemaster.json5")
  await makeDir(gamemasterFolder)
  const gamemasterFileExists = await fsp.pathExists(gamemasterFile)
  if (gamemasterFileExists) {
    gamemaster = await readFileJson(gamemasterFile)
  } else {
    gamemaster = await fetchGamemaster(gamemasterVersion)
    await fsp.outputJson5(gamemasterFile, gamemaster)
  }
  const pokemonDataFolder = path.join(__dirname, "..", "dist", "pokemonData")
  const pokemonDataFile = path.join(pokemonDataFolder, "data.json5")
  await makeDir(pokemonDataFolder)
  // const pokemonDataFileExists = await fsp.pathExists(pokemonDataFile)
  const pokemonDataFileExists = false
  if (pokemonDataFileExists) {
    pokemonData = await readFileJson(pokemonDataFile)
  } else {
    pokemonData = await fetchPokemonData()
    await fsp.outputJson5(pokemonDataFile, pokemonData)
  }
  debugger
}

yargs
  .command("*", "", {}, job).argv