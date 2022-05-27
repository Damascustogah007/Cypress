export function createScreenShots(screenshotName, viewPort, options = {}) {
  console.log({ viewPort })

  let onBeforeScreenshot = null

  if (viewPort < 1023) {
    console.log('mobile')
    onBeforeScreenshot = ($el) => {
      const $header = $el.find('[data-cy=header-mobile]')
      console.log({ $header })
      if ($header) {
        $header.css('position', 'relative')
      }
    }
  }
  if (viewPort > 1023) {
    console.log('desktop')
    onBeforeScreenshot = ($el) => {
      const $header = $el.find('[data-cy=header-desktop-sticky]')
      console.log({ $header })
      if ($header) {
        $header.hide()
        $header.css('position', 'relative')
        $header.css('opacity', '0')
      }
    }
    // cy.get('[data-cy=header-desktop-sticky]').invoke('css', 'opacity', '0')
    // cy.get('[data-cy=header-desktop-sticky]').invoke('css', 'position', 'relative')
    // cy.get('[data-cy=labelkey-toggle]').invoke('css', 'position', 'absolute')
  }

  options = {
    onBeforeScreenshot,
  }

  cy.screenshot(screenshotName, options)
}
