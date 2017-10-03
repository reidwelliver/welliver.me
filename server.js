//server.js
var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var webpack = require('webpack');
var WebpackDevServer = require('webpack-dev-server');
var config = require('./webpack.config');
var PoetryServer = require('./server/NewPoetryServer')

var namespaceSock = io.of('/poetry');



new WebpackDevServer(webpack(config), {
    publicPath: config.output.publicPath,
    hot: true,
    historyApiFallback: true,
    quiet: false,
    noInfo: false,
    stats: {
      assets: false,
      colors: true,
      version: false,
      hash: false,
      timings: false,
      chunks: false,
      chunkModules: false
    }
}).listen(4200, '0.0.0.0', function (err) {
    if (err) {
        console.log(err);
    }

  console.log('Listening at 0.0.0.0:4200');
});


pserve = new PoetryServer({socket:namespaceSock});

http.listen(1337, function(){
  console.log('listening on localhost:1337');
});



/*
function parseWord(inString){
	var firstSpace = inString.indexOf(' ');
	var secondSpace = inString.indexOf(' ',firstSpace+1);
	secondSpace = secondSpace > -1 ? secondSpace : inString.length;

	return inString.slice(firstSpace+1, secondSpace);
}

process.stdin.resume();
process.stdin.setEncoding('utf8');

process.stdin.on('data', function(text) {
    text = text.replace(/(\r\n|\n|\r)/gm,'');

    if (text.indexOf('newtile') > -1) {
    	pserve.addTile(parseWord(text));
    }
    else if(text.indexOf('deltile') > -1){
    	pserve.removeTile(parseWord(text));
    }
    else{
    	console.log('"'+text+'" is not a known action');
    }
  });
*/
