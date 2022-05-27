import { baseUrl } from 'cypress/fixtures/environment'
import Auth from 'cypress/fixtures/auth.secret'
import {
  allDevices,
  mobileDevices,
  desktopDevices,
  hybridAppDevices,
} from 'cypress/integration/_helpers/devices'
import { getTestSpecName } from 'lib/testSpecName'

const testSpecName = getTestSpecName(__filename)

describe(`${testSpecName} @@ Search Page results - desktop`, function () {
  const deviceConfigs = desktopDevices.concat([allDevices.headlessModeDesktopDevice])

  const mockLangParams = [
    { lang: 'de', searchText: 'Bob', searchSelect: 'DVD' },
    { lang: 'fr', searchText: 'Bob', searchSelect: 'DVD' },
  ]

  mockLangParams.forEach((paramsObj) => {
    deviceConfigs.forEach((config) => {
      const [w, h] = config.viewport
      const viewportStr = config.viewport.join('x')

      const lang = paramsObj.lang

      describe(`${testSpecName} @@ Search: ${config.name}, ${viewportStr}, ${lang}`, function () {
        beforeEach(() => {
          cy.viewport(w, h)
          cy.intercept({
            method: 'POST',
            url: 'https://**/v1/Product/ProductTileQuery',
          }).as('productTileQuery')
        })

        it(`should open the startsite and search:  ${config.name}, ${viewportStr}, ${lang}`, function () {
          const itConfig = { auth: Auth, retryOnStatusCodeFailure: true }
          if (config.headers) {
            itConfig.headers = config.headers
          }
          cy.visit(`${baseUrl}/${lang}`, itConfig)
          cy.reload(true)

          cy.wait(1000)

          const mockSearchText = paramsObj.searchText
          const mockSelectCategory = paramsObj.searchSelect

          cy.dataCy('search-select-selection').select(mockSelectCategory)
          cy.headerSearch(mockSearchText)

          cy.get('div#epoq_resultrows', { timeout: 20000 }).then(() => {
            cy.get('[data-productid]', { timeout: 20000 })
              .its('length')
              .should('have.at.least', 1)
          })
        })
      })
    })
  })
})

describe(`${testSpecName} @@ Search Page results - mobile`, function () {
  const deviceConfigs = mobileDevices

  const mockLangParams = [
    { lang: 'de', searchText: 'Bob' },
    { lang: 'fr', searchText: 'Bob' },
  ]

  mockLangParams.forEach((paramsObj) => {
    deviceConfigs.forEach((config) => {
      const [w, h] = config.viewport
      const viewportStr = config.viewport.join(' x ')

      const lang = paramsObj.lang

      describe(`${testSpecName} @@ Search:  ${config.name}, ${viewportStr}, ${lang}`, function () {
        beforeEach(() => {
          cy.viewport(w, h)
        })

        it(`should should open the startsite and search: ${config.name}, ${viewportStr}, ${lang}`, function () {
          const itConfig = { auth: Auth, retryOnStatusCodeFailure: true }
          if (config.headers) {
            itConfig.headers = config.headers
          }
          cy.visit(`${baseUrl}/${lang}`, itConfig)
          cy.reload(true)

          const mockSearchText = paramsObj.searchText

          cy.wait(300)

          cy.headerSearch(mockSearchText)
          cy.get('div#epoq_resultrows', { timeout: 20000 }).then(() => {
            cy.get('[data-productid]', { timeout: 20000 })
              .its('length')
              .should('have.at.least', 1)
          })
        })
      })
    })
  })
})

describe(`${testSpecName} @@ Search Page results - hybrid app`, function () {
  const deviceConfigs = hybridAppDevices

  const mockLangParams = [
    { lang: 'de', resource: 'suche', searchText: 'Bob' },
    { lang: 'fr', resource: 'recherche', searchText: 'Bob' },
  ]

  mockLangParams.forEach((paramsObj) => {
    deviceConfigs.forEach((config) => {
      const [w, h] = config.viewport
      const viewportStr = config.viewport.join(' x ')

      const { lang, resource, searchText: mockSearchText } = paramsObj

      describe(`${testSpecName} @@ Search:  ${config.name}, ${viewportStr}, ${lang}`, function () {
        beforeEach(() => {
          cy.viewport(w, h)
        })

        it(`should should open search result page: ${config.name}, ${viewportStr}, ${lang}`, function () {
          const itConfig = { auth: Auth, retryOnStatusCodeFailure: true }
          if (config.headers) {
            itConfig.headers = config.headers
          }
          cy.visit(`${baseUrl}/${lang}/${resource}/?q=${mockSearchText}`, itConfig)
          cy.reload(true)

          cy.wait(300)

          cy.get('div#epoq_resultrows', { timeout: 20000 }).then(() => {
            cy.get('[data-productid]', { timeout: 20000 })
              .its('length')
              .should('have.at.least', 1)
          })
        })
      })
    })
  })
})
