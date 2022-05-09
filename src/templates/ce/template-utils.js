const renderProvidersLogos = (isDisplayProvider, providers = []) => {
  if (isDisplayProvider) {
    let getProviders = `<div class="builder-columns columns">`,
      count = 1;
    providers.map((provider) => {
      const { type, buffer } = provider;
      const transformLogo = `
        <div class="builder-column column-14">
            <div class="div-54">
                <img class="image-3" src="data:${type};charset=utf-8;base64,${buffer}"/>
                <div class="builder-image-sizer image-sizer-2"></div>
            </div>
        </div>
    `;
      if (count % 3 === 0)
        getProviders += `${transformLogo} </div> <div class="builder-columns columns">`;
      else getProviders += transformLogo;
      count += 1;
    });
    getProviders += `</div>`;

    return getProviders;
  } else return "";
};

const renderSignature = (isDisplaySignature, signerImage, signerTitle) => {
  if (isDisplaySignature) {
    return `
      <div class="builder-column column-12">
        <div class="div-44">
          <div class="div-45">
            <div class="div-46">
              <div class="div-47">
                <div class="div-48">Authorized Signature</div>
              </div>
            </div>
          </div>
      
          <div class="div-49">
            <img src="${signerImage}" class="image-3"/>
            <div class="builder-image-sizer image-sizer-2"></div>
          </div>
      
          <div class="div-50">
            <div class="div-51">
              <div class="builder-columns columns">
                <div class="builder-column column-13">
                  <div class="div-52">
                    <div class="katrinna-r-jackson-rdh-coo-ce">
                      ${signerTitle}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
  } else return "";
};

const renderWorkExperience = (work) => {
    return `
            <div class="row">
                    <div class="icon-container">
                      <svg xmlns="http://www.w3.org/2000/svg" class="icon-class" fill="none" viewBox="0 0 24 24"
                        stroke="currentColor" stroke-width="2">
                        <path stroke-linecap="round" stroke-linejoin="round"
                          d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                      </svg>
                    </div>
                    <div class="col-10">
                      <h3 class="personal-info-text">${work.profession}</h3>
                      <span>${work.company} | ${work.from} - ${work.to || 'Ongoing'}</span>
                    </div>
                    <div class="col-12">
                      ${work.notes}
                    </div>
                  </div>
    `;
};

const renderEducationExperience = (education) => {
    return `
            <div class="row">
                    <div class="icon-container">
                      <svg xmlns="http://www.w3.org/2000/svg" class="icon-class" fill="none" viewBox="0 0 24 24"
                        stroke="currentColor" stroke-width="2">
                        <path stroke-linecap="round" stroke-linejoin="round"
                          d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                      </svg>
                    </div>
                    <div class="col-10">
                      <h3 class="personal-info-text">${education.insitution}</h3>
                      <span>${education.degree} | ${education.from} - ${education.to || 'Ongoing'}</span>
                    </div>
                    <div class="col-12">
                      ${education.notes}
                    </div>
                  </div>
    `;
};

const renderReference = (reference) => {
    return `<div class="row">
                    <div class="icon-container">
                      <svg xmlns="http://www.w3.org/2000/svg" class="icon-class" fill="none" viewBox="0 0 24 24"
                        stroke="currentColor" stroke-width="2">
                        <path stroke-linecap="round" stroke-linejoin="round"
                          d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                      </svg>
                    </div>
                    <div class="col-10">
                      <h3 class="personal-info-text">${reference.name}</h3>
                      <span>${reference.position} | ${reference.email}</span>
                    </div>
                  </div>
    `;
};

const renderLanguage = (language) => {
    return `<div class="row">
                  <h3 class="personal-info-text">${language.language}</h3>
                  <span>${language.proficiency}</span>
                </div>
    `;
};

const renderSkill = (skill) => {
    return `<div class="row">
                <h3 class="personal-info-text">${skill.skill}</h3>
                <span>${skill.proficiency}</span>
              </div>
    `;
};



module.exports = { renderProvidersLogos, renderSignature, renderWorkExperience, renderEducationExperience, renderReference, renderLanguage, renderSkill };
