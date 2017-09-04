/*
 *
 * One logical tile
 *
 */
function Tile( optsIn ){
	optsIn = optsIn || {};
	var thisTile = this;

	if(!window.jQuery){
		console.log('jQuery not available in current scope!');
	}

	this.id = optsIn.id;
	this.word = optsIn.word || 'the' ;
	optsIn.coord = optsIn.coord || {};
	this.coord = {
		x: optsIn.coord.x || 5,
		y: optsIn.coord.y || 5
	};

	this.state = {
		active: false
	}

	optsIn.css = optsIn.css || {};
	this.css = {
		zIndex: optsIn.css.zIndex || 900,
		tileClass: optsIn.css.tileClass || 'poetry-tile',
		wordClass: optsIn.css.wordClass || 'poetry-word',
		idPrefix: optsIn.css.idPrefix  || 'poetry-id-'
	};

	this.rootElem = optsIn.rootElem || 'body';
	this.elem = null;

	optsIn.events = optsIn.events || {};
	this.events = new EventManager({
		self: thisTile,
		events: {
			posUpdate: false,
			pick: function(evt,data){
				thisTile.state.active = true;
				thisTile.togglePosTracking();
				thisTile.grayOut();
			},
			drop: function(evt,data){
				//ensure the position is updated before any drop events
				var updates = thisTile.elem.css(['top','left']);
				thisTile.coord.x = updates.left || thisTile.coord.x;
				thisTile.coord.y = updates.top  || thisTile.coord.y;
				thisTile.ungrayOut();
				thisTile.togglePosTracking();
				thisTile.state.active = false;
			}
		}
	});

	this.posTrackIntervalId = -1;


	this.render = function(){
		this.elem = $('#'+this.css.idPrefix+this.id);
		if ( this.elem.length === 0 ) {
			//we haven't created this element yet
			$(this.rootElem).append('<div id="'+this.css.idPrefix+this.id+'" class="'+this.css.tileClass+'"><p class="'+this.css.wordClass+'">'+this.word+'</p></div>');
			this.elem = $('#'+this.css.idPrefix+this.id);
			this.elem.css({position: 'fixed'});
			this.elem.draggable({zIndex: this.css.zIndex}).dblclick(function(){
				thisTile.eventCall('dblClick', thisTile);
			});

			this.elem.on('dragstop', function(evt,ui){
				thisTile.eventCall('drop', thisTile);
				thisTile.eventCall('posUpdate', thisTile);
			});

			this.elem.on('dragstart',function(evt,ui){
				thisTile.eventCall('pick', thisTile);
			});
		}

		//update position
		this.elem.css({top: this.coord.y, left: this.coord.x});

		return this.elem;
	};

	this.togglePosTracking = function(){
		if(this.posTrackIntervalId === -1){
			this.posTrackIntervalId = setInterval(this.trackPosition, 100);
		}
		else{
			clearInterval(this.posTrackIntervalId);
			this.posTrackIntervalId = -1;
		}
	}

	this.trackPosition = function(){
		var updates = thisTile.elem.css(['top','left']);
		if(Math.abs(parseInt(updates.top)-parseInt(thisTile.coord.y)) > 10 || Math.abs(parseInt(updates.left)-parseInt(thisTile.coord.x)) > 10){
			thisTile.coord.x = parseInt(updates.left) > 0 ? updates.left : '5px';
			thisTile.coord.y = parseInt(updates.top) > 0 ? updates.top : '5px';
			thisTile.eventCall('posUpdate',thisTile);
		}
	}

	this.updatePosition = function(coord){
		if(!this.state.active){
			this.coord.x = coord.x;
			this.coord.y = coord.y;
			this.elem.animate({top: this.coord.y, left: this.coord.x}, 50);
		}
	};

	this.grayOut = function(){
		this.elem.draggable( 'disable' );
		this.elem.addClass( 'poetry-disable' );
	};

	this.ungrayOut = function(){
		this.elem.draggable( 'enable' );
		this.elem.removeClass( 'poetry-disable' );
	};

	this.toSendable = function(){
		return {
			id: this.id,
			x: this.coord.x,
			y: this.coord.y
		};
	};

	this.unRender = function(){
		this.elem.remove();
	}

	return this;
};



/*
 *
 * Event Manager
 *
 */
