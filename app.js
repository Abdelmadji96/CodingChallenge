"use strict";

var SwaggerExpress = require("swagger-express-mw");
var app = require("express")();
var cors = require("cors");
module.exports = app; // for testing
app.use(cors());

var http = require('http');
var config = {
  appRoot: __dirname
  // required config
};


// Basic Setup new express

SwaggerExpress.create(config, function(err, swaggerExpress) {
    if (err) { throw err; }
    // install middleware
    swaggerExpress.register(app);
    var port = process.env.PORT || 10000;
    http.createServer(app).listen(port, function() {
     console.log('Server started @ %s!', port);
    });
 if (swaggerExpress.runner.swagger.paths["/hello"]) {
    console.log(
      "try this:\ncurl http://127.0.0.1:" + port + "/hello?name=Scott"
    );
  }
});
