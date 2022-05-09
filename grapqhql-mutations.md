# Surveys

#### Create/Update a survey

Request

```graphql
mutation {
  survey(
    input: {
      _id: "62313e42b62919498ebe9ff9",
    	course_id: "95dfc3bd-92ca-4a5f-aaa7-7b466d66fb55",
    	company_id:"1",
      required: true,
    	name: "Satisfaction survey",
      description: "This is an example of a survey",
      end_message: "<p>Thank you for taking the time to complete this survey. </p><p><br></p><p><strong><a href='https://deals.usnews.com/coupons/doordash'>Please go to this link to get 50% discount!</a></strong></p>"
      deadline: 1650162589756,
      presenters: [{
        first_name: "Andoni",
        last_name: "Altuna"
      }]
    })
}
```

Response

```json
{
  "data": {
    "survey": {
      "_id": "6239c24abfa7d80a415fef1e",
      "name": "Optional satisfaction survey",
      "description": "This is an example of a survey",
      "end_message": "<p>Thank you for taking the time to complete this survey. </p><p><br></p><p><strong><a href='https://deals.usnews.com/coupons/doordash'>Please go to this link to get 50% discount!</a></strong></p>",
      "required": false,
      "deadline": 1650162589756,
      "presenters": [
        {
          "_id": "6239ecf354b9141d64a08a3a",
          "first_name": "Andoni",
          "last_name": "Altuna"
        }
      ]
    }
  }
}
```

#### Create/Update suvery's question

Request

```graphql
mutation {
  surveyQuestion(
    input: {
      _id: "62324dfd2918ab67de37c560",
      survey_id: "62313e42b62919498ebe9ff9",
      type: "rating_scale", 
      required: true,
      name: "How much are you enjoying this survey?",
      options: [
            "1",
            "2",
            "3",
            "4",
            "5"
          ],
      additional_info: {
        shape: "star",
        color: "green",
        other: "Cualquier cosa"
      }
      answer: []
    }
  ) {
    _id,
    survey_id,
    type,
    required,
    name,
    keys,
    options,
    additional_info {
      shape,
      color,
      other
    }
  } 
}
```

Response

```json
{
  "data": {
    "surveyQuestion": {
      "_id": "62324dfd2918ab67de37c560",
      "survey_id": "62313e42b62919498ebe9ff9",
      "name": "How much are you enjoying this survey?",
      "type": "rating_scale", 
      "required": true,
      "keys": [],
      "options": [
        "1",
        "2",
        "3",
        "4",
        "5"
      ],
      "additional_info": {
        "shape": "star",
        "color": "green",
        "other": "Cualquier cosa"
      }
    }
  }
}
```

#### Get a survey

Request

```graphql
query {
  survey (id: "62313e42b62919498ebe9ff9") {
    _id
    name
    description
    end_message
    required
    deadline
    questions {
      _id
      survey_id,
      test_id,
      type,
      name,
      keys
      options
      additional_info {
        shape,
        color,
        other
      }
      user_answer {
        key
        value
      }
    },
    presenters {
      _id,
      first_name,
      last_name
    },
    progress
  }
}
```

Response

```json
{
  "data": {
    "survey": {
      "_id": "62313e42b62919498ebe9ff9",
      "name": "Required satisfaction survey",
      "description": "This is an example of a survey",
      "end_message": "<p>Thank you for taking the time to complete this survey. </p><p><br></p><p><strong><a href='https://deals.usnews.com/coupons/doordash'>Please go to this link to get 50% discount!</a></strong></p>",
      "required": true,
      "deadline": 1650162589756,
      "questions": [
        {
          "_id": "62322ac70d653d0ff7ac0014",
          "survey_id": "62313e42b62919498ebe9ff9",
          "test_id": null,
          "type": "matrix_grid",
          "name": "Which one do you prefer?",
          "keys": [
            "Coffee",
            "Tea"
          ],
          "options": [
            "A little",
            "Meh",
            "A lot"
          ],
          "additional_info": {
            "shape": "star",
            "color": "red",
            "other": "Lo que quieras poner"
          },
          "user_answer": [
            {
              "key": "Coffee",
              "value": "Meh"
            },
            {
              "key": "Tea",
              "value": "A little"
            }
          ]
        },
        {
          "_id": "62324dfd2918ab67de37c560",
          "survey_id": "62313e42b62919498ebe9ff9",
          "test_id": null,
          "type": "rating_scale",
          "name": "How much are you enjoying this survey?",
          "keys": [],
          "options": [
            "1",
            "2",
            "3",
            "4",
            "5"
          ],
          "additional_info": {
            "shape": "star",
            "color": "green",
            "other": "Cualquier cosa"
          },
          "user_answer": null
        }
      ],
      "presenters": [
        {
          "_id": "6239e9e6c5c9538ceaa1bda7",
          "first_name": "Andoini",
          "last_name": "Altuna"
        }
      ],
      "progress": 25
    }
  }
}
```

#### Get all surveys (COMPANY)

Request

```graphql
query {
  surveys(
    page: 1,
    filters: {
      search: "Sur",
      required: true
    }
  ) {
    surveys {
      _id,
      course_id,
      company_id,
      name,
      description,
      end_message,
      required,
      deadline,
      presenters {
        _id,
        first_name,
        last_name
      },
      progress
    }
    pagination {
      page,
      last_page
    }
  }
}
```

Response

```json

```

#### Get surveys by course 

Request

