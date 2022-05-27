/*
 * PIC-813
 */
import { baseUrl } from 'cypress/fixtures/environment'
import { getTestSpecName } from 'lib/testSpecName'
import devices, { checkIsMobileOrTablet } from 'cypress/integration/_helpers/devices'
import { customer } from 'cypress/fixtures/007.6.2-cumulus.data.json'

const testSpecName = getTestSpecName(__filename)

devices.forEach((device) => {
  const [w, h] = device.viewport
  const targetUrl = baseUrl + `/de`
  describe(`${testSpecName}  @@Logged in - Enter invalid cumulus number - ${device.name}`, () => {
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
      cy.wait(1000)
    })

    it('Should clear basket', () => {
      cy.clearBasket(checkIsMobileOrTablet(device))
      if (checkIsMobileOrTablet(device)) {
        cy.dataCy('checkout-header-exLibrisLogo').click()
      }
    })

    it('should add item to cart from start page', () => {
      cy.get('[data-cy="tileEngine-button-basket"]').first().click({ force: true })
    })

    it('should redirect to basket', () => {
      cy.clickBasketIcon(checkIsMobileOrTablet(device))
    })

    it('should redirect to step 2', () => {
      cy.dataCy('basket-button-step2').first().click()
    })

    it('Should enter invalid cumulus number and click vouchers and coupon button', function () {
      cy.dataCy('checkout-address-input-cumulusnr').clear().type(2099991)
    })

    it('should validate error message', () => {
      cy.dataCy('checkout-addressSend-button-submit-bottom').click()
      cy.dataCy('checkout-address-input-cumulusnr')
        .should('have.css', 'border-color', 'rgb(191, 13, 62)')
        .next()
        .should(($el) => {
          expect($el).to.have.length(1)
          const className = $el[0].className
          expect(className).to.match(/input-error/)
        })
    })
  })
})
