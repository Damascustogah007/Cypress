/**
 * PIC-827
 */
import { baseUrl } from 'cypress/fixtures/environment'
import { getTestSpecName } from 'lib/testSpecName'
import devices, { checkIsMobileOrTablet } from 'cypress/integration/_helpers/devices'
import { storeLocation, customer } from 'cypress/fixtures/007.7.2-checkout-open-PickMup'

const testSpecName = getTestSpecName(__filename)

devices.map((device) => {
  const targetUrl = `${baseUrl}/de/`
  describe(`${testSpecName} @@ Checkout open PickMup - ${
    device.name
  } (${device.viewport.join(' x ')})`, () => {
    const [w, h] = device.viewport

    before(() => {
      cy.clearCookies({ domain: null })
      cy.visit(targetUrl)
    })

    beforeEach(() => {
      cy.viewport(w, h)
      cy.preserveDefaultCookies()
    })

    after(() => {
      cy.dataCy('checkout-header-exLibrisLogo').click()
      cy.clearBasket(checkIsMobileOrTablet(device))
    })

    it('should login', () => {
      let { email, password } = customer
      cy.loginCustomer(email, password)
    })

    it('Should add product to basket and redirect to basket', () => {
      cy.addFirstProductOnCurrentPageToBasket()
      cy.clickBasketIcon(checkIsMobileOrTablet(device))
      cy.dataCy('basket-button-step2').first().click()
    })

    it('Should enter a city in the search field (enter)', () => {
      cy.dataCy('checkoutAddressSend-shippingType-item-2').click()
      cy.dataCy('pickMup-searchField').type(`${storeLocation.city}{enter}`)
    })

    it('Should check if pop up window with range of stores is visible after entering a city', () => {
      cy.wait(1000)
      cy.dataCy('pickMup-storefinder-modalContent').should('be.visible')
      cy.dataCy('modal-button-close').click({ force: true })
    })

    it('Should enter a city in the search field (click)', () => {
      cy.dataCy('checkoutAddressSend-shippingType-item-2').click()
      cy.dataCy('pickMup-searchField').clear().type(storeLocation.city)
      cy.dataCy('pickMup-searchButton').click()
    })

    it('Should check if pop up window with range of stores is visible after entering a city', () => {
      cy.wait(1000)
      cy.dataCy('pickMup-storefinder-modalContent').should('be.visible')
      cy.dataCy('modal-button-close').click({ force: true })
    })

    it('Should enter a Zip Code in the search field (enter)', () => {
      cy.dataCy('pickMup-searchField').clear().type(`${storeLocation.zipCode}{enter}`)
    })

    it('Should check if pop up window with range of stores is visible after entering a Zip code', () => {
      cy.wait(1000)
      cy.dataCy('pickMup-storefinder-modalContent').should('be.visible')
      cy.dataCy('modal-button-close').click({ force: true })
    })

    it('Should enter a Zip Code in the search field(click)', () => {
      cy.dataCy('pickMup-searchField').clear().type(storeLocation.zipCode)
      cy.dataCy('pickMup-searchButton').click()
    })

    it('Should check if pop up window with range of stores is visible after entering a Zip code', () => {
      cy.wait(1000)
      cy.dataCy('pickMup-storefinder-modalContent').should('be.visible')
      cy.dataCy('modal-button-close').click({ force: true })
    })

    it('Should enter a Store name in the search field (enter)', () => {
      cy.dataCy('pickMup-searchField').clear().type(`${storeLocation.storeName}{enter}`)
    })

    it('Should check if pop up window with range of stores is visible after entering a store name', () => {
      cy.wait(1000)
      cy.dataCy('pickMup-storefinder-modalContent').should('be.visible')
      cy.dataCy('modal-button-close').click({ force: true })
    })

    it('Should enter a Store name in the search field (click)', () => {
      cy.dataCy('pickMup-searchField').clear().type(storeLocation.storeName)
      cy.dataCy('pickMup-searchButton').click()
    })

    it('Should check if pop up window with range of stores is visible after entering a store name', () => {
      cy.wait(1000)
      cy.dataCy('pickMup-storefinder-modalContent').should('be.visible')
      cy.dataCy('modal-button-close').click({ force: true })
    })
  })
})
