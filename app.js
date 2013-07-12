
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , user = require('./routes/user')
  , http = require('http')
  , path = require('path');

var QRCode = require("qrcode");
var Barc = require("barc");

var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}


var Canvas = require('canvas')
  , canvas = new Canvas(600,100)
  , Image = Canvas.Image
  , ctx = canvas.getContext('2d');

app.get('/', function(req, res){
	var barc = new Barc();
	var buf = barc.code128('123456',600,100);
	var img = new Image;
	img.src = buf;
	ctx.drawImage(img, 0,0,img.width, img.height);
	canvas.toDataURL('image/png', function(err, url){
		res.send("<img src='"+url+"'>");
	});
	
	//~ QRCode.toDataURL("Hello,World.", function(err, url){
		//~ console.log(url);
		//~ res.send("<img style='border:10px solid pink;' src='"+url+"'>");
	//~ });
	
	//~ res.send('Generated');
	
});
app.get('/users', user.list);

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
