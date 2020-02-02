/**
 * Using require with a json file only reads
 * it once, returning the cached data when you
 * need it.
 */
jQuery(document).ready(function($) {
	$.getJSON('tonight.json', function(json) {
		console.log('json data: ', json);
		let vData = json.vData;
		console.log('vData = ', vData);
		let vWidth = 800;
		let vHeight = 800;
		let vRadius = 300;
		var vColor = d3
			.scaleOrdinal()
			.domain(vData)
			.range(d3.schemeCategory10);

		function computeTextRotation(d) {
			var angle = ((d.x0 + d.x1) / Math.PI) * 90;
			return angle < 120 || angle > 270 ? angle : angle + 180;

			// spoke label alternative
			// return (angle < 180) ? angle - 90: angle + 90;
		}

		function drawSunburst(vData) {
			var g = d3
				.select('svg')
				.attr('width', vWidth)
				.attr('height', vHeight)
				.append('g')
				.attr('transform', `translate(${vRadius}, ${vRadius})`);

			var vLayout = d3.partition().size([2 * Math.PI, vRadius]);

			var vArc = d3
				.arc()
				.startAngle(function(d, i) {
					return d.x0.toFixed(2);
				})
				.endAngle(function(d, i) {
					return d.x1.toFixed(2);
				})
				.innerRadius(function(d, i) {
					return d.y0.toFixed(2);
				})
				.outerRadius(function(d, i) {
					return d.y1.toFixed(2);
				});

			var tArc = d3
				.arc()
				.startAngle(function(d, i) {
					return d.x0;
				})
				.endAngle(function(d, i) {
					return d.x1;
				})
				.innerRadius(function(d, i) {
					return d.y0;
				})
				.outerRadius(function(d, i) {
					return d.y1;
				});
			var vRoot = d3.hierarchy(vData).sum(function(d, i) {
				return d.size;
			});
			var vNodes = vRoot.descendants();
			vLayout(vRoot);
			// var x = d3
			// 	.scaleOrdinal()
			// 	.domain(['mon', 'tues', 'wed'])
			// 	.range([10, 20, 30]);

			// var xAxis = d3.axisBottom(x);
			// g.append('g')
			// 	.attr('class', 'x axis')
			// 	.call(xAxis);

			function getXYforText(d) {
				/**
				 *  Equation for coords of point on a circle:
				 *
				 *  x = rsin0
				 *  y = rcos0
				 *
				 * 	where 0 is in degrees
				 *  and r = radius
				 *
				 * 	for the text:
				 * 	radius should equal 1/2*75 + y0 = 37.5 + y0;
				 *
				 *
				 */
				let radius = 37.5 + d.y0;
				let radians = d.x0 + 0.5 * (d.x1 - d.x0);
				let angle = (radians / Math.PI) * 180;
				let x = radius * Math.sin(angle);
				let y = radius * Math.cos(angle);
				let s = 0;
				let t = radius;
				let u = s * Math.cos(angle) + t * Math.sin(angle);
				let v = -s * Math.sin(angle) + t * Math.cos(angle);
			}
			function getAngle(d) {
				let startRadii = d.x0;
				let endRadii = d.x1;
				let startAngle = startRadii;
				let endAngle = endRadii;
				startAngle = startAngle;
				endAngle = endAngle;
				// console.log('startAngle ', startAngle);
				// console.log('endAngle = ', endAngle);
				totalDegrees = endAngle - startAngle;
				// console.log('totalDegrees = ', totalDegrees);
				halfTotalDegrees = totalDegrees / 2;
				// console.log('halftotalDegrees = ', halfTotalDegrees);
				let angle = startAngle + halfTotalDegrees;
				// console.log('angle for text placement = ', angle);

				console.log('get angle = ', angle);
				return angle;
			}

			function getX(d, i) {
				let radius = 37.5 + d.y0;
				let angle = getAngle(d);
				let x = radius * Math.sin(angle);
				// console.log('x = ', x);
				return x;
			}
			function getY(d, i) {
				let radius = 37.5 + d.y0;

				// console.log('Element #', i);
				// console.log('Named ', d.data.name);
				let angle = getAngle(d);
				let y = radius * Math.cos(angle);
				console.log('Math.cos of ' + angle + ' is = ' + Math.cos(angle));
				// console.log('y = ', y);
				return -1 * y;
			}

			var vSlices = g
				.selectAll('g')
				.data(vNodes)
				.enter()
				.append('g');

			// d3.select('svg')
			// 	.append('text')
			// 	.text('hello');

			vSlices
				.append('path')
				.attr('display', function(d, i) {
					//	console.log('vslices.attr display d ', d);
					//	console.log('vslices.attr display i ', i);
					return d.depth ? null : 'none';
				})
				.filter(function(d, i) {
					// console.log('filter d.parent = ', d.parent);
					return d.parent;
				})
				.attr('d', vArc)
				.style('stroke', '#000000')
				.style('fill', 'none');

			//----------from zoomsun
			const text = vSlices.append('text').attr('display', null);
			let midangle = 0;
			let midradius = 0;
			let midpont = vSlices
				.append('circle')
				.attr('cx', function(d, i) {
					midangle = (d.x0 + d.x1) / 2;
					midradius = (d.y0 + d.y1) / 2;
					let x = midradius * Math.sin(midangle);
					//	console.log(`slice ${d.data.name} x of midpoint is ${x}`);
					return x;
				})
				.attr('cy', function(d, i) {
					midangle = (d.x0 + d.x1) / 2;
					midradius = (d.y0 + d.y1) / 2;
					let y = -1 * midradius * Math.cos(midangle);
					//	console.log(`slice ${d.data.name} y of midpoint is ${y}`);
					return y;
				})
				.attr('r', '10')
				.attr('fill', 'purple')
				.attr('id', function(d, i) {
					return `midpoint${i}`;
				});
			// Add white contour
			// text
			// 	.append('textPath')
			// 	.attr('startOffset', '50%')
			// 	.attr('xlink:href', (_, i) => `#hiddenArc${i}`)
			// 	.text(d => d.data.name)
			// 	.style('fill', 'none')
			// 	.style('stroke', '#fff')
			// 	.style('stroke-width', 5)
			// 	.style('stroke-linejoin', 'round');

			text
				.append('textPath')
				.attr('xlink:href', (_, i) => `#hiddenArc${i}`)
				.text(d => d.data.name)
				.attr('x', function(d, i) {
					midangle = (d.x0 + d.x1) / 2;
					midradius = (d.y0 + d.y1) / 2;
					let x = midradius * Math.sin(midangle);
					// console.log(`slice ${d.data.name} x of midpoint is ${x}`);
					return x;
				})
				.attr('y', function(d, i) {
					midangle = (d.x0 + d.x1) / 2;
					midradius = (d.y0 + d.y1) / 2;
					let y = -1 * midradius * Math.cos(midangle);
					// console.log(`slice ${d.data.name} y of midpoint is ${y}`);
					return y;
				});
			//-----------end zoomsun
			function startX(d, i) {
				// startX
				let radii = d.x0;
				let adjust = (d.x1 - d.x0) / 2;

				let namechars = d.data.name.length;
				let chardegree = 45 / 12; // 45 degrees per 12 letters on inner donut
				console.log('chardegrees = ', chardegree);
				let totalchardegrees = namechars * chardegree;
				console.log('totalchardegrees = ', totalchardegrees);
				let charradians = (totalchardegrees * Math.PI) / 180;
				let charadjust = charradians / 2;
				console.log('charradjust = ', charadjust);
				radii = d.x0 + adjust - charadjust;
				let radius = (d.y0 + d.y1) / 2;
				let startX = radius * Math.sin(radii);
				return startX;
			}
			function startY(d, i) {
				// startY
				let radii = d.x0;
				let adjust = (d.x1 - d.x0) / 2;

				let namechars = d.data.name.length;
				let chardegree = 45 / 12; // 45 degrees per 12 letters on inner donut
				console.log('chardegrees = ', chardegree);
				let totalchardegrees = namechars * chardegree;
				console.log('totalchardegrees = ', totalchardegrees);
				let charradians = (totalchardegrees * Math.PI) / 180;
				let charadjust = charradians / 2;
				console.log('charradjust = ', charadjust);
				radii = d.x0 + adjust - charadjust;
				let radius = (d.y0 + d.y1) / 2;
				let startY = radius * Math.cos(radii);
				return -startY;
			}
			function endX(d) {
				// endX
				let radii = d.x1;
				let radius = (d.y0 + d.y1) / 2;
				let endX = radius * Math.sin(radii);
				return endX;
			}
			function endY(d) {
				// endY

				let radii = d.x1;
				let radius = (d.y0 + d.y1) / 2;
				let endY = radius * Math.cos(radii);
				return -endY;
			}
			// vSlices
			// 	.append('title')
			// 	.text(function(d) {
			// 		return d.data.name;
			// 	})
			// 	.attr('fill', 'rgb(255,0,0)')
			// 	.attr('font-size', '40');
			vSlices
				.append('path')
				.attr('d', function(d, i) {
					let radius = 37.5 + d.y0;
					let xstart = startX(d, i);
					let ystart = startY(d, i);
					// ystart = -1 * ystart;
					let rotationDegrees = ((-d.x0 / Math.PI) * 180).toFixed(2);
					//	console.log(`For the ${i} element named ${d.data.name}`);
					//	console.log('Rotation Degrees = ', rotationDegrees);
					let xend = endX(d).toFixed(2);
					let yend = endY(d).toFixed(2);
					// yend = -1 * yend;
					return `M${xstart},${ystart} A${radius},${radius} ${rotationDegrees} 0 1 ${xend}, ${yend}`;
				})
				.attr('id', function(d, i) {
					return `hiddenArc${i}`;
				})
				.attr('fill', 'none');
			// .attr('stroke', 'rgb(255,0,0)')
			// .attr('stroke-width', '0')
			// .append('text')
			// .attr('x')
			// .text(function(d, i) {
			// 	return d.data.name;
			// })
			// .attr('font-size', '100')
			// .attr('fill', 'rgb(0,255,0)')
			// .attr('color', '#000000');
		}
		drawSunburst(vData);
	});
});

