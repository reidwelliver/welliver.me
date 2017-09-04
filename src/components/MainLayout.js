import '../style/MainLayout.less'

import React, { Component } from 'react';
import {connect} from 'react-redux';

import GridLayout from './GridLayout';

@connect((store) => { return { tiles: store.tiles.tiles } } )
export default class MainLayout extends Component {
	constructor(props){
		super(props)
	}

	render(){
		return (
			<div className="main-layout">
				<GridLayout/>
			</div>
		)
	}
}
