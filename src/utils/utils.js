const jwt = require("jsonwebtoken");
const fs = require("fs");
const { JWT_SECRET, USER_URL } = require("../utils/constants");
const logger = require("../configs/logs/logger");
const auth = require("auth-middleware");

const PATH = USER_URL + "/api/v1/verify/auth";

const chunk = function (array, chunkSize) {
  var R = [];
  for (var i = 0; i < array.length; i += chunkSize)
    R.push(array.slice(i, i + chunkSize));
  return R;
};

const verifyToken = function (token) {
  try {
    const tokenParsed = token.replace("Bearer ", "").trim();
    const decoded = jwt.verify(tokenParsed, JWT_SECRET, {
      algorithms: ["HS256"],
    });
    if (decoded.company) {
      decoded.data.company = decoded.company;
    }
    return decoded.data;
  } catch (error) {
    logger.error(error);
    throw Error("Invalid token provided");
  }
};

const verifyIntegrationToken = function (token) {
  try {
    const tokenParsed = token.replace("Bearer ", "").trim();
    const decoded = jwt.verify(tokenParsed, JWT_SECRET, {
      algorithms: ["HS256"],
    });
  } catch (error) {
    logger.error(error);
    throw Error("Invalid token provided");
  }
};

const verifyAuth = async function (token) {
  const res = await auth.default(token, PATH);

  if (!res.success) {
    logger.error({
      code: res.error.response.status,
      message: res.error.response.data,
    });
    throw Error();
  }

  return res.user;
};

const addDates = (
  params = {
    is_granted_extension,
    extended_date,
    expiration_date,
    years_duration,
    month_duration,
    days_duration,
  }
) => {
  let addedDate;
  if (params.is_granted_extension && params.extended_date) {
    addedDate = params.extended_date;
  } else if (
    params.is_granted_extension &&
    (params.years_duration || params.month_duration || params.days_duration)
  ) {
    const extendedDate = new Date(params.expiration_date * 1000);
    extendedDate.setFullYear(
      extendedDate.getFullYear() +
        (params.years_duration ? params.years_duration : 0),
      extendedDate.getMonth() +
        (params.month_duration ? params.month_duration : 0),
      extendedDate.getDate() + (params.days_duration ? params.days_duration : 0)
    );
    addedDate = extendedDate.getTime() / 1000;
  }

  return addedDate;
};

const generateCurriculumAlias = () => {
  const date = Math.round(new Date().getTime() / 1000);
  const randomName = (Math.random() + 1).toString(36).substring(5);

  return `${date}-${randomName}`;
};

const convertFile = (file) => {
  const { path, name, size, type } = file;
  return {
    buffer: fs.readFileSync(path).toString("base64"),
    name,
    size,
    type,
  };
};

const isActualDateGreater = function (date) {
  const actualDate = Math.round(new Date().getTime() / 1000);
  const compareDate = new Date(date).getTime();
  return actualDate >= compareDate;
};

const getProviderValidState = function (
  filterState,
  { is_active, expiration_date, start_date }
) {
  if (!filterState) return true;
  switch (filterState) {
    case "active":
      return is_active;
    case "expired":
      return isActualDateGreater(expiration_date);
    case "upcoming":
      return !isActualDateGreater(start_date) && is_active;
    default:
      return false;
  }
};

module.exports = {
  chunk,
  verifyToken,
  verifyAuth,
  addDates,
  generateCurriculumAlias,
  convertFile,
  isActualDateGreater,
  getProviderValidState,
  verifyIntegrationToken
};
