/**
 * PIC-629
 */
import { baseUrl } from 'cypress/fixtures/environment'
import { customer } from 'cypress/fixtures/006.2-basket.data'
import { getTestSpecName } from 'lib/testSpecName'
import devices, { checkIsMobileOrTablet } from 'cypress/integration/_helpers/devices'

const testSpecName = getTestSpecName(__filename)

const _dev = [devices[0]]

_dev.map((device) => {
  const targetUrl = `${baseUrl}/de/`
  const isMobileOrTablet = checkIsMobileOrTablet(device)
  describe(`${testSpecName} @@ Remove from basket - ${
    device.name
  } (${device.viewport.join('x')})`, () => {
    const [w, h] = device.viewport

    before(() => {
      cy.viewport(w, h)
      cy.clearCookies({ domain: null })
      cy.restoreLocalStorageCache()
      cy.visit(targetUrl)
    })

    beforeEach(() => {
      cy.viewport(w, h)
      cy.preserveDefaultCookies()
    })

    it('should login', () => {
      let { email, password } = customer
      cy.loginCustomer(email, password)
    })

    it('Should clear basket', () => {
      cy.clearBasket(isMobileOrTablet)
      if (isMobileOrTablet) {
        cy.dataCy('checkout-header-exLibrisLogo').click()
      }
    })

    if (!isMobileOrTablet) {
      it('should add products outside the basket', () => {
        cy.addFirstProductOnCurrentPageToBasket()
        cy.wait(500)
        cy.dataCy('tileEngine-button-basket').eq(2).click()
        cy.wait(500)
      })

      it('Should delete the first product in the basket', () => {
        cy.dataCy('widget-basket-button').trigger('mouseover')
        cy.get('[data-cy*="tooltip-item_val"][type="button"]')
          .first()
          .invoke('show')
          .click({ force: true })
      })

      // it('Should validate the amount of the product in the basket', () => {
      //   cy.dataCy('tooltip-basket-content')
      //     .children()
      //     .eq(1)
      //     .children()
      //     .eq(1)
      //     .invoke('text')
      //     .then(($productPrice) => {
      //       expect($productPrice.length).to.be.greaterThan(7) // 7 stands for seven digits e.g "CHF .00"
      //     })
      // })
    }

    it('should increase quantity of products outside the basket', () => {
      cy.addFirstProductOnCurrentPageToBasket()
      cy.wait(500)
      cy.addFirstProductOnCurrentPageToBasket()
      cy.wait(500)
      cy.dataCy('tileEngine-button-basket').eq(2).click()
      cy.wait(500)
      if (isMobileOrTablet) {
        cy.dataCy('header-mobile-basket').click()
      } else {
        cy.clickBasketIcon()
      }
      cy.get('[data-cy*="basket-product_val"][type="text"]')
        .first()
        .should('have.value', '2')
        .and('be.visible')
    })

    it('should check if quantity field does not accept negative (-) value', () => {
      cy.get('[data-cy*="basket-product_val"][type="text"]')
        .first()
        .clear()
        .type('-1{enter}')
        .should('have.value', '1')
    })

    if (!isMobileOrTablet) {
      it("should remove a product from the basket by clicking '-'", () => {
        cy.dataCy('product-list-item-removeOne').first().click()
        cy.dataCy('checkout-basket-productList-totalPrice')
          .invoke('text')
          .then(($productPrice) => {
            expect($productPrice.length).to.be.greaterThan(7) // 7 stands for seven digits e.g "CHF .00"
          })
      })
    }

    it('should remove a product from the basket by changing quantity to 0', () => {
      if (isMobileOrTablet) {
        cy.get('[data-cy*="basket-product_val"][type="text"]')
          .first()
          .clear()
          .type('0{enter}')
      } else {
        cy.dataCy('checkout-header-exLibrisLogo').click()
        cy.wait(500)
        cy.dataCy('tileEngine-button-basket').eq(2).click()
        cy.clickBasketIcon()
        cy.get('[data-cy*="basket-product_val"][type="text"]')
          .first()
          .clear()
          .type('0{enter}')
      }
      // cy.dataCy('checkout-basket-productList-totalPrice')
      // .invoke('text')
      // .then(($productPrice) => {
      //   expect($productPrice.length).to.be.greaterThan(7) // 7 stands for seven digits e.g "CHF .00"
      // })
    })

    it("should remove a product from basket by clicking 'x' icon", () => {
      cy.dataCy('checkout-header-exLibrisLogo').click()
      cy.wait(500)
      cy.addFirstProductOnCurrentPageToBasket()
      if (isMobileOrTablet) {
        cy.dataCy('header-mobile-basket').click()
        cy.get('[data-cy$="button-close"]').first().click()
      } else {
        cy.clickBasketIcon()
        cy.dataCy('product-list-item-removeProduct').first().click()
      }
      // cy.dataCy('checkout-basket-productList-totalPrice')
      // .invoke('text')
      // .then(($productPrice) => {
      //   expect($productPrice.length).to.be.greaterThan(7) // 7 stands for seven digits e.g "CHF .00"
      // })
    })
  })
})