```graphql
query {
  surveysByCourse(
    page: 1,
    id: "95dfc3bd-92ca-4a5f-aaa7-7b466d66fb55",
    filters: {
      search: "Sur",
      required: true
    }
  ) {
    surveys {
      _id,
      name,
      description,
      end_message,
      required,
      deadline,
      presenters {
        _id,
        first_name,
        last_name
      },
      progress
    }
    pagination {
      page,
      last_page
    }
  }
}
```

Response

```json

```

#### Get surveys available for user 

Request

```graphql
query {
  surveysByUser(
    page: 1,
    filters: {
      search: "survey"
    }
  ) {
    surveys {
      _id,
      course_id,
      company_id,
      name,
      description,
      end_message,
      required,
      deadline,
      presenters {
        _id
        first_name,
        last_name
      },
      progress,
      completed
    }
    pagination {
      page,
      last_page
    }
  }
}
```

Response

```json
{
  "data": {
    "surveysByUser": {
      "surveys": [
        {
          "_id": "62313e42b62919498ebe9ff9",
          "course_id": "95e64cc9-e4e8-430e-8f1b-326295ebe84a",
          "company_id": "1",
          "name": "Required satisfaction survey",
          "description": "This is an example of a survey",
          "end_message": "<p>Thank you for taking the time to complete this survey. </p><p><br></p><p><strong><a href='https://deals.usnews.com/coupons/doordash'>Please go to this link to get 50% discount!</a></strong></p>",
          "required": true,
          "deadline": 1650162589756,
          "presenters": [
            {
              "_id": "6239e9e6c5c9538ceaa1bda7",
              "first_name": "Andoini",
              "last_name": "Altuna"
            }
          ],
          "progress": 80,
          "completed": true
        },
        {
          "_id": "6239c24abfa7d80a415fef1e",
          "course_id": "95e64cc9-e4e8-430e-8f1b-326295ebe84a",
          "company_id": "1",
          "name": "Optional satisfaction survey",
          "description": "This is an example of a survey",
          "end_message": "<p>Thank you for taking the time to complete this survey. </p><p><br></p><p><strong><a href='https://deals.usnews.com/coupons/doordash'>Please go to this link to get 50% discount!</a></strong></p>",
          "required": false,
          "deadline": 1650162589756,
          "presenters": [
            {
              "_id": "6239ecfc54b9141d64a08a3c",
              "first_name": "Andoni",
              "last_name": "Altuna"
            }
          ],
          "progress": 50,
          "completed": false
        }
      ],
      "pagination": {
        "page": 1,
        "last_page": 1
      }
    }
  }
}
```

#### Answer a survey question

Request

```graphql
mutation {
  answerSurveyQuestion(
    input: {
      question_id: "62322ac70d653d0ff7ac0014",
      answer: [{
        key: "Coffee"
        value: "Meh"
      },{
        key: "Tea"
        value: "A little"
      }]
    }
  ) {
    _id,
    survey_id,
    name,
    keys,
    options,
    user_answer {
      key,
      value
    }
  }
}
```

Response

```json
{
  "data": {
    "answerSurveyQuestion": {
      "_id": "62322ac70d653d0ff7ac0014",
      "survey_id": "62313e42b62919498ebe9ff9",
      "name": "Which one do you prefer?",
      "keys": [
        "Coffee",
        "Tea"
      ],
      "options": [
        "A little",
        "Meh",
        "A lot"
      ],
      "user_answer": [
        {
          "key": "Coffee",
          "value": "Meh"
        },
        {
          "key": "Tea",
          "value": "A little"
        }
      ]
    }
  }
}
```

# Tests

#### Create/Update a test

Request

```graphql
mutation {
  test(
    input: {
      _id: "6232a55f63ad5d1b8a926080",
    	course_id: "95d9fa35-ff59-4106-a775-b6a908694752",
    	company_id:"1",
      required: true,
    	name: "This is a test",
      description: "This is an example of a test",
      deadline: 1650162589756,
      minimum_grade: 80,
      maximum_reattempts: 3,
      status: "active"
    })
}
```

Response

```json

```

#### Create/Update a test question

Request

```graphql
mutation {
  testQuestion(
    input: {
      _id: "6232abb4f33c1aecb163ac29",
      test_id: "6232a55f63ad5d1b8a926080",
    	type: "multiple_choice", 
    	name: "How many planets exist in our galaxy?",
      options: ["5","7","8","9"],
      answer: [{
        value: "8"
      }]
    })
}
```

Response

```json

```

#### Get all tests

Request

```graphql
query {
  tests(
  	id: "95d9fa35-ff59-4106-a775-b6a908694752",
    page: 1,
    filters: {
      search: "this is a",
      required: true,
      status: "active"
    }
  ) {
    tests {
      _id,
      name,
      course_id,
      description,
      required,
      status,
      deadline,
      presenters {
        _id
      },
      minimum_grade,
      maximum_reattempts,
      progress,
      grade
    },
    pagination {
      page,
      last_page
    }
  }
}
```

Response

```json

```

#### Get tests by course

Request

```graphql
query {
  testsByCourse(
  	id: "95d9fa35-ff59-4106-a775-b6a908694752",
    page: 1,
    filters: {
      search: "this is a",
      required: true,
      status: "active"
    }
  ) {
    tests {
      _id,
      name,
      course_id,
      description,
      required,
      status,
      deadline,
      presenters {
        _id
      },
      minimum_grade,
      maximum_reattempts,
      progress,
      grade
    },
    pagination {
      page,
      last_page
    }
  }
}
```

Response

```json

```

#### Get all test available for user

Request

```graphql
query {
  testsByUser(
    page:1,
    filters: {
      search: "Test",
      required: true,
      status: "active"
    }
  ) {
    tests {
      _id,
      name,
      description,
      required,
      status,
      deadline,
      presenters {
        _id
      },
      minimum_grade,
      maximum_reattempts,
      progress,
      grade
    },
    pagination {
      page,
      last_page
    }
  }
}
```

