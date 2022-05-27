/**
 * PIC-2870
 */
import { baseUrl } from 'cypress/fixtures/environment'
import devices, { checkIsMobileOrTablet } from 'cypress/integration/_helpers/devices'
import { getTestSpecName } from 'lib/testSpecName'
import {
  user_with_visacard as visa,
  user_with_mastercard as master,
  user_with_americanexpress as express,
} from 'cypress/fixtures/007.1.4-checkout-select-default-payment-credit-card.data'

const testSpecName = getTestSpecName(__filename)

const customers = [visa, express, master]

const _dev = [devices[1]]
_dev.forEach((device) => {
  customers.forEach((customer) => {
    const targetUrl = `${baseUrl}/de/`
    describe(`${testSpecName} @@ Default payment credit card selection in checkout - ${device.name} - ${customer.name}`, function () {
      const [w, h] = device.viewport

      beforeEach(() => {
        cy.viewport(w, h)
        cy.preserveDefaultCookies()
      })

      before(() => {
        cy.clearCookies({ domain: null })
        cy.restoreLocalStorageCache()
        cy.viewport(w, h)
        cy.visit(targetUrl)
      })

      it('login', () => {
        let { email, password } = customer
        cy.loginCustomer(email, password)
      })

      it('Should clear Basket', () => {
        cy.clearBasket(checkIsMobileOrTablet(device))
        if (checkIsMobileOrTablet(device)) {
          cy.dataCy('checkout-header-exLibrisLogo').click()
        }
      })

      it('Should add product to basket', () => {
        cy.addFirstProductOnCurrentPageToBasket()
      })

      it('Should click on basket icon', () => {
        if (checkIsMobileOrTablet) {
          cy.wait(2000)
        }
        cy.clickBasketIcon(checkIsMobileOrTablet(device))
      })

      it('Should redirect to step 2', () => {
        cy.dataCy('basket-button-step2').first().click()
      })

      it('Should redirect to step 3', () => {
        cy.dataCy('checkout-addressSend-button-submit-bottom').click()
        cy.intercept({
          method: 'POST',
          url: 'https://**/v1/Basket/BasketGet',
        }).as('basketGet')
        cy.wait('@basketGet')
        cy.wait(1000)
      })

      it('Should check default payment option', () => {
        if (customer.name === 'Visa') {
          cy.get('[data-cy=checkout-paymentMethods-1][type=radio]').should('be.checked')
        } else if (customer.name === 'Master') {
          cy.get('[data-cy=checkout-paymentMethods-0][type=radio]').should('be.checked')
        } else {
          cy.get('[data-cy=checkout-paymentMethods-2][type=radio]').should('be.checked')
        }
      })
    })
  })
})
