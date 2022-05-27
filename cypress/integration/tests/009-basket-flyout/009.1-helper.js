import { onBasket } from 'cypress/support/page-objects/basket.page-object'

const checkItemDetails = ($el) => {
    const itemQuantityAndPrice = $el[0].innerText
    const itemQuantityAndPriceArray = itemQuantityAndPrice.split(' x CHF ')
    const itemQuantity = itemQuantityAndPriceArray[0]
    const itemPrice = itemQuantityAndPriceArray[1]
    expect(itemQuantity).equals('1')
    expect(itemPrice.length).to.be.greaterThan(0)
}
  
const checkBasketTotalPrice = ($results) => {
    const basketTotalPrice = $results[0].innerText
    expect(basketTotalPrice.length).to.be.greaterThan(6) // 6 stands for six digits e.g "CHF .0"
}

export function checkBasketFlyout(expectedItemAmount) {
    cy.dataCy('widget-basket-button').trigger('mouseover')
    cy.get("[data-cy^='tooltip-item_val-']")
        .first()
        .children()
        .last()
        .children()
        .as('itemDetails')

    cy.get('@itemDetails')
        .last()
        .then(($el) => checkItemDetails($el))

    cy.dataCy('tooltip-basket-content')
        .children()
        .first()
        .next()
        .children()
        .last()
        .then(($results) => checkBasketTotalPrice($results))

    cy.get('@itemDetails')
        .first()
        .then(($el) => {
        const itemName = $el[0].innerText
        expect(itemName.length).to.be.greaterThan(0)
        })

    cy.dataCy('tooltip-basket-cat').should('be.visible')
    cy.dataCy('widget-basket-button').trigger('mouseout')
    cy.wait(1000)
    cy.dataCy('tooltip-basket-content').should('not.be.visible')
    onBasket.assertNumberOfItemsInBasketToEqual(expectedItemAmount)
}