import fsp from "@absolunet/fsp"
import makeDir from "make-dir"
import path from "path"
import {getLatestVersionName} from "pokemongo-game-master"
import readFileJson from "read-file-json"
import statSizeText from "stat-size-text"
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
  const stoppuhr = new Stoppuhr
  if (gamemasterFileExists) {
    gamemaster = await readFileJson(gamemasterFile)
    const sizeText = await statSizeText(gamemasterFile)
    console.log(`Loaded gamemaster in ${stoppuhr.lapText()} (${sizeText})`)
  } else {
    gamemaster = await fetchGamemaster(gamemasterVersion)
    await fsp.outputJson5(gamemasterFile, gamemaster)
    const sizeText = await statSizeText(gamemasterFile)
    console.log(`Fetched gamemaster in ${stoppuhr.lapText()} (${sizeText})`)
  }
  const pokemonDataFolder = path.join(__dirname, "..", "dist", "pokemonData")
  const pokemonDataFile = path.join(pokemonDataFolder, "data.json5")
  await makeDir(pokemonDataFolder)
  const pokemonDataFileExists = await fsp.pathExists(pokemonDataFile)
  if (pokemonDataFileExists) {
    pokemonData = await readFileJson(pokemonDataFile)
    const sizeText = await statSizeText(pokemonDataFile)
    console.log(`Loaded pokeapi data in ${stoppuhr.lapText()} (${sizeText})`)
  } else {
    pokemonData = await fetchPokemonData()
    await fsp.outputJson5(pokemonDataFile, pokemonData)
    const sizeText = await statSizeText(pokemonDataFile)
    console.log(`Fetched pokeapi data in ${stoppuhr.lapText()} (${sizeText})`)
  }
  console.log("MOIN")
}

yargs
  .command("*", "", {}, job).argv