/*
 * PIC-567
 * */
import { baseUrl } from 'cypress/fixtures/environment'

import { createRegistrationData } from 'cypress/fixtures/shared/user-create'
import { getTestSpecName } from 'lib/testSpecName'

const testSpecName = getTestSpecName(__filename)

describe(`${testSpecName} @@ Registration happy case`, () => {
  const user = createRegistrationData()
  before(() => {
    cy.clearCookies()
  })

  beforeEach(() => {
    cy.preserveDefaultCookies()
  })

  it('visit the home page', () => {
    cy.visitWithViewport(baseUrl + '/de/')
  })

  it('click in login-modal to register', () => {
    cy.dataCy('loginmodal-desktoplogin-toogle').click()
    cy.dataCy('login-registerLink').click()
  })
  it('full form fields and submit', () => {
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
    } = user

    cy.dataCy('registration-input-emailaddress').type(email)
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
    cy.dataCy('registration-input-city').type(city)
    cy.dataCy('registration-input-phonenumber').type(phone)
    cy.dataCy('registration-input-company').type(company)
    // todo
    // cy.get("[data-cy=registration-input-cumulusnr]").type(cumulusNr);
    // cy.get("[data-cy=registration-checkbox-nocumulusneeded]").type(
    //   cumulusNeeded
    // );
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
    cy.url().should('contain', '/de/')
  })

  it('should have name in welcome-salutation', () => {
    cy.get('[data-cy=welcome-salutation]').should('contain', `${user.lastName}`)
  })

  it('account-modal should have the nav item for new user club', () => {
    cy.dataCy('modal-account-button').trigger('mouseover')
    cy.dataCy('modal-account-content').contains('Club-Kartennummer hinterlegen')
    cy.go('back')
    cy.get('[data-cy=welcome-salutation]').should('contain', `${user.lastName}`)
  })

  it('should reload the page', () => {
    cy.reload(true)
  })

  it('should have the user cookies', () => {
    cy.getCookies({ timeout: 3000 }).then((cookies) => {
      const userCookie = cookies.filter((cookieItem) => {
        return cookieItem.name === 'User' || cookieItem.name === 'SessionCookie'
      })

      expect(userCookie).to.have.lengthOf(2)
    })
  })

  it('should have name in welcome-salutation', () => {
    cy.get('[data-cy=welcome-salutation]').should('contain', `${user.lastName}`)
  })
})
