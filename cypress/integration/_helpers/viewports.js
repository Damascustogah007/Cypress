const viewports = {
  headlessMode: [1280, 720],
  desktopSmall: [1024, 768],
  desktopFullHd: [1920, 1080],
  laptopMedium: [1366, 768],
  ipad2: [768, 1024],
  iphone5: [320, 568],
  iphoneX: [375, 812],
  samsungGalaxyS8: [360, 740],
  macBookPro2018Inch13: [1280, 800],
  macBookPro2018Inch15: [1440, 900],
}

viewports.mobile = viewports.iphone5
viewports.desktop = viewports.laptopMedium

export default viewports
