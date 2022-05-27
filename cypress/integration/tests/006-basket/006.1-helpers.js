export const clickInSearchResultProductByIndex = (itemIndex) => {
  cy.intercept({
    method: 'POST',
    url: 'https://**/v1/Basket/BasketGet',
  }).as('basketGet')

  cy.dataCy('tileEngine-button-basket').eq(itemIndex).click()
  cy.wait('@basketGet')
}

export const deleteProductFromBasketByIndex = (itemIndex) => {
  cy.dataCy('widget-basket-button').trigger('mouseover')
  cy.get('[data-cy*="tooltip-item_val"][type="button"]')
    .eq(itemIndex)
    .invoke('show')
    .click({ force: true })
}
