require('babel/register')({
  optional: ["es7.comprehensions"]
});
require('./server/app');
