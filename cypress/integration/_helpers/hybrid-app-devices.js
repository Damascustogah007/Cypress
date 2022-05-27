export const ios = {
  name: 'iOS App',
  viewport: [320, 568],
  headers: {
    'user-agent':
      'Mozilla/5.0 (iPhone; CPU iPhone OS 9_2 like Mac OS X) AppleWebKit/601.1 (KHTML, like Gecko) CriOS/47.0.2526.70 Mobile/13C71 Safari/601.1.46 content-only:true client:ios',
  },
  isMobile: true
}

export const android = {
  name: 'Android App',
  viewport: [360, 740],
  headers: {
    'user-agent':
      'Mozilla/5.0 (Linux; Android 4.0.4; Galaxy Nexus Build/IMM76B) AppleWebKit/601.1 (KHTML, like Gecko) CriOS/47.0.2526.70 Mobile/13C71 Safari/601.1.46 content-only:true',
  },
  isMobile: true
}

export const hybridAppDevices = [ios, android]