Response

```json

```

#### Get a test

Request

```graphql
query {
  test (id: "6232a55f63ad5d1b8a926080") {
    _id
    name
    description
    required
    status
    deadline
    questions {
      _id
      type,
      name,
      keys,
      options,
      answer {
        key,
        value
      }
      user_answer {
        key
        value
      }
    },
    presenters {
      _id
    },
    minimum_grade,
    maximum_reattempts,
    progress,
    grade
  }
}
```

Response

```json

```

#### Answer a test question

Request

```graphql
mutation {
  answerTestQuestion(
    input: {
      question_id: "6232abb4f33c1aecb163ac29",
      answer: [{
        value: "8"
      }]
    })
}
```

Response

```json

```

#### Grade/Finish test

Request

```graphql
mutation {
  gradeTest (id: "6232a55f63ad5d1b8a926080")
}
```

Response

```json

```

# Industry Licences

#### Get user industries licences

Request

```graphql
query {
  userProfessionalLicences {
    professional_licences {
      _id
      country {
        name
      }
      state {
        name
      }
      industry {
        name
      }
      profession {
        name
      }
      license_number
      aquired_date
      expiration_date
      license_url
      first_renewal
      issue_date
      licensed_by
      graduation_date
      last_ce_reporting
      last_new_ce_reporting
      is_granted_extension
      extended_date
      years_duration
      month_duration
      days_duration
      new_extended_date
      license_distinction
      is_active
      is_inactive
      is_retired
      is_expired
      is_renewed
      is_limited
    },
    pagination {
      page,
      last_page
    }
  }
}
```

Response

```json
{
  "data": {
    "userProfessionalLicences": {
      "professional_licences": [
        {
          "_id": "624097fe9916fde6045a8749",
          "country": {
            "name": "United States"
          },
          "state": {
            "name": "Alabama"
          },
          "industry": {
            "name": "Medical"
          },
          "profession": {
            "name": "Doctor"
          },
          "license_number": "ABA123C",
          "aquired_date": 123,
          "expiration_date": 123,
          "license_url": null,
          "first_renewal": null,
          "issue_date": null,
          "licensed_by": null,
          "graduation_date": null,
          "last_ce_reporting": null,
          "last_new_ce_reporting": null,
          "is_granted_extension": null,
          "extended_date": null,
          "years_duration": null,
          "month_duration": null,
          "days_duration": null,
          "new_extended_date": null,
          "license_distinction": null,
          "is_active": null,
          "is_inactive": null,
          "is_retired": null,
          "is_expired": null,
          "is_renewed": null,
          "is_limited": null
        }
      ],
      "pagination": {
        "page": 1,
        "last_page": 1
      }
    }
  }
}
```

#### Save/Create user professional license

Request

```graphql
mutation {
  addIndustryUserLicense(
    input:{
      license: {
        name: "Doctor",
        industry: {
          name: "Medical"
        },
        profession: {
          name: "Doctor"
        },
        country: {
          name: "United States"
        }
        state: {
          name: "Alabama"
        }
        detail: {
          license_number: "ABC123CBA",
          aquired_date: 123,
          expiration_date: 123,
          first_renewal: false,
          issue_date: 123,
          graduation_date: 123,
          last_ce_reporting: 123,
          is_renewed: false
          file: {
            buffer: "kjshdasjdajks",
            size: 1024,
            type: "image/png",
            name: "Doctors License",
            alias: "image.png"
          }
        }
      }
    }
  ) {
    _id
    profession {
      name
    },
    industry {
      name
    },
    state {
      name
    },
    country {
      name
    }
    detail {
      license_number,
      aquired_date,
      expiration_date,
      first_renewal,
      issue_date,
      licensed_by,
      graduation_date,
      last_ce_reporting,
      extended_date,
      file {
        buffer,
        size,
        type,
        name,
        alias
      }
    }
  }
}
```

Response

```json
{
  "data": {
    "addIndustryUserLicense": {
      "_id": "624097fe9916fde6045a8749",
      "profession": {
        "name": "Doctor"
      },
      "industry": {
        "name": "Medical"
      },
      "state": {
        "name": "Alabama"
      },
      "country": {
        "name": "United States"
      },
      "detail": {
        "license_number": "ABC123CBA",
        "aquired_date": 123,
        "expiration_date": 123,
        "first_renewal": false,
        "issue_date": 123,
        "licensed_by": null,
        "graduation_date": 123,
        "last_ce_reporting": 123,
        "extended_date": null,
        "file": {
          "buffer": "kjshdasjdajks",
          "size": "1024",
          "type": "image/png",
          "name": "Doctors License",
          "alias": "image.png"
        }
      }
    }
  }
}
```

#### Delete user professional license

Request

```graphql
mutation {
  deleteUserProfessionalLicense(_id:"kjash2376wyufg27637g82")
}
```

Response

```json
{
  "data": {
    "deleteUserProfessionalLicense": "Deleted professional license"
  }
}
```

# DEA Licences

#### Create/Update DEA Licence

```graphql
mutation {
  addDeaLicense(
      dea_license: {
        name: "Test",
        state: {
          name: "Alabama"
        },
        country: {
          name: "United States"
        },
        industry: {
          name: "Medical"
        }
      }
  ) {
    _id,
    name,
    state {
      name
    },
    country {
      name
    },
    industry {
      name
    }
  }
}
```

Response

