# Screenshot

https://docs.cypress.io/guides/guides/screenshots-and-videos.html#Screenshots

## Cypress

## Run mode

In headless mode Cypress set XVFB to render at 1280x720.

### Directory

`\cypress\screenshots`

Cypress creates automatically 2 directories if you run single test or all the test

- All Specs
- tests

## Directory Structure and File Name Convention

### Directory Structure

Cypress creates automatically the nested structure defined in the path string

- Test-file name
- Date (2020-Jan-01)

### File Name

Separated by double underscore.
Blocks are optional, just think in better and fast readability

- Prefix (test-target) describe keyword
- Special case identifier (wrong-password)
- Viewport (1024x768)
- language (de,fr)

### Example

```
{test-file}/{date}/{describe-unique}/{prefix__case__viewport__lang}.png
```

`registration.spec.js/2020-Jan-30/password_1024x768_de.png`

## Issues

- https://github.com/cypress-io/cypress/issues/2102
- https://github.com/cypress-io/cypress/issues/6210
