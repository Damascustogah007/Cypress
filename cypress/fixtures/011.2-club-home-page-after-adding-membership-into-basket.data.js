export const club_membership_partner = {
  cardNumber: 2098353865641,
  wrongCardNumber: 2098353865600,
  salutation: 1,
  dateOfBirth: '30.06.1900',
  firstName: 'mVorXnameCC',
  lastName: 'mNachXnameCC',
}

export const createRegistrationData = () => ({
  email: `mario.nexumtester+club-${new Date().getTime()}@gmail.com`,
  password: '123456aA_',
  passwordRepeat: '123456aA_',
  salutation: '0',
  firstName: 'Mario',
  lastName: 'Nexum Tester',
  street: 'Oberer Graben 1',
  zipCode: '9000',
  city: 'St. Gallen',
  language: 'de',
  newsletter: false,
  newsletterClub: false,
  phone: '+41 44 743 72 72',
})
