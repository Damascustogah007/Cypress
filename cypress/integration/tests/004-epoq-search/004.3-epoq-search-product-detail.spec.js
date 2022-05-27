import { baseUrl } from 'cypress/fixtures/environment'
import Auth from 'cypress/fixtures/auth.secret'
import {
  allDevices,
  mobileDevices,
  checkIsDesktop,
  checkIsTablet
} from 'cypress/integration/_helpers/devices'
import { getTestSpecName } from 'lib/testSpecName'

const testSpecName = getTestSpecName(__filename)

const devices = mobileDevices.concat([allDevices.headlessModeDesktopDevice])

describe(`${testSpecName} @@ Product Detail after search`, function () {
  devices.forEach((device) => {
    describe(`Epoq Search - PDP - ${device.name} - ${device.viewport.join(
      ' x ',
    )}`, () => {
      const mockSearchText = 'Dragon Ball'
      const mockSelectCategory = 'DVD'
      const lang = 'de'
      const itConfig = { auth: Auth, retryOnStatusCodeFailure: true }
      if (device.headers) {
        itConfig.headers = device.headers
      }
      const [w, h] = device.viewport

      before(() => {
        cy.clearCookies()
      })

      beforeEach(() => {
        cy.viewport(w, h)
      })

      it('should search in header', function () {
        cy.visit(`${baseUrl}/${lang}`, itConfig)
        if (checkIsDesktop(device) || checkIsTablet(device)) {
          cy.dataCy('search-select-selection').select(mockSelectCategory)
        }
        cy.headerSearch(mockSearchText)

        cy.get('div#epoq_resultrows a', { timeout: 20000 }).eq(0).click()

        cy.get('h1').should('contain', mockSearchText)
      })
    })
  })
})
