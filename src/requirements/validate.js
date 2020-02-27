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

  if (universityResult.errors.length === 0) {
    console.log('Passed university schema validator!');
  } else {
    console.log('Error with university schema');
    console.log({
      name: 'Schema error with University',
      error: universityResult.errors
    });
  }
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

  if (collegeErrors.length === 0) {
    console.log('Passed college schema validator!');
  } else {
    console.log('Error with college schema');
    console.log(collegeErrors);
  }
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

  if (majorErrors.length === 0) {
    console.log('Passed major schema validator!');
  } else {
    console.log('Error with major schema');
    console.log(majorErrors);
  }
}
