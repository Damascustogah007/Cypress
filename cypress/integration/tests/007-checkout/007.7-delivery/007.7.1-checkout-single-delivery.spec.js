/**
 * PIC-817
 */
import { baseUrl } from 'cypress/fixtures/environment'
import { customer } from 'cypress/fixtures/007.7.1-checkout.data'
import { getTestSpecName } from 'lib/testSpecName'
import devices, { checkIsMobileOrTablet } from 'cypress/integration/_helpers/devices'

const testSpecName = getTestSpecName(__filename)

const checkStringLength = ($el) => {
  const text = $el[0].innerText
  expect(text.length).to.be.greaterThan(0)
}

devices.map((device) => {
  const [w, h] = device.viewport
  const targetUrl = `${baseUrl}/de/`
  describe(`${testSpecName} @@ Checkout - Delivery - Single delivery ${device.name}`, function () {
    before(() => {
      cy.viewport(w, h)
      cy.clearCookies({ domain: null })
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
      cy.wait(2000)
      cy.clearBasket(checkIsMobileOrTablet(device))
      if (checkIsMobileOrTablet(device)) {
        cy.dataCy('checkout-header-exLibrisLogo').click()
      }
    })

    it('should add one item to the basket from the start page', () => {
      cy.addFirstProductOnCurrentPageToBasket()
      cy.wait(500)
    })

    it('should add second item to the basket from the start page', () => {
      cy.dataCy('tileEngine-button-basket').eq(2).click()
    })

    it('Should redirect to basket', () => {
      cy.clickBasketIcon(checkIsMobileOrTablet(device))
    })

    it('Should redirect to step 2', () => {
      cy.dataCy('basket-button-step2').first().click()
    })

    it('Should check the See shipping dates.', () => {
      cy.dataCy('checkoutAddressSend-shippingOption-item-0').next().click()
      cy.dataCy('checkoutAddressSend-shippingOption-item-0').should('have.checked', true)
    })

    it('Should validate the product details on "See shipping dates".', () => {
      cy.dataCy('checkout-addressSend-button-link').click()
      cy.dataCy('modal-button-close').next().children().as('shippingDetails')

      cy.get('@shippingDetails')
        .eq(2)
        .children()
        .as('firstProductDetails')
        .eq(1)
        .find('p')
        .then(($el) => {
          checkStringLength($el) // check whether product name of the first product is available
        })
      cy.get('@firstProductDetails')
        .eq(2)
        .find('p')
        .eq(0)
        .then(($el) => {
          checkStringLength($el) // check whether shipping date description of the first product is available
        })
      cy.get('@firstProductDetails')
        .eq(2)
        .find('p')
        .eq(1)
        .then(($el) => {
          checkStringLength($el) // check whether shipping date of the first product is available
        })

      cy.get('@shippingDetails')
        .eq(3)
        .children()
        .as('secondProductDetails')
        .eq(1)
        .find('p')
        .then(($el) => {
          checkStringLength($el) // check whether product name of the second product is available
        })
      cy.get('@secondProductDetails')
        .eq(2)
        .find('p')
        .eq(0)
        .then(($el) => {
          checkStringLength($el) // check whether shipping date description of the second product is available
        })
      cy.get('@secondProductDetails')
        .eq(2)
        .find('p')
        .eq(1)
        .then(($el) => {
          checkStringLength($el) // check whether shipping date of the second product is available
        })
    })
  })
})
