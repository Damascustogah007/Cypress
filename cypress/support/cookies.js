const preserveDefaultCookies = (additionalCookies = []) => {
    Cypress.Cookies.preserveOnce(
        'exliPUC',
        'exliPCC',
        'User',
        'SessionCookie',
        'SessionCookieExpire',
        'basket',
        ...additionalCookies,
      )
}

Cypress.Commands.add('preserveDefaultCookies', preserveDefaultCookies)