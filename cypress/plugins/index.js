// ***********************************************************
// This example plugins/index.js can be used to load plugins
//
// You can change the location of this file or turn off loading
// the plugins file with the 'pluginsFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/plugins-guide
// ***********************************************************
const fs = require('fs')
const browserify = require('@cypress/browserify-preprocessor')

// This function is called when a project is opened or re-opened (e.g. due to
// the project's config changing)

module.exports = async (on, config) => {
  const browserifyOptions = browserify.defaultOptions
  //browserifyOptions.typescript = require.resolve('typescript')

  on('task', {
    getLatestUser() {
      let userData = null
      if (fs.existsSync('./output-data/registration')) {
        const list = fs.readdirSync('./output-data/registration')
        let timestamps = []
        list.forEach(function (file) {
          timestamps.push(Number(file.toString().split('.')[0]))
        })

        if (timestamps.length !== 0) {
          const latestTimestamp = String(Math.max.apply(Math, timestamps))
          const userDataRaw = fs.readFileSync(
            `./output-data/registration/${latestTimestamp}.json`,
          )
          userData = JSON.parse(userDataRaw)
        } else {
          console.warn(
            '\x1b[33m%s\x1b[0m',
            `${__dirname}: No users in /output/registration`,
          )
        }
      } else {
        console.warn(
          '\x1b[33m%s\x1b[0m',
          `${__dirname}: File /output/registration does not exist`,
        )
      }
      return userData
    },
    log(subject) {
      console.log(subject)
      return null
    },
  })

  on('file:preprocessor', browserify(browserifyOptions))
}
