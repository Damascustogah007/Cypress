/**
 * PIC-937
 *
 * User types: 'CLUB_ACCOUNT', 'GUEST', 'REGULAR'
 * User type will be defined in run command (see package.json and ci)
 */
import { baseUrl } from 'cypress/fixtures/environment'
import { getTestSpecName } from 'lib/testSpecName'
import { onBasket } from 'cypress/support/page-objects/basket.page-object'
import users from 'cypress/fixtures/shared/users'
import products, {
  categories,
  productInfoKey,
} from 'cypress/fixtures/005.1-pdp-add-item-to-basket.data'

const testSpecName = getTestSpecName(__filename)
const targetUrl = `${baseUrl}/de/`

const checkDiscountAvailability = ($el) => {
  const discount = $el[0].innerText
  expect(discount).to.match(/%/)
}

const checkStringLength = ($el) => {
  const stringContent = $el[0].innerText
  expect(stringContent.length).to.be.greaterThan(0)
}

const userType = Cypress.env('TEST_USER_TYPE')

describe(`${testSpecName} @@ Add item to basket (exept ebook, VOD) - ${userType}`, () => {
  before(() => {
    cy.clearCookies({ domain: null })
    cy.restoreLocalStorageCache()
    cy.visit(targetUrl)
  })

  beforeEach(() => {
    cy.preserveDefaultCookies()
  })

  it('Should login based on user type', () => {
    if (userType != 'GUEST') {
      let user = users.regularCustomer
      if (userType === 'CLUB_ACCOUNT') {
        user = users.clubCustomer
      }
      cy.loginCustomer(user.email, user.password)
    }
  })

  products.forEach((product) => {
    describe(` @@ Product Ean - ${product.ean}`, () => {
      it('should clear basket', () => {
        cy.clearBasket()
      })

      it('should search for a product and should redirect to the product details page', () => {
        cy.headerSearch(product.ean)
        cy.dataCy('tileEngine-link-pdp').should('be.visible').click()
      })

      it('should add item to cart, show number of items in the cart icon and show cart modal content', () => {
        cy.dataCy('pdp-button-cart').should('be.visible').click()
        cy.dataCy('tooltip-basket-content', { timeout: 10000 }).should('be.visible')
        cy.get('[data-cy*="button-close"][type="button"]').should('exist')
        onBasket.assertNumberOfItemsInBasketToEqual(1)
        cy.dataCy('tooltip-basket-content').should('not.be.visible')
      })

      it('should verify whether the Image cover of the product is visible', () => {
        cy.dataCy('pdp-image-cover')
          .should('be.visible')
          .and(($el) => {
            const cover = $el[0]
            expect(cover.naturalWidth).to.be.greaterThan(0)
          })
      })

      it('should show the name of the products author', () => {
        if (
          product.category != categories.VIDEO_GAMES &&
          product.category != categories.CLASSIC_GAMES
        ) {
          cy.dataCy('pd-header')
            .children()
            .eq(1)
            .children()
            .eq(1)
            .children()
            .first()
            .then(($author) => checkStringLength($author))
        }
      })

      it('Should check for advertised club discount ', () => {
        if (product.category === categories.BOOKS) {
          if (userType === 'GUEST' || userType === 'REGULAR') {
            cy.dataCy('pd-header-clubDiscountIcon').should(($el) => {
              checkDiscountAvailability($el)
            })
            cy.dataCy('pd-header-clubDiscountIcon').should(
              'have.css',
              'background-color',
              'rgb(191, 13, 62)',
            )
          }
        }
      })

      it('should check the title of the product', () => {
        cy.dataCy('pd-header')
          .children()
          .eq(1)
          .children()
          .first()
          .then(($productTitle) => checkStringLength($productTitle))
      })

      it('should check product additional information', () => {
        if (product.category != categories.CLASSIC_GAMES) {
          cy.dataCy('pd-header')
            .children()
            .eq(1)
            .children()
            .last()
            .prev()
            .then(($additionalInformation) => checkStringLength($additionalInformation))
        }
      })

      it('should check whether the short description of a product exist', () => {
        cy.dataCy('pd-header').children().eq(1).children().last().should('exist')
      })

      it('should check product discount', () => {
        if (product.category === categories.BOOKS) {
          if (userType === 'GUEST' || userType === 'REGULAR') {
            cy.dataCy('pd-header-discountIcon')
              .should('have.css', 'background-color', 'rgb(152, 219, 206)')
              .children()
              .eq(0)
              .should(($el) => checkDiscountAvailability($el))
          } else {
            cy.dataCy('pd-header-clubDiscountIcon')
              .children()
              .eq(0)
              .children()
              .eq(0)
              .should(($el) => {
                checkDiscountAvailability($el)
              })
            cy.dataCy('pd-header-clubDiscountIcon').should(
              'have.css',
              'background-color',
              'rgb(191, 13, 62)',
            )
          }
        }
      })

      it('should show the price of the product', () => {
        cy.dataCy('pdp-item-prices')
          .last()
          .children()
          .then(($price) => {
            expect($price).to.exist
          })
      })

      it('should check product availability', () => {
        cy.dataCy('pdp-item-availability')
          .should('be.visible')
          .its('length')
          .should('be.gt', 0)
      })

      it("should check the product's format", () => {
        if (product.category != categories.CLASSIC_GAMES) {
          cy.dataCy('pd-format-select')
            .should('be.visible')
            .its('length')
            .should('be.gt', 0)
        }
      })

      it('should check whether product description exists', () => {
        cy.dataCy('pd-body-contentColumn').first().should('exist')
        if (
          product.category === categories.BOOKS ||
          product.category === categories.VIDEO_GAMES
        ) {
          cy.dataCy('pd-body-markdown')
            .children()
            .eq(1)
            .then(($productDescription) => {
              checkStringLength($productDescription)
            })
        }
      })

      it('should check whether product information exists', () => {
        cy.dataCy('pd-body-contentColumn')
          .last()
          .should('be.visible')
          .and('contain', 'Produktinformationen')

        cy.dataCy('pd-body-contentColumn')
          .last()
          .children()
          .eq(1)
          .children()
          .then(($infoTableRows) => {
            let arrayOfProductInfoKeys = []
            for (let infoTableRow of $infoTableRows) {
              let infoKey = infoTableRow.firstChild.innerText.slice(0, -1)
              arrayOfProductInfoKeys.push(infoKey)
            }
            if (product.category === categories.BOOKS) {
              expect(arrayOfProductInfoKeys).to.contain(productInfoKey.AUTHOR)
            }
            expect(arrayOfProductInfoKeys).to.contain(productInfoKey.TITLE)
            expect(arrayOfProductInfoKeys).to.contain(productInfoKey.EAN)
            if (product.category != categories.CLASSIC_GAMES) {
              expect(arrayOfProductInfoKeys).to.contain(productInfoKey.FORMAT)
            }
          })
      })

      it("should show author's text", () => {
        if (
          product.category === categories.BOOKS ||
          product.category === categories.VIDEO_GAMES
        ) {
          cy.dataCy('pd-body-markdown')
            .children()
            .eq(2)
            .then(($authorText) => {
              checkStringLength($authorText)
            })
        }
      })

      it('should show additional text', () => {
        if (
          product.category === categories.BOOKS ||
          product.category === categories.VIDEO_GAMES
        ) {
          cy.dataCy('pd-body-markdown')
            .children()
            .eq(3)
            .invoke('text')
            .then(($additionalText) => {
              expect($additionalText.length).to.be.greaterThan(0)
            })
        }
      })

      it('should check product remarks', () => {
        if (product.category != categories.MUSIC) {
          cy.dataCy('pdp-list-remarks')
            .children()
            .first()
            .children()
            .should('be.visible')
            .its('length')
            .should('be.gt', 0)
        }
      })
    })
  })
})
