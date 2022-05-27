/*
 * ADVICE:
 * Don´t use underscore in url, throw a security alert in cypress on visit
 * */

const aspectraT = 'https://t-new.exlibris.ch'

const acceptanceWWWUrl = 'https://a-www.exlibris.ch'

//Environmentvariable imported from system-environment through CYPRESS_CUSTOM_BASE_URL
let baseUrl = aspectraT
if (Cypress.env('CUSTOM_BASE_URL')) {
  baseUrl = Cypress.env('CUSTOM_BASE_URL')
}

let executeCaptures = true
console.log('------- EXECUTE_CAPTURES: ' + executeCaptures)
if (Cypress.env('EXECUTE_CAPTURES')) {
  executeCaptures = Cypress.env('EXECUTE_CAPTURES')
  console.log('------- EXECUTE_CAPTURES: ' + executeCaptures)
}

export default {
  baseUrl,
  acceptanceWWWUrl,
  executeCaptures,
}
