/**
PIC-830
*/

import { baseUrl } from 'cypress/fixtures/environment'
import { getTestSpecName } from 'lib/testSpecName'
import devices, { checkIsMobileOrTablet } from 'cypress/integration/_helpers/devices'

import {
  customer,
  store01,
  store02,
} from 'cypress/fixtures/007.7.3-checkout-PickMup-choose-store.data.js'

const testSpecName = getTestSpecName(__filename)

devices.map((device) => {
  const targetUrl = `${baseUrl}/de/`
  const [w, h] = device.viewport

  describe(`${testSpecName} @@ Checkout-PickMup-choose-store - ${
    device.name
  } (${device.viewport.join(' x ')})`, () => {
    before(() => {
      cy.viewport(w, h)
      cy.clearCookies({ domain: null })
      cy.restoreLocalStorageCache()
      cy.visit(targetUrl)
    })

    beforeEach(() => {
      cy.viewport(w, h)
      cy.preserveDefaultCookies()
    })

    it('should login', () => {
      let { email, password } = customer
      cy.loginCustomer(email, password)
    })

    it('Should clear basket', () => {
      cy.clearBasket(checkIsMobileOrTablet(device))
      if (checkIsMobileOrTablet(device)) {
        cy.dataCy('checkout-header-exLibrisLogo').click()
      }
    })

    it('should add one item to the basket from the start page', () => {
      cy.addFirstProductOnCurrentPageToBasket()
    })

    it('Should redirect to basket', () => {
      cy.clickBasketIcon(checkIsMobileOrTablet(device))
      cy.dataCy('basket-button-step2').should('be.visible')
    })

    it('Should redirect to step 2', () => {
      cy.dataCy('basket-button-step2').first().click({ force: true })
    })

    it('Should click on the "Location Choose" button', () => {
      cy.dataCy('checkoutAddressSend-shippingType-item-1').next().click()

      cy.dataCy('addrAndDelivery-storefinder')
        .select(store01.id)
        .should('be.visible')
        .and('contain', store01.name)
    })

    it('Chosen location should remain the same as long as no other location is gets selected', () => {
      cy.reload()
      cy.dataCy('addrAndDelivery-storefinder')
        .should('be.visible')
        .and('contain', store01.name)
    })

    it('Input field should remain editable', () => {
      cy.dataCy('addrAndDelivery-storefinder').select(store02.id)
      cy.dataCy('addrAndDelivery-storefinder')
        .should('be.visible')
        .and('contain', store02.name)
    })
  })
})
