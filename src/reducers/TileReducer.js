import AbstractReducer from './AbstractReducer';

export default class TileReducer extends AbstractReducer {
	constructor(){
		super();
	}

	getInitialState(){
		return {
			tiles: []
		}
	}
}
