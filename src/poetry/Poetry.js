function Poetry(optsIn){
	var thisPoet = this;

	this.tileStore = {};
	this.protectedElems = optsIn.protectedElems || [];

	this.links = optsIn.links || {};

	this.events = new EventManager({
		self: thisPoet,
		events: {
			loadTiles: function(evt,data){
				for (thisId in data) {
					if(data.hasOwnProperty(thisId)){
						thisPoet.storeTile(data[thisId]);
					};
				};
				thisPoet.renderTiles();
			},
			delTiles: function(evt,data){
				for(delId in data){
					if(data.hasOwnProperty(delId)){
						thisPoet.tile[delId].unRender();
						delete thisPoet.tile[delId];
					};
				};
			}
		}
	});

	this.connection = new Connection({
		websocket: true,
		events: {
			disconnect: function(){
				console.log('server disconnected!');
			},
			posUpdate: function(evt,data){
				thisPoet.tileStore[data.id].updatePosition(data);
				console.log('PosUpdate Recieved for id '+data.id+' at  ['+data.x+','+data.y+']');
			},
			pick: function(evt,data){
				thisPoet.tileStore[data.id].grayOut();
				console.log('Pick Recieved for id '+data.id);
			},
			drop: function(evt,data){
				thisPoet.tileStore[data.id].ungrayOut();
				console.log('Drop Recieved for id '+data.id);
			},
			loadTiles: function(evt,data){
				console.log('Tiles Recieved');
				thisPoet.eventCall('loadTiles',data);
			},
			delTiles: function(evt,data){
				console.log('Delete tile received for id '+data.id);
				thisPoet.eventCall('delTiles',data);
			}
		}
	});


	this.storeTile = function(tileIn){
		if(tileIn instanceof Tile){
			thisPoet.tileStore[tileIn.id] = tileIn;
		}
		else{
			thisPoet.tileStore[tileIn.id] = new Tile(tileIn);
		}

		var currTile = thisPoet.tileStore[tileIn.id];

		//bind general callbacks
		for(evtName in currTile.events.events){
			currTile.on(evtName,function(evt,tile){
				thisPoet.connection.update(evt,tile);
			});
		}

		//bind link callback
		if( this.links[currTile.word] instanceof Function ) {
			console.log('registering link function for link ' + currTile.word);
			currTile.on('dblClick', this.links[currTile.word]);
		}
		else{
			console.log('creating link function for link '+ currTile.word);
			currTile.on('dblClick', function(evt,data){
				console.log( '!!!!!!!LINKCALLBACK '+data.word );
				window.open( thisPoet.links[data.word] ? thisPoet.links[data.word] : '' );
			});
		}
	};

	this.renderTiles = function(){
		for (var tileId in this.tileStore) {
			if(thisPoet.tileStore.hasOwnProperty(tileId)){
					console.log("rendering tile "+thisPoet.tileStore[tileId].word);
					thisPoet.tileStore[tileId].render();
			}
		};
	};

	this.checkCollisions = function(tile){
		//todo: check for collisions with other HTML elements
	};

	this.serverLoadFailTiles = function(){
		var failPrefix = 'fail-poetry-id-';

		if($('[id^='+failPrefix+']').length === 0){
			var words = ['these','with','play','still','can','you','but','failed','server','from','tiles','loading']

			var tempTile = {
				id: 0,
				word: '',
				coord: {
					x: 200,
					y: 300
				},
				css: {
					idPrefix: failPrefix
				}
			};

			for (var i = words.length - 1; i >= 0; i--) {
				tempTile.word = words[i];
				tempTile.id = 500+i;
				tempTile.coord.y = (i%2 === 0 ? 400 : 395 );

				this.storeTile(tempTile);
				tempTile.coord.x += words[i].length*7;
			};
		};
	};

	this.connection.loadTiles();

	return this;
};
