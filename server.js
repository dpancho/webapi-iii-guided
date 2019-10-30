const express = require('express'); // importing a CommonJS module
const helmet = require('helmet');
const morgan = require('morgan');

const hubsRouter = require('./hubs/hubs-router.js');

const server = express();

//Custom middleware
function dateLogger( req, res, next ){
  console.log(new Date().toISOString());
  next();
}

function logger(req, res, next) {
  console.log(`The Logger: [${new Date().toISOString()}] ${req.method} to ${req.url}`)
  next()
}

function gateKeeper(req, res, next) {
  // data can come in the body, url parameters, query string, headers
  // new way of reading data sent by the client
  const password = req.headers.password || '';
  if(password.toLowerCase().length === 0){
    res.status(400).json({ message: "Please enter a password" })
  }else if (password.toLowerCase() === 'mellon') {
    next();
  } else {
    res.status(401).json({ you: 'cannot pass!!' });
  }
}

//global middleware
server.use(gateKeeper);
server.use(helmet()); // 3rd party
server.use(express.json()); //built in
// server.use(dateLogger);//Custom middleware
server.use(logger);
server.use(morgan('dev'));

server.use('/api/hubs', hubsRouter);

server.get('/', (req, res) => {
  const nameInsert = (req.name) ? ` ${req.name}` : '';

  res.send(`
    <h2>Lambda Hubs API</h2>
    <p>Welcome${nameInsert} to the Lambda Hubs API</p>
    `);
});

module.exports = server;

