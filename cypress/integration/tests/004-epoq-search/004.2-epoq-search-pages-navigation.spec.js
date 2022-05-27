import { baseUrl } from 'cypress/fixtures/environment'
import Auth from 'cypress/fixtures/auth.secret'
import { defaultDesktop } from 'cypress/integration/_helpers/devices'
import { getTestSpecName } from 'lib/testSpecName'

const testSpecName = getTestSpecName(__filename)

describe(`${testSpecName} @@ Search results with the same params after navigate between pages`, function () {
  const mockSearchText = 'Bob'
  const mockSelectCategory = 'DVD'
  const lang = 'de'

  beforeEach(() => {
    cy.intercept({
      method: 'GET',
      url: 'https://**/CmsPageGet*',
    }).as('cmsPageGet')
    cy.intercept({
      method: 'POST',
      url: 'https://**/v1/Product/ProductTileQuery',
    }).as('productTileQuery')

    const config = defaultDesktop
    const [w, h] = config.viewport
    const itConfig = { auth: Auth }
    if (config.headers) {
      itConfig.headers = config.headers
    }

    cy.viewport(w, h)

    cy.preserveDefaultCookies(['customerCenter', 'EPOQ-Init'])
  })

  before(() => {
    cy.clearCookies()
  })

  it('should visit the search page', () => {
    cy.visit(`${baseUrl}/${lang}/suche/?q=Cactus`, { retryOnStatusCodeFailure: true })
    cy.reload(true)
    cy.wait('@productTileQuery', { timeout: 30000 })
    cy.get('div#epoq_resultrows', { timeout: 30000 }).then(() => {
      cy.get('[data-productid]', { timeout: 30000 })
        .its('length')
        .should('be.at.least', 1)
    })
  })

  it('should visit a cms page', function () {
    cy.get(
      '[data-cy=header-navigation-desktop] [href="/de/kontakt-hilfe/hilfe/service-leistungen/"]',
    ).click()
    cy.wait('@cmsPageGet')
  })

  it('should search in header', function () {
    cy.dataCy('search-select-selection', { timeout: 20000 }).select(mockSelectCategory)
    cy.headerSearch(mockSearchText)

    cy.get('div#epoq_resultrows', { timeout: 20000 }).then(() => {
      cy.get('[data-productid]', { timeout: 20000 })
        .its('length')
        .should('be.at.least', 1)
    })
  })

  it('should visit another cms page', function () {
    cy.get(
      '[data-cy=header-navigation-desktop] [href="/de/kontakt-hilfe/hilfe/"]',
    ).click()
    cy.wait('@cmsPageGet')
  })

  it('should search in header again', function () {
    cy.dataCy('search-select-selection').select(mockSelectCategory)
    cy.headerSearch(mockSearchText)
    cy.get('div#epoq_resultrows', { timeout: 20000 }).then(() => {
      cy.get('[data-productid]', { timeout: 20000 })
        .its('length')
        .should('be.at.least', 1)
    })
  })
})
