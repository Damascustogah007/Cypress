import { baseUrl } from 'cypress/fixtures/environment'
import Languages from 'cypress/fixtures/shared/languages'
import { routes_shop } from 'cypress/fixtures/shared/routes'
import deviceConfigs from 'cypress/integration/_helpers/devices'
import { getTestSpecName } from 'lib/testSpecName'

const testSpecName = getTestSpecName(__filename)

const languages = [Languages[0]]

deviceConfigs.forEach((deviceConfig) => {
  describe(`${testSpecName} - ${deviceConfig.name} - @@ Checkout - Direct Access of Checkout Steps`, function () {
    before(() => {
      cy.clearCookies()
      cy.visit(baseUrl)
      cy.addFirstProductOnCurrentPageToBasket()
      cy.clearBasket()
    })

    languages.forEach((language) => {
      const [w, h] = deviceConfig.viewport
      const viewportStr = deviceConfig.viewport.join('x')

      describe(`${testSpecName} - ${deviceConfig.name}(${viewportStr}) - ${language.name} @@ Checkout User not logged in - direct checkout step requests via bookmarks - no basket`, function () {
        before(() => {})

        beforeEach(() => {
          cy.viewport(w, h)
          cy.clearCookies()
          cy.clearCookies()
        })

        it('will be redirected to home page when accessing step 2 - login', () => {
          cy.visit(`${baseUrl}${routes_shop['checkout_login'][language.code]}`)
          cy.location('pathname').should('equal', `/${language.code}/`)
        })

        it('will be redirected to home page when accessing step 2 - adresse', () => {
          cy.visit(`${baseUrl}${routes_shop['checkout_step2_logged_in'][language.code]}`)
          cy.location('pathname').should('equal', `/${language.code}/`)
        })

        it('will be redirected to home page when accessing step 3 - zahlung', () => {
          cy.visit(
            `${baseUrl}${routes_shop['checkout_step2_payment'][language.code]}&rt=g`,
          )
          cy.location('pathname').should('equal', `/${language.code}/`)
        })

        it('will be redirected to home page when accessing basket with no basket cookie', () => {
          cy.clearCookies()
          cy.visit(`${baseUrl}${routes_shop['basket'][language.code]}`)
          if (language.code === 'de') {
            cy.contains('Ihr Warenkorb ist leer')
          } else {
            cy.contains('Votre panier est vide')
          }
        })
      })

      describe(`${testSpecName} - ${deviceConfig.name}(${viewportStr}) - ${language.name} @@ Checkout User not logged in - direct checkout step requests via bookmarks - empty basket`, function () {
        before(() => {})

        beforeEach(() => {
          cy.viewport(w, h)
          cy.preserveDefaultCookies()
        })

        it('will be redirected to home page when accessing step 2 - login', () => {
          cy.visit(`${baseUrl}${routes_shop['checkout_login'][language.code]}`)
          cy.location('pathname').should('equal', `/${language.code}/`)
        })

        it('will be redirected to home page when accessing step 2 - adresse', () => {
          cy.visit(`${baseUrl}${routes_shop['checkout_step2_logged_in'][language.code]}`)
          cy.location('pathname').should('equal', `/${language.code}/`)
        })

        it('will be redirected to home page when accessing step 3 - zahlung', () => {
          cy.visit(
            `${baseUrl}${routes_shop['checkout_step2_payment'][language.code]}&rt=g`,
          )
          cy.location('pathname').should('equal', `/${language.code}/`)
        })

        it('will be redirected to home page when accessing basket with no basket cookie', () => {
          cy.clearCookies()
          cy.visit(`${baseUrl}${routes_shop['basket'][language.code]}`)

          if (language.code === 'de') {
            cy.contains('Ihr Warenkorb ist leer')
          } else {
            cy.contains('Votre panier est vide')
          }
        })
      })
    })
  })
})
