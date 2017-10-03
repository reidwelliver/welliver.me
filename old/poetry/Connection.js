function Connection(optsIn){
	var thisConn = this;

	optsIn = optsIn || {};
	optsIn.events = optsIn.events || {};
	this.server = optsIn.server || './poetry.json';
	this.namespace = '/poetry';
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

	this.init = function(){
		console.log('initializing webSockets...');
		thisConn.websocket = io.connect(thisConn.namespace);

		thisConn.websocket.on('update',function(update){
				thisConn.eventCall(update.type,update.data);
		});
	};

	this.update = function(evt,data){
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

	//initialize transport mechanism
	this.init();


	return this;
}
