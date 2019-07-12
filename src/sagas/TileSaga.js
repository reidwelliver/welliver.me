import {put, takeEvery, take, select} from 'redux-saga/effects';
import {delay} from 'redux-saga';
import co from 'co';


export default class TileSaga {

	constructor() {

	}

	* ASDF( action ) {
		yield put({ type: 'ecmis_admin_initialized' });
	}

	respond() {

		return function*() {

			yield takeEvery( 'ASDF', this.ASDF.bind(this) );
		}.bind( this );
	}

}
