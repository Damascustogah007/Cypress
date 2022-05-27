export default {
  regular_user: {
    testId:'regular',
    email: 'mario.nexumtester+fingerprint.regular@gmail.com',
    password: '123456aA_',
    salutationDe: 'Her Nexum Tester',
    name: 'Mario Nexum Tester',
    guid: '170df003-9450-1a69-bd8c-0004ac1d6ddb',
    clubCookieValue: 'no',
    browserConfig: {
      userAgent:
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:89.0) Gecko/20100101 Firefox/87.0',
      language: 'fr-CH',
      platform: '3ds',
    },
  },
  club_user: {
    testId:'with club',
    //NB: Club membership expires on: 31.12.2029
    email: 'maria.nexumtester+fingerprint.club@gmail.com',
    password: '123456aA_',
    salutationDe: 'Frau TestClubMember',
    name: 'Maria TestClubMember',
    guid: '8b796003-9456-1a69-bd8c-0004ac1d6ddb',
    clubCookieValue: 'yes',
    browserConfig: {
      userAgent:
        'Mozilla/5.0 (iPhone; CPU iPhone OS 11_0 like Mac OS X) AppleWebKit/604.1.38 (KHTML, like Gecko) Version/11.0 Mobile/15A356 Safari/604.1',
      language: 'de-CH',
      platform: 'iPhone',
    },
  },
  unknown_user: {
    browserConfig: {
      userAgent:
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:89.0) Gecko/20100101 Firefox/89.0',
      language: 'de',
      platform: 'Win64',
    },
  },
}