```json
{
  "data": {
    "addDeaLicense": {
      "_id": "6239e3513daf99c4c1feaf9b",
      "name": "Test",
      "state": {
        "name": "Alabama"
      },
      "country": {
        "name": "United States"
      },
      "industry": {
        "name": "Medical"
      }
    }
  }
}
```

#### Get DEA Licences

Request

```graphql
query {
  deaLicenses(
    page: 1,
    filters: {
      search: "Test",
      states: ["Alabama"],
      countries: ["United States"],
      industries: ["Medical"],
    }
  ) {
    dea_licenses {
      _id,
        name,
        state {
          _id,
          name
        }
        country {
          _id,
          name,
        },
        industry {
          _id,
          name
        }
    },
    pagination {
      page,
      last_page
    }
  }
}
```

Response

```json
{
  "data": {
    "deaLicenses": {
      "dea_licenses": [
        {
          "_id": "6239e3513daf99c4c1feaf9b",
          "name": "Test",
          "state": {
            "_id": "6239e3513daf99c4c1feaf9c",
            "name": "Alabama"
          },
          "country": {
            "_id": "6239e3513daf99c4c1feaf9d",
            "name": "United States"
          },
          "industry": {
            "_id": "6239e3513daf99c4c1feaf9e",
            "name": "Medical"
          }
        }
      ],
      "pagination": {
        "page": 1,
        "last_page": 1
      }
    }
  }
}
```

#### Create/Update user's DEA Licence

Request

```graphql
mutation {
  addDeaLicenseToUser(
    page: 2,
    dea_license: {
      license: {
        name: String
        state: {
          name: "Testx"
        },
        country: {
          name: "Testa"
        },
        industry: {
          name: "Testa"
        }
      },
      detail: {
        dea_license_number: "ABC123",
        aquired_date: 1234,
        expiration_date: 1234
      }
    }
  ) {
    _id,
    license{
      name,
      state {
        _id,
        name
      },
      country {
        _id,
        name,
      },
      industry {
        _id,
        name
      }
    },
    detail{
      dea_license_number
    }
  }
}
```

Response

```json

```

#### Delete user's DEA Licence

Request

```graphql
mutation {
  deleteDeaLicenseToUser(
    page: 3,
    _id:"6238a6ad86c2ee8f27528468"
  ) {
    dea_licenses {
      _id,
      license {
        name,
        state {
          _id
          name
        }
        country {
          _id
          name
        }
        industry {
          _id
          name
        }
      },
      detail {
        dea_license_number,
        expiration_date
      }
    },
    pagination {
      page,
      last_page
    }
  }
}
```

Response

```json

```

#### Get user's DEA Licences

Request

```graphql
query {
  deaLicensesByUser(
    page: 1
  ) {
    dea_licenses {
      _id,
      license {
        name,
        state {
          _id,
          name
        }
      	country {
          _id,
          name,
        },
        industry {
          _id,
          name
        }
      },
      detail {
        dea_license_number,
        aquired_date
      }
    },
    pagination {
      page,
      last_page
    }
  }
}
```

Response

```json

```

# Memberships

#### Create/update a membership (ADMIN)

Request

```graphql
mutation {
  membership(
    input:{
      _id: "623b816a2b16a065af8e0e4d" (Para actualizar)
      name: "AAIO - American Academy"
    }
  ) {
    _id,
    name
  }
}
```

Response

```json
{
  "data": {
    "membership": {
      "_id": "623b816a2b16a065af8e0e4d",
      "name": "AAIO - American Academy"
    }
  }
}
```

#### Delete a membership (ADMIN)

Request

```graphql
mutation {
  deleteMembership(id:"623b7ee52e8d154b04b4ad1e")
}
```

Response

```json
{
  "data": {
    "deleteMembership": "Deleted membership"
  }
}
```

#### Get memberships

Request

```graphql
query {
  memberships(
    page: 1,
    filters: {
      search: "AAIO"
    }
  ) {
    memberships {
      _id
      name
    },
    pagination {
      page,
      last_page
    }
  }
}
```

Response

```json
{
  "data": {
    "memberships": {
      "memberships": [
        {
          "_id": "623a2f23bba098168b2781af",
          "name": "AAIO - American Academy"
        }
      ],
      "pagination": {
        "page": 1,
        "last_page": 1
      }
    }
  }
}
```

#### Create/update a user's membership

Request

```graphql
mutation {
  userMembership (
    input: {
      _id: "623b7d24849409d264f3600e",
      membership: {
        country: {
          name: "United States"
        },
        industry: {
          name: "Medical"
        }
      },
      detail: {
        membership_number: "ABA123",
        aquired_date: 1234,
        expiration_date: 123
      }
    }
  ) {
    _id
    membership {
        country {
          name
        },
        industry {
          name
        }
      },
      detail {
        membership_number,
        aquired_date,
        expiration_date
      }
  }
}
```

Response

```json
{
  "data": {
    "userMembership": {
      "_id": "623b7d24849409d264f3600e",
      "membership": {
        "country": {
          "name": "United States"
        },
        "industry": {
          "name": "Medical"
        }
      },
      "detail": {
        "membership_number": "ABA123",
        "aquired_date": 1234,
        "expiration_date": 123
      }
    }
  }
}
```

#### Delete a users's membership

Request

```graphql
mutation {
  deleteUserMembership(id:"623b7d24849409d264f3600e")
}
```

Response

```json
{
  "data": {
    "deleteMembership": "Deleted membership"
  }
}
```

#### Get users's memberships

Request

