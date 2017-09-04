import { createStore, combineReducers, applyMiddleware } from 'redux'
import { createLogger } from 'redux-logger';

import TileReducer from './TileReducer'

const middleware = applyMiddleware( createLogger() );
const reducers = combineReducers({
	tiles: new TileReducer().reduce
})



export default function initializeStore(){
	return createStore(
	  reducers,
	  middleware
	)
}
