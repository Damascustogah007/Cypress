# Cypress

https://www.cypress.io/

## Visit

Auth in Cypress
https://docs.cypress.io/api/commands/visit.html#Options

## Docs - Ressources

https://docs.cypress.io/guides/core-concepts/introduction-to-cypress.html#Cypress-Can-Be-Simple-Sometimes

## Test Events

https://docs.cypress.io/api/events/catalog-of-events.html#Cypress-Events

## Fixtures

```
cy.fixture("users.js").as("users");
```

## Selectors

Data unique id attributte

```
data-cy="login_input_email"
```

## Interaction

### Triggers

https://docs.cypress.io/api/commands/trigger.html#Options

```
.type("{enter}");
```

```
.click({force:true});
```

### JS/React click

```
.invoke('click);
```

## Reporters

https://mochajs.org/#reporters
https://docs.cypress.io/guides/tooling/reporters.html

- https://github.com/cypress-io/testing-workshop-cypress/blob/master/slides/09-reporters/PITCHME.md

```
// npx mochawesome-merge cypress/report/mochawesome-report/mochawesome*.json > cypress/report/mochawesome.json

```

### Custom Reporter

cypress-runner.js

```
  // const mergeOptions = {
  //   files: ["cypress/reports/mochawesome/*.json"]
  // };
```

### Viewports

https://docs.cypress.io/api/commands/viewport.html#Arguments