```graphql
query {
  userMemberships(
    page: 1,
    filters: {
      search: "",
      countries: ["United States"],
      industries: ["Medical"]
    }
  ) {
    memberships {
      _id,
      membership {
        _id,
        country {
          name
        },
        industry {
          name
        }
      },
      detail {
        membership_number
      }
    },
    pagination {
      page,
      last_page
    }
  }
}
```

Response

```json
{
  "data": {
    "userMemberships": {
      "memberships": [
        {
          "_id": "623b7d24849409d264f3600e",
          "membership": {
            "_id": "623b7d7512add24e3c358b27",
            "country": {
              "name": "United States"
            },
            "industry": {
              "name": "Medical"
            }
          },
          "detail": {
            "membership_number": "ABA123"
          }
        }
      ],
      "pagination": {
        "page": 1,
        "last_page": 1
      }
    }
  }
}
```

# Certificates

### Create/Update user's certificate

#### Request

En el caso de los user cerificates, tenemos 2 tipos Course y Manual. En el caso de los tipo Course, son generados automáticamente, y el usuario solo puede modificar 2 campos "certification" y "notes". En el caso de los Manual el usuario puede crear/modificar sin limites y debe proveer todos los datos en la mutación.

```graphql
mutation {
  userCertificate(input:{
    _id: "62503ffd24fb218c97152347",//Para actualizar
    name: "Medical certification XXXXXXX"
    course: {
      course_type: "in_person",
      course_credits: 10,
      course_categories: ["Medical Licenses","Ethical Concerns"],
      course_industries: [{
        name: "Medical"
      }],
      course_presenters: [{
        first_name: "Franco",
        last_name: "Altuna"
      }]
    },
    licences: [{
      profession: {
        name: "Doctor"
      },
      industry: {
        name: "Medical"
      },
      country: {
        name: "United States"
      },
      state: {
        name: "Alabama"
      },
      detail: {
        license_number: "ABC123",
        aquired_date: 12345,
        expiration_date: 12346,
        issue_date: 12345,
        licensed_by: "Google",
        graduation_date: 12345,
        last_ce_reporting: 12345,
        last_new_ce_reporting: 12345,
        license_distinction: "With Honors",
        is_retired:false,
        file: {
          buffer: "Abaaskjdhasjdah",
          size: 1024,
          type: "image/png",
          name: "License",
          alias: "image.png"
        }
      }
    }],
    providers: {
      providers: [{
        affiliation: "Alabama Medical Affiliation",
        affiliation_start_date: 1234,
        affiliation_end_date: 1235,
        country: {
          name: "United States"
        },
        industry: {
          name: "Medical"
        }
      }]
    },
    certificate: {
      buffer: "sjkdhasjdhajdhasjd",
      size: 1024,
      type: "image/png",
      name: "Certificate",
      alias: "cert.png"
    },
    certification: {
      buffer: "sjkdhasjdhajdhasjd",
      size: 1024,
      type: "image/png",
      name: "Certificatation",
      alias: "cert.png"
    }
    earn_date: 12345,
    notes: "This is my Medical Certification"
  }) {
  _id,
  name,
  course {
    course_id,
    course_type,
    course_credits,
    course_presenters {
      first_name,
      last_name
    },
  },
  providers {
    is_display_provider_logo,
    providers {
      country {
        name
      },
      industry {
        name
      },
      affiliation
      affiliation_start_date,
      affiliation_end_date,
      disclaimer
    }
  },
  licences {
    profession {
      name
    },
    industry {
      name
    },
    state {
      name
    },
    detail {
      license_number,
      aquired_date,
      expiration_date,
      issue_date,
      licensed_by
    }
  },
  certificate {
    buffer,
    size,
    type,
    name,
    alias
  },
  certification {
      buffer,
      size,
      type,
      name,
      alias
  }
  earn_date,
  notes
}
```

Response

```json
{
  "data": {
    "userCertificate": {
      "_id": "62503ffd24fb218c97152347",
      "name": "Medical certification",
      "course": {
        "course_id": null,
        "course_type": "in_person",
        "course_credits": "10",
        "course_presenters": [
          {
            "first_name": "Franco",
            "last_name": "Altuna"
          }
        ]
      },
      "providers": {
        "is_display_provider_logo": null,
        "providers": [
          {
            "country": {
              "name": "United States"
            },
            "industry": {
              "name": "Medical"
            },
            "affiliation": "Alabama Medical Affiliation",
            "affiliation_logo": null,
            "affiliation_start_date": 1234,
            "affiliation_end_date": 1235,
            "disclaimer": null
          }
        ]
      },
      "licences": [
        {
          "profession": {
            "name": "Doctor"
          },
          "industry": {
            "name": "Medical"
          },
          "state": {
            "name": "Alabama"
          },
          "detail": {
            "license_number": "ABC123",
            "aquired_date": 12345,
            "expiration_date": 12346,
            "issue_date": 12345,
            "licensed_by": "Google"
          }
        }
      ],
      "certificate": {
        "buffer": "sjkdhasjdhajdhasjd",
        "size": "1024",
        "type": "image/png",
        "name": "Certificate",
        "alias": "cert.png"
      },
      "certification": {
        "buffer": "sjkdhasjdhajdhasjd",
        "size": "1024",
        "type": "image/png",
        "name": "Certificatation",
        "alias": "cert.png"
      },
      "earn_date": 12345,
      "notes": "This is my Medical Certification"
    }
  }
}
```

#### Get user's certificates

Request

