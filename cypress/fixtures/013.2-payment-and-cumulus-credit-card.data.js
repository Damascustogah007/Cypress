export const cardType = {
  VISA: 'VISA',
  MASTER_CARD: 'MASTER_CARD',
  AMERICAN_EXPRESS: 'AMERICAN_EXPRESS',
}

export const customer = {
  email: 'mario.nexumtester+cumulusAndPayment@gmail.com',
  password: '123456',
}

export default [
  {
    card: '5200000000000007',
    valid_cvv: '123',
    valid_expiration_date: '06/25',
    type: cardType.VISA,
    invalid_cvv: '111',
    invalid_expiration_date: '07/25',
  },
  {
    card: '4000001000000042',
    valid_cvv: '123',
    valid_expiration_date: '06/25',
    type: cardType.MASTER_CARD,
    invalid_cvv: '111',
    invalid_expiration_date: '07/25',
  },
  {
    card: '5100000000000016',
    valid_cvv: '123',
    valid_expiration_date: '06/25',
    type: cardType.AMERICAN_EXPRESS,
    invalid_cvv: '111',
    invalid_expiration_date: '07/25',
  },
]
