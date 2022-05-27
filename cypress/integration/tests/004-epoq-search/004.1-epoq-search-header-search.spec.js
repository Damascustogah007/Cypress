import { baseUrl } from 'cypress/fixtures/environment'
import Auth from 'cypress/fixtures/auth.secret'
import namedViewports from 'cypress/integration/_helpers/viewports'
import { getTestSpecName } from 'lib/testSpecName'

const testSpecName = getTestSpecName(__filename)

describe(`${testSpecName} @@ Header-Search button`, function () {
  beforeEach(() => {
    const [w, h] = namedViewports.desktop
    cy.viewport(w, h)
    cy.visit(`${baseUrl}/de`, { auth: Auth, retryOnStatusCodeFailure: true })
  })
  const mockSearchText = 'Bob'

  it('should redirect to the search page if click on the button', function () {
    cy.dataCy('epoq-search-input').clear().type(mockSearchText)
    cy.dataCy('epoq-search-button').click({ force: true })
    cy.url().should('eq', `${baseUrl}/de/suche/?q=${mockSearchText}`)
  })
})

describe(`${testSpecName} @@ Header-Search recomendation`, function () {
  beforeEach(() => {
    const [w, h] = namedViewports.desktop
    cy.viewport(w, h)
    cy.visit(`${baseUrl}/de`, { auth: Auth, retryOnStatusCodeFailure: true })
  })
  const mockSearchText = 'Clean Code'

  it('should redirect to the search page if click on the recomendation', function () {
    cy.dataCy('epoq-search-input').clear().type(mockSearchText)
    cy.dataCy('epoq-search-input')
      .parent()
      .siblings()
      .first()
      .children()
      .eq(1)
      .children()
      .eq(1)
      .click({ force: true })
    cy.url().should('eq', `${baseUrl}/de/suche/?qs=Clean%20Code`)
  })
})

describe(`${testSpecName} @@ Header-Search enter`, function () {
  beforeEach(() => {
    const [w, h] = namedViewports.desktop
    cy.viewport(w, h)
    cy.visit(`${baseUrl}/de`, { auth: Auth, retryOnStatusCodeFailure: true })
  })
  const mockSearchText = 'Bob'

  it('should redirect to the search page if press enter', function () {
    cy.dataCy('epoq-search-input').clear().type(mockSearchText).type('{enter}')
    cy.url().should('eq', `${baseUrl}/de/suche/?q=${mockSearchText}`)
  })
})

describe(`${testSpecName} @@ Header-Search with Category and enter`, function () {
  const mockSearchText = 'Bob'
  const mockSelectOption = 'DVD'
  beforeEach(() => {
    const [w, h] = namedViewports.desktop
    cy.viewport(w, h)
    cy.visit(`${baseUrl}/de`, { auth: Auth, retryOnStatusCodeFailure: true })
  })

  it('should redirect to the search page if press enter', function () {
    cy.dataCy('search-select-selection').select(mockSelectOption)
    cy.dataCy('epoq-search-input').clear().type(mockSearchText).type('{enter}')
    cy.url().should(
      'eq',
      `${baseUrl}/de/suche/?q=${mockSearchText}&Kategorie=Filme%3EDVD`,
    )
  })
})
