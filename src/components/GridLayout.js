import React, { Component } from 'react';
import {connect} from 'react-redux';

import ReactGridLayout from 'react-grid-layout';

@connect((store) => { return { tiles: store.tiles.tiles } } )
export default class GridLayout extends Component {
	constructor(props){
		super(props)
	}

	render(){
		var emSize = parseFloat(getComputedStyle(document.querySelector('body'))['font-size']);

		return (
			<ReactGridLayout verticalCompact={false} className="layout" cols={window.innerWidth/10} rowHeight={emSize} height={window.innerHeight} width={window.innerWidth} autoSize={false}>
				

				<div key="a" data-grid={{ x: 0, y: 0, w: 1, h: 1 }}>a</div>
				<div key="b" data-grid={{ x: 1, y: 0, w: 3, h: 1 }}>b</div>
				<div key="c" data-grid={{ x: 4, y: 0, w: 1, h: 1 }}>c</div>
			</ReactGridLayout>
		)
	}
}
