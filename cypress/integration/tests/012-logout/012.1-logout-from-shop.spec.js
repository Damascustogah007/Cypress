/**
 * PIC-575
 */
import { baseUrl } from 'cypress/fixtures/environment'
import { getTestSpecName } from 'lib/testSpecName'
import { regular_user } from 'cypress/fixtures/012.1-logout-from-shop.js'
import { mobile, desktop } from 'cypress/integration/_helpers/default-devices.js'
const testSpecName = getTestSpecName(__filename)
const devices = [mobile, desktop]
let { email, password } = regular_user

devices.forEach((device) => {
  const targetUrl = `${baseUrl}/de/`
  const [w, h] = device.viewport
  let cookieValue
  describe(`${testSpecName} @@ Logout from Shop - ${device.name}`, () => {
    before(() => {
      cy.clearCookies()
      cy.visitWithDevice(targetUrl, device)

      cy.wait(1000)
      cy.loginCustomer(email, password)
      cy.wait(3000)
      cy.getCookie('exliPUC').then(($cookie) => {
        let cookieLoginValue = $cookie.value
        cookieValue = cookieLoginValue.substr(1)
      })
    })

    beforeEach(() => {
      cy.viewport(w, h)
      cy.preserveDefaultCookies()
    })

    it('should check if User, SessionCookie, and SessionCookieExpire cookies are available before logout', () => {
      cy.getCookie('User').should('exist')
      cy.getCookie('SessionCookie').should('exist')
      cy.getCookie('SessionCookieExpire').should('exist')
    })

    it('should log out', () => {
      cy.logoutCustomer(device.isMobile)
      cy.wait(2000)
    })

    it('should not display the users name next to "Mein Ex Libris" and "Jetzt anmelden" should exist on the page', () => {
      cy.dataCy('modal-account-button').should('not.exist')
      if (device.isMobile) {
        cy.dataCy('loginmodal-mobilelogin-toogle').should('exist')
      } else {
        cy.dataCy('welcome-salutation').should('not.contain', 'Herr Tester')
        cy.dataCy('loginmodal-desktoplogin-toogle')
          .should('contain', 'Jetzt anmelden')
          .and('be.visible')
      }
    })

    it('should get logout cookie value', () => {
      cy.getCookie('exliPUC').then(($cookie) => {
        const cookieLogOutValue = $cookie.value
        expect(cookieLogOutValue).to.equal('I' + cookieValue)
      })
    })

    it('should log user in', () => {
      cy.loginCustomer(email, password)
      cy.wait(1000)
    })

    it('should navigate to Mein Ex Libris', () => {
      if (!device.isMobile) {
        cy.dataCy('modal-account-button').click()
      } else {
        cy.get('[data-cy=header-mobile-myAccount]').click()
        cy.get('[data-cy=myAccount-wrapper]')
          .children()
          .eq(1)
          .children()
          .eq(1)
          .children()
          .eq(1)
          .children()
          .eq(0)
          .click()
      }
    })

    it('should log out', () => {
      if (!device.isMobile) {
        cy.dataCy('modal-account-button').should('be.visible')
        cy.dataCy('welcome-nav-logoutButton').click()
      } else {
        cy.dataCy('header-mobile-myAccount').click()
        cy.dataCy('header-mobile').next().next().children().eq(1).children().eq(6).click()
      }
      cy.wait(1000)
    })

    it('should not display the users name next to "Mein Ex Libris" anymore and open login page after click', () => {
      if (device.isMobile) {
        cy.dataCy('loginmodal-mobilelogin-toogle').click()
      } else {
        cy.dataCy('welcome-salutation').should('not.contain', 'Herr Tester')
        cy.dataCy('loginmodal-desktoplogin-toogle').click()
      }
      cy.dataCy('login-input-email').should('exist')
    })

    it('should check for cookies', () => {
      cy.wait(2000)
      cy.getCookie('exliPUC').then(($cookie) => {
        const cookieLogOutValue = $cookie.value
        expect(cookieLogOutValue).to.equal('I' + cookieValue)
      })
    })

    it('should check if User, SessionCookie, and SessionCookieExpire cookies are removed after logout', () => {
      cy.getCookie('User').should('not.exist')
      cy.getCookie('SessionCookie').should('not.exist')
      cy.getCookie('SessionCookieExpire').should('not.exist')
    })
  })
})
