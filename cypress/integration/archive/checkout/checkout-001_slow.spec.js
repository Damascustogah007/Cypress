import { baseUrl } from 'cypress/fixtures/environment'

import { customer_new as customer } from 'cypress/fixtures/extras/checkout-001.data'
import { getTestSpecName } from 'lib/testSpecName'

const testSpecName = getTestSpecName(__filename)

describe(`${testSpecName} @@ Login as customer with items in basket`, function () {
  before(() => {
    cy.clearCookies()

    const targetUrl = `${baseUrl}/de/`
    cy.visitWithDesktop(targetUrl)

    // Login in as customer
    const { email, password } = customer
    cy.get('[data-cy=loginmodal-desktoplogin-toogle]').click()
    cy.get('[data-cy=login-input-email]').type(email)
    cy.get('[data-cy=login-input-password]').type(password)
    cy.wait(1500)
    cy.get('[data-cy=login-submit]').click({ force: true })

    // Automatically be redirected to home
    cy.preserveDefaultCookies()

    /* Checking for items in basket
     * if the basket is empty => add one item
     **/
    cy.get('[data-cy=widget-basket-button]').then(($el) => {
      const itemsInBasketAmount = $el[0].innerText
      if (itemsInBasketAmount === '0') {
        cy.get('[data-cy="main-navigation-menuItem"]').first().click()
        cy.wait(1000)
        cy.get('[data-cy="flyout-navigation-subMenuItem"]').first().click()
        cy.wait(1000)
        cy.get('[data-cy="productBox-basket-button"]').first().click({ force: true })
      }
    })
  })

  beforeEach(() => {
    cy.preserveDefaultCookies()
  })

  it('should redirect to basket', () => {
    cy.wait(5000)
    cy.get('[data-cy=widget-basket-button]').click()

    cy.location().should((location) => {
      expect(location.pathname).to.eq('/de/bestellung/warenkorb')
    })
  })

  it('should redirect to step 2', () => {
    cy.wait(4000)
    cy.get('[data-cy=basket-button-step2]').eq(1).click()
    cy.location().should((location) => {
      expect(location.pathname).to.eq('/de/bestellung/adresse')
    })
  })

  it('should display customer company name in bill address at checkout step 2 page', () => {
    cy.get('[data-cy=checkout-addressCopy-customerCompany]').should(
      'have.text',
      'nexum AG',
    )
  })

  it('should display customer name in bill address at checkout step 2 page', () => {
    cy.get('[data-cy=checkout-addressCopy-customerName]').should(
      'have.text',
      'Herr Mario Nexum Tester',
    )
  })

  it('should display customer street in bill address at checkout step 2 page', () => {
    cy.get('[data-cy=checkout-addressCopy-customerStreet]').should(
      'have.text',
      'Oberer Graben 1,',
    )
  })

  it('should display customer location in bill address at checkout step 2 page', () => {
    cy.get('[data-cy=checkout-addressCopy-customerLocation]').should(
      'have.text',
      'CH-9000 St. Gallen',
    )
  })

  // it('should display customer bill address information at checkout step 2 page', () => {
  //   cy.get('[data-cy=checkout-address').should($address => {
  //     const children = $address.children();
  //
  //     const lines = children.map((i, el) => {
  //       return Cypress.$(el).text();
  //     });
  //
  //     expect(lines.get()).to.deep.eq([
  //       'nexum AG',
  //       'Herr Mario Nexum Tester',
  //       'Oberer Graben 1,',
  //       'CH-9000 St. Gallen'
  //     ]);
  //
  //   });
  // });

  it('should have radio delivery option "Einzellieferung" checked', () => {
    cy.get('[data-cy=checkoutAddressSend-shippingOption-item-0]').should(
      'have.checked',
      true,
    )
  })

  it('should have radio shipping option "Heimlieferung" checked', () => {
    cy.get('[data-cy=checkoutAddressSend-shippingType-item-0]').should(
      'have.checked',
      true,
    )
  })

  it('should redirect to checkout process step 3', () => {
    cy.get('[data-cy=checkout-addressSend-button-submit-bottom]').should('be.visible')
    cy.get('[data-cy=checkout-addressSend-button-submit-bottom]').click({ force: true })
    cy.wait(5000)
    cy.location().should((location) => {
      expect(location.pathname).to.eq('/de/bestellung/zahlung')
    })
  })

  it('should buy through accepting AGB and top button click', () => {
    cy.get('[data-cy=checkout-paymentMethods-5]').check()
    cy.wait(2500)
    cy.get('[data-cy=checkout-agreements] [type="checkbox"]').check({ force: true })
    cy.wait(2500)
    cy.get('[data-cy=checkout-payment-button-submit]').first().click()
  })
})
