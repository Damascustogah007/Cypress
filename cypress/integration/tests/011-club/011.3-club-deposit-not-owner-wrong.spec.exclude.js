/**
 * PIC-688
 * PIC-690
 * PIC-691
 */

import { getTestSpecName } from 'lib/testSpecName'
import languages from 'cypress/fixtures/shared/languages'
import { routes_shop } from 'cypress/fixtures/shared/routes'
import { redirectToBasket } from 'cypress/support/checkout'
import { registerCustomer } from 'cypress/support/club'
import { club_membership_partner as partner } from 'cypress/fixtures/011.1-club-deposit-existing-club-number-and-not-owner-of-the-membership.data'
import { createRegistrationData } from 'cypress/fixtures/shared/user-create'
import devices, {
  checkIsMobileOrTablet,
  checkIsDesktop,
} from 'cypress/integration/_helpers/devices'

const testSpecName = getTestSpecName(__filename)
const language = languages[0]

devices.map((device) => {
  const [w, h] = device.viewport

  describe(`${testSpecName} @@ Club - DepositExisting Clubnumber - wrong number - ${device.name}`, () => {
    before(() => {
      cy.clearCookies()
      cy.viewport(w, h)

      registerCustomer(language, createRegistrationData())
      cy.wait(2000)
    })

    beforeEach(() => {
      cy.viewport(w, h)
      cy.preserveDefaultCookies()
    })

    it('should visit "Store your club card number" page', () => {
      if (checkIsMobileOrTablet(device)) {
        cy.dataCy('header-mobile-myAccount').click()
      } else {
        cy.dataCy('modal-account-button').click()
      }
      cy.dataCy('myAccount-navigationItem').eq(1).children().eq(2).click()
      cy.location('pathname').should(
        'equal',
        `/de${routes_shop['club_mitgliedschaft_hinterlegen']['de']}`,
      )
    })

    it('fill club membership form and submit', () => {
      cy.dataCy('clubdeposit-input-clubNummer').type(partner.wrongCardNumber)
      cy.dataCy('clubdeposit-radio-ownCard__0').check()
      cy.dataCy('clubdeposit-select-salutation').select('1')
      cy.dataCy('clubdeposit-input-birthDate').type(partner.dateOfBirth)
      cy.dataCy('clubdeposit-button-submit').click()
    })

    it('should show error message', () => {
      cy.dataCy('clubcard-add-infobox-captcha')
        .should('contain', '(Support-Code: 51)')
        .and('be.visible')
    })
  })
})
