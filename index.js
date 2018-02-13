var express = require('express');
var bodyParser = require("body-parser");
var path = require("path");
var encomendas = require("./routes/encomendas");
// var gestao = require("./routes/gestao");
// var auth = require("./middlewares/auth");
var app = express();

app.set("port", (process.env.PORT || 3000));

// Body Parser Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false
}));
// app.use(auth.router);

// app.get('*', function(req, res, next){
//    if(req.path.includes('log')){
//     next();
//    }else{
//       auth.isAuthenticated(req, res, next);
//    }
// });

// Get Static Path
app.use(express.static(path.join(__dirname, "public")));
app.use("/", encomendas);
// app.use("/gestao", gestao.router);


app.listen(app.get("port"), function() {
  console.log("App is listenning o port 3000");
});
