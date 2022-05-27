module.exports = function generateComponent(plop) {
  plop.setGenerator('Spec', {
    description: 'Creates a spec file and fixture',
    prompts: [
      {
        message: 'EPIC, example:  PIC-123  or  PIC-123, PIC-124 >> ',
        name: 'epic',
        type: 'input',
        validate(value) {
          if (/.+/.test(value)) {
            return true
          }
          return 'No EPIC? No spec! EPIC is Required'
        },
      },
      {
        message: 'name the directory, example:  006-basket >> ',
        name: 'folder',
        type: 'input',
        validate(value) {
          if (/.+/.test(value)) {
            return true
          }
          return 'No Name? No spec! Name is Required'
        },
      },
      {
        message: 'number of the file, examples: 006.1 or 006.2.3 >> ',
        name: 'number',
        type: 'input',
        validate(value) {
          if (/.+/.test(value)) {
            return true
          }
          return 'No number? No spec! number is Required'
        },
      },
      {
        message: 'name of the file, example: add-products >> ',
        name: 'name',
        type: 'input',
        validate(value) {
          if (/.+/.test(value)) {
            return true
          }
          return 'No Name? No spec! Name is Required'
        },
      },
    ],
    actions: [
      {
        path: 'cypress/integration/tests/{{kebabCase folder}}/{{dotCase number}}-{{kebabCase name}}.spec.js',
        skipIfExists: true,
        templateFile: 'plop-templates/spec/spec.plop',
        type: 'add',
      },
      {
        path: 'cypress/fixtures/{{kebabCase folder}}/{{dotCase number}}-{{kebabCase name}}.data.js',
        skipIfExists: true,
        templateFile: 'plop-templates/spec/data.plop',
        type: 'add',
      },
    ],
  })


}
