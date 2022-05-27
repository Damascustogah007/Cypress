import { baseUrl } from 'cypress/fixtures/environment'
import {
  registration_guest_no_password,
  registration_guest_password,
  registration_guest_password_mail_exists,
} from 'cypress/fixtures/007.2.3-checkout-complete-orders.data'
import namedViewports from 'cypress/integration/_helpers/viewports'
import { getTestSpecName } from 'lib/testSpecName'
import {
  addFirstItemInPriceRange,
  registerNewCustomer,
} from 'cypress/support/checkout'

const testSpecName = getTestSpecName(__filename)
const [width, height] = namedViewports.mobile

describe(`${testSpecName} - Mobile (${namedViewports.mobile.join(
  'x',
)}) @@ 007.2.3.1 - Checkout - guest order - happy flow (with browser back test and account transformation)`, function () {
  before(() => {
    cy.viewport(width, height)
    cy.clearCookies()
    cy.clearCookies()
    cy.visit(baseUrl)
  })

  beforeEach(() => {
    cy.restoreLocalStorageCache()
    cy.viewport(width, height)
    cy.preserveDefaultCookies()
  })

  afterEach(() => {
    cy.saveLocalStorageCache()
  })

  it('should add one item to basket and show one item in basket page', () => {
    cy.visit(baseUrl)
    addFirstItemInPriceRange(10, 12, { code: 'de' })
    cy.clickBasketIcon(true)

    cy.location('pathname').should('equal', '/de/bestellung/warenkorb/') //     // /fr/ordre/panier/
    cy.dataCy('product-list-item').should('have.length', 1)
  })

  it('Can go to checkout page 2', () => {
    cy.dataCy('basket-button-step2').first().click()

    cy.location('pathname').should('equal', '/de/bestellung/login/') // TODO: FR
    cy.dataCy('als-Gast-bestellen-module').should('exist')
  })

  it('Can go back to basket page with browser back', () => {
    cy.go('back')

    cy.location('pathname').should('equal', '/de/bestellung/warenkorb/') //     // /fr/ordre/panier/
    cy.dataCy('product-list-item').should('have.length', 1)

    cy.go('forward')

    cy.location('pathname').should('equal', '/de/bestellung/login/') // TODO: FR
    cy.dataCy('als-Gast-bestellen-module').should('exist')
  })

  it('Can go to guest register page', () => {
    cy.dataCy('als-Gast-bestellen-module').find('button').click()

    cy.location().should((loc) => {
      expect(loc.pathname).to.be.equal('/de/bestellung/adresse/ohne-registrierung/')
      expect(loc.search).to.contain('step=1')
      expect(loc.search).to.contain('rt=g')
    }) // TODO: FR
  })

  it('Can register as guest', () => {
    cy.intercept({
      method: 'POST',
      url: 'https://**/Customer/CustomerSave',
    }).as('customerSaveGuest')
    cy.registerGuestFillOutFormOnly(registration_guest_no_password)
    cy.dataCy('registration-button-submittop').last().click()

    cy.wait('@customerSaveGuest').then((data) => {
      expect(data.response.statusCode, 'Response Status Code').to.equal(200)
      expect(data.response.body.ResultStatus.Error, 'Response Result Status').to.be.false
      expect(
        data.response.body.Account.AccountAddress.LastName,
        'Response Last Name',
      ).to.be.equal(registration_guest_no_password.lastName)
    })

    cy.location().should((loc) => {
      expect(loc.pathname).to.be.equal('/de/bestellung/adresse/')
      expect(loc.search).to.contain('step=2')
      expect(loc.search).to.contain('rt=g')
    }) // TODO: FR
    cy.dataCy('checkout-addressCopy-customerName')
      .should('contain', registration_guest_no_password.lastName)
      .and('contain', registration_guest_no_password.firstName)
    cy.dataCy('checkout-addressCopy-customerStreet').should(
      'contain',
      registration_guest_no_password.street,
    )
  })

  it('replaces the exlibris cookies for guest case', () => {
    cy.wait(1000)
    cy.getCookie('exliPUC').should('have.property', 'value', 'guest')
    cy.getCookie('exliPCC').should('have.property', 'value', 'no')
  })

  it('Can go back to homepage and is not logged in', () => {
    cy.get('[data-cy="checkout-header-exLibrisLogo"]').click()

    cy.location('pathname').should('equal', '/de/')
    cy.dataCy('loginmodal-mobilelogin-toogle').should('exist')
  })

  it('Can go back to checkout page 2', () => {
    cy.go('back')

    cy.location().should((loc) => {
      expect(loc.pathname).to.be.equal('/de/bestellung/adresse/')
      expect(loc.search).to.contain('step=2')
      expect(loc.search).to.contain('rt=g')
    }) // TODO: FR

    cy.dataCy('checkout-addressCopy-customerName')
      .should('contain', registration_guest_no_password.lastName)
      .and('contain', registration_guest_no_password.firstName)

    cy.dataCy('checkout-addressCopy-customerStreet').should(
      'contain',
      registration_guest_no_password.street,
    )
  })
  it('Can go to checkout page 3', () => {
    cy.dataCy('checkout-addressSend-button-submit-bottom').first().click()

    cy.location().should((loc) => {
      expect(loc.pathname).to.be.equal('/de/bestellung/zahlung/')
      expect(loc.search).to.contain('step=3')
    }) // TODO: FR
    cy.dataCy('product-list-item').should('have.length', 1)
  })

  it('Can go to order confirmation', () => {
    cy.get('[data-cy=checkout-agreements] [type="checkbox"]').check({
      force: true,
    })
    cy.dataCy('checkout-payment-button-submit').first().click()

    cy.get('[data-cy="checkout-confirmation-address"]')
      .should('exist')
      .and('contain', registration_guest_no_password.lastName)
      .and('contain', registration_guest_no_password.firstName)
  })

  it('Can transform guest account in regular account', () => {
    cy.dataCy('passwordfield-input')
      .should('not.be', 'disabled')
      .clear()
      .type(registration_guest_password.password)
    //cy.dataCy('passwordfield-input').clear().type(registration_guest_password.password)
    cy.dataCy('guest-registration-input-confirmpassword')
      .should('not.be', 'disabled')
      .clear()
      .type(registration_guest_password.password)
      .parents('form')
      .submit()

    cy.get('[data-cy="checkout-confirmation-successMessage"]').should('exist')
  })

  it('Is redirected to main page after click on browser back', { retries: 0 }, () => {
    cy.get('[data-cy="checkout-confirmation-continueShoppingButton"]').click()
    cy.location().should((location) => {
      expect(location.pathname).to.eq('/de/')
    })

    cy.dataCy('header-mobile-myAccount').should('exist')

    cy.go('back')
    cy.location('pathname').should('equal', '/de/')
  })
})

