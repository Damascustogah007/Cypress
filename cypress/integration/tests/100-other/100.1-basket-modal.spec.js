import { baseUrl } from 'cypress/fixtures/environment'
import { getTestSpecName } from 'lib/testSpecName'

const testSpecName = getTestSpecName(__filename)

describe(`${testSpecName} @@ Basket Modal Message`, function () {

  before(() => {
      cy.visitWithViewport(baseUrl + '/de')
  })

  it('Should Hover on button', function () {
    const expectEmptyTextDe = 'Ihr Warenkorb ist leer.'
    cy.get('[data-cy="widget-basket-button"]', { timeout: 6000 }).trigger('mouseover')
    cy.get('[data-cy=widgetwishcart-modal-alert-empty]', {
      timeout: 5000,
    }).should('have.text', expectEmptyTextDe)
  })

    it('Should Hover on button and be closeable', function () {
        cy.get('[data-cy="widget-basket-button"]').trigger('mouseover', {
            cancelable: true,
        })
        cy.get('[data-cy=widgetwishcart-modal-alert-empty]').should('be.visible')
        cy.get('[data-cy="widget-basket-button"]').trigger('mouseout', {
            cancelable: true,
        })
        cy.get('[data-cy=widgetwishcart-modal-alert-empty]').should('not.be.visible')
    })
})

describe(`${testSpecName} @@ Basket Modal Close`, function () {

})
