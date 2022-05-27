/**
 * PIC-572
 */

import { baseUrl } from 'cypress/fixtures/environment'
import { incorrect_login as loginData } from 'cypress/fixtures/002.1-login-flyout-error-case.data'
import { getTestSpecName } from 'lib/testSpecName'
import { defaultMobile, defaultDesktop } from 'cypress/integration/_helpers/devices'

const testSpecName = getTestSpecName(__filename)
const devices = [defaultMobile, defaultDesktop]
const { email, password } = loginData

devices.map((device) => {
  const targetUrl = `${baseUrl}/de/`
  describe(`${testSpecName} @@ Shop Login - ${device.name}`, () => {
    const [w, h] = device.viewport

    before(() => {
      cy.viewport(w, h)
      cy.clearCookies({ domain: null })
      cy.visit(targetUrl)
    })

    it('should login with incorrect data', () => {
      cy.loginCustomer(email, password)
    })

    it('should expect no captcha field', () => {
      cy.get('input[name="captchaCodeSolution"]').should('not.exist')
    })

    it('should expect Error message ', () => {
      cy.get('[data-cy="login-backendAlert"]').its('length').should('be.gt', 0)
    })
  })
})
