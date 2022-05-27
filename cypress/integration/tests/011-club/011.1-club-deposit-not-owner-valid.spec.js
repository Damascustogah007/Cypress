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

const errorColor = 'rgb(191, 13, 62)'

devices.map((device) => {
  const [w, h] = device.viewport
  describe(`${testSpecName} @@ Deposit Existing Club number - correct (not owner of membership) - ${device.name}`, () => {
    let priceBeforeClubDiscount = null
    const registrationData = createRegistrationData()

    before(() => {
      cy.clearCookies()
      cy.viewport(w, h)
      registerCustomer(language, registrationData, checkIsMobileOrTablet(device))
      cy.wait(2000)
    })

    beforeEach(() => {
      cy.viewport(w, h)
      cy.preserveDefaultCookies()
    })

    it('add item with club discount to basket', () => {
      cy.wait(1500)
      cy.headerSearch('Die sieben Schwestern')
      cy.dataCy('tileEngine-price-list')
        .eq(1)
        .then(($price) => {
          priceBeforeClubDiscount = $price.text()
        })
      cy.dataCy('tileEngine-button-basket').eq(1).click({ force: true })
    })

    it('direct to deposit club membership page', () => {
      if (checkIsMobileOrTablet(device)) {
        cy.dataCy('header-mobile-myAccount').click()
      } else {
        cy.dataCy('modal-account-button').click()
      }
      cy.dataCy('myAccount-navigationItem').eq(1).children().eq(2).click()
      cy.location('pathname').should(
        'equal',
        `/${language.code}${
          routes_shop['club_mitgliedschaft_hinterlegen'][language.code]
        }`,
      )
    })

    it('should check whether the name and salutation of the user is prefilled in the input fields', () => {
      cy.dataCy('clubdeposit-input-firstname').then(($el) => {
        const firstName = $el[0].getAttribute('value')
        expect(firstName).to.equal(registrationData.firstName)
      })
      cy.dataCy('clubdeposit-input-lastname').then(($el) => {
        const lastName = $el[0].getAttribute('value')
        expect(lastName).to.equal(registrationData.lastName)
      })
      cy.dataCy('clubdeposit-select-salutation').should(
        'contain',
        // TODO 2021-07-29: Check the salutation selection logic
        // registrationData.salutation,
        '',
      )
    })

    it('should remove spaces after entering data with spaces and clicking the continue button', () => {
      cy.dataCy('clubdeposit-input-clubNummer').type(`  ${partner.cardNumber}  `)
      cy.dataCy('clubdeposit-button-submit').click()
      cy.dataCy('clubdeposit-input-clubNummer').should(
        'have.value',
        `${partner.cardNumber}`,
      )
    })

    it('should show error message for too short number', () => {
      const invalidCardNumber = parseInt(partner.cardNumber / 10)
      cy.dataCy('clubdeposit-input-clubNummer').type(invalidCardNumber)
      cy.dataCy('clubdeposit-input-clubNummer')
        .should('have.css', 'border-color', errorColor)
        .next()
        .its('length')
        .should('be.gt', 0)
    })

    it('should clear all values in input fields', () => {
      cy.dataCy('clubdeposit-input-firstname').clear()
      cy.dataCy('clubdeposit-input-lastname').clear()
      cy.dataCy('clubdeposit-input-birthDate').clear()
      cy.dataCy('clubdeposit-input-clubNummer').clear()
      cy.dataCy('clubdeposit-select-salutation').select('Bitte Anrede auswählen')
    })

    it('should check for the error message and css color of red for all not filled required fields', () => {
      cy.dataCy('clubdeposit-select-salutation')
        .should('have.css', 'border-color', errorColor)
        .next()
        .its('length')
        .should('be.gt', 0)
      cy.dataCy('clubdeposit-input-clubNummer')
        .should('have.css', 'border-color', errorColor)
        .next()
        .its('length')
        .should('be.gt', 0)
      cy.dataCy('clubdeposit-input-birthDate')
        .should('have.css', 'border-color', errorColor)
        .next()
        .its('length')
        .should('be.gt', 0)
      cy.dataCy('clubdeposit-input-firstname')
        .should('have.css', 'border-color', errorColor)
        .next()
        .invoke('text')
        .then(($firstName) => {
          expect($firstName.length).to.be.greaterThan(0)
        })
      cy.dataCy('clubdeposit-input-lastname')
        .should('have.css', 'border-color', errorColor)
        .next()
        .invoke('text')
        .then(($lastName) => {
          expect($lastName.length).to.be.greaterThan(0)
        })
      cy.dataCy('clubdeposit-radio-ownCard__1')
        .next()
        .children()
        .first()
        .should('have.css', 'border-color', errorColor)
      cy.dataCy('clubdeposit-radio-ownCard__0')
        .next()
        .children()
        .first()
        .should('have.css', 'border-color', errorColor)
    })

    it('should not display error message after entering valid values into the required field', () => {
      cy.dataCy('clubdeposit-input-clubNummer').clear().type(partner.cardNumber)
      cy.dataCy('clubdeposit-radio-ownCard__0')
        .check({ force: true })
        .should('not.have.css', 'border-color', errorColor)
      cy.dataCy('clubdeposit-select-salutation')
        .select('1')
        .should('not.have.css', 'border-color', errorColor)
        .and('have.value', partner.salutation)
        .next()
        .should('not.exist')
      cy.dataCy('clubdeposit-input-birthDate')
        .clear()
        .type(partner.dateOfBirth)
        .should('not.have.css', 'border-color', errorColor)
        .next()
        .should('not.exist')
      cy.dataCy('clubdeposit-input-firstname')
        .type(partner.firstName)
        .should('not.have.css', 'border-color', errorColor)
        .next()
        .should('not.exist')
      cy.dataCy('clubdeposit-input-lastname')
        .type(partner.lastName)
        .should('not.have.css', 'border-color', errorColor)
        .next()
        .should('not.exist')
    })

    it('should submit and redirect to club world', () => {
      cy.dataCy('clubdeposit-button-submit').click()
      cy.location('pathname').should('equal', `/de${routes_shop['club']['de']}/`)
    })

    it('validate that the user is recognized as a club discount user', () => {
      cy.get('[data-cy=club-add-infobox-success]').should('be.visible')
    })

    it('check that cookie is saved with value "yes"', () => {
      cy.getCookie('exliPCC').should('have.property', 'value', 'yes')
    })

    if (checkIsDesktop(device)) {
      it('check that navigation is different from that of club owner', () => {
        cy.dataCy('sidebar-navigation-collapse-tree')
          .children()
          .children()
          .children()
          .children()
          .eq(2)
          .should('not.contain', 'Partner-Karte beantragen')
      })
    }

    it('redirect to basket', () => {
      redirectToBasket(language, checkIsMobileOrTablet(device))
    })

    it('validate that club discount is applied', () => {
      cy.dataCy('checkout-basket-productList-totalPrice').then(($newPrice) => {
        expect($newPrice.text()).not.to.eq(priceBeforeClubDiscount)
      })
    })
  })
})
