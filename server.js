const restify = require('restify');
const mongoose = require("mongoose");
const config = require('./config');
const rjwt = require('restify-jwt-community');

const server = restify.createServer();

//middleware
server.use(restify.plugins.bodyParser());

//protect routes
server.use(rjwt({secret: config.JWT_SECRET}).unless({path: ['/auth','/register'] }));


server.listen(config.PORT, () =>{
    mongoose.connect(config.MONGODB_URI,{useNewUrlParser: true});
});

const db = mongoose.connection;
db.on('error', err => console.log(err));
db.once('open',  () =>{
    require("./routes/customers")(server);
    require("./routes/users")(server);
    console.log(`server started on ${config.PORT}`);
});