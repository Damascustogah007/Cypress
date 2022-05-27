/**
 * PIC-4740
 * PIC-4742
 */

import { baseUrl } from 'cypress/fixtures/environment'
import { routes_shop } from 'cypress/fixtures/shared/routes'
import { defaultDevices as devices } from 'cypress/integration/_helpers/default-devices'
import languages from 'cypress/fixtures/shared/languages'
import { createRegistrationData } from 'cypress/fixtures/shared/user-create'
import { getTestSpecName } from 'lib/testSpecName'
import {
  depositExistingClubmemberCredentials,
  expectTileEngineClubDiscount,
  expectErrorMessage,
  storeCardClubMember,
  clickOnBooksInTheClubMenuItem,
} from 'cypress/integration/tests/011-club/011.4-helpers'
import {
  blocked,
  lost,
  stolen,
} from 'cypress/fixtures/011.4-deposit-existing-lost-stolen-blocked-owner-clubMember-data'

const testSpecName = getTestSpecName(__filename)
const language = languages[0]
const clubMemberVariants = [blocked, lost, stolen]
const routePage = `${routes_shop['register'][language.code]}`

devices.forEach((device) => {
  clubMemberVariants.forEach((clubMemberVariant) => {
    describe(`${testSpecName} @@ Deposit existing clubMember - owner - ${clubMemberVariant.status} - ${device.name}`, () => {
      const [w, h] = device.viewport
      const isOwner = true
      before(() => {
        cy.clearCookies()
        cy.registerCustomer(
          baseUrl,
          routePage,
          createRegistrationData(),
          language.code,
          device,
        )
      })
      beforeEach(() => {
        cy.viewport(w, h)
        cy.preserveDefaultCookies()
      })

      it("Should click on the 'store your club card member'", () => {
        storeCardClubMember(device)
      })

      it("Should fill in the fields with cardholder's details ", () => {
        depositExistingClubmemberCredentials(clubMemberVariant, isOwner)
      })

      it('Should display an error', () => {
        expectErrorMessage()
      })

      it('should check that cookie is saved with value "no"', () => {
        cy.getCookie('exliPCC').should('have.property', 'value', 'no')
      })

      it("Should click on 'books in the club'", () => {
        clickOnBooksInTheClubMenuItem(device)
      })

      it('Should check that user will not be recognized as a club discount user', () => {
        expectTileEngineClubDiscount()
      })
    })
    describe(`${testSpecName} @@ Deposit existing clubMember - not owner - ${clubMemberVariant.status} - ${device.name} `, () => {
      const [w, h] = device.viewport
      before(() => {
        cy.clearCookies()
        cy.registerCustomer(
          baseUrl,
          routePage,
          createRegistrationData(),
          language.code,
          device,
        )
      })
      beforeEach(() => {
        cy.viewport(w, h)
        cy.preserveDefaultCookies()
      })

      it("Should click on the 'store your club card member'", () => {
        storeCardClubMember(device)
      })

      it("Should fill in the fields with cardholder's details ", () => {
        depositExistingClubmemberCredentials(clubMemberVariant)
      })

      it('Should display an error', () => {
        expectErrorMessage()
      })

      it('should check that cookie is saved with value "no"', () => {
        cy.getCookie('exliPCC').should('have.property', 'value', 'no')
      })

      it("Should click on 'books in the club'", () => {
        clickOnBooksInTheClubMenuItem(device)
      })

      it('Should check that user will not be recognized as a club discount user', () => {
        expectTileEngineClubDiscount()
      })
    })
  })
})
