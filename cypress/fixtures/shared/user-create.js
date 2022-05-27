export function createRegistrationData() {
  return {
    testId: new Date().getTime(),
    email: 'mario.nexumtester+' + new Date().getTime() + '@gmail.com',
    password: '123456aA_',
    passwordRepeat: '123456aA_',
    salutation: '0',
    firstName: 'Mario',
    lastName: 'Nexum Tester',
    street: 'Oberer Graben 1',
    zipCode: '9000',
    city: 'St. Gallen',
    language: 'de',
    rememberMe: false,
    cumulusNr: '',
    cumulusNeeded: false,
    newsletter: false,
    phone: '+41 44 743 72 72',
    company: 'nexum AG',
  }
}
