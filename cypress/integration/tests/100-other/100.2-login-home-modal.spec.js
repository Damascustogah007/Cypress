/**
 * PIC- 569
 */

import { baseUrl } from 'cypress/fixtures/environment'
import { regular_user, club_user } from 'cypress/fixtures/100.2-login-home-modal.data'
import { getTestSpecName } from 'lib/testSpecName'

const testSpecName = getTestSpecName(__filename)

const users = [regular_user, club_user]
users.forEach((user) => {
  describe(`${testSpecName} @@ Login - ${user.name.toUpperCase()}`, function () {
    before(() => {
      cy.clearCookies()

      const { email, password } = user
      cy.visitWithViewport(baseUrl + '/de', 'desktopSmall')
      cy.loginCustomer(email, password)
    })

    beforeEach(() => {
      cy.preserveDefaultCookies()
    })
    it('should have the salutation name after login', function () {
      let { salutationDe } = regular_user
      if (user.isClubMember) {
        salutationDe = club_user.salutationDe
      }
      cy.get('[data-cy=welcome-salutation]').should(($div) => {
        const text = $div.text()
        expect(text).to.include(salutationDe)
      })
    })

    it('should create the user cookie after valid login', function () {
      cy.getCookie('User').should('exist')
    })

    it('should display a popup personalized for club member status', function () {
      if (user.isClubMember) {
        cy.get('[data-cy=modal-account-button]').trigger('mouseover')
        cy.dataCy('modal-drop')
          .should('contain.text', 'Meine Rabatt-Bons')
          .and('contain.text', 'Mitgliedschaft')
          .and('contain.text', 'Club-Aktionen')
          .and('contain.text', 'Club-Welt')
      } else {
        cy.dataCy('modal-account-button').trigger('mouseover')
        cy.dataCy('modal-drop')
          .should('contain.text', 'Jetzt Club-Mitglied werden')
          .and('contain.text', 'Club-Kartennummer hinterlegen')
      }
    })

    it('should keep user logged in after reload', function () {
      cy.reload()
      let { salutationDe } = regular_user
      if (user.isClubMember) {
        salutationDe = club_user.salutationDe
      }
      cy.get('[data-cy=welcome-salutation]').should('contain', salutationDe)
    })

    it('should keep user logged in after going back in the browser history', function () {
      cy.get('[data-cy="widget-basket-button"]').click()
      cy.wait(500)
      cy.go('back')
      if (user.isClubMember) {
        cy.get('[data-cy=welcome-salutation]').should('contain', club_user.salutationDe)
      } else {
        cy.get('[data-cy=welcome-salutation]').should(
          'contain',
          regular_user.salutationDe,
        )
      }
    })

    it('should logout user', function () {
      cy.logoutCustomer()
    })
  })
})
