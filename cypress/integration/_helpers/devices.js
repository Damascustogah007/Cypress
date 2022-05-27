import {
  iphone5 as iphone5UserAgent,
  iosHybridApp,
  androidHybridApp,
  ipad as ipadUserAgent,
  chromeWindows,
  chromeAndroid,
  firefoxWindows,
  safariIOs,
  safariMacOs,
} from 'cypress/integration/_helpers/user-agents'
import namedViewports from 'cypress/integration/_helpers/viewports'

export const deviceTypes = {
  DESKTOP: 'DESKTOP',
  MOBILE: 'MOBILE',
  MOBILE_TABLET: 'MOBILE_TABLET',
}

export const checkIsDesktop = (device) => device.type === deviceTypes.DESKTOP
export const checkIsMobile = (device) => device.type === deviceTypes.MOBILE
export const checkIsTablet = (device) => device.type === deviceTypes.MOBILE_TABLET
export const checkIsMobileOrTablet = (device) => device.type.includes(deviceTypes.MOBILE)

export const allDevices = {
  headlessModeDesktopDevice: {
    name: 'Headless Desktop Device Without User Agent',
    viewport: namedViewports.headlessMode,
    headers: null,
    type: deviceTypes.DESKTOP,
  },
  iphone5: {
    name: 'iPhone 5',
    viewport: namedViewports.iphone5,
    headers: { 'user-agent': iphone5UserAgent },
    type: deviceTypes.MOBILE,
  },
  iphone5HybridApp: {
    name: 'iPhone 5 with HybridApp',
    viewport: namedViewports.iphone5,
    headers: { 'user-agent': iosHybridApp },
    type: deviceTypes.MOBILE,
  },
  iphoneX: {
    name: 'iPhone X',
    viewport: namedViewports.iphoneX,
    headers: { 'user-agent': safariIOs },
    type: deviceTypes.MOBILE,
  },
  ipad2: {
    name: 'ipad 2',
    viewport: namedViewports.ipad2,
    headers: { 'user-agent': ipadUserAgent },
    type: deviceTypes.MOBILE_TABLET,
  },
  samsungGalaxyS8: {
    name: 'Samsung Galaxy S8',
    viewport: namedViewports.samsungGalaxyS8,
    headers: { 'user-agent': chromeAndroid },
    type: deviceTypes.MOBILE,
  },
  samsungGalaxyS8HybridApp: {
    name: 'Samsung Galaxy S8 with HybridApp',
    viewport: namedViewports.samsungGalaxyS8,
    headers: { 'user-agent': androidHybridApp },
    type: deviceTypes.MOBILE,
  },
  macBookPro2018Inch13: {
    name: 'Mac Book Pro 2018 13"',
    viewport: namedViewports.macBookPro2018Inch13,
    headers: { 'user-agent': safariMacOs },
    type: deviceTypes.DESKTOP,
  },
  macBookPro2018Inch15: {
    name: 'Mac Book Pro 2018 15"',
    viewport: namedViewports.macBookPro2018Inch15,
    headers: { 'user-agent': safariMacOs },
    type: deviceTypes.DESKTOP,
  },
  windowsLaptopChrome: {
    name: 'Windows Laptop with Chrome',
    viewport: namedViewports.laptopMedium,
    headers: { 'user-agent': chromeWindows },
    type: deviceTypes.DESKTOP,
  },
  windowsPcChrome: {
    name: 'Windows PC with Chrome',
    viewport: namedViewports.desktopSmall,
    headers: { 'user-agent': chromeWindows },
    type: deviceTypes.DESKTOP,
  },
  windowsPcFirefox: {
    name: 'Windows PC with Firefox',
    viewport: namedViewports.desktopFullHd,
    headers: { 'user-agent': firefoxWindows },
    type: deviceTypes.DESKTOP,
  },
}

const {
  iphone5,
  ipad2,
  windowsLaptopChrome,
  iphone5HybridApp,
  samsungGalaxyS8HybridApp,
} = allDevices

export const defaultDesktop = windowsLaptopChrome

export const defaultMobile = iphone5

export const defaultHybridApp = iphone5HybridApp

export const desktopDevices = [defaultDesktop]

export const mobileDevices = [defaultMobile, ipad2]

export const hybridAppDevices = [defaultHybridApp, samsungGalaxyS8HybridApp]

export const captureDevices = [defaultDesktop, defaultMobile]

export default [defaultMobile, ipad2, defaultDesktop]
