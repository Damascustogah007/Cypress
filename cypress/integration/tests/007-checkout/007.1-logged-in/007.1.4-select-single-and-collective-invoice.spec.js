/**
 * PIC-866
 */
import { baseUrl } from 'cypress/fixtures/environment'
import languages from 'cypress/fixtures/shared/languages'
import {
  collectiveInvoiceUser,
  noCollectiveInvoiceUser,
} from 'cypress/fixtures/007.1.4-select-single-and-collective-invoice.js'
import { mobile, desktop } from 'cypress/integration/_helpers/default-devices'
import { getTestSpecName } from 'lib/testSpecName'

const testSpecName = getTestSpecName(__filename)

const devices = [mobile, desktop]
const users = [collectiveInvoiceUser, noCollectiveInvoiceUser]

users.forEach((user) => {
  devices.map((device) => {
    languages.map((language) => {
      const targetUrl = `${baseUrl}/${language.code}/`
      const userType = `${!user.isCollectiveUser && 'no '}collective invoice user`
      describe(`${testSpecName} @@ Checkout - Continue with creating regular account - ${userType} - ${device.name} - ${language.name}`, () => {
        const [w, h] = device.viewport

        before(() => {
          cy.clearCookies()
          cy.visitWithDevice(targetUrl, device)

          cy.loginCustomer(user.email, user.password)
          cy.wait(1000)
        })

        beforeEach(() => {
          cy.viewport(w, h)
          cy.preserveDefaultCookies()
        })

        it('Should clear basket', () => {
          cy.clearBasket(device.isMobile)
          if (device.isMobile) {
            cy.dataCy('checkout-header-exLibrisLogo').click()
          }
        })

        it('add first product to basket', () => {
          cy.visitSearchResultPage({ language, device })
          cy.addFirstProductOnCurrentPageToBasket()
        })

        it('redirect to basket', () => {
          cy.redirectToBasket(language, device.isMobile)
        })

        it('should redirect to the second step', () => {
          cy.redirectToStep2(language, device.isMobile)
        })

        it('redirect to step 3', () => {
          cy.redirectToCheckoutStep3(language)
        })

        if (user.isCollectiveUser) {
          it('should select single invoice and invoice by email (free of charge)', () => {
            cy.dataCy('checkout-invoiceOptions__5').click()
            cy.dataCy('checkout-invoiceOptions__5').should('be.checked')
            cy.dataCy('checkout-invoiceOptions-subItem__9')
              .next()
              .children()
              .first()
              .click()
            cy.dataCy('checkout-invoiceOptions-subItem__9').should('be.checked')
          })

          it('should select single invoice and Paper invoice with payment slip (additional fee + CHF 1.50) ', () => {
            cy.wait(2000)
            cy.dataCy('checkout-invoiceOptions__5').next().children().first().click()
            cy.dataCy('checkout-invoiceOptions__5').should('be.checked')
            cy.dataCy('checkout-invoiceOptions-subItem__10')
              .next()
              .children()
              .first()
              .click()
            cy.dataCy('checkout-invoiceOptions-subItem__10').should('be.checked')
          })

          it('should select collective bill', () => {
            cy.wait(1000)
            cy.dataCy('checkout-invoiceOptions__6').next().children().first().click()
            cy.dataCy('checkout-invoiceOptions__6').should('be.checked')
          })
        } else {
          it('single and collective invoice is not visible', () => {
            cy.dataCy('checkout-paymentMethods').should('exist')
            cy.dataCy('checkout-invoiceOptions__5', { type: 'radio' }).should('not.exist')
            cy.dataCy('checkout-invoiceOptions__6', { type: 'radio' }).should('not.exist')
          })
        }
      })
    })
  })
})
