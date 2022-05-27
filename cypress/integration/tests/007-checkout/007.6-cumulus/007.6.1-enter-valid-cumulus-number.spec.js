/**
 * PIC-812
 */

import { getTestSpecName } from 'lib/testSpecName'
import devices, { deviceTypes } from 'cypress/integration/_helpers/devices'
import languages from 'cypress/fixtures/shared/languages'
import { registerCustomer } from 'cypress/support/club'
import { createRegistrationData } from 'cypress/fixtures/shared/user-create'
import { validCumulusNr } from 'cypress/fixtures/007.6.1-cumulus.data.json'
import { baseUrl } from 'cypress/fixtures/environment'

import { redirectToBasket, redirectToStep2 } from 'cypress/support/checkout'

const testSpecName = getTestSpecName(__filename)
const language = languages[0]

const targetUrl = `${baseUrl}/de/`

devices.map((device) => {
  describe(`${testSpecName} @@ Valid cumulus number - ${device.name}`, () => {
    const [w, h] = device.viewport
    const isMobile = device.type.includes(deviceTypes.MOBILE)

    before(() => {
      cy.viewport(w, h)
      cy.clearCookies({ domain: null })
      cy.visit(targetUrl)
    })

    beforeEach(() => {
      cy.viewport(w, h)
      cy.preserveDefaultCookies()
    })

    it('Register user', () => {
      const registrationData = createRegistrationData()
      registerCustomer(language, registrationData)

      cy.url().should('contain', '/de/')
    })

    it('Should add first item on current page basket', () => {
      cy.get('[data-cy="tileEngine-button-basket"]').first().click({ force: true })
    })

    it('Redirect to basket', () => {
      redirectToBasket(language, isMobile)
    })

    it('Should redirect to step 2', () => {
      redirectToStep2(language)
    })

    it('Should clear the input field and enter the cumulus number', () => {
      cy.dataCy('checkout-address-input-cumulusnr').clear().type(validCumulusNr)
    })

    it('Should check if cumulus number is transmitted successfully', () => {
      cy.intercept({
        method: 'POST',
        url: 'https://**/v1/Customer/CustomerValueSave',
      }).as('cumulusNumberCheck')

      cy.dataCy('checkout-addressSend-button-submit-bottom').click({ force: true })
      cy.wait('@cumulusNumberCheck', { timeout: 20000 }).then((interception) => {
        expect(interception.response.statusCode, 'Response Status Code').to.equal(200)
        assert.isNotNull(
          interception.response.body,
          'cumulus number transmitted successfully',
        )
      })
    })
  })
})
