/** 
 * PIC-798
 */
import { baseUrl } from 'cypress/fixtures/environment'
import Languages from 'cypress/fixtures/shared/languages'
import { getTestSpecName } from 'lib/testSpecName'
import { routes_shop as routes } from 'cypress/fixtures/shared/routes'
import devices, { checkIsMobileOrTablet } from 'cypress/integration/_helpers/devices'

const testSpecName = getTestSpecName(__filename)

const languages = [Languages[0]] // just 'de'

devices.map((device) => {
  languages.map((language) => {
    const targetUrl = `${baseUrl}/${language.code}/`
    describe(`${testSpecName} @@ Checkout - Login page - Address & Delivery - ${language.name} ${device.name} `, () => {
      const [w, h] = device.viewport
      before(() => {
        cy.clearCookies()
        cy.visit(targetUrl, { retryOnStatusCodeFailure: true })
      })
      beforeEach(() => {
        cy.viewport(w, h)
        cy.preserveDefaultCookies()
      })

      it('Add one item to basket on homepage', () => {
        cy.addFirstProductOnCurrentPageToBasket()

        const isMobileOrTablet = checkIsMobileOrTablet(device)
        cy.clickBasketIcon(isMobileOrTablet)
      })

      it('Go to basket page & show one item in basket', () => {
        cy.location('pathname').should('equal', routes['basket'][language.code])
        cy.dataCy('product-list-item').should('have.length', 1)
      })

      it('Go to address and delivery page - step 2', () => {
        cy.dataCy('basket-button-step2').first().click()
        cy.location('pathname').should('equal', routes['checkout_login'][language.code])
      })

      it('Check login option', () => {
        cy.dataCy('neukunde-registrierung-module')
          .parent()
          .siblings()
          .first()
          .children()
          .first()
          .should(($loginOption) => {
            if (language.code === 'de') {
              expect($loginOption).to.contain('Mit Ex Libris-Konto bestellen')
            } else {
              expect($loginOption).to.contain('Commander avec mon compte Ex Libris')
            }
          })

        cy.dataCy('login-input-email').should('be.visible')
        cy.dataCy('login-input-password').should('be.visible')
        cy.dataCy('login-submit').should('be.visible')
      })

      it('Check option to register a new regular account', () => {
        cy.dataCy('neukunde-registrierung-module').should(($registeroption) => {
          if (language.code === 'de') {
            expect($registeroption)
              .to.contain('Ich bin Neukunde')
              .and.to.contain('BESTELL- UND RECHNUNGSÜBERSICHT')
              .and.to.contain('SCHNELLER & EINFACH BESTELLEN')
              .and.to.contain('EINFACH INSPIRIERT')
          } else {
            expect($registeroption)
              .to.contain('Je suis un nouveau client')
              .and.to.contain('GESTION DES COMMANDES')
              .and.to.contain('COMMANDES FACILES ET PLUS RAPIDES')
              .and.to.contain('LAISSEZ-VOUS INSPIRER')
          }
        })
        cy.dataCy('neukunde-registrierung-module').find('button').should('be.visible')
      })

      it('Check option to register a new guest account', () => {
        cy.dataCy('als-Gast-bestellen-module').should(($guestOption) => {
          if (language.code === 'de') {
            expect($guestOption).to.contain('Als Gast bestellen')
          } else {
            expect($guestOption).to.contain('Commander en tant qu’invité')
          }
        })

        cy.dataCy('als-Gast-bestellen-module').find('button').should('be.visible')
      })
    })
  })
})
