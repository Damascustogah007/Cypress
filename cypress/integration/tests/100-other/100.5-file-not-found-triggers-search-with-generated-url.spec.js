/**
 * PIC-3183
 */

import { getTestSpecName } from 'lib/testSpecName'
import { defaultMobile, defaultDesktop } from 'cypress/integration/_helpers/devices'
import { baseUrl } from 'cypress/fixtures/environment'

const testSpecName = getTestSpecName(__filename)
const devices = [
  defaultMobile,
  defaultDesktop,
]
const searchResultPathname = '/de/suche/'

devices.map((device) => {
  const [w, h] = device.viewport

  const specName = `${testSpecName} @@ File not found triggers search with generated URL - ${device.name} `

  describe(`${specName} - CMS page`, () => {
    beforeEach(() => {
      cy.viewport(w, h)
    })

    it('search for a non existing page', () => {
      cy.visit(`${baseUrl}/de/clubwelt/wettbbewerbe/`)
    })

    it('wait for tiles', () => {
      cy.intercept({
        method: 'POST',
        url: 'https://**/v1/Product/ProductTileQuery',
      }).as('productTileQuery')

      cy.wait('@productTileQuery')
    })

    it('should redirect to search page', () => {
      cy.window().should((win) => {
        expect(win.location.pathname).to.contain(searchResultPathname)
      })
    })

    it('Invalid category search redirects to search-result page', () => {
      cy.get('.alert-1.epoq_404_text').should(($errrorMessage) => {
        expect($errrorMessage).to.have.length.greaterThan(0)
      })
      cy.dataCy('epoq-search-input').should('have.value', 'wettbbewerbe')
    })
  })

  describe(`${specName} - PDP page`, () => {
    beforeEach(() => {
      cy.viewport(w, h)
    })

    it('search for a non existing page', () => {
      cy.visit(
        `${baseUrl}/de/buecher-buch/english-books/jane-piper-florida-state-university-college-of-music-clendinni/the-musicians-guide-to-theory-and-analysis/id/97803936004834`,
      )
    })

    it('wait for tiles', () => {
      cy.intercept({
        method: 'POST',
        url: 'https://**/v1/Product/ProductTileQuery',
      }).as('productTileQuery')

      cy.wait('@productTileQuery')
    })

    it('should redirect to search page', () => {
      cy.window().should((win) => {
        expect(win.location.pathname).to.contain(searchResultPathname)
      })
    })

    it('Invalid category search redirects to search-result page', () => {
      cy.get('.alert-1.epoq_404_text').should(($errrorMessage) => {
        expect($errrorMessage).to.have.length.greaterThan(0)
      })
      cy.dataCy('epoq-search-input').should(
        'have.value',
        'the musicians guide to theory and analysis',
      )
    })
  })
})
