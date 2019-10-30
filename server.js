const express = require('express'); // importing a CommonJS module
const helmet = require('helmet');

const hubsRouter = require('./hubs/hubs-router.js');

const server = express();

//Custom middleware
function dateLogger( req, res, next ){
  console.log(new Date().toISOString());

  next();
}

function methodLogger(req, res, next) {
  console.log(`Method: ${req.method} - URL: ${req.originalUrl}`)
  next()
}

//global middleware
server.use(helmet()); // 3rd party
server.use(express.json()); //built in
server.use(dateLogger);//Custom middleware
server.use(methodLogger);

server.use('/api/hubs', hubsRouter);

server.get('/', (req, res) => {
  const nameInsert = (req.name) ? ` ${req.name}` : '';

  res.send(`
    <h2>Lambda Hubs API</h2>
    <p>Welcome${nameInsert} to the Lambda Hubs API</p>
    `);
});

module.exports = server;

