export const categories = {
  BOOKS: 'BOOKS',
  CLASSIC_GAMES: 'CLASSIC_GAMES',
  VIDEO_GAMES: 'VIDEO_GAMES',
  MUSIC: 'MUSIC',
  FILMS: 'FILMS',
}

export const productInfoKey = {
  TITLE: 'Titel',
  AUTHOR: 'Autor',
  EAN: 'EAN',
  FORMAT: 'Format',
}

const products = [
  {
    ean: '9783442479719',
    category: categories.BOOKS,
    availableProductInfoKeys: [
      productInfoKey.TITLE,
      productInfoKey.AUTHOR,
      productInfoKey.EAN,
      productInfoKey.FORMAT,
    ],
  },
  {
    ean: '0190758149226',
    category: categories.MUSIC,
    availableProductInfoKeys: [
      productInfoKey.TITLE,
      productInfoKey.EAN,
      productInfoKey.FORMAT,
    ],
  },
  {
    ean: '0711719985198',
    category: categories.VIDEO_GAMES,
    availableProductInfoKeys: [
      productInfoKey.TITLE,
      productInfoKey.EAN,
      productInfoKey.FORMAT,
    ],
  },
  {
    ean: '5050582753226',
    category: categories.FILMS,
    availableProductInfoKeys: [
      productInfoKey.TITLE,
      productInfoKey.EAN,
      productInfoKey.FORMAT,
    ],
  },
  {
    ean: '4035576044062',
    category: categories.CLASSIC_GAMES,
    availableProductInfoKeys: [
      productInfoKey.TITLE,
      productInfoKey.EAN,
    ],
  },
]
export default products
