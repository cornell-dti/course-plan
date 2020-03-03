// Retrieve file
const { Validator } = require('jsonschema');
const json = require('./reqs.json');
// Import validate jsonschema

// Requirements Schema referenced by all attributes
const requirementSchema = {
  id: '/RequirementSchema',
  type: 'object',
  properties: {
    name: { type: 'string' },
    description: { type: 'string' },
    source: { type: 'string' },
    search: { type: 'array', items: { type: 'string' } },
    includes: { type: 'array', items: { type: 'array', items: { type: 'string' } } },
    excludes: { type: 'array', items: { type: 'array', items: { type: 'string' } } },
    fulfilledBy: { type: 'string', enum: ['courses', 'credits', 'self-check'] },
    minCount: { type: 'integer' },
    applies: { type: 'string' },
    progressBar: { type: 'boolean' }
  },
  required: ['name', 'description', 'source', 'fulfilledBy']
};

/**
 * @param {string} schemaName
 * @param {{name: string, error: string}[]} errors
 */
const checkValidation = (schemaName, errors) => {
  if (errors.length === 0) {
    // eslint-disable-next-line no-console
    console.log(`Passed ${schemaName} schema validator!`);
  } else {
    // eslint-disable-next-line no-console
    console.log(`Error with ${schemaName} schema`);
    // eslint-disable-next-line no-console
    console.log({
      name: `Schema error with ${schemaName}`,
      error: errors
    });
    // eslint-disable-next-line no-console
    console.log('Please run node src/requirements/validate.js before push.');
    process.exit(1);
  }
};

// Validate University from JSON

// Check with json schema if university attribute exist
if (json.university) {
  const universitySchema = {
    title: 'University Schema',
    id: '/UniversitySchema',
    type: 'object',
    properties: {
      value: {
        type: 'string'
      },
      name: {
        type: 'string'
      },
      requirements: {
        type: 'array',
        items: {
          $ref: '/RequirementSchema'
        }
      }
    },
    required: ['value', 'name']
  };

  const universityValidator = new Validator();
  universityValidator.addSchema(requirementSchema, '/RequirementSchema');
  const { university } = json;
  const universityResult = universityValidator.validate(university, universitySchema);

  checkValidation('university', universityResult.errors);
}

// Validate Colleges from JSON

// Check with json schema if college attribute exist
if (json.college) {
  const collegeSchema = {
    title: 'College Schema',
    id: '/CollegeSchema',
    type: 'object',
    properties: {
      name: {
        type: 'string'
      },
      requirements: {
        type: 'array',
        items: {
          $ref: '/RequirementSchema'
        }
      }
    },
    required: ['name', 'requirements']
  };

  const collegeErrors = [];

  for (const collegeVal of Object.keys(json.college)) {
    const college = json.college[collegeVal];

    const collegeValidator = new Validator();
    collegeValidator.addSchema(requirementSchema, '/RequirementSchema');
    const collegeResult = collegeValidator.validate(college, collegeSchema);

    if (collegeResult.errors.length > 0) {
      collegeErrors.push({
        name: `Schema error with ${collegeVal} college`,
        error: collegeResult.errors[0]
      });
    }
  }

  checkValidation('college', collegeErrors);
}

// Validate Majors from JSON

// Check with json schema if major attribute exist
if (json.major) {
  const majorSchema = {
    title: 'Major Schema',
    id: '/MajorSchema',
    type: 'object',
    properties: {
      name: {
        type: 'string'
      },
      schools: {
        type: 'array',
        items: {
          type: 'string'
        }
      },
      requirements: {
        type: 'array',
        items: {
          $ref: '/RequirementSchema'
        }
      }
    },
    required: ['name', 'schools', 'requirements']
  };

  const majorErrors = [];

  for (const majorVal of Object.keys(json.major)) {
    const major = json.major[majorVal];

    const majorValidator = new Validator();
    majorValidator.addSchema(requirementSchema, '/RequirementSchema');
    const majorResult = majorValidator.validate(major, majorSchema);

    if (majorResult.errors.length > 0) {
      majorErrors.push({
        name: `Schema error with ${majorVal} major`,
        error: majorResult.errors[0]
      });
    }
  }

  checkValidation('major', majorErrors);
}
