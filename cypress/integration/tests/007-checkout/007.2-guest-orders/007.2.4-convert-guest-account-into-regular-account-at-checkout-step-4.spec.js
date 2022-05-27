/**
 * PIC 1742
 */

import { acceptAgbAndContinue, redirectToBasket } from 'cypress/support/checkout'
import { baseUrl } from 'cypress/fixtures/environment'
import languages from 'cypress/fixtures/shared/languages'
import devices, {
  checkIsMobileOrTablet,
  checkIsDesktop,
} from 'cypress/integration/_helpers/devices'
import { getTestSpecName } from 'lib/testSpecName'

import {
  createGuestRegistrationData,
  passwordData,
} from 'cypress/fixtures/007.2.4-convert-guest-account-into-regular-account-at-checkout-step-4.data.js'

const testSpecName = getTestSpecName(__filename)
let registrationGuestData

devices.forEach((device) => {
  const [w, h] = device.viewport
  languages.forEach((language) => {
    const targetUrl = `${baseUrl}/${language.code}/`
    const isFrench = language.code === 'fr'
    describe(`${testSpecName} @@ Convert guest account into regular account ${
      language.name
    } - (${device.viewport.join(' x ')}) `, () => {
      before(() => {
        cy.viewport(w, h)
        cy.clearCookies({ domain: null })
        cy.visit(targetUrl)

        registrationGuestData = createGuestRegistrationData()

        cy.addFirstProductOnCurrentPageToBasket()
      })

      beforeEach(() => {
        cy.viewport(w, h)
        cy.preserveDefaultCookies()
      })

      it('should redirect to basket', function () {
        redirectToBasket(language, checkIsMobileOrTablet(device))
      })

      it('should redirect to step 2', () => {
        cy.get('[data-cy=basket-button-step2]').last().click()
      })

      it("should click on 'Als Gast bestellen' button", () => {
        cy.dataCy('als-Gast-bestellen-module').children().last().find('button').click()
      })

      it('should fill guest registration form without password', () => {
        cy.registerGuestFillOutFormOnly(registrationGuestData, language.code)
        cy.scrollTo('bottom')
        cy.get('[data-cy=registration-button-submittop]').last().click()
      })

      it('Redirect to checkout process step 3', () => {
        cy.intercept({
          method: 'POST',
          url: 'https://**/v1/Basket/BasketGet',
        }).as('getBasket')
        cy.get('[data-cy=checkout-addressSend-button-submit-bottom]').should('be.visible')
        cy.get('[data-cy=checkout-addressSend-button-submit-bottom]').click()
        cy.wait('@getBasket')
      })

      it('Buy through accepting AGB and top button click', () => {
        acceptAgbAndContinue()
        cy.dataCy('checkout-step4-confirmation').should('exist')
      })
      it('should input password and check password strength', () => {
        cy.get('[data-cy=passwordfield-input]')
          .type(passwordData.password)
          .next()
          .then(($el) => {
            const win = $el[0].ownerDocument.defaultView
            const after = win.getComputedStyle($el[0], 'after')
            const contentValue = after.getPropertyValue('content')
            const expectedValue = isFrench ? '"SÛR"' : '"STARK"'
            expect(contentValue).to.eq(expectedValue)
          })
        cy.get('[data-cy="password-field-tooltip"]').should('be.visible')
      })

      it('should input confirm password', () => {
        cy.get('[data-cy=guest-registration-input-confirmpassword]')
          .type(passwordData.passwordRepeat)
          .should('not.have.css', 'border-color', 'rgb(191, 13, 62)')
      })

      it('should click on continue', () => {
        cy.dataCy('guest-registration-button-submit').click()
      })

      it('should check success message', () => {
        cy.dataCy('checkout-confirmation-successMessage').should('be.visible')
      })

      it('Move customer outside checkout page and check if customer is still logged in', () => {
        cy.dataCy('checkout-header-exLibrisLogo').click({ force: true })
        if (checkIsDesktop(device)) {
          cy.dataCy('welcome-salutation').should(
            'contain',
            registrationGuestData.lastName,
          )
        } else {
          cy.dataCy('header-mobile-myAccount').click()
          const expectedValue = isFrench ? 'Mon Ex Libris' : 'Mein Ex Libris'
          cy.dataCy('breadcrumb-item-' + expectedValue).should('contain', expectedValue)
        }
      })
    })
  })
})