// var datajson = {
// 	vData: {
// 		name: 'Topics',
// 		children: [
// 			{
// 				name: 'Murano IDE',
// 				children: [
// 					{
// 						name: 'Determin Config ',
// 						children: [
// 							{ name: 'Monitor: DVD Player', size: 1 },
// 							{ name: 'Stand', size: 1 },
// 							{ name: 'Computer', size: 1 },
// 							{ name: 'Keyboard', size: 1 },
// 							{ name: 'Mouse', size: 1 }
// 						]
// 					},
// 					{
// 						name: 'Build',
// 						children: [
// 							{ name: 'Monitor stand', size: 1 },
// 							{ name: 'keyboard', size: 1 },
// 							{ name: 'Power inverter', size: 1 }
// 						]
// 					}
// 				]
// 			},
// 			{
// 				name: 'jades clothes',
// 				children: [
// 					{ name: 'move to dryer', size: 1 },
// 					{ name: 'layout to dry', size: 1 }
// 				]
// 			},
// 			{
// 				name: 'jades essay',
// 				children: [
// 					{
// 						name: 'Rough draft',
// 						children: [
// 							{ name: 'para 1', size: 1 },
// 							{ name: 'para 2', size: 1 },
// 							{ name: 'para 3', size: 1 },
// 							{ name: 'conclusion', size: 1 }
// 						]
// 					},
// 					{
// 						name: 'proofread',
// 						children: [
// 							{ name: 'edit', size: 1 },
// 							{ name: 'proof', size: 1 }
// 						]
// 					}
// 				]
// 			}
// 		]
// 	}
// };

