import { baseUrl, executeCaptures } from 'cypress/fixtures/environment'
import devices from 'cypress/integration/_helpers/devices'
import { passwords } from 'cypress/fixtures/001.2-registration-password-levels.data'
import Auth from 'cypress/fixtures/auth.secret'
import { getTestSpecName } from 'lib/testSpecName'

const testSpecName = getTestSpecName(__filename)

const targetUrl = `${baseUrl}/de/neues-konto`

devices.forEach((config) => {
  describe(`${testSpecName} @@ Should have the right level advice`, () => {
    const passwordLevelsKeys = Object.keys(passwords)

    it('visit', () => {
      const [w, h] = config.viewport
      cy.viewport(w, h)

      cy.visit(targetUrl, {
        auth: Auth,
        retryOnStatusCodeFailure: true,
      })
    })

    passwordLevelsKeys.forEach((passwordLevelKey) => {
      const [w, h] = config.viewport
      const selectedPassword = passwords[passwordLevelKey]

      beforeEach(() => {
        cy.viewport(w, h)
      })

      it(`should show a ${passwordLevelKey} password advice ${config.viewport.join(
        'x',
      )}`, () => {
        cy.get('[data-cy=passwordfield-input]').clear().type(selectedPassword.value)
        cy.wait(1000)
        cy.get('[data-cy=passwordfield-input]')
          .parent()
          .find('span')
          .then(($items) => {
            const win = $items[0].ownerDocument.defaultView
            const after = win.getComputedStyle($items[0], 'after')
            const contentValue = after.getPropertyValue('content')
            expect(contentValue).to.eq(`"${selectedPassword.advice}"`)
          })
      })
    })
  })
})
