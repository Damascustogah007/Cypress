import { baseUrl } from 'cypress/fixtures/environment'
import namedViewports from 'cypress/integration/_helpers/viewports'
import { getTestSpecName } from 'lib/testSpecName'

const testSpecName = getTestSpecName(__filename)
describe(`${testSpecName} @@ Register in Checkout `, function () {
  before(() => {
    const [w, h] = namedViewports.desktop
    cy.viewport(w, h)
    cy.clearCookies()
    cy.visit(baseUrl)
  })

  beforeEach(() => {
    cy.preserveDefaultCookies()
  })

  it('should add one item to basket and show one item in basket page', () => {
    cy.visit(baseUrl)
    cy.addFirstProductOnCurrentPageToBasket()
    cy.clickBasketIcon()

    cy.location('pathname').should('equal', '/de/bestellung/warenkorb/') // "/fr/ordre/panier/""
    cy.dataCy('product-list-item').should('have.length', 1)
  })

  it('Can go to checkout page 2', () => {
    cy.dataCy('basket-button-step2').first().click()

    cy.location('pathname').should('equal', '/de/bestellung/login/') // TODO: FR
    cy.dataCy('als-Gast-bestellen-module').should('exist')
  })

  it('goes to register page and has the right tracking parameter ', () => {
    cy.get('[data-cy=neukunde-registrierung-module]').find('button').click()

    cy.location().should((loc) => {
      expect(loc.pathname).to.be.equal('/de/bestellung/adresse/neues-konto/')
      expect(loc.search).to.contain('step=1')
      expect(loc.search).to.contain('rt=n')
    }) // TODO: FR
  })
})
