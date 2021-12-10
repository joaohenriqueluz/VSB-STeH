import React, { useState, useEffect } from 'react';
import './App.css';
import io from 'socket.io-client';
import Canvas from './Canvas';
import Cube from './Cube';
var FileSaver = require('file-saver');

const positioningFloorSocket = io('http://158.196.218.115:8888/');
const ws_accelerometer = new WebSocket('ws://127.0.0.1:8888/');
const ws_pozyx = new WebSocket('ws://localhost:8080/', 'echo-protocol');

let messagesToSave = [];
let pozyxCoords;
let accelerometer_message = 'accelerometer';

function App() {
	const [allObjectsRender, setAllPFObjectsRender] = useState([]);
	const [pozyxPosition, setPozyxPosition] = useState();
	const [cubeRotation, setCubeRotation] = useState({ cubeRotation: 0 });

	useEffect(() => {
		positioningFloorSocket.on('objects-update', (args) => {
			setAllPFObjectsRender([...args]);
			args.map((elem) => {
				try {
					let dist = Math.sqrt(
						(elem.x - pozyxCoords.x) * (elem.x - pozyxCoords.x) +
							(elem.y - pozyxCoords.y) * (elem.y - pozyxCoords.y)
					);
					if (dist < 0.5) {
						let time = new Date().getTime();
						messagesToSave.push({
							time: time,
							position_floor: { x: elem.x, y: elem.y },
							pozyx_tag: { x: pozyxCoords.x, y: pozyxCoords.y },
							accelerometer_message: accelerometer_message,
						});
					}
				} catch (error) {
					console.log(error);
				}
			});
		});

		positioningFloorSocket.on('connect', () => {
			console.log('Connected to positioning floor');
		});

		//---------------------------------------------------
		// Pozyx WebSocket

		ws_pozyx.onopen = () => {
			console.log('Opened Pozyx Connection!');
		};

		ws_pozyx.onmessage = (event) => {
			// console.log(event.data);
			// console.log(JSON.parse(event.data));
			// console.log(JSON.parse(event.data)[0].data.coordinates);
			pozyxCoords = JSON.parse(event.data)[0].data.coordinates;
			// console.log(pozyxCoords);
			setPozyxPosition({ x: pozyxCoords.x / 100, y: pozyxCoords.y / 100 });
		};

		ws_pozyx.onclose = () => {
			console.log('Closed Pozyx Connection!');
		};

		//---------------------------------------------------
		// Accelerometer

		ws_accelerometer.onopen = () => {
			console.log('Opened accelerometer Connection!');
		};

		ws_accelerometer.onmessage = (event) => {
			let data;
			data = JSON.parse(event.data);
			console.log(data);
			try {
				// console.log(data[0][1] === "/euler");
				if (data[0][1] === '/euler') {
					//   let d = new Date('1900-01-01 00:00:00');
					// d.setSeconds(d.getSeconds() + data[1][0] - 60 * 60);
					// console.log(d);
					// accelerometer_message = {};

					// let z_rot = data[1][4];
					// let current_time = new Date();

					// if(previous_time !== undefined){
					//   const delta_time = Math.ceil(Math.abs(current_time - previous_time) / 1000);
					//   const delta_angle = z_rot * delta_time;
					//   current_angle += delta_angle;
					//   current_angle = 360 % current_angle;
					//   console.log(current_angle)
					//   setCubeRotation({ cubeRotation: current_angle })
					//   previous_time = current_time;
					// }
					// else{
					//   previous_time = current_time;
					// }
					// console.log(data[1][4])
					setCubeRotation({ cubeRotation: data[0][4] });
				}
			} catch (error) {}
		};

		ws_accelerometer.onclose = () => {
			console.log('Closed Accelerometer Connection!');
		};
		//---------------------------------------------------
	}, []);

	const saveToFile = () => {
		var blob = new Blob([JSON.stringify(messagesToSave)], {
			type: 'text/plain;charset=utf-8',
		});
		console.log(JSON.stringify(messagesToSave));
		FileSaver.saveAs(blob, 'history_data.txt');
	};

	return (
		<>
			<div className='App'>
				<header className='App-header'>
					<div className='visuals-container'>
						<Canvas
							height={800}
							width={800}
							objects={allObjectsRender}
							tagPosition={pozyxPosition}
						/>{' '}
					</div>
					<>
						{/* <div className='obj-div'>
							{allObjectsRender.map((elem, index) => {
								return (
									<div key={index}>
										<h3>{elem.id}</h3>
										<h4>{elem.x}</h4>
										<h4>{elem.y}</h4>
										<h4>dist: </h4>
									</div>
								);
							})}
						</div> */}
					</>
					<button onClick={saveToFile}>Export</button>
				</header>
				<div id='cube-container'>
					<div className='container'>
						<Cube size={200} rotation={cubeRotation.cubeRotation} />
						<h6>Rotation: {cubeRotation.cubeRotation} degrees </h6>
					</div>
				</div>
			</div>
		</>
	);
}

export default App;
