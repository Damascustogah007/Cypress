/*
 * NO-PIC
 * Description:
 * Test the Fingerprint process
 * */
import { getTestSpecName } from 'lib/testSpecName'
import devices, { defaultDesktop } from '../../_helpers/devices'
import { baseUrl } from '../../../fixtures/environment'
import userFixtures from '../../../fixtures/101-fingerprint.data'

const testSpecName = getTestSpecName(__filename)

const [w, h] = defaultDesktop.viewport
const targetUrl = `${baseUrl}/de/`

function getVisitConfig(user) {
  return {
    headers: { 'user-agent': user.browserConfig.userAgent },
    onBeforeLoad(win) {
      Object.defineProperty(win.navigator, 'language', {
        value: user.browserConfig.language,
      })
      Object.defineProperty(win.navigator, 'platform', {
        value: user.browserConfig.platform,
      })
    },
  }
}

function getDateWithTZ() {
  const offset = 0
  return new Date(new Date().getTime() + offset * 3600 * 1000)
}

function interceptFp() {
  cy.intercept({
    method: 'POST',
    url: 'https://**/v1/Customer/CustomerIdentifiedByFingerprint',
  }).as('fingerprintCall')
}

const itConfig = {
  retries: {
    runMode: 1,
    openMode: 1,
  },
}

const users = [userFixtures.regular_user, userFixtures.club_user]

users.map((user) => {
  describe(`${testSpecName} @@ user ${user.testId}, recognition on visit the page`, () => {
    before(() => {
      cy.clearCookies()
    })

    beforeEach(() => {
      cy.viewport(w, h)
      cy.restoreLocalStorageCache()
      cy.preserveDefaultCookies(['SPRING_SECURITY_REMEMBER_ME_COOKIE'])
    })

    afterEach(() => {
      cy.saveLocalStorageCache()
    })

    it('prepare, visit the page without user data', itConfig, () => {
      interceptFp()
      cy.visit(targetUrl, getVisitConfig(user))
      cy.wait('@fingerprintCall').then((data) => {
        //data.request.body: Fingerprint
        //data.response.body CustomerGlobalId, IsClubMember, CustomerFound
      })
    })

    it('prepare, login to assign fingerprint to user', itConfig, () => {
      const { email, password } = user
      cy.loginCustomer(email, password)
      cy.wait(2000)
      cy.clearCookies()
    })

    it(
      'recognize the user on visit, exlibris cookies contains the user guid and club-status',
      itConfig,
      () => {
        interceptFp()
        cy.visit(targetUrl, getVisitConfig(user))
        cy.wait('@fingerprintCall').then((data) => {
          //data.request.body: Fingerprint
          //data.response.body CustomerGlobalId, IsClubMember, CustomerFound
        })
        cy.wait(1000)
        cy.getCookie('exliPUC').should('have.property', 'value', `I-${user.guid}`)
        cy.getCookie('exliPCC').should('have.property', 'value', user.clubCookieValue)
      },
    )
  })

  describe(`${testSpecName} @@ user ${user.testId}, fingerprint when no exlibris cookies, old stored flag`, () => {
    before(() => {
      cy.clearCookies()
    })

    beforeEach(() => {
      cy.viewport(w, h)
      cy.restoreLocalStorageCache()
      cy.preserveDefaultCookies(['SPRING_SECURITY_REMEMBER_ME_COOKIE'])
    })

    afterEach(() => {
      cy.saveLocalStorageCache()
    })

    it('first visit and overwrite flag to past', itConfig, () => {
      var past = getDateWithTZ()

      past.setHours(past.getHours() - 25)

      interceptFp()

      cy.visit(targetUrl, getVisitConfig(user))
      cy.wait('@fingerprintCall').then((data) => {
        cy.wait(3000)
        localStorage.setItem('pucRefreshedAt', past.getTime())
      })
    })

    it(
      'should call fingerprint Endpoint, refresh cookies and update the stored flag',
      itConfig,
      () => {
        const now = new Date().getTime()

        interceptFp()

        cy.clearCookie('exliPUC')
        cy.clearCookie('exliPCC')

        cy.visit(targetUrl, getVisitConfig(user))

        cy.wait('@fingerprintCall').should(({ request, response }) => {
          expect(request && request.body).to.have.property('Fingerprint')
          cy.wait(3000)
          const updatedStoredFlag = localStorage.getItem('pucRefreshedAt')
          expect(parseInt(updatedStoredFlag, 10)).greaterThan(now)
        })
      },
    )

    it('epoq should contains the user guid', itConfig, () => {
      cy.window().then((win) => {
        expect(win.EpoqSearch.exlibrisCid).to.eq(user.guid)
      })
    })
  })
})

describe(`${testSpecName} @@ user unknow on visit the page`, () => {
  let randomGuidFromResponse = ''

  before(() => {
    cy.clearCookies()
  })

  beforeEach(() => {
    cy.viewport(w, h)
    cy.restoreLocalStorageCache()
    cy.preserveDefaultCookies(['SPRING_SECURITY_REMEMBER_ME_COOKIE'])
  })

  afterEach(() => {
    cy.saveLocalStorageCache()
  })

  it('visit the page without user data', itConfig, () => {
    interceptFp()
    const userUnknow = userFixtures.unknown_user
    cy.visit(targetUrl, getVisitConfig(userUnknow))
    cy.wait('@fingerprintCall').then((data) => {
      // data.request.body: Fingerprint
      //data.response.body: CustomerGlobalId, IsClubMember, CustomerFound
      randomGuidFromResponse = data.response.body.CustomerGlobalId
    })
  })

  it('exlibris cookies contains the user guid and club-status', itConfig, () => {
    cy.wait(1000)
    cy.getCookie('exliPUC').should(
      'have.property',
      'value',
      `N-${randomGuidFromResponse}`,
    )
    cy.getCookie('exliPCC').should('have.property', 'value', 'no')
  })

  it('epoq should no contains the random guid', itConfig, () => {
    cy.log(`[FP CY] ------ step 3`)
    cy.window().then((win) => {
      expect(win.EpoqSearch.exlibrisCid).to.eq('')
    })
  })
})
