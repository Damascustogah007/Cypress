/**
 * PIC-834
 * PIC-835
 * PIC-836
 * PIC-837
 */

import { club_user, products } from 'cypress/fixtures/007.4-checkout-club-bons.data'
import { baseUrl } from 'cypress/fixtures/environment'
import { getTestSpecName } from 'lib/testSpecName'
import languages from 'cypress/fixtures/shared/languages'
import { redirectToStep2, redirectToBasket } from 'cypress/support/checkout'
import { defaultDevices as devices } from 'cypress/integration/_helpers/default-devices'

const testSpecName = getTestSpecName(__filename)
const redeemdedDiscountsColor = 'rgba(230, 230, 230, 0.9)'
const unredeemedDiscountColor = 'rgb(191, 13, 62)'
const targetUrl = `${baseUrl}/de`
let { email, password } = club_user

devices.forEach((device) => {
  const language = languages[0]
  const [w, h] = device.viewport

  describe(`${testSpecName} @@ Club Bons - 1 - Redeem bons overview - ${device.name}`, () => {
    before(() => {
      cy.clearCookies()
      cy.visitWithDevice(targetUrl, device)
      cy.wait(2000)
      cy.loginCustomer(email, password)
    })

    beforeEach(() => {
      cy.viewport(w, h)
      cy.preserveDefaultCookies()
    })

    it('Should redirect to Basket', () => {
      redirectToBasket(language, device.isMobile)
    })

    it('should redirect to step 2', () => {
      redirectToStep2(language, device.isMobile)
    })

    it('Redirect to checkout process step 3', () => {
      cy.dataCy('checkout-addressSend-button-submit-bottom').should('be.visible').click()
    })

    it('should open the club coupons modal Rabatt-Bons einlösen', () => {
      cy.dataCy('giftcardsAndCoupons-giftcardBon-Rabatt-Bons einlösen}').click()
    })

    it('Should validate the discount types available', () => {
      cy.get('[data-cy="clubBonsModal-clubBonsOverviewContainer"] ul > li').then(
        ($sel) => {
          const productType = $sel[0].innerText
          expect(productType.length).to.be.greaterThan(0)
        },
      )
    })
  })

  describe(`${testSpecName} @@ Club Bons - 2 - Redeem bons - ${device.name}`, () => {
    before(() => {
      cy.clearCookies()
      cy.visitWithDevice(targetUrl, device)
      cy.loginCustomer(club_user.email, club_user.password)
    })

    beforeEach(() => {
      cy.viewport(w, h)
      cy.preserveDefaultCookies()
    })

    it('Should redirect to Basket', () => {
      redirectToBasket(language, device.isMobile)
    })

    it('should redirect to step 2', () => {
      redirectToStep2(language, device.isMobile)
    })

    it('Redirect to checkout process step 3', () => {
      cy.dataCy('checkout-addressSend-button-submit-bottom').should('be.visible').click()
    })

    it('should open the club coupons modal Rabatt-Bons einlösen', () => {
      cy.dataCy('giftcardsAndCoupons-giftcardBon-Rabatt-Bons einlösen}').click()
    })

    it('Should show all products on which BUCH discount can be redeemed', () => {
      cy.dataCy('clubBonsModal-clubBonsOverviewContainer')
        .children()
        .eq(1)
        .children()
        .as('discountsItemsList')

      cy.get('@discountsItemsList').first().click()

      cy.dataCy('clubBonsModal-productItem')
        .first()
        .children()
        .eq(1)
        .children()
        .first()
        .contains(products.book_1, { matchCase: false })

      cy.dataCy('clubBonsModal-productItem')
        .eq(1)
        .children()
        .eq(1)
        .children()
        .first()
        .contains(products.book_2, { matchCase: false })
      cy.wait(1000)
      cy.dataCy('clubBonsModal-backToCouponsButton').click()
    })
    it('Should show all products on which CD discount can be redeemed', () => {
      cy.dataCy('clubBonsModal-clubBonsOverviewContainer')
        .children()
        .eq(1)
        .children()
        .as('discountsItemsList')

      cy.get('@discountsItemsList').eq(8).click()

      cy.dataCy('clubBonsModal-productItem')
        .first()
        .children()
        .eq(1)
        .children()
        .first()
        .contains(products.CD, { matchCase: false })

      cy.wait(2000)
      cy.dataCy('clubBonsModal-backToCouponsButton').click()
    })
    it('Should show all products on which DVD discount can be redeemed', () => {
      cy.dataCy('clubBonsModal-clubBonsOverviewContainer')
        .children()
        .eq(1)
        .children()
        .as('discountsItemsList')

      cy.get('@discountsItemsList').eq(7).click()

      cy.dataCy('clubBonsModal-productItem')
        .first()
        .children()
        .eq(1)
        .children()
        .first()
        .contains(products.DVD, { matchCase: false })
    })
  })

  describe(`${testSpecName} @@ Club Bons - 3 - Apply bon on product- ${device.name}`, () => {
    before(() => {
      cy.clearCookies()
      cy.visitWithDevice(targetUrl, device)
      cy.loginCustomer(email, password)
    })

    beforeEach(() => {
      cy.viewport(w, h)
      cy.preserveDefaultCookies()
    })

    it('Should redirect to Basket', () => {
      redirectToBasket(language, device.isMobile)
    })

    it('should redirect to step 2', () => {
      redirectToStep2(language, device.isMobile)
    })

    it('Redirect to checkout process step 3', () => {
      cy.dataCy('checkout-addressSend-button-submit-bottom').should('be.visible').click()
    })

    it('should open the club coupons modal Rabatt-Bons einlösen', () => {
      cy.dataCy('giftcardsAndCoupons-giftcardBon-Rabatt-Bons einlösen}').click()
    })

    it('Should apply bon and validate bon is greyed out', () => {
      cy.intercept({
        method: 'POST',
        url: 'https://**/v1/Coupon/CouponUse',
      }).as('couponUse')
      cy.dataCy('clubBonsModal-clubBonsOverviewContainer')
        .children()
        .eq(1)
        .children()
        .as('discountsItemsList')

      cy.dataCy('clubBonsModal-clubBonsOverviewContainer')
        .children()
        .eq(1)
        .children()
        .first()
        .children()
        .first()
        .as('redeemedDiscounts')

      cy.get('@discountsItemsList').first().click()

      cy.dataCy('clubBonsModal-submitBons-redeemCoupon').first().click()
      cy.wait('@couponUse').then((data) => {
        expect(data.response.statusCode, 'Response Status Code').to.equal(200)
        expect(data.response.body.ResultStatus.Error, 'Response Result Status Error').to
          .be.false
      })
      cy.get('@redeemedDiscounts')
        .should('have.css', 'background-color')
        .and('eq', redeemdedDiscountsColor)

      cy.dataCy('clubBonsModal-button-removeBons').click()
      cy.wait(2000)
      cy.get('@discountsItemsList').eq(9).click()
      cy.dataCy('clubBonsModal-submitBons-redeemCoupon').click()
      cy.wait('@couponUse').then((data) => {
        expect(data.response.statusCode, 'Response Status Code').to.equal(200)
        expect(data.response.body.ResultStatus.Error, 'Response Result Status Error').to
          .be.false
      })

      cy.get('@redeemedDiscounts')
        .should('have.css', 'background-color')
        .and('eq', redeemdedDiscountsColor)

      cy.dataCy('clubBonsModal-button-removeBons').click()
      cy.wait(2000)
      cy.get('@discountsItemsList').eq(7).click()

      cy.dataCy('clubBonsModal-submitBons-redeemCoupon').click()
      cy.wait('@couponUse').then((data) => {
        expect(data.response.statusCode, 'Response Status Code').to.equal(200)
        expect(data.response.body.ResultStatus.Error, 'Response Result Status Error').to
          .be.false
      })
      cy.get('@redeemedDiscounts')
        .should('have.css', 'background-color')
        .and('eq', redeemdedDiscountsColor)

      cy.dataCy('clubBonsModal-button-removeBons').click()
      cy.wait(3000)
    })
  })

  describe(`${testSpecName} @@ Club Bons - 4 - Undock bon from product- ${device.name}`, () => {
    before(() => {
      cy.clearCookies()
      cy.visitWithDevice(targetUrl, device)
      cy.loginCustomer(email, password)
    })

    beforeEach(() => {
      cy.viewport(w, h)
      cy.preserveDefaultCookies()
    })

    it('Should redirect to Basket', () => {
      redirectToBasket(language, device.isMobile)
    })

    it('should redirect to step 2', () => {
      redirectToStep2(language, device.isMobile)
    })

    it('Redirect to checkout process step 3', () => {
      cy.dataCy('checkout-addressSend-button-submit-bottom').should('be.visible').click()
    })

    it('should open the club coupons modal Rabatt-Bons einlösen', () => {
      cy.dataCy('giftcardsAndCoupons-giftcardBon-Rabatt-Bons einlösen}').click()
    })

    it('Should apply bons on products', () => {
      cy.intercept({
        method: 'POST',
        url: 'https://**/v1/Coupon/CouponUse',
      }).as('couponUse')
      cy.dataCy('clubBonsModal-clubBonsOverviewContainer')
        .children()
        .eq(1)
        .children()
        .as('discount')

      cy.get('@discount').first().click()
      cy.dataCy('clubBonsModal-submitBons-redeemCoupon').first().click()
      cy.wait('@couponUse').then((data) => {
        expect(data.response.statusCode, 'Response Status Code').to.equal(200)
        expect(data.response.body.ResultStatus.Error, 'Response Result Status Error').to
          .be.false
      })

      cy.get('@discount').eq(9).click()
      cy.dataCy('clubBonsModal-submitBons-redeemCoupon').click()
      cy.wait('@couponUse').then((data) => {
        expect(data.response.statusCode, 'Response Status Code').to.equal(200)
        expect(data.response.body.ResultStatus.Error, 'Response Result Status Error').to
          .be.false
      })
    })

    it('Should undock all bon from products', () => {
      cy.intercept({
        method: 'POST',
        url: 'https://**/v1/Basket/BasketRemoveAllProductCoupons',
      }).as('RemoveAllProductCoupons')
      cy.wait(2000)
      cy.dataCy('clubBonsModal-optionsButton-removeAll').click()

      cy.wait('@RemoveAllProductCoupons').then((data) => {
        expect(data.response.statusCode, 'Response Status Code').to.equal(200)
        expect(data.response.body.ResultStatus.Error, 'Response Result Status Error').to
          .be.false
      })
    })

    it('Should validate that the bons are red again', () => {
      cy.dataCy('clubBonsModal-clubBonsOverviewContainer')
        .children()
        .eq(1)
        .children()
        .as('discount')

      cy.get('@discount')
        .first()
        .should('have.css', 'background-color')
        .and('eq', unredeemedDiscountColor)

      cy.get('@discount')
        .eq(7)
        .should('have.css', 'background-color')
        .and('eq', unredeemedDiscountColor)

      cy.get('@discount')
        .eq(4)
        .should('have.css', 'background-color')
        .and('eq', unredeemedDiscountColor)
    })
  })
})
