/**
 * NO-PIC
 */
import { getTestSpecName } from 'lib/testSpecName'
import { baseUrl } from 'cypress/fixtures/environment'
import { defaultDesktop } from 'cypress/integration/_helpers/devices'
import testFixture from '../../../fixtures/002.2-login-restore-session.data'

const testSpecName = getTestSpecName(__filename)

const [w, h] = defaultDesktop.viewport

const targetUrl = `${baseUrl}/de/`

const { email, password, salutation, name } = testFixture.user

describe(`${testSpecName} @@ Session Restore`, () => {
  before(() => {
    cy.clearCookies()
    cy.visit(targetUrl)
  })

  beforeEach(() => {
    cy.viewport(w, h)
    cy.preserveDefaultCookies(['SPRING_SECURITY_REMEMBER_ME_COOKIE'])
  })

  it('login and remober all cookies, execpt "rememberme"', function () {
    cy.loginCustomer(email, password, true)
    cy.wait(1000)
    cy.getCookie('SPRING_SECURITY_REMEMBER_ME_COOKIE').should('exist')
  })

  it('remove all cookies, except "rememberme"', function () {
    cy.clearCookie('User')
    cy.clearCookie('SessionCookie')
    cy.clearCookie('exliPUC')
    cy.clearCookie('exliPCC')
    cy.clearCookie('basket')
    cy.visit(targetUrl)
  })

  it('should have the salutation name after reload', function () {
    cy.get('[data-cy=welcome-salutation]').should('contain', salutation)
  })

  it('should show the my-account flyout button', function () {
    cy.get('[data-cy=modal-account-button]').should('contain', name)
  })

  it('should show the basket items in header', function () {
    cy.get('[data-cy=widget-basket-button]').should('contain', '2')
  })
})
