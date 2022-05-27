import { baseUrl } from 'cypress/fixtures/environment'
import Auth from 'cypress/fixtures/auth.secret'
import languages from 'cypress/fixtures/shared/languages'
import deviceConfigs from 'cypress/integration/_helpers/devices'
import { dateFormat } from 'cypress/integration/_helpers/date'
import { getTestSpecName } from 'lib/testSpecName'
import { case_01 } from 'cypress/fixtures/dummy'

const testSpecName = getTestSpecName(__filename)
const todaysDate = Cypress.moment().format(dateFormat)

const captureOptions = (w, h) => {
  return {
    capture: 'fullPage',
    // clip: { x: 0, y: 0, width: w, height: h }
  }
}

describe(`${testSpecName} @@ Dummy Test`, function () {
  before(() => {
    const lang = languages[0].code

    const config = deviceConfigs[0]
    const [w, h] = config.viewport
    const viewportStr = config.viewport.join('x')
    const itConfig = { auth: Auth, retryOnStatusCodeFailure: true }
    if (config.headers) {
      itConfig.headers = config.headers
    }

    cy.viewport(w, h)
    cy.visit(`${baseUrl}/${lang}`, itConfig)
  })

  it('should log somtething', function () {
    cy.log('something')
  })
})
