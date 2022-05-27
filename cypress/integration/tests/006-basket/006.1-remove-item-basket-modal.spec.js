/**
 * PIC-630
 */

import { baseUrl } from 'cypress/fixtures/environment'
import { onBasket } from 'cypress/support/page-objects/basket.page-object'
import { getTestSpecName } from 'lib/testSpecName'
import {
  clickInSearchResultProductByIndex,
  deleteProductFromBasketByIndex,
} from './006.1-helpers.js'

const testSpecName = getTestSpecName(__filename)

const targetUrl = `${baseUrl}/de/`
describe(`${testSpecName} @@ Remove from basket (on basket Pop-Up widget)`, () => {
  before(() => {
    cy.visitWithDesktop(targetUrl)
  })

  beforeEach(() => {
    cy.preserveDefaultCookies()
  })

  it('Should add products in the basket', () => {
    cy.visit(`${targetUrl}suche/?q=Buch`, {
      failOnStatusCode: false,
    })
    for (let i = 0; i < 2; i++) {
      clickInSearchResultProductByIndex(0)
    }
    clickInSearchResultProductByIndex(1)
  })

  it('Should check if products are in the basket', () => {
    onBasket.assertNumberOfItemsInBasketToEqual(3)
  })

  it('Should remove product with quantity greater than one from the basket', () => {
    deleteProductFromBasketByIndex(0)
  })

  it('Should validate the remaining quantity of product in the basket', () => {
    onBasket.assertNumberOfItemsInBasketToEqual(1)
  })

  it('Should delete the last product in the basket', () => {
    deleteProductFromBasketByIndex(0)
    onBasket.assertNumberOfItemsInBasketToEqual(0)
  })

  it('Should check timeouts of the basket FlyOuts', () => {
    cy.scrollTo('top')
    cy.clock()
    cy.tick(1000)
    cy.dataCy('tooltipModal-content').should('not.exist')
  })
})
