/**
 * PIC-623
 */
import { baseUrl } from 'cypress/fixtures/environment.js'
import { customer } from 'cypress/fixtures/006.1-basket.data'
import { getTestSpecName } from 'lib/testSpecName'
import devices, { checkIsMobileOrTablet } from 'cypress/integration/_helpers/devices'
import { routes_shop as routes } from 'cypress/fixtures/shared/routes'

const testSpecName = getTestSpecName(__filename)
const basketUrl = `${baseUrl}${routes.basket.de}`

devices.map((device) => {
  const targetUrl = `${baseUrl}/de/`
  const isMobileOrTablet = checkIsMobileOrTablet(device)
  describe(`${testSpecName} @@ Show empty basket - ${device.name} (${device.viewport.join(
    'x',
  )}) `, () => {
    const [w, h] = device.viewport

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

    it('should clear basket', () => {
      cy.clearBasket(isMobileOrTablet)
      if (isMobileOrTablet) {
        cy.get('[data-cy=checkout-header-exLibrisLogo]').click()
      }
    })

    it('should redirect to basket page', () => {
      if (isMobileOrTablet) {
        cy.dataCy('header-mobile-basket').click()
      } else {
        cy.dataCy('widget-basket-button').click()
      }
      cy.location().should((location) => {
        expect(location.pathname).to.eq(routes.basket.de)
      })
    })

    it('should show message with content "Ihr Warenkorb ist leer"', () => {
      cy.dataCy('basket-advice-empty')
        .should('contain', 'Ihr Warenkorb ist leer')
        .and('be.visible')
    })

    it('should directly call basket page through URL', () => {
      cy.visit(basketUrl)
      cy.location().should((location) => {
        expect(location.pathname).to.eq(routes.basket.de)
      })
    })

    it('should show message with content "Ihr Warenkorb ist leer', () => {
      cy.dataCy('basket-advice-empty')
        .should('contain', 'Ihr Warenkorb ist leer')
        .and('be.visible')
    })
  })
})
