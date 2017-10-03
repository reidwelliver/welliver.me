import '../style/Tile.less'

import React, { Component } from 'react';


export default class Tile extends Component {
	constructor(props){
		super(props)
	}

	render(){
		const {tile, key} = this.props;
		return (
			<div {...this.props}>
				<div className="tile">
					<span className="word">{tile.word}</span>
				</div>
			</div>
		)
	}
}
