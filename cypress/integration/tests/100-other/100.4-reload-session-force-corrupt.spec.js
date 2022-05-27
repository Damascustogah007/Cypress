/**
 * NO-PIC
 * Description:
 * Force error in Session by manipulating the SessionCookie after login,
 * and reload the page
 */
import { getTestSpecName } from 'lib/testSpecName'
import { baseUrl } from 'cypress/fixtures/environment'
import testFixture from 'cypress/fixtures/100.4-reload-session-force-corrupt.data'
import { defaultDesktop } from 'cypress/integration/_helpers/devices'

const testSpecName = getTestSpecName(__filename)

const [w, h] = defaultDesktop.viewport

const targetUrl = `${baseUrl}/de/`

const { email, password } = testFixture.regular_user

let cookieStored = ''
let newCookieValue = ''

describe(`${testSpecName} @@ Session Restore`, () => {
  before(() => {
    cy.clearCookies()
    cy.visit(targetUrl)
  })

  beforeEach(() => {
    cy.viewport(w, h)
    cy.preserveDefaultCookies()
  })

  it('login', () => {
    cy.loginCustomer(email, password)
    cy.wait(2000)
  })

  it('should have the SessionCookie', () => {
    cy.getCookie('SessionCookie', { timeout: 1000 })
      .should('exist')
      .then((cookie) => {
        cookieStored = cookie
      })
  })

  it('should replace the SessionCookie with a wrong value', function () {
    newCookieValue = cookieStored.value.replace(/[0-9]/g, 'X')
    const options = {
      domain: cookieStored.domain,
      expiry: cookieStored.expiry,
      httpOnly: cookieStored.httpOnly,
      path: cookieStored.path,
      sameSite: cookieStored.sameSite,
      secure: cookieStored.secure
    }
    cy.setCookie('SessionCookie', newCookieValue, options)
  })

  it(
    'on reload the page should redirect to login page with the url parameter "userLoggedOut"',
    {
      retries: {
        runMode: 1,
        openMode: 1,
      },
    },
    () => {
      cy.visit(targetUrl, { retryOnStatusCodeFailure: false })
      cy.url().should('include', 'de/mein-konto/login/?userLoggedOut=true')
    },
  )

  it('should remove the SessionCookie', () => {
    cy.getCookie('SessionCookie', { timeout: 1000 }).should('not.exist')
  })
})
