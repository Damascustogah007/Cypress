/**
 * PIC-627
 */
import { getTestSpecName } from 'lib/testSpecName'
import devices, {
  checkIsMobileOrTablet,
  checkIsDesktop,
} from 'cypress/integration/_helpers/devices'
import { baseUrl } from 'cypress/fixtures/environment'

const testSpecName = getTestSpecName(__filename)
devices.map((device) => {
  const [w, h] = device.viewport
  const targetUrl = `${baseUrl}/de/suche/?q=Die%20suche`
  describe(`${testSpecName} @@ Increase amount of position(product item) - ${
    device.name
  } (${device.viewport.join(' x ')})`, () => {
    before(() => {
      cy.viewport(w, h)
      cy.clearCookies({ domain: null })
      cy.visit(targetUrl)
    })

    beforeEach(() => {
      cy.viewport(w, h)
      cy.preserveDefaultCookies()
    })

    it('should add/change quantity of products outside the basket', () => {
      cy.wait(1000)
      cy.addFirstProductOnCurrentPageToBasket()
      cy.wait(500)
      cy.addFirstProductOnCurrentPageToBasket()
      cy.clickBasketIcon(checkIsMobileOrTablet(device))
      cy.get('[data-cy*="basket-product_val"][type="text"]')
        .should('have.value', '2')
        .and('be.visible')
      cy.dataCy('checkout-header-exLibrisLogo').click()
    })

    if (checkIsDesktop(device)) {
      it('Should delete the product outside the basket', () => {
        cy.dataCy('widget-basket-button').trigger('mouseover')
        cy.get('[data-cy*="tooltip-item_val"][type="button"]')
          .first()
          .invoke('show')
          .click({ force: true })
        cy.get('[data-cy="widgetwishcart-modal-alert-empty"]')
          .should('contain', 'Ihr Warenkorb ist leer.')
          .and('be.visible')
      })

      it('should add first product to the basket', () => {
        cy.addFirstProductOnCurrentPageToBasket()
      })
    }

    it('should redirect to step 1', () => {
      cy.clickBasketIcon(checkIsMobileOrTablet(device))
    })

    it('should increase product quantity when a value  is entered', () => {
      cy.get('[data-cy*="basket-product_val"][type="text"]')
        .first()
        .clear()
        .type('3{enter}')
      cy.dataCy('checkout-basket-productList-totalPrice')
        .invoke('text')
        .then(($productPrice) => {
          expect($productPrice.length).to.be.greaterThan(7)
        })
    })

    if (checkIsDesktop(device)) {
      it('should increase the quantity of a product when the "+" icon is clicked', () => {
        cy.dataCy('product-list-item-addOne').click()
        cy.get('[data-cy*="basket-product_val"][type="text"]')
          .should('have.value', '4')
          .and('be.visible')
      })
    }
  })
})
