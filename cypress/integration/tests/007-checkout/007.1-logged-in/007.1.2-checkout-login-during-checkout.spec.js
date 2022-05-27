/**
 * PIC-799
 */

import { baseUrl } from 'cypress/fixtures/environment'
import { customer_new as customer } from 'cypress/fixtures/007.1-checkout.data'
import Languages from 'cypress/fixtures/shared/languages'
import { routes_shop } from 'cypress/fixtures/shared/routes'
import { getTestSpecName } from 'lib/testSpecName'
import {
  acceptAgbAndContinue,
  redirectToBasket,
  addFirstItemInPriceRange,
  validateCustomerBill,
  registerNewCustomer,
} from 'cypress/support/checkout'
import { defaultDesktop, defaultMobile, checkIsMobile, checkIsDesktop } from "cypress/integration/_helpers/devices"

const testSpecName = getTestSpecName(__filename)

let user = customer

const devices = [defaultDesktop, defaultMobile]
const languages = [Languages[0]] // just 'de'

devices.forEach((device) => {
  const [w, h] = device.viewport
  const isMobile = checkIsMobile(device)
  languages.forEach((language) => {
    const targetUrl = `${baseUrl}/${language.code}/`
    describe(`${testSpecName} @@ 007.1.2.1 Login in Checkout - (${device.viewport.join('x')}) ${
      language.name
    }`, function () {
      before(() => {
        cy.clearCookies()
        cy.viewport(w, h)

        if (checkIsDesktop(device) && language.code === 'de') {
          registerNewCustomer(language)
        } else {
          cy.visit(targetUrl)
        }
        cy.task('getLatestUser').then((latestCredentials) => {
          if (latestCredentials){
             user = latestCredentials
          }
         cy.loginCustomer(user.email, user.password)
        })
      })

      beforeEach(() => {
        cy.viewport(w, h)
        cy.preserveDefaultCookies()
      })

      it('Clear Basket, logout', () => {
        cy.clearBasket(isMobile)
        if (isMobile) {
          cy.get('[data-cy=checkout-header-exLibrisLogo]').click()
        }
        cy.logoutCustomer(isMobile)
        cy.clearCookies()
      })

      it('Search for item with price between 10 to 12 CHF and add it to basket', () => {
        addFirstItemInPriceRange(10, 12, language)
      })

      it('Redirect to basket', () => {
        redirectToBasket(language, isMobile)
      })

      it('Redirect to step 2', () => {
        cy.get('[data-cy=basket-button-step2]').first().click()
        cy.location().should((location) => {
          expect(location.pathname).to.eq(
            `${routes_shop['checkout_login'][language.code]}`,
          )
        })
      })

      it('Login while checking out', () => {
        cy.dataCy('login-input-email').clear().type(user.email)
        cy.dataCy('login-input-password').clear().type(user.password)
        cy.dataCy('login-submit').click()
        cy.location().should((location) => {
          expect(location.pathname).to.eq(
            `${routes_shop['checkout_step2_logged_in'][language.code].split('?')[0]}`,
          )
        })
      })

      it('Move customer outside checkout page and check if customer is still logged in', () => {
        cy.dataCy('checkout-header-exLibrisLogo').click({ force: true })
        const labels = {
          de: 'Mein Ex Libris',
          fr: 'Mon Ex Libris'
        }
        if (isMobile) {
          cy.dataCy('header-mobile-myAccount').click()
          cy.dataCy('breadcrumb-item-Mein Ex Libris').contains(labels[language.code])
          cy.go('back')
          cy.go('back')
        }
        else {
          cy.dataCy('welcome-salutation').should('contain', user.lastName)
          cy.go('back')
        } 
      })

      it('Display customer bill address information at checkout step 2 page', () => {
        validateCustomerBill(user)
      })

      it('Have radio delivery option "Einzellieferung" checked', () => {
        cy.get('[data-cy=checkoutAddressSend-shippingOption-item-0]').should(
          'have.checked',
          true,
        )
      })

      it('Have radio shipping option "Heimlieferung" checked', () => {
        cy.get('[data-cy=checkoutAddressSend-shippingType-item-0]').should(
          'have.checked',
          true,
        )
      })

      it('Redirect to checkout process step 3', () => {
        cy.intercept({
          method: 'POST',
          url: 'https://**/v1/Basket/BasketGet',
        }).as('getBasket')

        cy.get('[data-cy=checkout-addressSend-button-submit-bottom]').should('be.visible')
        cy.get('[data-cy=checkout-addressSend-button-submit-bottom]').click()

        cy.wait('@getBasket')
        cy.location().should((location) => {
          expect(location.pathname).to.eq(
            `${routes_shop['checkout_step2_payment'][language.code].split('?')[0]}`,
          )
        })
      })

      it('Try to buy by top button click but fail because of AGB', () => {
        cy.get('[data-cy=checkout-paymentMethods-5]').check()
        cy.get('[data-cy=checkout-payment-button-submit]').first().click()

        cy.dataCy('checkout-agreements-acceptAGB_false')
          .parent()
          .children('span')
          .should('exist')
      })

      it('Buy through accepting AGB and top button click', () => {
        acceptAgbAndContinue()
        cy.dataCy('basket-step_4').should('exist')
      })
    })
  })
})
