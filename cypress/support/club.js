import { routes_shop } from 'cypress/fixtures/shared/routes'
import { baseUrl } from 'cypress/fixtures/environment'

export function registerCustomer(language, registrationData, isMobile) {
  const routePage = `${routes_shop['register'][language.code]}`
  if (isMobile) {
    cy.registerCustomer(baseUrl, routePage, registrationData, language.code, 'iphone5')
  } else {
    cy.registerCustomer(baseUrl, routePage, registrationData, language.code)
  }
  return registrationData
}

export function clubRegistration(clubRegistrationData) {
  cy.intercept('https://**/Customer/CustomerSave').as('clubRegistration')
  const {
    salutation,
    firstName,
    lastName,
    street,
    zipCode,
    city,
    phone,
    dateOfBirth,
  } = clubRegistrationData

  cy.dataCy('clubregister-checkbox-confirm_false').check({ force: true })
  cy.dataCy('clubregister-select-salutation').select(salutation)
  cy.dataCy('clubregister-input-firstname').clear().type(firstName)
  cy.dataCy('clubregister-input-lastname').clear().type(lastName)
  cy.dataCy('clubregister-input-street').clear().type(street)
  cy.dataCy('deliveryAddressChange-input-zipcode').clear().type(zipCode)
  cy.dataCy('clubregister-input-city').select(city)
  cy.dataCy('clubregister-input-birthDate').type(dateOfBirth)
  cy.dataCy('clubregister-input-phonenumber').clear().type(phone)
  cy.dataCy('clubregister-radio-newslettersubscription__0').check()
  cy.dataCy('clubregister-button-submit').click()

  cy.wait('@clubRegistration').then((success) => {
    expect(success.response.statusCode, 'Response Status Code').to.equal(200)
  })
}

