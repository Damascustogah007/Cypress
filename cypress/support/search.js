Cypress.Commands.add('headerSearch', (searchText) => {
  headerSearch(searchText)
})

function headerSearch(searchText) {
  cy.intercept({
    method: 'POST',
    url: 'https://**/v1/Product/ProductTileQuery',
  }).as('productTileQuery')

  cy.get('[data-cy="epoq-search-input"]').clear().type(searchText)
  cy.wait(1000)
  cy.get('[data-cy="epoq-search-input"]').type('{enter}')
  cy.wait('@productTileQuery', { timeout: 30000 })
}
