/*
# Advice
  To runs the test, activate the feature
  in .env file
*/

import { baseUrl } from 'cypress/fixtures/environment'
import { getTestSpecName } from 'lib/testSpecName'

const testSpecName = getTestSpecName(__filename)

const routes = [
  {
    url: '/de/passwort-aendern',
    it: () => {
      // cy.wait(500);
      // cy.get("[data-cy=newpassword-confirm]").type("lorem ipsum");
      // cy.wait(500);
      // cy.get("[data-cy=newpassword-submit]").click({ force: true });
    },
  },
  {
    url: '/fr/modifier-mot-passe',
    it: () => {
      // cy.wait(500);
      // cy.get("[data-cy=newpassword-confirm]").type("lorem ipsum");
      // cy.wait(500);
      // cy.get("[data-cy=newpassword-submit]").click({ force: true });
    },
  },
  {
    url: '/de/mein-konto/passwort-vergessen',
    it: () => null,
  },
  {
    url: '/fr/mon-compte/passwort-vergessen',
    it: () => null,
  },
  {
    url: '/de/mein-konto/login',
    it: () => null,
  },
  {
    url: '/fr/mon-compte/identification',
    it: () => null,
  },
  {
    url: '/de/login/passwort-vergessen',
    it: () => null,
  },
  {
    url: '/fr/login/passwort-vergessen',
    it: () => null,
  },
  {
    url: '/de/login',
    it: () => null,
  },
  {
    url: '/fr/identification',
    it: () => null,
  },
  {
    url: '/de/suche',
    it: () => null,
  },
  {
    url: '/fr/recherche',
    it: () => null,
  },
  {
    url: '/de/neues-konto',
    it: () => null,
  },
  {
    url: '/fr/nouveau-compte',
    it: () => null,
  },
  {
    url: '/de/',
    it: () => null,
  },
  {
    url: '/fr/',
    it: () => null,
  },
  {
    url: '/',
    it: () => null,
  },
  //   {
  //     url: "/it/",
  //     it: () => null
  //   }
]

const params = '?showKeysInline=true&showKeysWithMessage=true&marker=%F0%9F%98%8E'
const viewports = [[1024, 768]]

const todaysDate = Cypress.moment().format('YYYY-MMM-DD')

describe(`${testSpecName} @@ Label Management`, function () {
  viewports.forEach((viewport) => {
    const [w, h] = viewport

    routes.forEach((route) => {
      const itName = 'should capture the page' + route.url
      it(itName, function () {
        cy.viewport(w, h)
        cy.visit(baseUrl + route.url + params, { retryOnStatusCodeFailure: true })
        route.it()

        cy.screenshot(
          todaysDate +
            '/' +
            w +
            '.' +
            h +
            '--showKeysInline__' +
            route.url.split('/').join('___'),
        )
      })
    })
  })
})
