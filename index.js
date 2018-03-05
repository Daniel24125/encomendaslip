var express = require('express');
var cookieParser = require("cookie-parser")
var bodyParser = require("body-parser");
var path = require("path");
var encomendas = require("./routes/encomendas");
var reserva = require("./routes/reserva");
var projects = require("./routes/gestao.js");
var dashboard = require("./routes/dashboard.js");
var auth = require("./middleware/auth");
var app = express();


app.set("port", (process.env.PORT || 3000));

// Body Parser Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false
}));
app.use(auth.router);

app.get('*', function(req, res, next){

   if(req.path.includes('log')){
    next();
   }else{
      auth.isAuthenticated(req, res, next);
   }
});

// Get Static Path
app.use(express.static(path.join(__dirname, "public")));
app.use("/", encomendas);
app.use("/", reserva);
app.use("/", projects)
app.use("/", dashboard)


app.listen(app.get("port"), function() {
  console.log("App is listenning o port 3000");
});
