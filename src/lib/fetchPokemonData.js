import arrayToObjectKeys from "array-to-object-keys"
import got from "got"
import pProps from "p-props"
import readableMs from "readable-ms"

const apiHost = "pokeapi.co"
const apiVersion = "2"

const pokemonApi = got.extend({
  prefixUrl: `https://${apiHost}/api/v${apiVersion}`,
  responseType: "json",
  method: "GET",
})

async function fetchPokemonList() {
  const apiResponse = await pokemonApi("pokemon", {
    searchParams: {
      limit: 5000,
    },
  })
  return apiResponse.body.results
}

async function fetchPokemon(pokemonName) {
  // console.log(`Fetch ${pokemonName}`)
  const apiResponse = await pokemonApi.get(`pokemon/${pokemonName}`)
  const pokemon = apiResponse.body
  // console.dir(`Fetched #${pokemon.id}: ${pokemon.name}`)
  return pokemon
}

async function fetchPokemons() {
  const startTime = Date.now()
  const pokemonList = await fetchPokemonList()
  const pokemonNames = pokemonList.map(pokemon => pokemon.name)
  console.log(`Fetching ${pokemonNames.length} pokemons`)
  const unresolvedPokemonMap = arrayToObjectKeys(pokemonNames, pokemonName => pokemonName)
  const resolvedPokemonMap = await pProps(unresolvedPokemonMap, fetchPokemon, {concurrency: 5})
  const runTime = Date.now() - startTime
  console.log(`Fetched ${pokemonNames.length} pokemons in ${readableMs(runTime)}`)
  return resolvedPokemonMap
}

async function fetchSpeciesList() {
  const apiResponse = await pokemonApi("pokemon-species", {
    searchParams: {
      limit: 5000,
    },
  })
  return apiResponse.body.results
}

async function fetchSpeciesEntry(speciesId) {
  // console.log(`Fetch ${pokemonName}`)
  const apiResponse = await pokemonApi.get(`pokemon-species/${speciesId}`)
  const species = apiResponse.body
  // console.dir(`Fetched #${pokemon.id}: ${pokemon.name}`)
  return species
}

async function fetchSpecies() {
  const startTime = Date.now()
  const speciesList = await fetchSpeciesList()
  const pokemonNames = speciesList.map(pokemon => pokemon.name)
  console.log(`Fetching ${pokemonNames.length} pokemon species`)
  const unresolvedPokemonMap = arrayToObjectKeys(pokemonNames, pokemonName => pokemonName)
  const resolvedPokemonMap = await pProps(unresolvedPokemonMap, fetchSpeciesEntry, {concurrency: 5})
  const runTime = Date.now() - startTime
  console.log(`Fetched ${pokemonNames.length} pokemon species in ${readableMs(runTime)}`)
  return resolvedPokemonMap
}

async function fetchEvolutionChainList() {
  const apiResponse = await pokemonApi("evolution-chain", {
    searchParams: {
      limit: 5000,
    },
  })
  return apiResponse.body.results
}

async function fetchEvolutionChain(speciesId) {
  // console.log(`Fetch ${pokemonName}`)
  const apiResponse = await pokemonApi.get(`evolution-chain/${speciesId}`)
  const evolutionChain = apiResponse.body
  // console.dir(`Fetched #${pokemon.id}: ${pokemon.name}`)
  return evolutionChain
}

async function fetchEvolutionChains() {
  const startTime = Date.now()
  const evolutionChainList = await fetchEvolutionChainList()
  debugger
  const evolutionChainNames = evolutionChainList.map(pokemon => pokemon.name)
  console.log(`Fetching ${evolutionChainNames.length} evolution chains`)
  const unresolvedEvolutionChainMap = arrayToObjectKeys(evolutionChainNames, pokemonName => pokemonName)
  const resolvedEvolutionChainMap = await pProps(unresolvedEvolutionChainMap, fetchEvolutionChain, {concurrency: 5})
  const runTime = Date.now() - startTime
  console.log(`Fetched ${evolutionChainNames.length} evolution chains in ${readableMs(runTime)}`)
  return resolvedEvolutionChainMap
}

export default async () => {
  console.log(`Fetching pokemon data from ${apiHost} v${apiVersion}`)
  // const pokemons = await fetchPokemons()
  // const species = await fetchSpecies()
  const evolutionChains = await fetchEvolutionChains()
  debugger
  // console.dir(pokemons)
  return {
    // pokemons,
    // species,
  }
}