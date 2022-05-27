/**
 * PIC-TC-30 Warenkorb: Produkte hinzufügen (Logged in)
 */

import { baseUrl } from 'cypress/fixtures/environment'
import { customer } from 'cypress/fixtures/PIC-TC-30.data'
import { onHeader } from 'cypress/support/page-objects/header.page-object'
import { getTestSpecName } from 'lib/testSpecName'

const testSpecName = getTestSpecName(__filename)

describe(`${testSpecName} @@ Logged in - Add Items to empty basket`, function () {
  before(() => {
    // Login in as customer and have not items in basket
    // Step 1
    const targetUrl = `${baseUrl}/de/`
    cy.clearCookies()

    let { email, password } = customer
    cy.task('getLatestUser').then((latestCredentials) => {
      if (latestCredentials) {
        email = latestCredentials.email
        password = latestCredentials.password
      }
    })
    cy.wait(300)

    cy.visitWithDesktop(targetUrl)
    cy.loginCustomer(email, password)
    cy.wait(500)
  })

  beforeEach(() => {
    cy.preserveDefaultCookies(['customerCenter'])
    cy.clearBasket()
    cy.wait(500)
  })

  // Step 2 and 3
  it('should add one item to the basket from the start page, and show modal popping up with recently added item', () => {
    cy.addFirstProductOnCurrentPageToBasket()
    cy.wait(500)
    cy.dataCy('tooltip-basket-content', {
      timeout: 10000,
    }).should('be.visible')
    cy.get('[data-cy*="button-close"][type="button"]').should('have.length', 1)

    // 'should hide basket modal after 3 seconds
    cy.clock()
    cy.tick(2500)
    cy.dataCy('tooltip-basket-content').should('not.be.visible')
  })

  it('should show basket modal as long as mouse is over modal area', () => {
    cy.scrollTo('top')
    cy.wait(1000)
    cy.get('[data-cy=widget-basket-button]').trigger('mouseover')
    cy.dataCy('tooltip-basket-content', { timeout: 10000 }).should('be.visible')
  })

  it('should hide basket modal by leaving modal area', () => {
    cy.get('[data-cy=widget-basket-button]').trigger('mouseout')
    cy.dataCy('tooltip-basket-content').should('not.be.visible')
  })

  it('should go to search page and add one item to the basket from the search result page', function () {
    const { searchText } = customer

    onHeader.search(searchText)
    cy.url().should('eq', `${baseUrl}/de/suche/?q=${searchText}`)
    cy.addFirstProductOnCurrentPageToBasket()
    cy.wait(500)
    cy.get('[data-cy*="button-close"][type="button"]').should('have.length', 1)
  })
})
