/**
 * PIC-4764
 */

import {
  club_membership_partner as partner,
  createRegistrationData,
} from 'cypress/fixtures/011.2-club-home-page-after-adding-membership-into-basket.data'
import { getTestSpecName } from 'lib/testSpecName'
import languages from 'cypress/fixtures/shared/languages'
import { routes_shop } from 'cypress/fixtures/shared/routes'
import devices, {
  checkIsMobileOrTablet,
  checkIsDesktop,
} from 'cypress/integration/_helpers/devices'
import { registerCustomer, clubRegistration } from 'cypress/support/club'

const testSpecName = getTestSpecName(__filename)
const language = languages[0]

devices.map((device) => {
  describe(`${testSpecName} @@ Club Home Page - after adding membership into basket - ${device.name}`, () => {
    const [w, h] = device.viewport
    const registrationData = createRegistrationData()
    const dateOfBirth = partner.dateOfBirth

    before(() => {
      cy.viewport(w, h)
      cy.clearCookies({ domain: null })
    })

    beforeEach(() => {
      cy.viewport(w, h)
      cy.preserveDefaultCookies()
    })

    it('should register', () => {
      registerCustomer(language, registrationData, checkIsMobileOrTablet(device))
      cy.wait(2000)
    })

    it('should login', () => {
      cy.logoutCustomer(checkIsMobileOrTablet(device))
      cy.loginCustomer(registrationData.email, registrationData.password)
    })

    it('Redirect to club registration page', () => {
      if (checkIsMobileOrTablet(device)) {
        cy.dataCy('header-mobile-myAccount').click()
      } else {
        cy.dataCy('modal-account-button').click()
      }
      cy.dataCy('myAccount-navigationItem').eq(1).children().eq(1).click()
      cy.location('pathname').should(
        'equal',
        `/de${routes_shop['mitgliedschaft_beantragen']['de']}`,
      )
    })

    it('Register for exlibris club', () => {
      const clubRegistrationData = Object.assign(registrationData, { dateOfBirth })
      clubRegistration(clubRegistrationData)
    })

    it('Navigate to club world', () => {
      if (checkIsDesktop(device)) {
        cy.dataCy('sidebar-navigation-collapse-tree')
          .children()
          .first()
          .children()
          .first()
          .children()
          .first()
          .children()
          .eq(1)
          .click()
      } else {
        cy.dataCy('mobile-navigation-burgerMenu').click({force:true})
        cy.wait(1000)
        cy.get('[data-page-id="CLUBWELT"]').first().click({force:true})
        cy.wait(1000)
        cy.get('[href="/de/club-welt/"]').first().click({force:true})
        cy.wait(1000)
        cy.dataCy('mobile-navigation-burgerMenu').click({force:true})

      }
      cy.location('pathname').should('equal', `/de${routes_shop['club']['de']}/`)
    })

    it('Feedback message Should contain a valid link', () => {
      cy.dataCy('club-temp-feedback')
        .children()
        .eq(1)
        .should('be.visible')
        .find('a')
        .should('have.attr', 'href', '/de/club-welt/aktuelle-club-aktionen/')
    })

    it('Redirect to basket after clicking "Checkout" button', () => {
      cy.dataCy('clubRegisterFeedback-button').click()
      cy.location('pathname').should('equal', `${routes_shop['basket']['de']}`)
      cy.go('back')
    })

    it('Remove club membership from basket on club world page', () => {
      cy.clearBasket(checkIsMobileOrTablet(device))
      if (checkIsMobileOrTablet(device)) {
        cy.go('back')
        cy.dataCy('breadcrumb-item-Club-Welt').click()
      }
    })

    it('Should not show club status  after membership is removed from basket', () => {
      cy.dataCy('club-temp-feedback').should('not.exist')
    })
  })
})
