import { baseUrl } from 'cypress/fixtures/environment'
import { routes_shop } from 'cypress/fixtures/shared/routes'
import { desktop } from 'cypress/integration/_helpers/default-devices'

function deleteBasket() {
  // this only works partially -- if you log out and log
  // in again, you will still have an empty basket but if
  // you add now one item, you will get an new basket
  clearBasket()
  cy.clearCookie('basket')
}

function addFirstProductOnCurrentPageToBasket() {
  cy.intercept({
    method: 'POST',
    url: 'https://**/v1/Basket/BasketGet',
  }).as('basketGet')

  cy.get('[data-cy="tileEngine-button-basket"]', { timeout: 6000 }).first().click()
  cy.wait('@basketGet')
  cy.wait(1000)
}

function visitSearchResultPage(options = {}) {
  const { searchString, categoryString, language, device } = options
  const _searchString = searchString || 'Garfield'
  const _categoryString = categoryString ? `&Kategorie=${categoryString}` : ''
  const _language = language || { code: 'de' }
  const _device = device || desktop
  cy.visitWithDevice(
    `${baseUrl}/${_language.code}${
      routes_shop['search'][_language.code]
    }/?q=${_searchString}${_categoryString}`,
    _device,
  )
  cy.wait(1000)
}

function clickBasketIcon(isMobile = false) {
  if (isMobile) {
    cy.get('[data-cy="header-mobile-basket"]').click({ force: true })
  } else {
    cy.get('[data-cy=widget-basket-button]').click()
  }
}

function clearBasket(isMobile = false) {
  cy.intercept({
    method: 'POST',
    url: 'https://**/v1/Basket/BasketGet',
  }).as('basketGet')

  /* Checking for items in basket
   * if the basket is not empty => remove all items
   **/
  const removeItems = ($el) => {
    const itemsInBasketAmount = $el[0].innerText
    if (itemsInBasketAmount > '0') {
      cy.get('[data-cy*="button-close"][type="button"]').each(($button) => {
        cy.wrap($button).click({ force: true })
        cy.wait('@basketGet')
        cy.wait(1500)
      })
    }
  }

  if (isMobile) {
    cy.dataCy('header-mobile-basket')
      .click()
      .then(($el) => {
        removeItems($el)
      })
  } else {
    cy.get('[data-cy=widget-basket-button]')
      .trigger('mouseover')
      .then(($el) => {
        removeItems($el)
      })
  }
}

Cypress.Commands.add('clearBasket', clearBasket)
Cypress.Commands.add(
  'addFirstProductOnCurrentPageToBasket',
  addFirstProductOnCurrentPageToBasket,
)
Cypress.Commands.add('visitSearchResultPage', visitSearchResultPage)
Cypress.Commands.add('clickBasketIcon', clickBasketIcon)
Cypress.Commands.add('deleteBasket', deleteBasket)