function EventManager(optsIn){
	optsIn = optsIn || {};
	var self = optsIn.self || false;
	var thisEvtMan = this;

	optsIn.events = optsIn.events || {};
	this.events = {};
	for(evt in optsIn.events){
		if(optsIn.events.hasOwnProperty(evt)){
			this.events[evt] = {def: optsIn.events[evt], doDef: true, add: []};
		}
	}

	//event adder
	this.on = function(evt,func){
		if (thisEvtMan.events.hasOwnProperty(evt)){
			thisEvtMan.events[evt].add.push(func);
			return (thisEvtMan.events[evt].add.length - 1);
		};
		return false;
	};

	this.setDefault = function(evt,func){
		if (thisEvtMan.events.hasOwnProperty(evt)){
			thisEvtMan.events[evt].def = func;
			return true;
		};
		return false;
	};

	this.preventDefault = function(evt){
		if (thisEvtMan.events.hasOwnProperty(evt)){
			thisEvtMan.events[evt].doDef = false;
		}
	}

	this.enableDefault = function(evt){
		if (thisEvtMan.events.hasOwnProperty(evt)){
			thisEvtMan.events[evt].doDef = true;
		}
	}

	//event caller
	this.eventCall = function(evt,data){
		if (thisEvtMan.events.hasOwnProperty(evt)){
			if(thisEvtMan.events[evt].def && thisEvtMan.events[evt].doDef){
				thisEvtMan.events[evt].def(evt,data);
			}

			var len = thisEvtMan.events[evt].add.length;
			for (var i = 0; i < len; i++) {
				thisEvtMan.events[evt].add[i](evt,data);
			};
		};
	};

	self.on = this.on;
	self.eventCall = this.eventCall;

	return this;

}


/*
 *
 * Data Sender
 *
 */
function Connection(optsIn){
	var thisConn = this;

	optsIn = optsIn || {};
	optsIn.events = optsIn.events || {};
	this.server = optsIn.server || './poetry.json';
	this.namespace = '/twilight';
	this.websocket = {};
	this.xhr = {};

	this.events = new EventManager({
		self: thisConn,
		events: {
			disconnect: optsIn.events['disconnect'] || false,
			posUpdate: optsIn.events['posUpdate'] || false,
			pick: optsIn.events['pick'] || false,
			drop: optsIn.events['drop'] || false,
			loadTiles: optsIn.events['loadTiles'] || false,
			delTiles: optsIn.events['delTiles'] || false,
		}
	});

	//we'll set these later
	this.init = function(){};
	this.update = function(){};


	this.initWebSocket = function(){
		console.log('initializing webSockets...');
		thisConn.websocket = io.connect(thisConn.namespace);

		thisConn.websocket.on('update',function(update){
				thisConn.eventCall(update.type,update.data);
		});
	};

	//XHR totally broken
	this.initXHR = function(){
		//todo: initialize XHR, bind callbacks
		thisConn.xhr = new XMLHttpRequest();
		thisConn.xhr.onreadystatechange = function(){
			if (thisConn.xhr.readyState == 4 && thisConn.xhr.status == 200){
				var resp = JSON.parse(thisConn.xhr.responseText);
				if(resp.type && events.hasOwnProperty(resp.type)){
					this.eventCall(resp.type,resp.data);
				};
			}
			else{
				console.log('XHR loading failed...');
			};
		};
	}

	this.updateXHR = function(evt,data){
		try{
			thisConn.xhr.open('POST', this.server);
			thisConn.xhr.send({
				type: evt,
				data: ( data.toSendable ? data.toSendable() : data )
			});
		}
		catch(err){
			console.log('XHR loading failed...');
		}
	};

	this.updateWebSocket = function(evt,data){
		var toSend = {
			type: evt,
			data: data.toSendable ? data.toSendable() : data
		};

		console.log("Sending update of type "+evt+" about tile "+data.id);
		this.websocket.emit('update',toSend);
	}

	this.loadTiles = function(){
		this.update('loadTiles',{});
	}

	if(optsIn.websocket){
		this.init = this.initWebSocket;
		this.update = this.updateWebSocket;
	}
	else{
		this.init = this.initXHR;
		this.update = this.updateXHR;
	}

	//initialize transport mechanism
	this.init();


	return this;
}



/*
 *
 * Store, Loader, and Controller
 *
 */
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
