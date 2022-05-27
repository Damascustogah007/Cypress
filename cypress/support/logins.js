import { desktop } from 'cypress/integration/_helpers/default-devices'
import { checkIsMobile, checkIsTablet } from 'cypress/integration/_helpers/devices'

function logoutCustomer(isMobile = false) {
  cy.intercept({
    method: 'POST',
    url: 'https://**/v1/Customer/Logout',
  }).as('customerLogout')
  if (isMobile) {
    cy.dataCy('header-mobile-myAccount').click({
      force: true,
    })
    cy.dataCy('myAccount-logoutButton').click()
  } else {
    cy.dataCy('welcome-nav-logoutButton').click({ force: true })
  }
  cy.wait('@customerLogout')
}

function logoutWithDevice(device) {
  cy.intercept({
    method: 'POST',
    url: 'https://**/v1/Customer/Logout',
  }).as('customerLogout')
  if (checkIsMobile(device) || checkIsTablet(device)) {
    cy.dataCy('header-mobile-myAccount').click({
      force: true,
    })
    cy.dataCy('myAccount-logoutButton').click()
  } else {
    cy.dataCy('welcome-nav-logoutButton').click({ force: true })
  }
  cy.wait('@customerLogout')
}

function loginCustomer(email, password, rememberme = false) {
  cy.intercept({
    method: 'POST',
    url: 'https://**/v1/Customer/Login',
  }).as('Login')

  cy.get('[data-cy$=login-toogle]').click()
  cy.get('[data-cy=modal-drop] [data-cy=login-input-email]').type(email, {force:true})
  cy.get('[data-cy=modal-drop] [data-cy=login-input-password]').type(password, {force:true})
  if (rememberme) {
    cy.get('[data-cy=modal-drop] [data-cy=login-keepAlive_false]').next().click()
  }
  cy.get('[data-cy=modal-drop] [data-cy=login-submit]').click({ force: true })
  cy.wait('@Login')
  cy.wait(1000)
}

function registerNewCustomer(
  baseUrl,
  routePage,
  registrationDataContainer,
  languageUrl = 'de',
  device = desktop,
) {
  cy.intercept({
    method: 'POST',
    url: 'https://**/Customer/CustomerSave',
  }).as('registration')
  const {
    email,
    password,
    passwordRepeat,
    salutation,
    firstName,
    lastName,
    street,
    zipCode,
    city,
    language,
    rememberMe,
    newsletter,
    phone,
    company,
    cumulusNr,
  } = registrationDataContainer

  cy.visitWithDevice(baseUrl + '/' + languageUrl + routePage, device)

  cy.dataCy('registration-input-emailaddress').type(email, {
    force: true,
  })
  cy.dataCy('passwordfield-input').type(password)
  cy.dataCy('registration-input-confirmpassword').type(passwordRepeat)
  cy.scrollTo(0, -100)
  cy.dataCy('registration-radio-language__' + language + '').click({
    force: true,
  })
  if (rememberMe === true) {
    cy.dataCy('registration-checkbox-rememberme_false').check({
      force: true,
    })
  }
  cy.dataCy('registration-select-salutation').select(salutation)
  cy.dataCy('registration-input-firstname').type(firstName)
  cy.dataCy('registration-input-lastname').type(lastName)
  cy.dataCy('registration-input-street').type(street)
  cy.dataCy('registration-input-zipcode').type(zipCode)
  cy.dataCy('registration-input-city').select(city)
  cy.dataCy('registration-input-phonenumber').type(phone)
  cy.dataCy('registration-input-company').type(company)

  if (cumulusNr) {
    cy.dataCy('registration-checkbox-nocumulusneeded_true').click({ force: true })
    cy.dataCy('registration-input-cumulusnr').type(cumulusNr)
  }

  const intNewsletter = newsletter === true ? '1' : '0'
  cy.get(
    '[data-cy=registration-radio-newslettersubscription__' + intNewsletter + ']',
  ).click({ force: true })
  cy.dataCy('registration-button-submittop').last().click()
  cy.wait('@registration').then((data) => {
    expect(data.response.statusCode, 'Response Status Code').to.equal(200)
    expect(data.response.body.ResultStatus.Error, 'Response Result Status Error').to.be
      .false
    expect(
      data.response.body.Account.AccountAddress.LastName,
      'Response Last Name',
    ).to.be.equal(lastName)
  })
}

function loginAWWW(email, password) {
  cy.visit('https://a-www.exlibris.ch/de')
  cy.get('[id*=Service-Navi_Login]').click()
  cy.get('#username').type(email)
  cy.get('#password').type(password)
  cy.get('#loginSubmitButton').click()

  cy.get("[id*='Service-Navi MeinAccount']").should(
    'contain.any',
    'Mon Ex Libris',
    'Mein Exlibris',
  )
}

function registerGuestFillOutFormOnly(registrationDataContainer, languageCode = 'de') {
  cy.intercept('https://**/Customer/CustomerSave').as('registration')
  const {
    email,
    password,
    passwordRepeat,
    salutation,
    firstName,
    lastName,
    street,
    zipCode,
    city,
    language,
    newsletter,
    phone,
    company,
  } = registrationDataContainer

  cy.dataCy('registration-input-emailaddress').clear().type(email)
  if (password) {
    cy.dataCy('registration-checkbox-open-account_false').check({ force: true })
    cy.dataCy('passwordfield-input').clear().type(password)
  }
  if (passwordRepeat) {
    cy.dataCy('registration-input-confirmpassword').clear().type(passwordRepeat)
  }
  cy.dataCy('registration-radio-language__' + languageCode)
    .next()
    .click({
      force: true,
    })
  cy.dataCy('registration-select-salutation').select(salutation)
  cy.dataCy('registration-input-firstname').clear().type(firstName)
  cy.dataCy('registration-input-lastname').clear().type(lastName)
  cy.dataCy('registration-input-street').clear().type(street)
  cy.dataCy('registration-input-zipcode').clear().type(zipCode)
  cy.dataCy('registration-input-city').type(city)

  if (phone) {
    cy.dataCy('registration-input-phonenumber').clear().type(phone)
  }
  if (company) {
    cy.dataCy('registration-input-company').clear().type(company)
  }

  const intNewsletter = newsletter === true ? '1' : '0'
  cy.dataCy('registration-radio-newslettersubscription__' + intNewsletter).click({
    force: true,
  })
}

Cypress.Commands.add('loginCustomer', loginCustomer)

Cypress.Commands.add('logoutWithDevice', logoutWithDevice)

Cypress.Commands.add('logoutCustomer', logoutCustomer)

Cypress.Commands.add('registerCustomer', registerNewCustomer)

Cypress.Commands.add('registerGuestFillOutFormOnly', registerGuestFillOutFormOnly)

Cypress.Commands.add('loginAWWW', loginAWWW)
