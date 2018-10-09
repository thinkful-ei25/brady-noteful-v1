//create an Express Middleware function which logs:
  // Current Date
  //Request method 
  //request url


const requestLogger = (function(req, res, next) {
  const now = new Date();
  console.log(`${now.toLocaleDateString()} ${now.toLocaleTimeString()} ${req.method} ${req.url}`);
  next();
});

module.exports = {requestLogger};