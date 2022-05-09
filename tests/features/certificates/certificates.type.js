export const addCertificateMutation = `
mutation {
  certificate(input: { 
    name: "Test"
    header: {
      company_name: "test-company"
      company_email: "company@test.com"
      company_slogan: "test-slogan"
      country: {
        name: "United States"
        alpha2Code: "US"
      }
      company_address: "test-address"
      company_city: "NY"
      company_state: "NY"
      company_phone: "12345678"
    }
    signature: {
      is_display_signature: true
      signer: "test-signer"
    }
    providers: {
      is_display_provider_logo: true
      providers: [
        {
          affiliation: "test-ADHA"
        }
      ]
    }
    additional_images: {
      is_display_assets: true
    }
    additional_info: {
      file_complaints: "test-files"
      disclaimer_statement: "test-disclaimer"
    }
  }) {
    _id
  }
}
`;

export const getCertificatesQuery = `
query {
  certificates,
  {
    certificates {
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
      total_issued_certificates
    },
    pagination {
      page,
      last_page
    }
  }
}
`;

export const certificates = [
  {
    header: {
      company_name: "test-company",
      company_email: "company@test.com",
      company_slogan: "test-slogan",
      country: {
        name: "United States",
        alpha2Code: "US",
      },
      _address: "test-address",
      company_city: "NY",
      company_state: "NY",
      company_phone: "12345678",
    },
    signature: {
      is_display_signature: true,
      signer: "test-signer",
    },
    providers: {
      is_display_provider_logo: true,
      providers: [
        {
          affiliation: "test-ADHA",
        },
      ],
    },
    additional_images: {
      is_display_assets: true,
    },
    additional_info: {
      file_complaints: "test-files",
      disclaimer_statement: "test-disclaimer",
    },
  },
];

export function getCertificateQuery(_id) {
  return `
    query {
        certificate(_id: "${_id}") {
            _id
            header {
                _id
                company_logo {
                    name
                    size
                }
                company_name
                company_email
                company_slogan
                country {
                    name
                    alpha2Code
                }
                company_address
                company_city
                company_state
                company_phone
            }
            signature {
                _id
                is_display_signature
                signature {
                    name
                    size
                }
                signer
            }
            providers {
                _id
                is_display_provider_logo
                providers {
                    _id
                    affiliation
                }
            }
            additional_images {
                _id
                is_display_assets
                images {
                    name
                    size
                }
            }
            additional_info {
                _id
                file_complaints
                disclaimer_statement
            }
        }
    }    
    `;
}

export function updateCertificateMutation(id) {
  return `
    mutation {
        certificate(input: {
            _id: "${id}"
            header: {
                company_name: "test-company",
                company_email: "company@test.com",
                company_slogan: "test-slogan",
                country: {
                name: "United States",
                alpha2Code: "US",
                },
                company_address: "test-address",
                company_city: "NY",
                company_state: "NY",
                company_phone: "12345678",
            },
            signature: {
                is_display_signature: true,
                signer: "test-signer",
            },
            providers: {
                is_display_provider_logo: true,
                providers: [
                {
                    affiliation: "test-ADHA",
                },
                ],
            },
            additional_images: {
                is_display_assets: true,
            },
            additional_info: {
                file_complaints: "test-files",
                disclaimer_statement: "test-disclaimer",
            },
        }) {
            _id
        }
    }
  `;
}
