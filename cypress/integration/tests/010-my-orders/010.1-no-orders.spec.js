/**
 * PIC-3997
 */

import { baseUrl } from 'cypress/fixtures/environment'
import { getTestSpecName } from 'lib/testSpecName'
import languages from 'cypress/fixtures/shared/languages'
import devices, { checkIsMobileOrTablet } from 'cypress/integration/_helpers/devices'
import { no_orders as user } from 'cypress/fixtures/010-my.orders.data'

const testSpecName = getTestSpecName(__filename)

devices.map((device) => {
  const language = languages[0]
  const targetUrl = `${baseUrl}/${language.code}/`
  describe(`${testSpecName} -${device.name} (${device.viewport.join(
    'x',
  )})  @@ My orders, no order`, () => {
    const [w, h] = device.viewport

    before(() => {
      cy.clearCookies()
      cy.viewport(w, h)

      cy.visit(targetUrl)
      let { email, password } = user
      cy.loginCustomer(email, password)
    })

    beforeEach(() => {
      cy.viewport(w, h)
      cy.preserveDefaultCookies()
    })

    it('Should navigate to the my orders page', () => {
      if (checkIsMobileOrTablet(device)) {
        cy.get('[data-cy=header-mobile-myAccount]').click()
        cy.get('a[href="/de/mein-konto/meine-bestellungen/"]').eq(1).click()
      } else {
        cy.dataCy('modal-account-button').trigger('mouseover')
        cy.dataCy('modal-account-content')
          .children()
          .first()
          .children()
          .eq(1)
          .first()
          .click()

          cy.intercept({
            method: 'POST',
            url: 'https://**/v1/Order/OrderQuery',
          }).as('orderQuery')
          cy.wait('@orderQuery')
      }
    })

    it('Should check for no orders prompt', () => {
      cy.wait(500)
      cy.get('[data-cy=orders-overview]')
          .children()
          .eq(1)
          .should('have.text', 'Sie haben zur Zeit keine offenen Bestellungen.')
    })
  })
})
