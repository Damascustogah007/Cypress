// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add("login", (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add("drag", { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add("dismiss", { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite("visit", (originalFn, url, options) => { ... })

import Auth from '../fixtures/auth.secret'
import namedViewports from '../integration/_helpers/viewports'
import 'cypress-iframe'

Cypress.Commands.add('visitWithDesktop', (targetUrl) => {
  const [w, h] = namedViewports.headlessMode
  cy.viewport(w, h)
  cy.visit(targetUrl, { auth: Auth, retryOnStatusCodeFailure: true })
})

Cypress.Commands.add('dataCy', (value, options = {}) => {
  return cy.get(`[data-cy="${value}"]`, options)
})

Cypress.Commands.add('visitWithViewport', (targetUrl, viewport = 'headlessMode') => {
  const [w, h] = namedViewports[viewport]
  cy.viewport(w, h)
  cy.visit(targetUrl, { auth: Auth, retryOnStatusCodeFailure: true })
})

Cypress.Commands.add('visitWithDevice', (targetUrl, device) => {
  const [w, h] = device.viewport
  cy.viewport(w, h)
  cy.visit(targetUrl, { auth: Auth, retryOnStatusCodeFailure: true })
})

//Workaraound, to really clear cookies:
Cypress.Commands.add('forceClearCookies', () => {
  cy.clearCookies()
  cy.wait(100)
  cy.getCookies({ timeout: 3000 }).then((cookies) => {
    if (cookies.length !== 0) {
      cy.reload()
      cy.getCookies({ timeout: 3000 }).should('be.empty')
    }
  })
})

let LOCAL_STORAGE_MEMORY = {}

Cypress.Commands.add('saveLocalStorageCache', () => {
  Object.keys(localStorage).forEach((key) => {
    LOCAL_STORAGE_MEMORY[key] = localStorage[key]
  })
})

Cypress.Commands.add('restoreLocalStorageCache', () => {
  Object.keys(LOCAL_STORAGE_MEMORY).forEach((key) => {
    localStorage.setItem(key, LOCAL_STORAGE_MEMORY[key])
  })
})

/*
 * Configurable pause/delay between commands
 * Description: Workaround to allow the configuration of the speed steps in test
 * Source: https://github.com/cypress-io/cypress/issues/249
 *
 * or try with config: "defaultCommandTimeout": 4000,
 * Source: https://docs.cypress.io/api/cypress-api/config.html#Object
 *
 * */
const COMMAND_DELAY = 200
for (const command of [
  'visit',
  'click',
  'trigger',
  'type',
  'clear',
  'reload',
  'contains',
]) {
  Cypress.Commands.overwrite(command, (originalFn, ...args) => {
    const origVal = originalFn(...args)
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(origVal)
      }, COMMAND_DELAY)
    })
  })
}

const VISIT_COMMAND_DELAY = 500
const ONETRUST_LOAD_DELAY = 100
Cypress.Commands.overwrite('visit', (originalFn, url, options) => {
  const origVal = originalFn(url, options)
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(origVal)
    }, VISIT_COMMAND_DELAY)
  }).then((window) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        if (window.OneTrust) {
          window.OneTrust.AllowAll()
        }
        resolve()
      }, ONETRUST_LOAD_DELAY)
    })
  })
})
