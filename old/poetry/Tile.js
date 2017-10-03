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
