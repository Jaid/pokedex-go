import path from "path"

/**
 * @type { import("../src") }
 */
const pokedexGo = require(process.env.MAIN ? path.resolve(process.env.MAIN) : path.join(__dirname, "..", "src"))

it("Should return a proper TypeScript configuration", () => {
  expect(pokedexGo().compilerOptions.newLine).toStrictEqual("lf")
})