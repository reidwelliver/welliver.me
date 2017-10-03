import React, { Component } from 'react';
import {connect} from 'react-redux';
import ReactGridLayout from 'react-grid-layout';

import Tile from './Tile';

@connect((store) => { return { tiles: store.tiles.tiles } } )
export default class GridLayout extends Component {
	constructor(props){
		super(props)
		this.state = {
			emSize: parseFloat(getComputedStyle(document.querySelector('body'))['font-size'])
		}
	}

	render(){

		var tiles = [
			{ x: 1, y: 1, word: 'aaaaaaaah'},
			{ x: 1, y: 3, word: 'bbbbbbh'},
			{ x: 1, y: 5, word: 'cccch'},
			{ x: 1, y: 9, word: 'ddh'},
		]

		return (
			<ReactGridLayout
				verticalCompact={false}
				className="layout"
				cols={window.innerWidth}
				rowHeight={this.state.emSize}
				height={window.innerHeight}
				width={window.innerWidth}
				autoSize={false}
			>
				{ tiles.map( (tile, i) => {
					return <Tile key={i} tile={tile} data-grid={this.tileToDataGrid(tile)}/>
				} ) }
			</ReactGridLayout>
		)
	}

	tileToDataGrid(tile){
		return {
			x: tile.x,
			y: tile.y,
			w: tile.word.length,
			h: 1
		}
	}
}
