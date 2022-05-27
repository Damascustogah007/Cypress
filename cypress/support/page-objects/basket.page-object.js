export class Basket {
  removeAllItems() {
    cy.intercept({
      method: 'POST',
      url: 'https://**/Basket/BasketItemRemove',
    }).as('basketItemRemove')

    cy.get('[data-cy=widget-basket-button]', { timeout: 8000 }).then(($el) => {
      const itemsInBasketAmount = Number($el[0].innerText)
      cy.log('Number of items in Basket', itemsInBasketAmount)
      if (itemsInBasketAmount > 0) {
        cy.get('[data-cy="widget-basket-button"]').trigger('mouseover')
        cy.get('[data-cy="tooltip-basket-content"]', { timeout: 4500 })
          .children()
          .first()
          .children()
          .each(($item) => {
            cy.wrap($item).find('button').as('closeButton')
            cy.get('@closeButton').invoke('show').click({ force: true })
            cy.wait('@basketItemRemove')
          })
      }
      //Guarding assertion
      this.assertNumberOfItemsInBasketToEqual(0)
    })
  }

  assertNumberOfItemsInBasketToEqual(numberOfItems) {
    cy.get('[data-cy=widget-basket-button]', { timeout: 6000 }).should(($el) => {
      const itemsInBasketAmount = Number($el[0].innerText)
      expect(itemsInBasketAmount).equal(numberOfItems)
    })
  }

  getNumberOfItemsInBasket() {
    cy.wait(500)
    return cy.get('[data-cy=widget-basket-button]', { timeout: 6000 }).then(($el) => {
      return Number($el[0].innerText)
    })
  }
}

export const onBasket = new Basket()
