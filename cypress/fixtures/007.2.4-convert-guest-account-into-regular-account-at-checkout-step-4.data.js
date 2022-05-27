export const createGuestRegistrationData = () => ({
  email: `mario.nexumtester+${new Date().getTime()}@gmail.com`,
  salutation: '0',
  firstName: 'Mario',
  lastName: 'Nexum Tester',
  street: 'Oberer Graben 1',
  zipCode: '9000',
  city: 'St. Gallen',
  language: 'de',
  newsletter: false,
  phone: '+41 44 743 72 72',
})

export const passwordData = {
  password: '123456aA_',
  passwordRepeat: '123456aA_',
}