// jQuery(document).ready(function($) {
// 	console.log('jquery fired');
// 	var topics = datajson.vData.children;
// 	// console.log(topics);
// 	for (i = 0; i < topics.length; i++) {
// 		var newlist = '<ul>';
// 		var listitems = topics[i].children;
// 		for (j = 0; j < listitems.length; j++) {
// 			newlist += `<li>${listitems[j]}</li`;
// 		}
// 		newlist += '</ul>';
// 		$('#mylist').html(newlist);
// 	}
// });

// function computeTextRotation(d) {
// 	var angle = ((d.x0 + d.x1) / Math.PI) * 90;
// 	return angle < 120 || angle > 270 ? angle : angle + 180;

// 	// spoke label alternative
// 	// return (angle < 180) ? angle - 90: angle + 90;
// }

// function drawSunburst(vData) {
// 	var g = d3
// 		.select('svg')
// 		.attr('width', vWidth)
// 		.attr('height', vHeight)
// 		.append('g')
// 		.attr('transform', `translate(${vRadius}, ${vRadius})`);

// 	var vLayout = d3.partition().size([2 * Math.PI, vRadius]);

// 	var vArc = d3
// 		.arc()
// 		.startAngle(function(d, i) {
// 			return d.x0;
// 		})
// 		.endAngle(function(d, i) {
// 			return d.x1;
// 		})
// 		.innerRadius(function(d, i) {
// 			return d.y0;
// 		})
// 		.outerRadius(function(d, i) {
// 			return d.y1;
// 		});

// 	var vRoot = d3.hierarchy(vData).sum(function(d, i) {
// 		return d.size;
// 	});
// 	var vNodes = vRoot.descendants();
// 	vLayout(vRoot);

// 	var vSlices = g
// 		.selectAll('g')
// 		.data(vNodes)
// 		.enter()
// 		.append('g');

// 	vSlices
// 		.append('path')
// 		.attr('display', function(d, i) {
// 			return d.depth ? null : 'none';
// 		})
// 		.filter(function(d, i) {
// 			return d.parent;
// 		})
// 		.text(function(d, i) {
// 			console.log(d.data.name);
// 			return d.data.name;
// 		})
// 		.attr('d', vArc)
// 		.style('stroke', '#fff')
// 		.style('fill', function(d, i) {
// 			return vColor((d.children ? d : d.parent).data.id);
// 		})

// 		.append('text');
// }

//drawSunburst(datajson.vData);
