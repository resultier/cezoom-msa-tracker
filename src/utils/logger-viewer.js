const fs = require("fs");
const path = require("path");

const loggerViewer = async function (res) {
  fs.readFile(path.join("logs/error.log"), "utf8", (err, data) => {
    if (err) {
      console.error(err);
      return [];
    }
    logs = [];
    const logsObj = data.split("\n");
    logsObj.splice(-1, 1);

    logsObj.map(function (obj) {
      const parsed = JSON.parse(obj);
      logs.push(parsed);
    });

    res.json(logs);
  });
};

module.exports = loggerViewer;