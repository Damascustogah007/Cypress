/**
 * PIC-TC-29 Warenkorb: Warenkorbs Ansicht (leer)
 */

import { baseUrl } from 'cypress/fixtures/environment'
import { customer } from 'cypress/fixtures/PIC-TC-29.data'
import { getTestSpecName } from 'lib/testSpecName'

const testSpecName = getTestSpecName(__filename)

describe(`${testSpecName} @@ Show empty basket`, () => {
  before(() => {
    // Login in as customer and have not items in basket
    // Step 1
    const targetUrl = `${baseUrl}/de/`
    cy.clearCookies()

    cy.visitWithDesktop(targetUrl)

    let { email, password } = customer
    cy.task('getLatestUser').then((latestCredentials) => {
      if (latestCredentials) {
        email = latestCredentials.email
        password = latestCredentials.password
      }
      cy.loginCustomer(email, password)
      cy.wait(500)

      cy.clearBasket()

      cy.preserveDefaultCookies()
    })
  })

  // Step 2
  it('should redirect to basket page', () => {
    cy.get('[data-cy="widget-basket-button"]').click()
    cy.location().should((location) => {
      expect(location.pathname).to.eq('/de/bestellung/warenkorb/')
    })
  })

  // Step 3
  it('should show message with content "Ihr Warenkorb ist leer"', () => {
    cy.dataCy('basket-advice-empty')
      .should('contain', 'Ihr Warenkorb ist leer')
      .and('be.visible')
  })
})
