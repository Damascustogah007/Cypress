export function depositExistingClubmemberCredentials(clubmemberCredentials, isOwner = false) {
  cy.intercept({
    method: 'POST',
    url: 'https://**/v1/Club/AssignClubNumber',
  }).as('assignClubNumber')
  cy.dataCy('clubdeposit-input-clubNummer').type(clubmemberCredentials.clubNumber)
  
  const selector = `[data-cy="clubdeposit-radio-ownCard__${isOwner ? '1' : '0'}"][type="radio"]`
  cy.get(selector).check()
  cy.dataCy('clubdeposit-select-salutation').select(clubmemberCredentials.salutation)
  cy.dataCy('clubdeposit-input-firstname').clear().type(clubmemberCredentials.firstName)
  cy.dataCy('clubdeposit-input-lastname').clear().type(clubmemberCredentials.lastName)
  cy.dataCy('clubdeposit-input-birthDate').clear().type(clubmemberCredentials.datOfBirth)
  cy.dataCy('clubdeposit-button-submit').click()
  cy.wait('@assignClubNumber')
}

export function expectTileEngineClubDiscount() {
  cy.dataCy('tileEngine-icon-clubDiscount')
    .should('be.visible')
    .and('have.css', 'background-color', 'rgb(191, 13, 62)')
}

export function expectErrorMessage() {
  cy.dataCy('clubcard-add-infobox-robbed')
    .should('be.visible')
    .and('contain', 'Support-Code 27.')
}

export function storeCardClubMember(device) {
  if (device.isMobile) {
    cy.dataCy('header-mobile-myAccount').click()
    cy.dataCy('myAccount-wrapper').children().eq(1)
    cy.dataCy('myAccount-navigationItem').eq(1).children().eq(2).children().eq(0).click()
  } else {
    cy.dataCy('action-navigation-desktop')
      .children()
      .eq(0)
      .children()
      .eq(0)
      .children()
      .eq(0)
      .click()
    cy.wait(2000)
    cy.dataCy('sidebar-navigation-collapse-tree')
      .children()
      .eq(0)
      .children()
      .eq(0)
      .children()
      .eq(0)
      .children()
      .eq(1)
      .click()
  }
}

export function clickOnBooksInTheClubMenuItem(device) {
  if (device.isMobile) {
    cy.dataCy('mobile-navigation-burgerMenu').click()
    cy.dataCy('mobileNavigation-item-child').eq(7).click()
    cy.wait(2000)
    cy.dataCy('mobileNavigation-item-child').eq(5).click()
    cy.wait(2000)
    cy.dataCy('mobileNavigation-item-child').eq(3).click()
    cy.wait(2000)
    cy.dataCy('mobileNavigation-button-home').eq(2).next().next().click()
    cy.wait(2000)
  } else {
    cy.dataCy('sidebar-navigation-collapse-tree')
      .children()
      .eq(0)
      .children()
      .eq(0)
      .children()
      .eq(0)
      .children()
      .eq(5)
      .click()
    cy.wait(2000)
  }
}
