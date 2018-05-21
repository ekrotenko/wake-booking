const request = require('request-promise');

module.exports = async (method, url, qs = {}, form = {}) => {
  const options = {
    method,
    url,
    form,
    qs,
    json: true,
    resolveWithFullResponse: true,
    followRedirect: true,
    followAllRedirects: true,
    simple: false
  };

  return await request(options);
};
