/**
 * PIC-811
 */
import {
  defaultBillingAddress,
  editedBillingAddress,
  customer,
} from 'cypress/fixtures/007.5-edit.customer.billing.data'
import { baseUrl } from 'cypress/fixtures/environment'
import devices, { checkIsMobileOrTablet } from 'cypress/integration/_helpers/devices'
import { getTestSpecName } from 'lib/testSpecName'
import {
  editBillingAddress,
  validateEditedBillingAddress,
} from 'cypress/support/checkout'

const testSpecName = getTestSpecName(__filename)

let userAddress = defaultBillingAddress

devices.forEach((device) => {
  const targetUrl = `${baseUrl}/de`
  const isMobileOrTablet = checkIsMobileOrTablet(device)
  describe(`${testSpecName} - @@ Edit Customer Billing Address - ${device.name}`, function () {
    const [w, h] = device.viewport
    before(() => {
      cy.viewport(w, h)
      cy.clearCookies()

      cy.visit(targetUrl, { retryOnStatusCodeFailure: true })

      let { email, password } = customer
      cy.loginCustomer(email, password)
    })

    beforeEach(() => {
      cy.viewport(w, h)
      cy.preserveDefaultCookies()
    })

    it('Clear basket', () => {
      cy.clearBasket(isMobileOrTablet)
      if (isMobileOrTablet) {
        cy.dataCy('basket-button-back').click({ force: true })
      }
    })

    it('Add product to basket', () => {
      cy.addFirstProductOnCurrentPageToBasket()
    })
    it('Click on basket icon and redirect to the basket', () => {
      if (isMobileOrTablet) {
        cy.dataCy('header-mobile-basket').click({ force: true })
      } else {
        cy.dataCy('widget-basket-button').trigger('mouseover')
        cy.dataCy('tooltip-basket-cat').click({ force: true })
      }
    })

    it('Redirect to step 2', () => {
      cy.dataCy('basket-button-step2').last().click({
        force: true,
      })
      cy.dataCy('checkout-address-changeBillAddressLink').click({
        force: true,
      })
    })

    it('Edit customer billing Address', () => {
      editBillingAddress(editedBillingAddress)
    })

    it('Validate the edited billing address', () => {
      validateEditedBillingAddress(editedBillingAddress)
    })

    it('Reset the edited billing address', () => {
      cy.dataCy('checkout-address-changeBillAddressLink').click()
      editBillingAddress(userAddress)
    })

    it('Validate the edited billing address', () => {
      validateEditedBillingAddress(userAddress)
    })
  })
})
