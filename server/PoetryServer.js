function PoetryServer(optsIn){
	var thisServ = this;

	optsIn = optsIn || {};

	this.tiles = {};
	this.dataFile = optsIn.file || '/var/www/serve/data.json';
	this.socket = optsIn.socket;

	this.posUpdate = function(data){
		if( (typeof data.id !== 'undefined') && data.x && data.y){
		  	if (this.tiles.hasOwnProperty(data.id)) {
		  		data.x = parseInt(data.x) > 0 ? data.x : '5px';
		  		data.y = parseInt(data.y) > 0 ? data.y : '5px';

		  		this.tiles[data.id].coord.x = data.x;
		  		this.tiles[data.id].coord.y = data.y;

		  		thisServ.socket.emit('update', {
			 		type: 'posUpdate',
			 		data: data
			 	});
		  	};
		}
	};

	this.loadTiles = function(data,sock){
	 	thisServ.socket.emit('update', {
	 		type: 'loadTiles',
	 		data: this.tiles
	 	});
	};

	this.pick = function(data){
		if (typeof data.id !== 'undefined'){
		 	thisServ.socket.emit('update', {
		 		type: 'pick',
		 		data: data
		 	});
		}
	};

	this.drop = function(data){
		if (typeof data.id !== 'undefined'){
		 	thisServ.socket.emit('update', {
		 		type: 'drop',
		 		data: data
		 	});
		}
	};

	this.readData = function(){
		fs.readFile(thisServ.dataFile, function(err, data){
			if (err){
				console.log("Error reading file!");
			}
			else{
				thisServ.tiles = JSON.parse(data);
				console.log("File read");
			}
		})
	}

	this.writeData = function(){
		fs.writeFile(thisServ.dataFile, JSON.stringify(thisServ.tiles, null, '\t'), function(err){
			if (err){
				console.log("Error saving file!");
			}
			else{
				console.log("File updated");
			}
		});
	}

	this.addTile = function(word){
		if(!word){
			return false;
		}
		var newId = Object.keys(this.tiles).length;
		var tempTile = {
			id: newId,
			word: word,
			coord: {
				x: "330px",
				y: "420px"
			},
			css: {}
		}

		console.log("adding tile with id "+newId+" and word "+word);

		this.tiles[newId] = tempTile;

		var tempData = {};
		tempData[newId] = tempTile;

		thisServ.socket.emit('update', {
			type: 'loadTiles',
			data: tempData
		});

	}


	this.removeTile = function(word){
		if(!word){
			return false;
		}

		for(delId in this.tiles){
			if(thisServ.tiles[delId].word === word ){
				var tempStore = {};

				var delData = {};
				delData[delId] = thisServ.tiles[delId];

				console.log("deleting tile with id "+delId+" and word "+word);
				thisServ.socket.emit('update', {
					type: 'delTiles',
					data: delData
				});

				for(copyId in this.tiles){
					if( this.tiles.hasOwnProperty(copyId) && (copyId !== delId) ){
						tempStore[copyId] = thisServ.tiles[copyId];
					}
				}

				delete thisServ.tiles[delId];
				thisServ.tiles = tempStore;

				break;
			}
		}
	}


	this.readData();

	//occasionally save modified tile data to file
	setInterval(this.writeData,600000);

	return this;
}
