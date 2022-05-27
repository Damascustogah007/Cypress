export class Header {
  search(searchText, chosenCategory = null) {
    cy.intercept({
      method: 'POST',
      url: 'https://**/v1/Product/ProductTileQuery',
    }).as('productTileQuery')
    if (chosenCategory) {
      cy.get('[data-cy="search-select-selection"]').select(chosenCategory)
    }
    cy.wait(1000)
    cy.get('[data-cy="epoq-search-input"]').clear().type(searchText).type('{enter}')
    cy.wait('@productTileQuery') //wait for products to be loaded (first call)
  }

  assertSalutationToInclude(salutation) {
    cy.get('[data-cy=welcome-salutation]').should(($div) => {
      const text = $div.text()
      expect(text).to.include(salutation)
    })
  }
}

export const onHeader = new Header()
