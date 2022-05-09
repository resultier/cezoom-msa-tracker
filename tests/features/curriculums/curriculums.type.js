export const getCurriculumsQuery = `
    query {
        userCurriculums {
            user_id
            curriculums {
                id
                name
                size
                type
                alias
                path
            }
        }
    }
`;

export function deleteCurriculumMutation(curriculumId) {
  return `
    mutation {
        deleteCurriculum(id: "${curriculumId}") {
            user_id
            curriculums {
                id
                name
                size
                type
                alias
                path
            }
        }
    }    
    `;
}

export const curriculums = [
  {
    file_id: "file-id",
  },
];
