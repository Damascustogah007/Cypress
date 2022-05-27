/**
 * PIC-818
 * PIC-823
 */

import { baseUrl } from 'cypress/fixtures/environment'
import { getTestSpecName } from 'lib/testSpecName'
import devices, { checkIsMobileOrTablet } from 'cypress/integration/_helpers/devices'
import {
  customer,
  defaultDeliveryAddress,
  editedDeliveryAddress,
} from 'cypress/fixtures/007.7.4-checkout-edit-delivery-address.data.js'

const testSpecName = getTestSpecName(__filename)

devices.forEach((device) => {
  const targetUrl = `${baseUrl}/de`
  const [w, h] = device.viewport
  describe(`${testSpecName} - @@ Edited Shipping address - ${device.name}`, () => {
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

    it('clear and add first item to basket basket', () => {
      cy.wait(2000)
      cy.clearBasket(checkIsMobileOrTablet(device))
      if (checkIsMobileOrTablet(device)) {
        cy.dataCy('checkout-header-exLibrisLogo').click()
      }
      cy.wait(1000)
      cy.addFirstProductOnCurrentPageToBasket()
    })

    it('should click on basket icon and redirect to step 1', () => {
      cy.clickBasketIcon(checkIsMobileOrTablet(device))
    })

    it('should redirect to step 2', () => {
      cy.dataCy('basket-button-step2').first().click()
    })

    it("should redirect to 'Change delivery address' and edit the input fields", () => {
      cy.dataCy('checkout-addressSend-button-changeAddress').click({ force: true })
      cy.url().should('include', '/lieferadresse-aendern')
      cy.dataCy('deliveryAddressChange-button-sameAsInvoice').should('not.exist')
      cy.dataCy('checkout-formDeliveryAddressChange-form').should('exist')
      cy.dataCy('deliveryAddressChange-select-salutation')
        .should('be.visible')
        .select(editedDeliveryAddress.salutation)
      cy.dataCy('deliveryAddressChange-input-firstname')
        .should('be.visible')
        .clear()
        .type(editedDeliveryAddress.firstName)
      cy.dataCy('deliveryAddressChange-input-company')
        .should('exist')
        .clear()
        .type(editedDeliveryAddress.company)
      cy.dataCy('deliveryAddressChange-input-lastname')
        .should('exist')
        .clear()
        .type(editedDeliveryAddress.lastName)
      cy.dataCy('deliveryAddressChange-button-submitbottom').should('exist').click()
    })

    it('should validate the edited changed delivery address', () => {
      cy.dataCy('homeDeliveryAddress').children().as('deliveryAddress')
      cy.get('@deliveryAddress').eq(0).should('contain', editedDeliveryAddress.company)
      cy.get('@deliveryAddress')
        .eq(1)
        .should(
          'contain',
          `${editedDeliveryAddress.salutation} ${editedDeliveryAddress.firstName} ${editedDeliveryAddress.lastName}`,
        )
    })

    it('should click on change delivery address button to revert the changes', () => {
      cy.dataCy('checkout-addressSend-button-changeAddress').click()
      cy.dataCy('deliveryAddressChange-button-sameAsInvoice').should('be.visible').click()
    })

    it('should validate whether the reverted delivery address is the same as the billing address', () => {
      cy.dataCy('homeDeliveryAddress').children().as('deliveryAddress')
      const { salutation, firstName, lastName, company } = defaultDeliveryAddress
      cy.get('@deliveryAddress').eq(0).should('contain', company)
      cy.get('@deliveryAddress')
        .eq(1)
        .should('contain', `${salutation} ${firstName} ${lastName}`)
    })
  })
})
