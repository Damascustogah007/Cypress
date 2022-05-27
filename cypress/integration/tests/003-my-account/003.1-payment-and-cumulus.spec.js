/**
 * PIC-601
 */
import { baseUrl } from 'cypress/fixtures/environment'
import { regular_user } from 'cypress/fixtures/003.1-payment-and-cumulus.data.js'
import { getTestSpecName } from 'lib/testSpecName'
import devices, {
  checkIsMobileOrTablet,
  checkIsDesktop,
} from 'cypress/integration/_helpers/devices'

const testSpecName = getTestSpecName(__filename)
devices.map((device) => {
  const targetUrl = `${baseUrl}/de/`

  describe(`${testSpecName} @@ Payment & Cumulus - ${device.name} (${device.viewport.join(
    ' x ',
  )})`, () => {
    const [w, h] = device.viewport

    before(() => {
      cy.viewport(w, h)
      cy.clearCookies()

      cy.visit(targetUrl)
      let { email, password } = regular_user
      cy.loginCustomer(email, password)
      cy.wait(1000)
    })

    beforeEach(() => {
      cy.viewport(w, h)
      cy.preserveDefaultCookies()
    })

    after(() => {
      cy.clearCookies()
    })

    it('should visit "PAY & CUMULUS" page', () => {
      cy.wait(1000)
      if (checkIsMobileOrTablet(device)) {
        cy.dataCy('header-mobile-myAccount').click()
      } else {
        cy.dataCy('modal-account-button').click()
      }
      cy.dataCy('myAccount-navigationItem').eq(2).children().eq(2).click()
    })

    it('should check if cumulus settings is available', () => {
      cy.dataCy('paymentAndCumulus-checkbox-nocumulusneeded_true').should('exist')
    })

    it('should check if cumulus field is disabled when checkbox is selected', () => {
      cy.dataCy('paymentAndCumulus-checkbox-nocumulusneeded_true')
        .as('checkbox')
        .invoke('is', ':checked')
        .then((initial) => {
          if (initial) {
            cy.dataCy('paymentAndCumulus-input-cumulusnr').should('be.disabled')
          }
        })
    })

    it('should check if cumulus field is not disabled when checkbox is not selected', () => {
      cy.dataCy('paymentAndCumulus-checkbox-nocumulusneeded_true').click({ force: true })
      cy.dataCy('paymentAndCumulus-input-cumulusnr').should('not.be.disabled')
    })

    if (checkIsDesktop(device)) {
      it('should check if overview of default Payment methods is available', () => {
        cy.dataCy('collapsible-paymentInfos').should('exist')
      })
    }

    it('should check if MasterCard payment method is available', () => {
      cy.dataCy('paymentMethodsRadioItem')
        .first()
        .should('contain', 'MasterCard')
        .and('be.visible')
    })

    it('should check if Visa payment method is available', () => {
      cy.dataCy('paymentMethodsRadioItem')
        .eq(1)
        .should('contain', 'Visa')
        .and('be.visible')
    })

    it('should check if American Express payment method is available', () => {
      cy.dataCy('paymentMethodsRadioItem')
        .eq(2)
        .should('contain', 'American Express')
        .and('be.visible')
    })

    it('should check if PostFinance Card payment method is available', () => {
      cy.dataCy('paymentMethodsRadioItem')
        .eq(3)
        .should('contain', 'PostFinance Card')
        .and('be.visible')
    })

    it('should check if Invoice payment method is available', () => {
      cy.dataCy('paymentMethodsRadioItem')
        .eq(4)
        .should('contain', 'Rechnung')
        .and('be.visible')
    })

    it('should check if Paypal payment method is available', () => {
      cy.dataCy('paymentMethodsRadioItem')
        .eq(5)
        .should('contain', 'PayPal')
        .and('be.visible')
    })

    it('should check if Twint payment method is available', () => {
      cy.dataCy('paymentMethodsRadioItem')
        .eq(6)
        .should('contain', 'Twint')
        .and('be.visible')
    })
  })
})
