/**
 * PIC-625
 */

import { baseUrl } from 'cypress/fixtures/environment'
import { userWithOneProduct } from 'cypress/fixtures/009.1-basket-flyout-with-products.data'
import { getTestSpecName } from 'lib/testSpecName'
import { onHeader } from 'cypress/support/page-objects/header.page-object'

import { checkBasketFlyout } from './009.1-helper'

const testSpecName = getTestSpecName(__filename)
const userTypes = ['LOGGED_IN', 'LOGGED_OUT']

const prepareTestConditions = (userType) => {
  const targetUrl = `${baseUrl}/de/suche/?q=Marvel`
  cy.clearCookies({ domain: null })
  cy.visitWithDesktop(targetUrl)

  if (userType === 'LOGGED_IN') {
    cy.loginCustomer(userWithOneProduct.email, userWithOneProduct.password)
    return
  }
}

const preserveCookiesOnce = () => {
  cy.preserveDefaultCookies()
}

userTypes.forEach((userType) => {
  describe(`${testSpecName} @@ ${userType} - Add Item to empty basket`, () => {
    before(() => prepareTestConditions(userType))

    beforeEach(preserveCookiesOnce)

    it('Clear and add first item to basket', () => {

      cy.wait(2000)
      cy.clearBasket()
      cy.wait(1000)
      cy.addFirstProductOnCurrentPageToBasket()
    })
    it('Show modal popping up with recently added item', () => {
      cy.dataCy('tooltip-basket-content', {
        timeout: 5000,
      }).should('be.visible')

      cy.get('[data-cy*="button-close"][type="button"]').should('exist')

      cy.dataCy('tooltip-basket-content')
        .children()
        .last()
        .prev()
        .its('length')
        .should('be.gt', 0)

      cy.dataCy('tooltip-basket-content').should('not.be.visible')
    })

    it('Show and hide basket modal, get number of items, add to cart button and price from cart', (done) => {
      const expectedItemAmount = 1
      checkBasketFlyout(expectedItemAmount)
      done()
    })
  })

  describe(`${testSpecName} @@ ${userType} - Add Item to basket from item search`, () => {
    before(() => prepareTestConditions(userType))

    beforeEach(preserveCookiesOnce)

    const { searchText } = userWithOneProduct

    it('Add first product on current page to basket', () => {
      onHeader.search(searchText)
      cy.addFirstProductOnCurrentPageToBasket()
    })
    it('Show modal popping up when an item has been added to cart after item search', () => {
      cy.wait(500)
      cy.dataCy('tooltip-basket-content', {
        timeout: 3000,
      }).should('be.visible')
      cy.get('[data-cy*="button-close"][type="button"]').should('exist')
      cy.dataCy('tooltip-basket-content').should('not.be.visible')
    })

    it('Show and hide basket modal, get number of items from cart', (done) => {
      const expectedItemAmount = 2
      checkBasketFlyout(expectedItemAmount)
      done()
    })
  })

  describe(`${testSpecName} @@ ${userType} - Add Item from the product details page`, () => {
    before(() => prepareTestConditions(userType))

    beforeEach(preserveCookiesOnce)

    it('Click on a product on the start page and redirect to product details page', () => {
      cy.dataCy('tileEngine-link-pdp').eq(0).click()
      cy.dataCy('pdp-image-cover').should('be.visible')
      cy.dataCy('pdp-button-cart').click()
    })

    it('Show and hide basket modal, get number of items from cart for an item on the product details page', (done) => {
      const expectedItemAmount = 3
      checkBasketFlyout(expectedItemAmount)
      done()
    })
  })
})
