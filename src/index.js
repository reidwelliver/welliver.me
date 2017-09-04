import React from 'react';
import { render } from 'react-dom';

import { AppContainer } from 'react-hot-loader';
import { Provider } from 'react-redux';
import { BrowserRouter as Router } from 'react-router-dom';

import initializeStore from './reducers/initializeStore';
import MainLayout from './components/MainLayout';

const store = initializeStore();
render(
	(
		<AppContainer>
			<Provider store={ store }>
				<Router>
					<MainLayout />
				</Router>
			</Provider>
		</AppContainer>
	), document.getElementById( 'root' )
)

if( module.hot ) {
	module.hot.accept()
}
