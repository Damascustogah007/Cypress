import { customer_new as customer } from 'cypress/fixtures/007.1-checkout.data'
import { baseUrl } from 'cypress/fixtures/environment'
import { createRegistrationData } from 'cypress/fixtures/shared/user-create'
import { routes_shop } from 'cypress/fixtures/shared/routes'

export function redirectToBasket(language, isMobile) {
  if (isMobile) {
    cy.clickBasketIcon(true)
    cy.location().should((location) => {
      expect(location.pathname).to.eq(
        `${routes_shop['basket'][language.code].split('?')[0]}`,
      )
    })
  } else {
    cy.scrollTo('top')
    cy.wait(200)
    cy.get('[data-cy=widget-basket-button]', { scrollbehavior: 'top' })
      .click()
      .then(() => {
        cy.location().should((location) => {
          expect(location.pathname).to.eq(
            `${routes_shop['basket'][language.code].split('?')[0]}`,
          )
        })
      })
  }
}

export function redirectToStep2(language, isMobile = false) {
  if (isMobile) {
    cy.dataCy('basket-button-step2').first().click()
  } else {
    cy.dataCy('basket-button-step2').first().click()
    cy.wait(2000)
    cy.go('back')
    cy.wait(2000)
    cy.dataCy('basket-button-step2').last().click()
  }
  cy.location().should((location) => {
    expect(location.pathname).to.eq(
      `${routes_shop['checkout_step2_logged_in'][language.code].split('?')[0]}`,
    )
  })
}

export function redirectToCheckoutStep3(language) {
  cy.get('[data-cy=checkout-addressSend-button-submit-bottom]').click()

  cy.location().should((location) => {
    expect(location.pathname).to.eq(
      `${routes_shop['checkout_step2_payment'][language.code].split('?')[0]}`,
    )
  })
}

export function validateCustomerBill(user) {
  cy.get('[data-cy=checkout-address]').should(($address) => {
    expect($address)
      .to.contain(`${user.firstName} ${user.lastName}`)
      .and.to.contain(`${user.street},`)
      .and.to.contain(`${user.zipCode} ${user.city}`)
  })
}

export function validateEditedBillingAddress(billingAddress) {
  if (billingAddress.company) {
    cy.dataCy('checkout-addressCopy-customerCompany').should(
      'contain',
      `${billingAddress.company}`,
    )
  }

  cy.dataCy('checkout-addressCopy-customerName').should(
    'contain',
    ` ${billingAddress.firstName} ${billingAddress.lastName}`,
  )
}

export function editBillingAddress(billingAddress) {
  cy.dataCy('invoiceAddressChange-select-salutation').select(billingAddress.salutation)
  cy.dataCy('invoiceAddressChange-input-firstname').clear().type(billingAddress.firstName)
  cy.dataCy('invoiceAddressChange-input-lastname').clear().type(billingAddress.lastName)
  cy.dataCy('invoiceAddressChange-input-company').clear()
  if (billingAddress.company) {
    cy.dataCy('invoiceAddressChange-input-company').type(billingAddress.company)
  }
  cy.dataCy('invoiceAddressChange-input-phonenumber').clear().type(billingAddress.phone)
  cy.dataCy('invoiceAddressChange-button-submitbottom').click({ force: true })
}

export function acceptAgbAndContinue() {
  cy.get('[data-cy*="checkout-agreements-acceptAGB"]').check({
    force: true,
  })
  cy.get('[data-cy=checkout-payment-button-submit]').first().click()
}

export function randomCharacterGenerator(characterCount) {
  return Math.random()
    .toString(36)
    .replace(/[^a-z]+/g, '')
    .substr(0, characterCount)
}

export function loginUser() {
  let { email, password } = customer
  cy.task('getLatestUser').then((latestCredentials) => {
    if (latestCredentials) {
      email = latestCredentials.email
      password = latestCredentials.password
      cy.loginCustomer(email, password)
    } else {
      cy.loginCustomer(customer.email, customer.password)
    }
  })
}

export function addFirstItemInPriceRange(minPrice, maxPrice, language) {
  cy.intercept({
    method: 'POST',
    url: 'https://**/v1/Basket/BasketItemAdd',
  }).as('basketItemAdd')

  const translations = {
    de: {
      search: 'Buch',
      price: 'Preis',
    },
    fr: {
      search: 'Bond&Catégorie=Musique',
      price: 'Prix',
    },
  }

  cy.visit(
    `${baseUrl}/${language.code}${routes_shop['search'][language.code]}/?q=${
      translations[language.code]['search']
    }&${translations[language.code]['price']}=${minPrice}-${maxPrice}`,
  )
  cy.dataCy('tileEngine-button-basket').first().click()
  cy.wait('@basketItemAdd')
}

export function registerNewCustomer(language) {
  const routePage = `${routes_shop['register'][language.code]}`
  const userData = createRegistrationData()
  cy.registerCustomer(baseUrl, routePage, userData, language.code)
  cy.writeFile(`output-data/registration/${userData.testId}.json`, userData)
  cy.wait(1000)
  cy.logoutCustomer()
  cy.clearCookies()
  cy.wait(1000)
  return userData
}

export function addNonPhysicalProduct(language) {
  cy.intercept({
    method: 'POST',
    url: 'https://**/v1/Basket/BasketItemAdd',
  }).as('basketItemAdd')

  const searchInfo = {
    de: {
      term: 'test',
      category: 'Kategorie=Bücher>E-Books Deutsch',
    },
    fr: {
      term: 'test',
      category: 'Catégorie=Livres>eBooks en français',
    },
  }

  cy.visit(
    `${baseUrl}/${language.code}${routes_shop['search'][language.code]}/?q=${
      searchInfo[language.code]['term']
    }&${searchInfo[language.code]['category']}`,
    { failOnStatusCode: false },
  )
  cy.dataCy('tileEngine-button-basket').first().click()
  cy.wait('@basketItemAdd')
}

Cypress.Commands.add('redirectToBasket', redirectToBasket)
Cypress.Commands.add('redirectToStep2', redirectToStep2)
Cypress.Commands.add('redirectToCheckoutStep3', redirectToCheckoutStep3)
Cypress.Commands.add('validateCustomerBill', validateCustomerBill)
Cypress.Commands.add('validateEditedBillingAddress', validateEditedBillingAddress)
Cypress.Commands.add('editBillingAddress', editBillingAddress)
Cypress.Commands.add('acceptAgbAndContinue', acceptAgbAndContinue)
Cypress.Commands.add('randomCharacterGenerator', randomCharacterGenerator)
Cypress.Commands.add('loginUser', loginUser)
Cypress.Commands.add('addFirstItemInPriceRange', addFirstItemInPriceRange)
Cypress.Commands.add('registerNewCustomer', registerNewCustomer)
Cypress.Commands.add('addNonPhysicalProduct', addNonPhysicalProduct)
