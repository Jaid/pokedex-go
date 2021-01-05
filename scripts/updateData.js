import fsp from "@absolunet/fsp"
import makeDir from "make-dir"
import path from "path"
import {getLatestVersionName} from "pokemongo-game-master"
import readFileJson from "read-file-json"
import Stoppuhr from "stoppuhr"
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
  const gamemasterStoppuhr = new Stoppuhr
  if (gamemasterFileExists) {
    gamemaster = await readFileJson(gamemasterFile)
    console.log(`Loaded gamemaster in ${gamemasterStoppuhr.totalText()}`)
  } else {
    gamemaster = await fetchGamemaster(gamemasterVersion)
    await fsp.outputJson5(gamemasterFile, gamemaster)
  }
  const pokemonDataFolder = path.join(__dirname, "..", "dist", "pokemonData")
  const pokemonDataFile = path.join(pokemonDataFolder, "data.json5")
  await makeDir(pokemonDataFolder)
  const pokemonDataFileExists = await fsp.pathExists(pokemonDataFile)
  if (pokemonDataFileExists) {
    pokemonData = await readFileJson(pokemonDataFile)
  } else {
    pokemonData = await fetchPokemonData()
    await fsp.outputJson5(pokemonDataFile, pokemonData)
  }
  console.log("MOIN")
}

yargs
  .command("*", "", {}, job).argv