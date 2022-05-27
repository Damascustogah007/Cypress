/**
 * PIC-626, PIC-634, PIC-825
 */

import { baseUrl } from 'cypress/fixtures/environment'
import Languages from 'cypress/fixtures/shared/languages'
import { routes_shop } from 'cypress/fixtures/shared/routes'
import { customer_new as customer, store } from 'cypress/fixtures/007.1-checkout.data'
import namedViewports from 'cypress/integration/_helpers/viewports'
import { getTestSpecName } from 'lib/testSpecName'
import {
  randomCharacterGenerator,
  loginUser,
  acceptAgbAndContinue,
  redirectToStep2,
  redirectToBasket,
  addFirstItemInPriceRange,
  validateCustomerBill,
  registerNewCustomer,
  addNonPhysicalProduct,
} from 'cypress/support/checkout'

const testSpecName = getTestSpecName(__filename)

const randomCharacter = randomCharacterGenerator(3)
let user = customer

const [width, height] = namedViewports.mobile
const isMobile = true

const languages = [Languages[0]] // just 'de'

languages.forEach((language) => {
  const targetUrl = `${baseUrl}/${language.code}/`
  describe(`${testSpecName} - ${language.name} - Mobile @@ Checkout Happy Flow - Bill`, function () {
    before(() => {
      cy.clearCookies()

      // always add new customer for clean checkouts...
      if (language.code === 'de') {
        registerNewCustomer(language)
      } else {
        cy.visit(targetUrl)
      }

      loginUser()
      cy.task('getLatestUser').then((latestCredentials) => {
        user = latestCredentials
      })
    })

    beforeEach(() => {
      cy.viewport(width, height)
      cy.restoreLocalStorageCache()
      cy.preserveDefaultCookies()
    })

    afterEach(() => {
      cy.saveLocalStorageCache()
    })

    it('Clear Basket', () => {
      cy.clearBasket(isMobile)
    })

    it('Search for item with price between 10 to 12 CHF and add it to basket', () => {
      addFirstItemInPriceRange(10, 12, language)
    })

    it('Redirect to basket', () => {
      redirectToBasket(language, true)
    })

    it('Should check product details in step 1', function () {
      cy.wait(1000)
      cy.dataCy('product-list-item')
        .children()
        .first()
        .children()
        .first()
        .children()
        .first()
        .children()
        .as('productListItem')

      cy.get('@productListItem')
        .first()
        .children()
        .first()
        .then(($cover) => {
          expect($cover[0].naturalWidth).to.be.greaterThan(0)
        })

      cy.get('@productListItem')
        .eq(1)
        .children()
        .as('details')
        .first()
        .then(($el) => {
          const productName = $el[0].innerText
          expect(productName.length).to.be.greaterThan(0)
        })

      cy.get('@details')
        .eq(2)
        .then(($productDetails) => {
          expect($productDetails.length).to.be.greaterThan(0)
        })

      cy.get('@details')
        .eq(1)
        .then(($el) => {
          const productAuthor = $el[0].innerText
          expect(productAuthor.length).to.be.greaterThan(0)
        })

      cy.dataCy('checkout-basket-productList-totalPrice').then(($el) => {
        const productTotalPrice = $el[0].innerText
        expect(productTotalPrice.length).to.be.greaterThan(6) // 6 stands for six digits e.g "CHF .0"
      })

      cy.get('@details')
        .eq(4)
        .children()
        .eq(1)
        .then(($el) => {
          const productAvailability = $el[0].innerText
          expect(productAvailability.length).to.be.greaterThan(0)
        })

      cy.get('[data-cy$="input-quantity"]').then(($el) => {
        const quantity = parseInt($el[0].value, 10)
        expect(quantity).to.equal(1)
      })

      cy.dataCy('product-list-item')
        .children()
        .eq(1)
        .children()
        .eq(1)
        .children()
        .eq(1)
        .invoke('text')
        .then(($productPrice) => {
          expect($productPrice.length).to.be.greaterThan(6) // 6 stands for six digits e.g "CHF .0"
        })
    })

    it('Redirect to step 2', () => {
      redirectToStep2(language, true)
    })

    it('Should have the right tracking parameter', { retries: 0, timeout: 3 }, () => {
      cy.location('search').should('contain', 'rt=b')
      cy.location('search').should('contain', 'step=2')
    })

    it('Display customer bill address information at checkout step 2 page', () => {
      validateCustomerBill(user)
    })

    it('Have radio delivery option "Einzellieferung" checked', () => {
      cy.get('[data-cy=checkoutAddressSend-shippingOption-item-0]').should(
        'have.checked',
        true,
      )
    })

    it('Have radio shipping option "Heimlieferung" checked', () => {
      cy.get('[data-cy=checkoutAddressSend-shippingType-item-0]').should(
        'have.checked',
        true,
      )
    })

    it('Redirect to checkout process step 3', () => {
      cy.intercept({
        method: 'POST',
        url: 'https://**/v1/Basket/BasketGet',
      }).as('getBasket')

      cy.get('[data-cy=checkout-addressSend-button-submit-bottom]').should('be.visible')
      cy.get('[data-cy=checkout-addressSend-button-submit-bottom]').click()

      cy.wait('@getBasket')
      cy.location().should((location) => {
        expect(location.pathname).to.eq(
          `${routes_shop['checkout_step2_payment'][language.code].split('?')[0]}`,
        )
      })
    })

    it('Try to buy by top button click but fail because of AGB', () => {
      // When
      cy.get('[data-cy=checkout-paymentMethods-5]').check()
      cy.get('[data-cy=checkout-payment-button-submit]').first().click()

      // Then
      cy.dataCy('checkout-agreements-acceptAGB_false')
        .parent()
        .children('span')
        .should('exist')
    })

    it('Buy through accepting AGB and Kleinmengenzuschlag and top button click', () => {
      acceptAgbAndContinue()
      cy.dataCy('checkout-step4-confirmation').should('exist')
    })
  })

  describe(`${testSpecName} - ${language.name} - Mobile @@ 007.1.1.1 Complete Checkout User logged in, order with Kleinmengenzuschlag and AGB validation check`, function () {
    before(() => {
      cy.clearCookies()

      cy.visit(targetUrl)

      loginUser()
      cy.task('getLatestUser').then((latestCredentials) => {
        user = latestCredentials
      })
    })

    beforeEach(() => {
      cy.viewport(width, height)

      cy.preserveDefaultCookies()
    })

    it('Clear Basket', () => {
      cy.clearBasket(isMobile)
    })

    it('Search for small price item and add it to basket', () => {
      addFirstItemInPriceRange(0, 8, language)
    })

    it('Redirect to basket', () => {
      redirectToBasket(language, true)
    })

    it('Redirect to step 2', () => {
      redirectToStep2(language)
    })

    it('Display customer bill address information at checkout step 2 page', () => {
      validateCustomerBill(user)
    })

    it('Have radio delivery option "Einzellieferung" checked', () => {
      cy.get('[data-cy=checkoutAddressSend-shippingOption-item-0]').should(
        'have.checked',
        true,
      )
    })

    it('Have radio shipping option "Heimlieferung" checked', () => {
      cy.get('[data-cy=checkoutAddressSend-shippingType-item-0]').should(
        'have.checked',
        true,
      )
    })

    it('Redirect to checkout process step 3', () => {
      cy.intercept({
        method: 'POST',
        url: 'https://**/v1/Basket/BasketGet',
      }).as('getBasket')

      cy.get('[data-cy=checkout-addressSend-button-submit-bottom]').should('be.visible')
      cy.get('[data-cy=checkout-addressSend-button-submit-bottom]').click() //Used to be {force true}. This should not be necessary at least in this case

      cy.wait('@getBasket')
      cy.location().should((location) => {
        expect(location.pathname).to.eq(
          `${routes_shop['checkout_step2_payment'][language.code].split('?')[0]}`,
        )
      })
    })

    it('Try to buy by top button click but fail because of AGB', () => {
      // When
      cy.get('[data-cy=checkout-paymentMethods-5]').check()
      cy.get('[data-cy=checkout-payment-button-submit]').first().click()

      // Then
      cy.dataCy('checkout-agreements-acceptAGB_false')
        .parent()
        .children('span')
        .should('exist')
    })

    it('Try to buy by top button click but fail because of Kleinmengenzuschlag', () => {
      acceptAgbAndContinue()
      // Test for failure
      // Then
      cy.dataCy('checkout-agreements-acceptSurchargeCheckbox_false')
        .parent()
        .children('span')
        .should('exist')
    })

    it('Buy through accepting AGB and Kleinmengenzuschlag and top button click', () => {
      cy.get('[data-cy=checkout-agreements] [type="checkbox"]').last().check({
        force: true,
      })
      cy.get('[data-cy=checkout-payment-button-submit]').first().click()
      // Test for success
      cy.dataCy('checkout-step4-confirmation').should('exist')
    })
  })

  describe(`${testSpecName} - ${language.name} - Mobile @@ 007.1.1.2 Checkout User logged in, store delivery`, function () {
    before(() => {
      cy.clearCookies()

      cy.visitWithDesktop(targetUrl)

      loginUser()
      cy.task('getLatestUser').then((latestCredentials) => {
        user = latestCredentials
      })
    })

    beforeEach(() => {
      cy.viewport(width, height)

      cy.preserveDefaultCookies()

      cy.intercept({
        method: 'POST',
        url: 'https://**/v1/Basket/BasketGet',
      }).as('getBasket')
    })

    it('Clear Basket', () => {
      cy.clearBasket(isMobile)
    })

    it('Search and add non-physical product to basket', () => {
      addNonPhysicalProduct(language)
    })

    it('Redirect to basket', () => {
      cy.scrollTo('top')
      cy.dataCy('header-mobile-basket').click()
    })

    it('Redirect to step 2', () => {
      redirectToStep2(language)
    })

    it('Store delivery should not be possible', () => {
      cy.dataCy('checkoutAddressSend-shippingType-item-1').should('be.disabled')

      const labels = {
        de: 'Keine Filialauslieferung möglich',
        fr: 'Impossible de livrer en succursale'
      }
      
      cy.dataCy('addrAndDelivery-warning').should(
        'contain',
        labels[language.code],
      )
    })

    it('Should go back to homepage', () => {
      cy.dataCy('checkout-header-exLibrisLogo').click()
    })

    it('Clear Basket', () => {
      cy.clearBasket(isMobile)
    })

    it('Search item in price range 10 to 12 CHF and add it to basket', () => {
      addFirstItemInPriceRange(10, 12, language)
    })

    it('Redirect to basket', () => {
      redirectToBasket(language, true)
    })

    it('Redirect to step 2', () => {
      redirectToStep2(language, true)
    })

    it('Display customer bill address information at checkout step 2 page', () => {
      validateCustomerBill(user)
    })

    it('Have radio delivery option "Einzellieferung" checked', () => {
      cy.get('[data-cy=checkoutAddressSend-shippingOption-item-0]').should(
        'have.checked',
        true,
      )
    })

    it('Have radio shipping option "Filialabholung" checked', () => {
      cy.dataCy('checkoutAddressSend-shippingType-item-1').check({ force: true })
      cy.dataCy('checkoutAddressSend-shippingType-item-1').should('have.checked', true)

      cy.dataCy('addrAndDelivery-storefinder').select(store.id)
      cy.wait('@getBasket')
    })

    it('check if selected store is visible', () => {
      cy.dataCy('addrAndDelivery-storefinder')
        .should('be.visible')
        .and('contain', store.location)
    })

    it('Redirect to checkout process step 3', () => {
      cy.get('[data-cy=checkout-addressSend-button-submit-bottom]').should('be.visible')
      cy.get('[data-cy=checkout-addressSend-button-submit-bottom]').click()

      cy.wait('@getBasket')
      cy.location().should((location) => {
        expect(location.pathname).to.eq(
          `${routes_shop['checkout_step2_payment'][language.code].split('?')[0]}`,
        )
      })
    })

    it('Buy through accepting AGB and top button click', () => {
      acceptAgbAndContinue()
      // Test for success
      cy.dataCy('checkout-step4-confirmation').should('exist')
    })
  })

  describe(`${testSpecName} - ${language.name} - Mobile @@ 007.1.1.3 Complete Checkout User logged in, change delivery adress - no buy`, function () {
    before(() => {
      cy.clearCookies()

      cy.visitWithDesktop(targetUrl)

      loginUser()
      cy.task('getLatestUser').then((latestCredentials) => {
        user = latestCredentials
      })
    })

    beforeEach(() => {
      cy.viewport(width, height)

      cy.preserveDefaultCookies()
    })

    it('Clear Basket', () => {
      cy.clearBasket(isMobile)
    })

    it('Search for item in price range 10-12 and add it to basket', () => {
      addFirstItemInPriceRange(10, 12, language)
    })

    it('Redirect to basket', () => {
      redirectToBasket(language, true)
    })

    it('Redirect to step 2', () => {
      redirectToStep2(language, true)
    })

    it('Display customer bill address information at checkout step 2 page', () => {
      validateCustomerBill(user)
    })

    it('Have radio delivery option "Einzellieferung" checked', () => {
      cy.get('[data-cy=checkoutAddressSend-shippingOption-item-0]').should(
        'have.checked',
        true,
      )
    })

    it('Have radio shipping option "Heimlieferung" checked', () => {
      cy.get('[data-cy=checkoutAddressSend-shippingType-item-0]').should(
        'have.checked',
        true,
      )
    })

    it('Change Delivery Address klick leads to input field', () => {
      cy.dataCy('checkout-addressSend-button-changeAddress').click()
      cy.location('pathname').should(
        'equal',
        `${
          routes_shop['checkout_step2_ChangeDeliveryAddress'][language.code].split('?')[0]
        }`,
      )
    })

    it('Save new delivery adress should lead back to Step 2', () => {
      cy.intercept({
        method: 'POST',
        url: 'https://**/LocationQuery',
      }).as('locationQuery')

      cy.wait(100)
      cy.dataCy('deliveryAddressChange-input-firstname').should('not.be.disabled')

      //cy.dataCy('deliveryAddressChange-select-salutation').select('1')
      cy.dataCy('deliveryAddressChange-input-firstname')
        .clear()
        .type(`${user.firstName} ${randomCharacter}`)
      cy.wait(100)

      cy.dataCy('deliveryAddressChange-input-lastname')
        .clear()
        .type(`Lastname ${randomCharacter}`)
      cy.wait(100)

      cy.dataCy('deliveryAddressChange-input-street')
        .clear()
        .type(`New Street ${randomCharacter} 1`)

      cy.wait(100)

      cy.dataCy('deliveryAddressChange-input-zipcode').clear().type('1234')
      cy.wait('@locationQuery')
      cy.dataCy('deliveryAddressChange-input-city').select('Vessy')

      cy.dataCy('deliveryAddressChange-button-submitbottom').should('not.be.disabled')
      cy.dataCy('deliveryAddressChange-button-submitbottom').click()

      cy.location('pathname').should(
        'equal',
        `${routes_shop['checkout_step2_logged_in'][language.code].split('?')[0]}`,
      )

      cy.dataCy('homeDeliveryAddress').should(($address) => {
        expect($address)
          .to.contain(`${user.firstName} ${randomCharacter} Lastname ${randomCharacter}`)
          .and.to.contain(`New Street ${randomCharacter} 1`)
          .and.to.contain(`1234 Vessy`)
      })
    })

    it('Change Back Delivery Adress', () => {
      cy.dataCy('checkout-addressSend-button-changeAddress').click()
      cy.location('pathname').should(
        'equal',
        `${
          routes_shop['checkout_step2_ChangeDeliveryAddress'][language.code].split('?')[0]
        }`,
      )

      cy.dataCy('checkout-formDeliveryAddressChange-form').children('button').click()

      cy.location('pathname').should(
        'equal',
        `${routes_shop['checkout_step2_logged_in'][language.code].split('?')[0]}`,
      )
      cy.dataCy('homeDeliveryAddress').should(($address) => {
        expect($address)
          .to.contain(`${user.firstName} ${user.lastName}`)
          .and.to.contain(`${user.street}`)
          .and.to.contain(`${user.zipCode} ${user.city}`)
      })
    })

    it('Redirect to checkout process step 3', () => {
      cy.intercept({
        method: 'POST',
        url: 'https://**/v1/Basket/BasketGet',
      }).as('getBasket')

      cy.get('[data-cy=checkout-addressSend-button-submit-bottom]').should('be.visible')
      cy.get('[data-cy=checkout-addressSend-button-submit-bottom]').click()

      cy.wait('@getBasket')
      cy.location().should((location) => {
        expect(location.pathname).to.eq(
          `${routes_shop['checkout_step2_payment'][language.code].split('?')[0]}`,
        )
      })
    })
  })
})
