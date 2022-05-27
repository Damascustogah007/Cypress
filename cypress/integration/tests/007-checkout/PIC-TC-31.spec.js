/**
 * PIC-TC-31 Warenkorb: Produkte hinzufügen(not logged in)
 */

import { baseUrl } from 'cypress/fixtures/environment'
import { customer } from 'cypress/fixtures/PIC-TC-31.data'
import { onBasket } from 'cypress/support/page-objects/basket.page-object'
import { onHeader } from 'cypress/support/page-objects/header.page-object'
import { onStartPage } from 'cypress/support/page-objects/startPage.page-object'
import { getTestSpecName } from 'lib/testSpecName'

const testSpecName = getTestSpecName(__filename)

describe(`${testSpecName} @@ Logged out - Add Items to empty basket`, function () {
  before(() => {
    cy.clearCookies()
  })

  beforeEach(() => {
    const targetUrl = `${baseUrl}/de/`
    cy.visitWithDesktop(targetUrl)
    cy.wait(2000)

    cy.preserveDefaultCookies(['customerCenter'])
    cy.intercept({
      method: 'POST',
      url: 'https://**/v1/Basket/BasketGet',
    }).as('basketGet')

    cy.intercept({
      method: 'POST',
      url: 'https://**/v1/Basket/BasketItemAdd',
    }).as('addItem')
    cy.clock()
  })

  let startTime

  // Step 2
  it('should add one item to the basket from the start page and hide popup after 3 seconds', () => {
    cy.clearBasket()
    cy.tick(1000)
    cy.addFirstProductOnCurrentPageToBasket()
    cy.tick(500)
    cy.get('[data-cy*="button-close"][type="button"]').should('have.length', 1)
    cy.tick(2500)
    cy.dataCy('tooltip-basket-content').should('not.be.visible')
  })

  // Step 4
  const { searchText } = customer

  it('should redirect to the search page if click on the button and add first item from search page', function () {
    cy.clearBasket()
    cy.tick(500)
    onHeader.search(searchText)
    cy.url().should('eq', `${baseUrl}/de/suche/?q=${searchText}`)
    cy.tick(1000)
    cy.addFirstProductOnCurrentPageToBasket()
    cy.tick(500)
    cy.get('[data-cy*="button-close"][type="button"]').should('have.length', 1)
  })
})
