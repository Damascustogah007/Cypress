const yargs = require('yargs')
const fs = require('fs')
const ls = require('ls')
const path = require('path')
const rm = require('rimraf')
const cypress = require('cypress')
const { merge } = require('mochawesome-merge')
const marge = require('mochawesome-report-generator')

const cypressConfig = require('./cypress.json')
const { markdownReporter } = require('./lib/report-markdown-custom')
const { today } = require('./lib/date')

// console.log(yargs.options().argv);
// const argv = yargs
//   .options({
//     browser: {
//       alias: "b",
//       describe: "choose browser that you wanna run tests on",
//       default: "chrome",
//       choices: ["chrome", "electron"]
//     },
//     spec: {
//       alias: "s",
//       describe: "run test with specific spec file",
//       default: "cypress/integration/*.spec.js"
//     }
//   })
//   .help().argv;

// List all of existing report files
// Delete all existing report files
const reportDir = cypressConfig.reporterOptions.mochawesomeReporterOptions.reportDir
const reportFiles = `${reportDir}/*.xml`

ls(reportFiles, { recurse: true }, (file) => console.log(`removing ${file.full}`))

rm(reportFiles, (error) => {
  if (error) {
    console.error(`Error while removing existing report files: ${error}`)
    process.exit(1)
  }
  console.log('Removing all existing report files successfully!')
})

const reportDirMd = path.join(__dirname, 'cypress', 'reports', `report_${today()}.md`)

cypress
  .run(cypressConfig)
  .then((results) => {
    const reportDir = results.config.reporterOptions.mochawesomeReporterOptions.reportDir
    const mergeOptions = {
      files: [`${reportDir}/*.json`],
      reportDir: reportDir,
    }
    merge(mergeOptions)
      .then((report) => {
        // custom markdown reporter
        const content = markdownReporter(report)
        console.log(content)
        fs.writeFile(reportDirMd, content, (err) => {
          if (err) throw err
          console.log('Md report saved')
          // todo: connect with Confluence or Jira, save the report as comment
        })
        // marge.create(report, mergeOptions); // mochawesome merge files function
      })
      .catch((error) => {
        console.error('errors merge: ', error)
        process.exit(1)
      })
  })
  .catch((error) => {
    console.error('errors run: ', error)
    process.exit(1)
  })

// todo: remove files
// todo: reportDir unify
