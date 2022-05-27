/**
 * PIC-602,
 *  PIC-603
 */

import { baseUrl } from 'cypress/fixtures/environment'
import { getTestSpecName } from 'lib/testSpecName'
import languages from 'cypress/fixtures/shared/languages'
import {
  createCumulusUser,
  createNonCumulusUser,
} from 'cypress/fixtures/013.1-payment-and-cumulus-selection.data'
import {
  successMessage,
  redirectToMeinExlibris,
  clickOnPayAndCumulus,
  loopPaymentOptions,
  saveAndCheckSuccessMessage,
  checkNoPaymentMethodIsSelected,
} from './013.1-helpers'
import { routes_shop } from 'cypress/fixtures/shared/routes'
import { defaultDevices } from 'cypress/integration/_helpers/default-devices'

const testSpecName = getTestSpecName(__filename)

const language = languages[0]
const routePage = `${routes_shop['register'][language.code]}`

defaultDevices.forEach((device) => {
  const [w, h] = device.viewport
  describe(`${testSpecName} @@ Payment & Cumulus - Non-Cumulus User - ${device.name}`, () => {
    before(() => {
      cy.clearCookies()
      cy.registerCustomer(
        baseUrl,
        routePage,
        createNonCumulusUser(),
        language.code,
        device,
      )
      cy.wait(1000)
    })

    beforeEach(() => {
      cy.viewport(w, h)
      cy.preserveDefaultCookies()
    })

    it('should redirect to "Mein Exlibris" page', () => {
      redirectToMeinExlibris(device)
    })

    it("should click on 'Pay and Cumulus'", () => {
      clickOnPayAndCumulus()
    })

    it('should check whether no payment method is preselected', () => {
      checkNoPaymentMethodIsSelected()
    })

    it('should check whether the radio buttons are clickable', () => {
      loopPaymentOptions()
    })

    it('should check culumus number input field is empty', () => {
      cy.dataCy('paymentAndCumulus-input-cumulusnr').should('contain', '')
    })

    it('should save and check for success message', () => {
      saveAndCheckSuccessMessage()
    })
  })

  describe(`${testSpecName} - @@ Payment & Cumulus - Cumulus User - ${device.name}`, () => {
    before(() => {
      cy.clearCookies()
      cy.registerCustomer(baseUrl, routePage, createCumulusUser(), language.code, device)
      cy.wait(1000)
    })
    beforeEach(() => {
      cy.viewport(w, h)
      cy.preserveDefaultCookies()
    })

    it('should redirect to "Mein Exlibris" page', () => {
      redirectToMeinExlibris(device)
    })

    it("should click on 'Pay and Cumulus'", () => {
      clickOnPayAndCumulus()
    })

    it('should check whether no payment method is preselected', () => {
      checkNoPaymentMethodIsSelected()
    })

    it('should check whether the radio buttons are clickable', () => {
      loopPaymentOptions()
    })

    it('should check equality of the culumus number input field', () => {
      cy.dataCy('paymentAndCumulus-input-cumulusnr').then(($el) => {
        const inputValue = $el[0].value
        expect(inputValue).to.be.equal(createCumulusUser()['cumulusNr'])
      })
    })

    it('should save and check for success message', () => {
      saveAndCheckSuccessMessage()
    })

    it('should change payment method and click on save', () => {
      cy.dataCy('credit-card-0').next().children().eq(0).click()
      cy.dataCy('paymentAndCumulus-save-button').click()
      cy.get('[type="SUCCESS"]').should('be.visible')
    })

    it('should replace cumulus number and click on submit button', () => {
      cy.dataCy('paymentAndCumulus-input-cumulusnr')
        .clear()
        .type(createCumulusUser()['anotherCumulusNr'])
      cy.dataCy('paymentAndCumulus-save-button').click()
    })

    it('should check success message, reload and check input field', () => {
      cy.get('[type="SUCCESS"]').should('contain', successMessage)
      cy.reload()
      cy.dataCy('paymentAndCumulus-input-cumulusnr').then(($el) => {
        const inputValue = $el[0].value
        expect(inputValue).to.be.equal(createCumulusUser()['anotherCumulusNr'])
      })
    })

    it('should input wrong cumulus number and click submit button', () => {
      cy.dataCy('paymentAndCumulus-input-cumulusnr').then(($inputValue) => {
        const inputValue = $inputValue[0].value
        const valueWithoutLastNumber = inputValue.substring(0, inputValue.length - 1)
        cy.dataCy('paymentAndCumulus-input-cumulusnr')
          .clear()
          .type(valueWithoutLastNumber)
      })
      cy.dataCy('paymentAndCumulus-save-button').click()
      cy.dataCy('paymentAndCumulus-input-cumulusnr')
        .next()
        .its('length')
        .should('be.gt', 0)
      cy.get('[type="SUCCESS"]').should('not.exist')
    })
  })
})
