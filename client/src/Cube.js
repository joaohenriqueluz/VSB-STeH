import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import './Cube.css';

const Cube = ({ size, rotation }) => {
	const [cubeStyle, setCubeStyle] = useState({
		width: size + 'px',
		height: size + 'px',
		transform: `rotateY(${rotation}deg)`,
	});

	useEffect(() => {
		setCubeStyle({
			width: size + 'px',
			height: size + 'px',
			transform: `rotateY(${rotation}deg)`,
		});
	}, [rotation, size]);

	return (
		<div className='cube' style={cubeStyle}>
			<div className='front'></div>
			<div className='back'></div>
			<div className='top'></div>
			<div className='bottom'></div>
			<div className='left'></div>
			<div className='right'></div>
		</div>
	);
};

export default Cube;
