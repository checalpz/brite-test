const { defineConfig } = require("cypress");

module.exports = defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
    baseUrl: 'https://www.imdb.com',    //default
    videoUploadOnPasses: false,
    numTestsKeptInMemory: 20      // lowered the test to advoid crashing during the executions (default: 50)
  },
  env: {
    sizes: [[1600, 900], [1024, 768], [1000, 660], [759, 768]],
    apiBaseUrl : 'https://pokeapi.co'

  }
});
