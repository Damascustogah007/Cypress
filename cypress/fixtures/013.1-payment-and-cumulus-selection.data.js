export default {
  createCumulusUser: () => ({
    testId: new Date().getTime(),
    email: 'mario.nexumtester+withCumulusNr' + new Date().getTime() + '@gmail.com',
    password: '123456aA_',
    passwordRepeat: '123456aA_',
    salutation: 'Herr',
    firstName: 'Mario',
    lastName: 'Nexum Tester',
    street: 'Oberer Graben 1',
    zipCode: '9000',
    city: 'St. Gallen',
    language: 'de',
    rememberMe: false,
    cumulusNr: '2099999999998',
    anotherCumulusNr: '2099343679873',
    newsletter: false,
    phone: '+41 44 743 72 72',
    company: 'nexum AG',
  }),

  createNonCumulusUser: () => ({
    testId: new Date().getTime(),
    email: 'mario.nexumtester+withoutCumulusNr' + new Date().getTime() + '@gmail.com',
    password: '123456aA_',
    passwordRepeat: '123456aA_',
    salutation: 'Herr',
    firstName: 'Mario',
    lastName: 'Nexum Tester',
    street: 'Oberer Graben 1',
    zipCode: '9000',
    city: 'St. Gallen',
    language: 'de',
    rememberMe: false,
    newsletter: false,
    phone: '+41 44 743 72 72',
    company: 'nexum AG',
  }),
}