```graphql
query {
  userCertificates(
    page: 1
  ) {
    certificates {
      _id,
      name,
      course {
        course_id,
        course_type,
        course_credits,
        course_presenters {
          first_name,
          last_name
        }
      },
      licences {
        profession {
          name
        },
        industry {
          name
        },
        state {
          name
        },
        country {
          name
        },
        detail {
          license_number,
          aquired_date,
          expiration_date,
          issue_date,
          aquired_date,
          graduation_date,
          last_ce_reporting
        }
      },
      certificate  {
          buffer,
          size,
          type,
          name,
          alias
      },
      certification  {
          buffer,
          size,
          type,
          name,
          alias
      },
      earn_date
      notes
    },
    pagination {
      page,
      last_page
    }
  }
}
```

Response

```json
{
  "data": {
    "userCertificates": {
      "certificates": [
        {
          "_id": "62503fb024fb218c971522e3",
          "name": "Medical certification",
          "course": {
            "course_id": null,
            "course_type": "in_person",
            "course_credits": 10,
            "course_presenters": [
              {
                "first_name": "Franco",
                "last_name": "Altuna"
              }
            ]
          },
          "licences": [
            {
              "profession": {
                "name": "Doctor"
              },
              "industry": {
                "name": "Medical"
              },
              "state": {
                "name": "Alabama"
              },
              "country": {
                "name": "United States"
              },
              "detail": {
                "license_number": "ABC123",
                "aquired_date": 12345,
                "expiration_date": 12346,
                "issue_date": 12345,
                "graduation_date": 12345,
                "last_ce_reporting": 12345
              }
            }
          ],
          "certificate": {
            "buffer": "sjkdhasjdhajdhasjd",
            "size": "1024",
            "type": "image/png",
            "name": "Certificate",
            "alias": "cert.png"
          },
          "certification": {
            "buffer": "sjkdhasjdhajdhasjd",
            "size": "1024",
            "type": "image/png",
            "name": "Certificatation",
            "alias": "certon.png"
          },
          "earn_date": 12345,
          "notes": "This is my Medical Certification"
        }
      ],
      "pagination": {
        "page": 1,
        "last_page": 1
      }
    }
  }
}
```

#### Get a user's certificate

Request

```graphql
query {
  userCertificate(_id:"6240ca97bd0ca93a3a7154e3"),
  {
      _id
      name,
      course_id,
      header {
        company_logo { 
          buffer,
          size,
          type
        },
        company_name,
        company_email,
        company_slogan,
        country {
          name
        },
        company_address,
        company_city,
        company_state,
        company_phone 
      },
      signature {
        is_display_signature,
        signature {
          buffer,
          size,
          type
        },
        signer
      },
      additional_images {
        is_display_assets,
        images {
          buffer,
          type,
          size
        }
      },
      total_issued_certificates,
    file {
      buffer,
      name
    }
  }
}
```

Response

```json
{
  "data": {
    "userCertificate": {
      "_id": "6240ca97bd0ca93a3a7154e3",
      "name": "Test",
      "course_id": "123",
      "header": {
        "company_logo": {
          "buffer": "jkschajkshfjkash36787",
          "size": 1024,
          "type": "image/png"
        },
        "company_name": "Test Company",
        "company_email": "test@test.com",
        "company_slogan": "Makeing the Test a better Test",
        "country": {
          "name": "United States"
        },
        "company_address": "Test road 123",
        "company_city": "Cityland",
        "company_state": "Alabama",
        "company_phone": "+1 1234-5678"
      },
      "signature": {
        "is_display_signature": true,
        "signature": {
          "buffer": "jkschajkshfjkash36787",
          "size": 1024,
          "type": "image/png"
        },
        "signer": "Franco Andoni"
      },
      "additional_images": {
        "is_display_assets": true,
        "images": [{
          "buffer": "jkschajkshfjkash36787",
          "size": 1024,
          "type": "image/png"
        }]
      },
      "total_issued_certificates": 0,
      "file": {
        "buffer": "jasdhkjashdakhjjhjdshaj",
        "name": "Certificate.pdf"
      }
    }
  }
}
```

# Custom Documents

#### Get user files

Request

```graphql
query {
  userFiles(
    collection_type: "custom_documents",
    search: "",
    page: 1
  ),
  {
    files {
      _id
      buffer,
      type,
      size,
      name,
      alias,
      is_public
      expiration
      notes
    },
    pagination {
      page,
      last_page
    }
  }
}
```

Response

```json
{
  "data": {
    "userFiles": {
      "files": [
        {
          "_id": "623f2b5d3b18917d713ddfec",
          "buffer": "base64buffer",
          "type": "image/png",
          "size": "1024",
          "name": "Medical License",
          "alias": "image.png",
          "is_public": false,
          "expiration": 1234567,
          "notes": "This is a note"
        }
      ],
      "pagination": {
        "page": 1,
        "last_page": 1
      }
    }
  }
}
```

#### Save/update user file

Request

```graphql
mutation {
  saveUserFile(
    file: {
      _id: "623f2b5d3b18917d713ddfec", (Send _id to update)
      buffer: "base64buffer",
      type: "image/png",
      size: 1024,
      name: "Medical License",
      alias: "image.png"
      is_public: false,
      expiration: 1234567,
      notes: "This is a note"
    },
    collection_type: "custom_documents"
  ),
  {
    _id,
    buffer,
    type,
    size,
    name,
    is_public,
    expiration,
    notes
  }
}
```

Response

```json
{
  "data": {
    "saveUserFile": {
      "_id": "62430139e3da56ad70215d0b",
      "buffer": "base64buffer",
      "type": "image/png",
      "size": "1024",
      "name": "Medical License",
      "alias": "image.png",
      "is_public": false,
      "expiration": 1234567,
      "notes": "This is a note"
    }
  }
}
```

#### Delete user file

Request