describe(`${testSpecName} - Mobile (${namedViewports.mobile.join(
  'x',
)}) @@ 007.2.3.2 - Checkout - guest order - create account in step 2`, function () {
  before(() => {
    cy.clearCookies()
    cy.visit(`${baseUrl}/de/`)
  })

  beforeEach(() => {
    cy.restoreLocalStorageCache()
    cy.viewport(width, height)
    cy.preserveDefaultCookies()
  })

  afterEach(() => {
    cy.saveLocalStorageCache()
  })

  it('should add one item to basket and show one item in basket page', () => {
    cy.addFirstProductOnCurrentPageToBasket()
    cy.clickBasketIcon(true)

    cy.location('pathname').should('equal', '/de/bestellung/warenkorb/') //     // /fr/ordre/panier/
    cy.dataCy('product-list-item').should('have.length', 1)
  })

  it('Can go to checkout page 2', () => {
    cy.dataCy('basket-button-step2').first().click()

    cy.location('pathname').should('equal', '/de/bestellung/login/') // TODO: FR
    cy.dataCy('als-Gast-bestellen-module').should('exist')
  })

  it('Can go to guest register page', () => {
    cy.dataCy('als-Gast-bestellen-module').find('button').click()

    cy.location().should((loc) => {
      expect(loc.pathname).to.be.equal('/de/bestellung/adresse/ohne-registrierung/')
      expect(loc.search).to.contain('step=1')
      expect(loc.search).to.contain('rt=g')
    }) // TODO: FR
  })

  it('Cannot register with new existing mail', () => {
    cy.intercept({
      method: 'POST',
      url: 'https://**/Customer/CustomerSave',
    }).as('customerSaveGuest')
    cy.registerGuestFillOutFormOnly(registration_guest_password_mail_exists)
    cy.dataCy('registration-button-submittop').last().click()

    cy.wait('@customerSaveGuest').then((data) => {
      expect(data.response.statusCode, 'Response Status Code').to.equal(200)
      expect(data.response.body.ResultStatus.Error, 'Response Result Status').to.be.true
    })

    // TODO: Look for error message
  })

  it('Can register as guest with registration', () => {
    cy.intercept({
      method: 'POST',
      url: 'https://**/Customer/CustomerSave',
    }).as('customerSaveGuest')
    cy.dataCy('registration-input-emailaddress')
      .clear()
      .type(registration_guest_password.email)
    cy.dataCy('registration-button-submittop').last().click()

    cy.wait('@customerSaveGuest').then((data) => {
      expect(data.response.statusCode, 'Response Status Code').to.equal(200)
      expect(data.response.body.ResultStatus.Error, 'Response Result Status').to.be.false
      expect(
        data.response.body.Account.AccountAddress.LastName,
        'Response Last Name',
      ).to.be.equal(registration_guest_no_password.lastName)
    })

    cy.location().should((loc) => {
      expect(loc.pathname).to.be.equal('/de/bestellung/adresse/')
      expect(loc.search).to.contain('step=2')
      expect(loc.search).to.contain('rt=n')
    }) // TODO: FR
    cy.dataCy('checkout-addressCopy-customerName')
      .should('contain', registration_guest_no_password.lastName)
      .and('contain', registration_guest_no_password.firstName)
    cy.dataCy('checkout-addressCopy-customerStreet').should(
      'contain',
      registration_guest_no_password.street,
    )
  })

  it('Can go to checkout page 3', () => {
    cy.dataCy('checkout-addressSend-button-submit-bottom').first().click()

    cy.location().should((loc) => {
      expect(loc.pathname).to.be.equal('/de/bestellung/zahlung/')
      expect(loc.search).to.contain('step=3')
    }) // TODO: FR
    cy.dataCy('product-list-item').should('have.length', 1)
  })
  it('Can go to order confirmation', () => {
    cy.get('[data-cy=checkout-agreements] [type="checkbox"]').check({
      force: true,
    })
    cy.dataCy('checkout-payment-button-submit').first().click()

    cy.get('[data-cy="checkout-confirmation-address"]')
      .should('exist')
      .and('contain', registration_guest_no_password.lastName)
      .and('contain', registration_guest_no_password.firstName)
  })

  it('Is redirected to main page after click on browser back and logged in', () => {
    cy.get('[data-cy="checkout-confirmation-continueShoppingButton"]').click()

    cy.location('pathname').should('equal', '/de/')
    cy.get('svg[name=mein-konto]').should('exist')

    cy.go('back')
    cy.wait(200) // TODO: Exchange against interceptor

    cy.location('pathname').should('equal', '/de/')
  })
})

