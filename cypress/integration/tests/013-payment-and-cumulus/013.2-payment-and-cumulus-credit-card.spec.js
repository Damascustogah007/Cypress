/**
 * PIC-604, PIC-605
 */

import { baseUrl } from 'cypress/fixtures/environment'
import { getTestSpecName } from 'lib/testSpecName'
import cumulusCards, {
  customer,
} from 'cypress/fixtures/013.2-payment-and-cumulus-credit-card.data'
import 'cypress-iframe'
import { defaultDevices } from 'cypress/integration/_helpers/default-devices'
import {
  redirectToMeinExlibris,
  clickOnPayAndCumulus,
  loopPaymentOptions,
  navigateToPaymentAndCumulus,
  selectCardType,
  successMessage,
} from './013.1-helpers'

const testSpecName = getTestSpecName(__filename)

const targetUrl = `${baseUrl}/de`
let { email, password } = customer

defaultDevices.forEach((device) => {
  const [w, h] = device.viewport
  describe(`${testSpecName}​ @@ Logged in - Enter valid cumulus number - ${device.name}​`, () => {
    before(() => {
      cy.clearCookies()
      cy.visitWithDevice(targetUrl, device)
      cy.wait(2000)
      cy.loginCustomer(email, password, false)
    })

    beforeEach(() => {
      cy.viewport(w, h)
      cy.preserveDefaultCookies()
    })

    it('Navigate to "Mein ExLibris"', () => {
      redirectToMeinExlibris(device)
    })

    it('should click on pay and cumulus', () => {
      clickOnPayAndCumulus()
    })

    it('should check whether each payment method can be selected', () => {
      cy.wait(2000)
      loopPaymentOptions()
    })

    cumulusCards.forEach((cumulusCard) => {
      describe(`${cumulusCard.type}`, () => {
        it('should navigate to "Payment and cumulus"', () => {
          navigateToPaymentAndCumulus(cumulusCard)
        })

        it('Should add cardtype', () => {
          selectCardType(cumulusCard)
          cy.iframe('#datatransPaymentFrame')
            .find('#cardNumber')
            .should('be.visible')
            .invoke('val', cumulusCard.card)
          cy.iframe('#datatransPaymentFrame')
            .find('#expiry')
            .should('be.visible')
            .invoke('val', cumulusCard.valid_expiration_date)
          cy.iframe('#datatransPaymentFrame')
            .find('#cvv')
            .should('be.visible')
            .invoke('val', cumulusCard.valid_cvv)
          cy.iframe('#datatransPaymentFrame')
            .find('#payLabel')
            .should('be.visible')
            .click({ force: true })
        })

        it('Should validate card is added', () => {
          cy.wait(2000)
          cy.get('[type="SUCCESS"]')
            .invoke('text')
            .then(($message) => {
              expect($message).to.equal(successMessage)
            })
          cy.dataCy('creditCardSelection-button-removeCreditCard').click()
        })
      })
    })
  })

  describe(`${testSpecName}​ @@ Logged in - Enter invalid cumulus number - ${device.name}​`, () => {
    before(() => {
      cy.clearCookies()
      cy.visitWithDevice(targetUrl, device)
      cy.wait(2000)
      cy.loginCustomer(email, password, false)
    })

    beforeEach(() => {
      cy.viewport(w, h)
      cy.preserveDefaultCookies()
    })

    it('Navigate to "Mein ExLibris"', () => {
      redirectToMeinExlibris(device)
    })
    it('should click on pay and cumulus', () => {
      clickOnPayAndCumulus()
    })

    it('should check whether each payment method can be selected', () => {
      cy.wait(2000)
      loopPaymentOptions()
    })

    cumulusCards.forEach((cumulusCard) => {
      describe(` ${cumulusCard.type}`, () => {
        it('should navigate to "Payment and cumulus"', () => {
          navigateToPaymentAndCumulus(cumulusCard)
        })

        it('Should add cardtype', () => {
          selectCardType(cumulusCard)
          cy.iframe('#datatransPaymentFrame')
            .find('#cardNumber')
            .should('be.visible')
            .invoke('val', cumulusCard.card)
          cy.iframe('#datatransPaymentFrame')
            .find('#expiry')
            .should('be.visible')
            .invoke('val', cumulusCard.invalid_expiration_date)
          cy.iframe('#datatransPaymentFrame')
            .find('#cvv')
            .should('be.visible')
            .invoke('val', cumulusCard.invalid_cvv)
          cy.iframe('#datatransPaymentFrame')
            .find('#payLabel')
            .should('be.visible')
            .click()
        })

        it('Should validate card is added', () => {
          cy.wait(2000)
          cy.get('[type="ERROR"]')
            .invoke('text')
            .then(($errorMessage) => {
              expect($errorMessage).to.contain(
                'Bitte überprüfen Sie die gemachten Eingaben auf ihre Vollständigkeit und Gültigkeit:',
              )
            })
        })
      })
    })
  })
})
