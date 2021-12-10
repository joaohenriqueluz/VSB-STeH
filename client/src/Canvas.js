import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

const pixelRatio = window.devicePixelRatio;

const Canvas = ({ height, width, objects, tagPosition }) => {
	const canvas = React.useRef();
	const room = [
		{ x: 6.2, y: 0 },
		{ x: 6.2, y: 4.6 },
		{ x: 0, y: 4.6 },
		{ x: 0, y: 11.6 },
		{ x: 7, y: 11.6 },
		{ x: 7, y: 9.6 },
		{ x: 7.2, y: 9.6 },
		{ x: 7.2, y: 11.6 },
		{ x: 11.7, y: 11.6 },
		{ x: 11.7, y: 7.1 },
		{ x: 8.7, y: 7.1 },
		{ x: 8.7, y: 8.65 },
		{ x: 7, y: 8.65 },
		{ x: 7, y: 4.55 },
		{ x: 7.7, y: 4.55 },
		{ x: 7.7, y: 2 },
		{ x: 9.7, y: 2 },
		{ x: 9.7, y: 0 },
		{ x: 6.2, y: 0 },
	];

	const wallMaxX = Math.max(...room.map(({ x }) => x));
	const wallMaxY = Math.max(...room.map(({ y }) => y));

	const resizeFactor = (() => {
		let factorY = height / wallMaxY;
		let factorX = width / wallMaxX;

		return Math.min(factorX, factorY);
	})();

	const center = {
		x: width / 2 - (wallMaxX * resizeFactor) / 2,
		y: height / 2 - (wallMaxY * resizeFactor) / 2,
	};
	function resizeX(value) {
		return value * resizeFactor + center.x;
	}

	function resizeY(value) {
		return height - value * resizeFactor - center.y;
	}

	function drawWall(context) {
		context.save();
		// context.scale(pixelRatio, pixelRatio);
		context.fillStyle = 'hsl(0, 0%, 95%)';
		context.fillRect(0, 0, width, height);
		context.beginPath();
		for (const corner of room) {
			let x = resizeX(corner.x);
			let y = resizeY(corner.y);
			context.lineTo(x, y);
		}
		context.closePath();

		context.lineWidth = '5';
		context.strokeStyle = 'black';
		context.fillStyle = '#fef';
		context.fill();
		context.stroke();
	}

	const draw = (context, objects, tagPosition) => {
		if (tagPosition) {
			context.strokeStyle = 'red';
			context.beginPath();
			// let tagX = resizeX(tagPosition.x)/10
			// let tagY = resizeX(tagPosition.y)/10
			// // console.log(tagY)
			// // console.log(tagX)
			context.arc(tagPosition.y * 7, tagPosition.x * 7, 10, 0, Math.PI * 2);
			context.arc(tagPosition.y * 7, tagPosition.x * 7, 50, 0, Math.PI * 2);
			context.stroke();
		}

		context.strokeStyle = 'black';
		objects.map((elem) => {
			context.beginPath();
			if (tagPosition) {
				let a = elem.x * 100 - tagPosition.x * 10;
				let b = elem.y * 100 - tagPosition.y * 10;
				let dist = Math.sqrt(a * a + b * b);
				if (dist < 50) {
					context.strokeStyle = 'blue';
				}
			}
			let x = resizeX(elem.x) / 100;
			let y = resizeY(elem.y) / 100;
			// console.log('elem.x',elem.x);
			// console.log('elem.y',elem.y);
			// console.log('x', x);
			// console.log('y', y);
			context.arc(elem.y * 70, elem.x * 70, 10, 0, Math.PI * 2);
			context.stroke();
			// context.fillText(elem.id, elem.x * 100, elem.y * 100);
			// context.fillStyle = 'green';
			// context.fillText(
			// 	elem.x * 100 + ',' + elem.y * 100,
			// 	(elem.x + 0.1) * 100,
			// 	(elem.y + 0.1) * 100
			// );
			// context.restore();
		});
		context.restore();
	};

	React.useEffect(() => {
		const context = canvas.current.getContext('2d');
		drawWall(context);
		draw(context, objects, tagPosition);
	});
	return <canvas ref={canvas} height={height} width={width} />;
};
Canvas.propTypes = {
	height: PropTypes.number.isRequired,
	width: PropTypes.number.isRequired,
};
export default Canvas;
