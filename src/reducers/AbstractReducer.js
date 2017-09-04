export default class AbstractReducer {
	constructor(){
		this.reduce = this.reduce.bind(this);
	}

	getInitialState(){
		return { };
	}

	reduce(state, action){
		state = state || this.getInitialState();
		if(this[action.type] && typeof yourFunctionName == 'function'){
			return this[action.type](state, action);
		}

		return state;
	}
}
