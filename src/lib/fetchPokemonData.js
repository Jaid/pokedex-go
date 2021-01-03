import arrayToObjectKeys from "array-to-object-keys"
import got from "got"
import pProps from "p-props"
import readableMs from "readable-ms"

import getLastUrlSegment from "./getLastUrlSegment"

const apiHost = "pokeapi.co"
const apiVersion = "2"

const pokemonApi = got.extend({
  prefixUrl: `https://${apiHost}/api/v${apiVersion}`,
  responseType: "json",
  method: "GET",
})

async function fetchPokemonIds() {
  const apiResponse = await pokemonApi("pokemon", {
    searchParams: {
      limit: 5000,
    },
  })
  return apiResponse.body.results.map(pokemon => getLastUrlSegment(pokemon.url))
}

async function fetchPokemon(pokemonId) {
  const apiResponse = await pokemonApi.get(`pokemon/${pokemonId}`)
  const pokemon = apiResponse.body
  return pokemon
}

async function fetchPokemons() {
  const startTime = Date.now()
  const pokemonIds = await fetchPokemonIds()
  console.log(`Fetching ${pokemonIds.length} pokemons`)
  const unresolvedPokemonMap = arrayToObjectKeys(pokemonIds, pokemonId => pokemonId)
  const resolvedPokemonMap = await pProps(unresolvedPokemonMap, fetchPokemon, {concurrency: 5})
  const runTime = Date.now() - startTime
  console.log(`Fetched ${pokemonIds.length} pokemons in ${readableMs(runTime)}`)
  return resolvedPokemonMap
}

async function fetchSpeciesIds() {
  const apiResponse = await pokemonApi("pokemon-species", {
    searchParams: {
      limit: 5000,
    },
  })
  return apiResponse.body.results.map(species => getLastUrlSegment(species.url))
}

async function fetchSpeciesEntry(speciesId) {
  const apiResponse = await pokemonApi.get(`pokemon-species/${speciesId}`)
  const species = apiResponse.body
  return species
}

async function fetchSpecies() {
  const startTime = Date.now()
  const speciesIds = await fetchSpeciesIds()
  console.log(`Fetching ${speciesIds.length} pokemon species`)
  const unresolvedPokemonMap = arrayToObjectKeys(speciesIds, speciesId => speciesId)
  const resolvedPokemonMap = await pProps(unresolvedPokemonMap, fetchSpeciesEntry, {concurrency: 5})
  const runTime = Date.now() - startTime
  console.log(`Fetched ${speciesIds.length} pokemon species in ${readableMs(runTime)}`)
  return resolvedPokemonMap
}

async function fetchEvolutionChainIds() {
  const apiResponse = await pokemonApi("evolution-chain", {
    searchParams: {
      limit: 5000,
    },
  })
  return apiResponse.body.results.map(evolutionChain => getLastUrlSegment(evolutionChain.url))
}

async function fetchEvolutionChain(evolutionChainId) {
  const apiResponse = await pokemonApi.get(`evolution-chain/${evolutionChainId}`)
  const evolutionChain = apiResponse.body
  return evolutionChain
}

async function fetchEvolutionChains() {
  const startTime = Date.now()
  const evolutionChainIds = await fetchEvolutionChainIds()
  console.log(`Fetching ${evolutionChainIds.length} evolution chains`)
  const unresolvedEvolutionChainMap = arrayToObjectKeys(evolutionChainIds, evolutionChainId => evolutionChainId)
  const resolvedEvolutionChainMap = await pProps(unresolvedEvolutionChainMap, fetchEvolutionChain, {concurrency: 5})
  const runTime = Date.now() - startTime
  console.log(`Fetched ${evolutionChainIds.length} evolution chains in ${readableMs(runTime)}`)
  return resolvedEvolutionChainMap
}

export default async () => {
  console.log(`Fetching pokemon data from ${apiHost} v${apiVersion}`)
  const pokemons = await fetchPokemons()
  const species = await fetchSpecies()
  const evolutionChains = await fetchEvolutionChains()
  return {
    pokemons,
    species,
    evolutionChains,
  }
}