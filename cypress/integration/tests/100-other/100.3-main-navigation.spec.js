import { baseUrl } from 'cypress/fixtures/environment'
import namedViewports from 'cypress/integration/_helpers/viewports'
import { dateFormat } from 'cypress/integration/_helpers/date'
import { getTestSpecName } from 'lib/testSpecName'

const testSpecName = getTestSpecName(__filename)
const todaysDate = Cypress.moment().format(dateFormat)

// const captureOptions = (w, h) => {
//   return {
//     capture: "fullPage",
//     clip: { x: 0, y: 0, width: w, height: 600 }
//   };
// };

describe(`${testSpecName} @@ Dummy Test`, function () {
  it('should ...', function () {
    const targetUrl = `${baseUrl}/de`

    // Get Test data
    const [w, h] = namedViewports.headlessMode
    cy.viewport(w, h)
    const viewportStr = namedViewports.headlessMode.join('x')

    cy.visitWithViewport(targetUrl) // default viewport = headlessMode
    cy.get('[data-cy=main-navigation-desktop] button').first().click({ force: true })
    cy.screenshot(
      `${todaysDate}/main-navigation_${viewportStr}`,
      // , captureOptions(w, h)
    )
  })
})
