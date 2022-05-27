import { cardType } from 'cypress/fixtures/013.2-payment-and-cumulus-credit-card.data'
export const successMessage = 'Ihre Einstellung wurde gespeichert.'

export function redirectToMeinExlibris(device) {
  if (device.isMobile) {
    cy.dataCy('header-mobile-myAccount').click({ force: true })
  } else {
    cy.dataCy('modal-account-button').click()
  }
  cy.url().should('include', '/mein-konto')
}

export function clickOnPayAndCumulus() {
  cy.dataCy('navigation-account')
    .children()
    .eq(1)
    .children()
    .eq(4)
    .children()
    .eq(2)
    .children()
    .eq(0)
    .click({ force: true })
}
export function checkNoPaymentMethodIsSelected() {
  cy.dataCy('paymentMethodsRadioItem')
    .children()
    .then(($radioBtns) => {
      for (let radioBtn of $radioBtns) {
        let datacyValue = radioBtn.firstChild.attributes['data-cy'].nodeValue
        cy.dataCy(datacyValue).as('datacyAttribute')
        cy.get('@datacyAttribute').should('not.checked')
        cy.wait(1000)
      }
    })
}
export function loopPaymentOptions() {
  cy.dataCy('paymentMethodsRadioItem')
    .children()
    .then(($radioBtns) => {
      for (let radioBtn of $radioBtns) {
        let datacyValue = radioBtn.firstChild.attributes['data-cy'].nodeValue
        cy.dataCy(datacyValue).as('datacyAttribute')
        cy.get('@datacyAttribute').next().children().eq(0).click()
        cy.get('@datacyAttribute').should('be.checked')
        cy.wait(1000)
      }
    })
}

export function saveAndCheckSuccessMessage() {
  cy.intercept({ url: 'https://a-ws.exlibris.ch/**/PaymentAndCumulusSave' }).as(
    'paymentAndCumlusSave',
  )
  cy.dataCy('paymentAndCumulus-save-button').click()
  cy.get('[type="SUCCESS"]').should('contain', successMessage)
  cy.wait('@paymentAndCumlusSave')
}

export function navigateToPaymentAndCumulus(cumulusCard) {
  let selector = null
  if (cumulusCard.type === cardType.MASTER_CARD) {
    selector = 'credit-card-0'
  } else if (cumulusCard.type === cardType.VISA) {
    selector = 'credit-card-1'
  } else {
    selector = 'credit-card-2'
  }
  cy.dataCy(selector).next().children().eq(0).click({ force: true })
  cy.dataCy(selector).should('be.checked')
  cy.wait(1000)
  cy.dataCy('add-credit-card-button').click()
  cy.wait(5000)
  cy.frameLoaded('#datatransPaymentFrame')
}

export function selectCardType(cumulusCard) {
  cy.iframe('#datatransPaymentFrame')
    .find('.payment-list--item')
    .children()
    .should('be.visible')
    .as('paymentList')
  if (cumulusCard.type === cardType.MASTER_CARD) {
    cy.get('@paymentList').eq(0).click()
  } else if (cumulusCard.type === cardType.VISA) {
    cy.get('@paymentList').eq(1).click()
  } else {
    cy.get('@paymentList').eq(2).click()
  }
}
