var fs = require('fs');

class PoetryServer {
	constructor(props){
		this.tiles = {};
		this.dataFile = props.file || './data.json';
		this.socket = props.socket;
		this.writeInterval = props.writeInterval;

		this.readData();
		this.bindMethods();

		this.socket.on('connection', (sock) => {
			console.log("client connected");

			sock.on('update', (update) => {
			  	if(this.hasOwnProperty(update.type)){
			  		pserve[update.type](update.data, sock);
			  	};
			  	console.log(update);
			});
		});

		if(this.writeInterval > 0){
			setInterval(this.writeData,this.writeInterval);
		}
	}

	bindMethods(){

	}

	posUpdate(data){
		if( (typeof data.id !== 'undefined') && data.x && data.y){
			if (this.tiles.hasOwnProperty(data.id)) {
				data.x = parseInt(data.x) > 0 ? data.x : '5px';
				data.y = parseInt(data.y) > 0 ? data.y : '5px';

				this.tiles[data.id].coord.x = data.x;
				this.tiles[data.id].coord.y = data.y;

				this.socket.emit('update', {
					type: 'posUpdate',
					data: data
				});
			};
		}
	};

	loadTiles(data,sock){
		this.socket.emit('update', {
			type: 'loadTiles',
			data: this.tiles
		});
	};

	pick(data){
		if (typeof data.id !== 'undefined'){
			this.socket.emit('update', {
				type: 'pick',
				data: data
			});
		}
	};

	drop(data){
		if (typeof data.id !== 'undefined'){
			this.socket.emit('update', {
				type: 'drop',
				data: data
			});
		}
	};

	readData(){
		fs.readFile(this.dataFile, (err, data) => {
			if (err){
				console.log("Error reading file!");
			}
			else{
				this.tiles = JSON.parse(data);
				console.log("File read");
				console.log(this.tiles);
			}
		})
	}

	writeData(){
		fs.writeFile(this.dataFile, JSON.stringify(this.tiles, null, '\t'), (err) => {
			if (err){
				console.log("Error saving file!");
			}
			else{
				console.log("File updated");
			}
		});
	}

	addTile(word){
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

		this.socket.emit('update', {
			type: 'loadTiles',
			data: tempData
		});

	}


	removeTile(word){
		if(!word){
			return false;
		}

		for(delId in this.tiles){
			if(this.tiles[delId].word === word ){
				var tempStore = {};

				var delData = {};
				delData[delId] = this.tiles[delId];

				console.log("deleting tile with id "+delId+" and word "+word);
				this.socket.emit('update', {
					type: 'delTiles',
					data: delData
				});

				for(copyId in this.tiles){
					if( this.tiles.hasOwnProperty(copyId) && (copyId !== delId) ){
						tempStore[copyId] = this.tiles[copyId];
					}
				}

				delete this.tiles[delId];
				this.tiles = tempStore;

				break;
			}
		}
	}
}

module.exports = PoetryServer;
