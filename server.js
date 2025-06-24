require('dotenv').config();

const express = require('express');
const cookieParser = require('cookie-parser');

const app = express();
const path = require('path');
const errorHandler = require("./middleware/errHandler");
const corsOptions = require('./config/corsOptions');
const homeRouter = require('./routes/homeRouter');
const employeeRouter = require('./routes/api/employeeRouter');
const registerRouter = require('./routes/registerRouter');
const authRouter = require('./routes/authrouter');
const { logger } = require("./middleware/logEvents");
const verifyJWT = require('./middleware/verifyJWT');
const cors = require('cors');

const port = process.env.PORT || 3000;

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cookieParser())
app.use('/', express.static(path.join(__dirname, '/public')));
app.use('/subdir', express.static(path.join(__dirname, '/public')));

app.use(cors(corsOptions));
app.use(logger);
app.use(require('./middleware/credentials'))

// routes
app.use('/', homeRouter);
app.use('/register', registerRouter);
app.use('/auth', authRouter);
app.use('/refresh',require('./routes/refreshRouter'))
app.use('/logout',require('./routes/logoutRouter'))

// api routes
app.use('/api/employee', verifyJWT, employeeRouter);

// 404 handler
app.all(/^\/.*/, (req, res) => {
  res.status(404);
  if (req.accepts("html"))
    res.sendFile(path.join(__dirname, "views", "404.html"));
  else if (req.accepts("json"))
    res.send({ error: "404 Not Found" });
  else
    res.type("txt").send("404 Not Found");
});

app.use(errorHandler);

app.listen(port, () => {
  console.log('server running');
});



















/*const http = require('http')
const port=3000

const server = http.createServer((req,res)=>{
    if(req.url==='/'&& req.method=="GET"){
        res.writeHead(200,{'content-type':'text/plain'})
        res.end('Hello world')
   }
    else{
        res.writeHead(404,{'content-type':'text/plain'})
        res.end('404 error')
    }
}) 
server.listen(port,()=>{
    console.log("server running")
})*/