import { baseUrl } from 'cypress/fixtures/environment'
import Languages from 'cypress/fixtures/shared/languages'
import { routes_shop } from 'cypress/fixtures/shared/routes'
import { defaultDesktop } from 'cypress/integration/_helpers/devices'
import { getTestSpecName } from 'lib/testSpecName'

const testSpecName = getTestSpecName(__filename)

const deviceConfig = defaultDesktop

const languages = [Languages[0]] // just 'de'

describe(`${testSpecName} - ${deviceConfig.name} - @@ 007.1.3.1 Checkout - Direct Access of Checkout Steps as authenticated user - no item in basket`, function () {
  before(() => {
    cy.clearCookies()
    cy.visit(`${baseUrl}/de/`)
    cy.task('getLatestUser').then((latestCredentials) => {
      cy.loginCustomer(latestCredentials.email, latestCredentials.password)
      cy.clearBasket()
      cy.wait(1000)
    })
  })

  beforeEach(() => {
    cy.preserveDefaultCookies()
  })

  languages.forEach((language) => {
    const [w, h] = deviceConfig.viewport
    const viewportStr = deviceConfig.viewport.join('x')

    describe(`${testSpecName} - ${deviceConfig.name}(${viewportStr}) - ${language.name} @@ 007.1.3.1.1   - Checkout User logged in - direct checkout step requests via bookmarks - empty Basket`, function () {
      beforeEach(() => {
        cy.viewport(w, h)
        cy.visit(`${baseUrl}/${language.code}/`)
        cy.preserveDefaultCookies()
      })

      it('will be redirected to basket view page when accessing step 2 - adresse', () => {
        cy.visit(`${baseUrl}${routes_shop['checkout_step2_logged_in'][language.code]}`)
        cy.wait(1000)
        cy.location('pathname').should('equal', `${routes_shop['basket'][language.code]}`)
      })

      it('will be redirected to basket view page when accessing step 3 - zahlung', () => {
        cy.visit(`${baseUrl}${routes_shop['checkout_step2_payment'][language.code]}&rt=g`)
        cy.location('pathname').should('equal', `${routes_shop['basket'][language.code]}`)
      })

      it('will be redirected to basket view page when accessing step 4 - order confirmation', () => {
        cy.visit(
          `${baseUrl}${routes_shop['checkout_step2_confirmation'][language.code]}&rt=g`,
        )
        cy.location('pathname').should('equal', `${routes_shop['basket'][language.code]}`)
      })
    })
  })
})

describe(`${testSpecName} - ${deviceConfig.name} - @@ 007.1.3.2 Checkout - Direct Access of Checkout Steps as authenticated user - no item in basket`, function () {
  before(() => {
    cy.clearCookies()
    cy.visit(`${baseUrl}/de/`)
    cy.task('getLatestUser').then((latestCredentials) => {
      cy.loginCustomer(latestCredentials.email, latestCredentials.password)
      cy.clearBasket()
      cy.addFirstProductOnCurrentPageToBasket()
    })
  })

  languages.forEach((language) => {
    const [w, h] = deviceConfig.viewport
    const viewportStr = deviceConfig.viewport.join('x')
    describe(`${testSpecName} - ${deviceConfig.name}(${viewportStr}) - ${language.name} @@ 007.1.3.2.1   - Checkout User logged in - direct checkout step requests via bookmarks - empty Basket`, function () {
      beforeEach(() => {
        cy.viewport(w, h)
        cy.visit(`${baseUrl}/${language.code}/`)
        cy.preserveDefaultCookies()
      })

      it('will be redirected to basket view page when accessing step 4 - order confirmation', () => {
        cy.visit(
          `${baseUrl}${routes_shop['checkout_step2_confirmation'][language.code]}&rt=g`,
        )
        cy.location('pathname').should('equal', `${routes_shop['basket'][language.code]}`)
      })
    })
  })
})
