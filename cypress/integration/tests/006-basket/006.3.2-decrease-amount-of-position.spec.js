/**
 * PIC-628
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

  describe(`${testSpecName} @@ Decrease amount of position(product item) - ${
    device.name
  } (${device.viewport.join(' x ')})`, () => {
    before(() => {
      cy.viewport(w, h)
      cy.clearCookies()

      cy.visit(targetUrl)
    })

    beforeEach(() => {
      cy.viewport(w, h)
      cy.preserveDefaultCookies()
    })

    after(() => {
      cy.clearCookies()
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

    it('Should redirect to step 1', () => {
      cy.clickBasketIcon(checkIsMobileOrTablet(device))
    })

    it('Should type product quantity', () => {
      cy.get('[data-cy*="basket-product_val"][type="text"]').clear().type('2{enter}')
      cy.get('[data-cy*="basket-product_val"][type="text"]')
        .should('have.value', '2')
        .and('be.visible')

      cy.get('[data-cy*="basket-product_val"][type="text"]').clear().type('1{enter}')
    })

    it('Should check quantity and total price', () => {
      cy.get('[data-cy*="basket-product_val"][type="text"]')
        .should('have.value', '1')
        .and('be.visible')
      cy.wait(1000)
      cy.dataCy('checkout-basket-productList-totalPrice')
        .invoke('text')
        .then(($productPrice) => {
          expect($productPrice.length).to.be.greaterThan(7)
        })
    })

    if (checkIsDesktop(device)) {
      it('Should navigate to the exlibris page', () => {
        cy.dataCy('checkout-header-exLibrisLogo').click()
      })

      it('Should add item to basket', () => {
        cy.wait(1000)
        cy.addFirstProductOnCurrentPageToBasket()
      })

      it('Should redirect to step 1', () => {
        cy.wait(1000)
        cy.clickBasketIcon()
      })

      it('Should decrease quantity of product by clicking the decrease button', () => {
        cy.get('[data-cy*="basket-product_val"][type="text"]')
          .should('have.value', '2')
          .and('be.visible')
        cy.dataCy('product-list-item-removeOne').click()
      })

      it('Should check quantity and total price', () => {
        cy.get('[data-cy*="basket-product_val"][type="text"]')
          .should('have.value', '1')
          .and('be.visible')
        cy.dataCy('checkout-basket-productList-totalPrice')
          .invoke('text')
          .then(($productPrice) => {
            expect($productPrice.length).to.be.greaterThan(7)
          })
      })

      it('Should remove last item from the basket', () => {
        cy.dataCy('product-list-item-removeProduct').click()
        cy.get('[data-cy="basket-advice-empty"]')
          .should('contain', 'Ihr Warenkorb ist leer.')
          .and('be.visible')
      })
    }
  })
})
