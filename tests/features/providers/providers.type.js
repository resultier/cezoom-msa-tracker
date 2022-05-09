export const providers = [
  {
    country: {
      name: "test-country",
    },
    industry: {
      name: "test-industry",
    },
    affiliation: "test-affiliation",
    affiliation_logo: null,
    affiliation_start_date: 1,
    affiliation_end_date: 2,
    disclaimer: "test-disclaimer",
  },
];

export const addProviderMutation = `
    mutation {
        addProvider(
            input: {
                country: { name: "test-country" }
                industry: { name: "test-industry" }
                affiliation: "test-affiliation"
                affiliation_start_date: 1
                affiliation_end_date: 2
                disclaimer: "test-disclaimer"
            }
        ) {
            _id
            user_id
            providers {
                _id
                country {
                    _id
                    name
                }
                industry {
                    _id
                    name
                }
                affiliation
                affiliation_logo {
                    name
                    size
                    type
                }
                affiliation_start_date
                affiliation_end_date
                disclaimer
            }
        }
    }
`;

export const getProvidersQuery = `
    query {
        providers {
            _id
            country {
                _id
                name
            }
            industry {
                _id
                name
            }
            affiliation
            affiliation_logo { 
                name
                size
                type
                path
            }
            affiliation_start_date
            affiliation_end_date
            disclaimer
        }
    }
`;

export const getProviderQuery = (providerId) => {
  return `
    query {
        provider(providerId: "${providerId}") {
            _id
            country {
                _id
                name
            }
            industry {
                _id
                name
            }
            affiliation
            affiliation_logo {
                name
                size
                type
                path
            }
            affiliation_start_date
            affiliation_end_date
            disclaimer
        }
    }
  `;
};

export const updateProviderMutation = (providerId) => {
  return `
    mutation {
        updateProvider(
            input: {
                id: "${providerId}"
                country: { name: "test-country" }
                industry: { name: "test-industry" }
                affiliation: "test-affiliation"
                affiliation_start_date: 1
                affiliation_end_date: 2
                disclaimer: "test-disclaimer"
            }
        ) {
            _id
            user_id
            providers {
                _id
                country {
                    _id
                    name
                }
                industry {
                    _id
                    name
                }
                affiliation
                affiliation_logo {
                    name
                    size
                    type
                }
                affiliation_start_date
                affiliation_end_date
                disclaimer
            }
        }
    }
    `;
};

export const deleteProviderMutation = (providerId) => {
  return `
    mutation {
        deleteProvider(id: "${providerId}") {
            _id
            user_id
            providers {
                _id
                country {
                    _id
                    name
                }
                industry {
                    _id
                    name
                }
                affiliation
                affiliation_logo {
                    name
                    size
                    type
                }
                affiliation_start_date
                affiliation_end_date
                disclaimer
            }
        }
    }
    `;
};