```graphql
mutation {
  deleteUserFile(
    _id: "623f2c9c564033f4c65ff252",
    collection_type: "custom_documents"
  )
}
```

Response

```json
{
  "data": {
    "deleteUserFile": "Deleted file"
  }
}
```

# Curriculums

#### Get user curriculums

Request

```graphql
query {
  userCurriculums {
    curriculums {
      _id,
      first_name,
      last_name,
      about,
      email,
      phone {
        code,
        number
      },
      linkedin,
      profession {
        _id,
        name
      },
      industry {
        _id,
        name
      },
      country {
        _id
        name
      },
      state {
        _id,
        name
      },
      city {
        _id,
        name
      },
      zip,
      references {
        name,
        position,
        email,
        phone {
          code,
          number
        }
      },
      skills {
        skill,
        proficiency
      },
      languages {
        language,
        proficiency
      },
      work {
        company,
        position,
        country {
          _id
          name
        },
        state {
          _id,
          name
        },
        city {
          _id,
          name
        },
        email,
        website,
        phone {
          code,
          number
        },
        start_date,
        end_date,
        active,
        notes
      },
      education {
        insitution,
        degree,
        field
        country {
          _id
          name
        },
        state {
          _id,
          name
        },
        city {
          _id,
          name
        },
        email,
        website,
        phone {
          code,
          number
        },
        start_date,
        end_date,
        active,
        notes
      }
      public
    },
    pagination {
      page,
      last_page
    }
  }
}
```

Response

```json
{
  "data": {
    "userCurriculums": {
      "curriculums": [
        {
          "_id": "6266ade914b7ac7f7bb3886f",
          "first_name": "Andres Keeling",
          "last_name": "Cremin",
          "about": "Full Stack Developer",
          "email": "pro@pro.com",
          "phone": {
            "code": "+55",
            "number": "13 98210 1222"
          },
          "linkedin": "https://linkedin/pro@pro.com",
          "profession": {
            "_id": "6167056e5ec0b30c2140f314",
            "name": "Acupuncture"
          },
          "industry": {
            "_id": "6167056e5ec0b30c2140f312",
            "name": "Medical"
          },
          "country": {
            "_id": "6266ade914b7ac7f7bb38873",
            "name": "United States"
          },
          "state": {
            "_id": "6111a14c4e0ed364db4417bc",
            "name": "Alabama"
          },
          "city": {
            "_id": null,
            "name": "Legocity"
          },
          "zip": "11055000",
          "references": [
            {
              "name": "Pedro Picapiedra",
              "position": "CEO",
              "email": "pedro@resultier.com",
              "phone": {
                "code": "+55",
                "number": "13 00000 11111"
              }
            }
          ],
          "skills": [
            {
              "skill": "Blogger",
              "proficiency": "High"
            }
          ],
          "languages": [
            {
              "language": "English",
              "proficiency": "Native"
            },
            {
              "language": "Spanish",
              "proficiency": "Native"
            },
            {
              "language": "Portugues",
              "proficiency": "Native"
            }
          ],
          "work": [
            {
              "company": "Google",
              "position": "Back End Developer",
              "country": {
                "_id": "6266ade914b7ac7f7bb3887c",
                "name": "United States"
              },
              "state": {
                "_id": "6266ade914b7ac7f7bb3887d",
                "name": "California"
              },
              "city": {
                "_id": null,
                "name": "Orange County"
              },
              "email": "info@google.com",
              "website": "https://google.com",
              "phone": {
                "code": "+1",
                "number": "22 2222 22222"
              },
              "start_date": 1619360277,
              "end_date": 1635171477,
              "active": false,
              "notes": "I was in charge of Google Chat"
            },
            {
              "company": "Resultier",
              "position": "Full Stack Developer",
              "country": {
                "_id": "6266ade914b7ac7f7bb38880",
                "name": "United States"
              },
              "state": {
                "_id": "6266ade914b7ac7f7bb38881",
                "name": "Idaho"
              },
              "city": {
                "_id": null,
                "name": "Idaho Falls"
              },
              "email": "info@resultier.com",
              "website": "https://resultier.com",
              "phone": {
                "code": "+1",
                "number": "12 2333 3343"
              },
              "start_date": 1635171477,
              "end_date": null,
              "active": true,
              "notes": "I am in charge of backend development for multiple projects"
            }
          ],
          "education": [
            {
              "insitution": "Miami College",
              "degree": "Full Stack Developer",
              "field": "Computer science",
              "country": {
                "_id": "6266ade914b7ac7f7bb38884",
                "name": "United States"
              },
              "state": {
                "_id": "6266ade914b7ac7f7bb38885",
                "name": "Miami"
              },
              "city": {
                "_id": null,
                "name": "Key Bay"
              },
              "email": "info@mcollege.com",
              "website": "https://mcollege.com",
              "phone": {
                "code": "+1",
                "number": "12 2333 3343"
              },
              "start_date": 1619360277,
              "end_date": 1635171477,
              "active": false,
              "notes": "I learnt a lot"
            }
          ],
          "public": true
        },
        {
          "_id": "6266ade914b7ac7f7bb388a8",
          "first_name": "Andres Keeling",
          "last_name": "Cremin",
          "about": "Full Stack Developer",
          "email": "pro@pro.com",
          "phone": {
            "code": "+55",
            "number": "13 98210 1222"
          },
          "linkedin": "https://linkedin/pro@pro.com",
          "profession": {
            "_id": "6167056e5ec0b30c2140f37f",
            "name": "Dental Hygienist"
          },
          "industry": {
            "_id": "6167056e5ec0b30c2140f352",
            "name": "Dentistry"
          },
          "country": {
            "_id": "6266ade914b7ac7f7bb388ac",
            "name": "Argentina"
          },
          "state": {
            "_id": "6111a14c4e0ed364db44064a",
            "name": "Buenos Aires"
          },
          "city": {
            "_id": null,
            "name": "San Isidro"
          },
          "zip": "1672",
          "references": [
            {
              "name": "Pedro Picapiedra",
              "position": "CEO",
              "email": "pedro@resultier.com",
              "phone": {
                "code": "+55",
                "number": "13 00000 11111"
              }
            }
          ],
          "skills": [
            {
              "skill": "Blogger",
              "proficiency": "High"
            }
          ],
          "languages": [
            {
              "language": "English",
              "proficiency": "Native"
            },
            {
              "language": "Spanish",
              "proficiency": "Native"
            },
            {
              "language": "Portugues",
              "proficiency": "Native"
            }
          ],
          "work": [
            {
              "company": "Google",
              "position": "Back End Developer",
              "country": {
                "_id": "6266ade914b7ac7f7bb388b5",
                "name": "United States"
              },
              "state": {
                "_id": "6266ade914b7ac7f7bb388b6",
                "name": "California"
              },
              "city": {
                "_id": null,
                "name": "Orange County"
              },
              "email": "info@google.com",
              "website": "https://google.com",
              "phone": {
                "code": "+1",
                "number": "22 2222 22222"
              },
              "start_date": 1619360277,
              "end_date": 1635171477,
              "active": false,
              "notes": "I was in charge of Google Chat"
            },
            {
              "company": "Resultier",
              "position": "Full Stack Developer",
              "country": {
                "_id": "6266ade914b7ac7f7bb388b9",
                "name": "United States"
              },
              "state": {
                "_id": "6266ade914b7ac7f7bb388ba",
                "name": "Idaho"
              },
              "city": {
                "_id": null,
                "name": "Idaho Falls"
              },
              "email": "info@resultier.com",
              "website": "https://resultier.com",
              "phone": {
                "code": "+1",
                "number": "12 2333 3343"
              },
              "start_date": 1635171477,
              "end_date": null,
              "active": true,
              "notes": "I am in charge of backend development for multiple projects"
            }
          ],
          "education": [
            {
              "insitution": "Miami College",
              "degree": "Full Stack Developer",
              "field": "Computer science",
              "country": {
                "_id": "6266ade914b7ac7f7bb388bd",
                "name": "United States"
              },
              "state": {
                "_id": "6266ade914b7ac7f7bb388be",
                "name": "Miami"
              },
              "city": {
                "_id": null,
                "name": "Key Bay"
              },
              "email": "info@mcollege.com",
              "website": "https://mcollege.com",
              "phone": {
                "code": "+1",
                "number": "12 2333 3343"
              },
              "start_date": 1619360277,
              "end_date": 1635171477,
              "active": false,
              "notes": "I learnt a lot"
            }
          ],
          "public": false
        }
      ],
      "pagination": {
        "page": 1,
        "last_page": 1
      }
    }
  }
}
```

