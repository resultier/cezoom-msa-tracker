export const companyDocuments = [
  {
    user_name: "test-name",
    note: "test-note",
    is_accesible: true,
    status: "read",
    published_date: 1,
  },
];

export const getCompanyDocumentsQuery = `
    query {
        companyDocuments {
            company_id
            documents {
                id
                user_name
                note
                attachment {
                    name
                    size
                    type
                    path
                    alias
                }
                is_accesible
                status
                published_date
            }
        }
    }
`;

export const getCompanyDocumentQuery = (documentId) => {
  return `
        query {
            companyDocument(id: "${documentId}") {
                company_id
                documents {
                    id
                    user_name
                    note
                    attachment {
                        name
                        size
                        type
                        path
                    }
                    is_accesible
                    status
                    published_date
                    replies {
                        id
                    }
                }
            }
        }
    
    `;
};

export const addCompanyDocumentMutation = `
    mutation {
        addCompanyDocument(
            input: {
                note: "test-note"
                is_accesible: false
                status: read
            }
        ) {
            company_id
            documents {
                id
                user_name
                note
                attachment {
                    name
                    size
                    type
                    path
                }
                is_accesible
                status
                published_date
            }
        }
    }
`;

export const addCompanyDocumentReplyMutation = (documentId) => {
  return `
    mutation {
        addCompanyDocumentReply(
            document_id: "${documentId}"
            reply: {
                note: "test-reply"
                is_accesible: true
                status: unread
            }
        ) {
            company_id
            documents {
                id
                user_name
                note
                attachment {
                    name
                    size
                    type
                    path
                }
                is_accesible
                status
                published_date
                replies {
                    id
                }
            }
        }
    }
    `;
};

export const updateCompanyDocumentMutation = (documentId) => {
  return `
    mutation {
        updateCompanyDocument(
            id: "${documentId}"
            input: {
                note: "test-note"
                is_accesible: true
                status: unread
            }
        ) {
            company_id
            documents {
                id
                user_name
                note
                attachment {
                    name
                    size
                    type
                    path
                }
                is_accesible
                status
                published_date
            }
        }
    }
    `;
};

export const deleteCompanyDocumentMutation = (documentId) => {
  return `
    mutation {
        deleteCompanyDocument(id: "${documentId}") {
            company_id
            documents {
                id
                user_name
                note
                is_accesible
                status
                published_date
            }
        }
    }    
    `;
};