describe(`${testSpecName} - Mobile (${namedViewports.mobile.join(
  'x',
)}) @@ 007.2.3.3 - Checkout - guest order - existing mail - no register`, function () {
  let newCustomer = null
  const language = { code: 'de', name: 'German' }

  before(() => {
    cy.clearCookies()
    cy.clearCookies()
    if (language.code === 'de') {
      newCustomer = registerNewCustomer(language)
    } else {
      cy.visit(baseUrl + '/fr')
    }
  })

  beforeEach(() => {
    cy.restoreLocalStorageCache()
    cy.viewport(width, height)
    cy.preserveDefaultCookies()
  })

  afterEach(() => {
    cy.saveLocalStorageCache()
  })

  it('should add one item to basket and show one item in basket page', () => {
    addFirstItemInPriceRange(10, 12, language)
    cy.clickBasketIcon(true)

    cy.location('pathname').should('equal', '/de/bestellung/warenkorb/') //     // /fr/ordre/panier/
    cy.dataCy('product-list-item').should('have.length', 1)
  })

  it('Can go to checkout page 2', () => {
    cy.dataCy('basket-button-step2').first().click()

    cy.location('pathname').should('equal', '/de/bestellung/login/') // TODO: FR
    cy.dataCy('als-Gast-bestellen-module').should('exist')
  })

  it('Can go to guest register page', () => {
    cy.dataCy('als-Gast-bestellen-module').find('button').click()

    cy.location().should((loc) => {
      expect(loc.pathname).to.be.equal('/de/bestellung/adresse/ohne-registrierung/')
      expect(loc.search).to.contain('step=1')
      expect(loc.search).to.contain('rt=g')
    }) // TODO: FR
  })

  it('Can register as guest', () => {
    cy.intercept({
      method: 'POST',
      url: 'https://**/Customer/CustomerSave',
    }).as('customerSaveGuest')
    newCustomer.password = undefined
    newCustomer.passwordRepeat = undefined
    cy.registerGuestFillOutFormOnly(newCustomer)

    cy.dataCy('registration-button-submittop').last().click()

    cy.wait('@customerSaveGuest').then((data) => {
      expect(data.response.statusCode, 'Response Status Code').to.equal(200)
      expect(data.response.body.ResultStatus.Error, 'Response Result Status').to.be.false
      expect(
        data.response.body.Account.AccountAddress.LastName,
        'Response Last Name',
      ).to.be.equal(newCustomer.lastName)
    })

    cy.location().should((loc) => {
      expect(loc.pathname).to.be.equal('/de/bestellung/adresse/')
      expect(loc.search).to.contain('step=2')
      expect(loc.search).to.contain('rt=g')
    }) // TODO: FR
    cy.dataCy('checkout-addressCopy-customerName')
      .should('contain', newCustomer.lastName)
      .and('contain', newCustomer.firstName)
    cy.dataCy('checkout-addressCopy-customerStreet').should('contain', newCustomer.street)
  })

  it('Can go back to homepage and is not logged in', () => {
    cy.get('[data-cy="checkout-header-exLibrisLogo"]').click()

    cy.location('pathname').should('equal', '/de/')
    cy.dataCy('loginmodal-mobilelogin-toogle').should('exist')
  })
  it('Can go back to checkout page 2', () => {
    cy.go('back')

    cy.location().should((loc) => {
      expect(loc.pathname).to.be.equal('/de/bestellung/adresse/')
      expect(loc.search).to.contain('step=2')
      expect(loc.search).to.contain('rt=g')
    }) // TODO: FR

    cy.dataCy('checkout-addressCopy-customerName')
      .should('contain', newCustomer.lastName)
      .and('contain', newCustomer.firstName)

    cy.dataCy('checkout-addressCopy-customerStreet').should('contain', newCustomer.street)
  })
  it('Can go to checkout page 3', () => {
    cy.dataCy('checkout-addressSend-button-submit-bottom').first().click()

    cy.location().should((loc) => {
      expect(loc.pathname).to.be.equal('/de/bestellung/zahlung/')
      expect(loc.search).to.contain('step=3')
    }) // TODO: FR
    cy.dataCy('product-list-item').should('have.length', 1)
  })

  it('Can go to order confirmation', () => {
    cy.get('[data-cy=checkout-agreements] [type="checkbox"]').check({
      force: true,
    })
    cy.dataCy('checkout-payment-button-submit').first().click()

    cy.get('[data-cy="checkout-confirmation-address"]')
      .should('exist')
      .and('contain', newCustomer.lastName)
      .and('contain', newCustomer.firstName)
  })

  it('Is redirected to main page after click on browser back', () => {
    cy.get('[data-cy="checkout-confirmation-continueShoppingButton"]').click()
    cy.location('pathname').should('equal', '/de/')
    cy.go('back')

    cy.location('pathname').should('equal', '/de/')
  })
})