#### Save/Update user curriculum

Request

```graphql
mutation {
  saveUserCurriculum(
    curriculum: {
      first_name: "Franco",
      last_name: "Altuna",
      about: "Full Stack Developer",
      email: "francoa@resultier.com",
      phone: {
        code: "+55"
        number: "13 98210 1222"
      },
      linkedin: "FranAlt",
      profession: {
        name: "Surgeon"
      },
      industry: {
        name: "Medical"
      },
      country: {
        name: "Argentina"
      },
      state: {
        name: "Buenos Aires"
      },
      city: {
        name: "San Isidro"
      },
      zip: "10055-110",
      skills: [{
        skill: "Blogger",
        proficiency: "High"
      }],
      languages: [{
        language: "Portugues",
        proficiency: "Native"
      }],
      references: [{
        name: "Pedro Picapiedra",
        position: "CEO",
        email: "pedro@resultier.com",
        phone: {
          code: "+55"
          number: "13 98210 1222"
        }
      }],
      request_references: true,
      work: [{
        company: "Resultier",
        position: "Full Stack Developer",
        country: {
          name: "United States"
        },
        state: {
          name: "Idaho"
        },
        city: {
          name: "Idaho Falls"
        },
        website: "https://resultier.com",
        email: "info@resultier.com",
        phone: {
          code: "+1",
          number: "12 2333 3343"
        },
        start_date: 123,
        end_date: 123,
        active: false,
        notes: "I was in charge of software"
      }],
      education: [{
        insitution: "Idaho College",
        degree: "Full Stack Developer",
        field: "Computer science",
        country: {
          name: "United States"
        },
        state: {
          name: "Idaho"
        },
        city: {
          name: "Idaho Falls"
        },
        website: "https://idahocollege.com",
        email: "info@idahocollege.com",
        phone: {
          code: "+1",
          number: "12 2333 3343"
        },
        start_date: 123,
        end_date: 123,
        active: false,
        notes: "I learnt a lot"
      }],
      public: true
    }
  ) {
    _id
    first_name,
    last_name,
    about
  }
}
```

Response

```json
{
  "data": {
    "saveUserCurriculum": {
      "_id": "6266a6f93fa011ea7b99eb45",
      "first_name": "Franco",
      "last_name": "Altuna",
      "about": "Full Stack Developer"
    }
  }
}
```

#### Delete user curriculum

Request

```graphql
mutation {
  deleteUsercurriculum(
    _id: "6266a6f93fa011ea7b99eb45"
  )
}
```

Response

```json
{
  "data": {
    "deleteUsercurriculum": "Deleted user curriculum"
  }
}
```