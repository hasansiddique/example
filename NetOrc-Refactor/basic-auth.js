const basicAuth = require('basic-auth');

const isUnauthorized = credentials => !credentials || !credentials.name || !credentials.pass;

const isAuthorized = (user, credentials) => user.name === credentials[0] && user.pass === credentials[1];

module.exports = (req, res, next) => {
  const user = basicAuth(req);
  const credentials = 'netorc:VPNSaaService'.split(':');

  const unauthorized = () => {
    res.set('WWW-Authenticate', 'Basic realm=Authorization Required');
    res.sendStatus(401).end();
  };

  if (isUnauthorized(user)) {
    unauthorized();
  } else {
    if (isAuthorized(user, credentials)) {
      next();
    } else {
      unauthorized();
    }
  }
};
