$(function(){

		// ========================================================================================//
		// 									 KHỞI TẠO 											   //
		// ========================================================================================//
		var MaxRange = Math.random() * 1000;
		var C=  $('.C').val();
		var R = $('.R').val();
		var W = $('.W').val();
		var node = $(".node").val();
		var alpha = $(".alpha").val();
		var Umin = $('.U').val();

		var cw = C*W;				

		//Width and height
		var w = 1110;
		var h = 660;
		var padding = 40;

		var backbone = []
		var dataset = {
				nodes: [

				],

				links:[

				],
				weight:[
				]
			};
		var dataIn=[];
		var root;
		var solutions;
		var indexBackboneMaxMoment;

		// ========================================================================================//
		// 									 PRIM - DIJKSTRA CLICK 								   //
		// ========================================================================================//
		$('.prim').click(function(){

			$("svg").remove();

			//Dynamic, random dataset
			backbone = []
			dataset = {
				nodes: [

				],

				links:[

				],
				weight:[
				]
			};

			dataIn=[];

			// Khởi tạo giá trị WEIGHT

			for (var i=0;i<node;i++){
				dataset.weight[i] =1;
			};
			dataset.weight[4] = dataset.weight[59] = dataset.weight[69]=10;
			dataset.weight[6] = dataset.weight[22] = dataset.weight[44]=15;
			dataset.weight[51] = dataset.weight[77] = dataset.weight[64]=5;
			dataset.weight[31] = dataset.weight[56] = dataset.weight[47]=3;	

			// Xac dinh toa do + Nodes
			for (var i = 0; i < node; i++) {
				var newNumber1 = Math.floor(Math.random() * MaxRange);
				var newNumber2 = Math.floor(Math.random() * MaxRange);
				dataset.nodes.push({name:i+1,backbone:false,weight:0,degre:[newNumber1, newNumber2]});
				dataIn[i] = false;
			}

			// Xac dinh nut Backbone ban dau
			for (var i = 0; i<dataset.nodes.length;i++){
				if (dataset.weight[i] > cw){
					dataset.nodes[i].backbone = true;
					backbone.push(i);
				}
			}

			// tinh MAXCOST
			var MAXCOST = -1;
			for (var i = 0; i < dataset.nodes.length ; i++){
				var ei_x = dataset.nodes[i].degre[0];
				var ei_y = dataset.nodes[i].degre[1];

				for (var j = i + 1; j < dataset.nodes.length; j++){
					var ej_x = dataset.nodes[j].degre[0];
					var ej_y = dataset.nodes[j].degre[1];
					var distance = Math.pow(ei_x-ej_x,2)+Math.pow(ei_y-ej_y,2);

	    			MAXCOST = Math.max(MAXCOST, Math.sqrt(distance)*alpha);
				}
			}

			// Ham tao danh sach Marit cua cac Node
			var getmarit= function(){
				// Tim Center of Gravity - CG
				var Xcg  = 0, Ycg = 0, maxWeight =0, maxDistance =0, distanceList = [], maritList =[];
				var totalWeight = 0, totalXWeight = 0, totalYWeight = 0;
				for (var i=0; i<dataset.nodes.length; i++){
					if (dataIn[i]==false){
						totalWeight += dataset.weight[i];
						totalXWeight += dataset.nodes[i].degre[0]*dataset.weight[i];
						totalYWeight += dataset.nodes[i].degre[1]*dataset.weight[i];
					}
				}
				Xcg =  totalXWeight/totalWeight;
				Ycg =  totalYWeight/totalWeight;

				// Max Weight 
				for (var i=0;i<dataset.weight.length;i++){
					if (dataIn[i] == false){
						maxWeight = Math.max(maxWeight, dataset.weight[i]);
					}
				}
				// Distance
				for (var i = 0 ; i<dataset.nodes.length;i++){
					if (dataIn[i]==false){
						var ei_x = dataset.nodes[i].degre[0];
						var ei_y = dataset.nodes[i].degre[1];
						var distance = Math.pow(ei_x-Xcg,2)+Math.pow(ei_y-Ycg,2);
						var dis = Math.sqrt(distance)*alpha;
						if (dis == 0){
							backbone.push(i);
							dataset.nodes[i].backbone=true;
							dataIn[i]=true;
						}
						distanceList.push(dis);
					} else {
						distanceList.push(0);
					}
				}
				// Max Distance
				maxDistance =  Math.max(...distanceList)
				if (maxDistance==0){
					return 0 ;
				} else{
					for (var i=0;i <dataset.nodes.length;i++){
						if (dataIn[i]==false){
							var marit = 0.5*(maxDistance-distanceList[i])/maxDistance+0.5*dataset.weight[i]/maxWeight;
							maritList.push(marit);
						} else {
							maritList.push(0);
						}
					}

					return maritList;
				}
			}

			var checkNode = function(){
				for (var i=0;i < dataIn.length;i++){
					if (dataIn[i] == false){
						return false;
					}
				}
				return true;
			};

			var findNode = function(){
				for (var i = 0; i < backbone.length; i++){
					var ei_x = dataset.nodes[backbone[i]].degre[0];
					var ei_y = dataset.nodes[backbone[i]].degre[1];
					for (var j = 0; j < dataset.nodes.length; j++){
						var ej_x = dataset.nodes[j].degre[0];
						var ej_y = dataset.nodes[j].degre[1];
						var distance = Math.pow(ei_x-ej_x,2)+Math.pow(ei_y-ej_y,2);
						var dis = Math.sqrt(distance)*alpha;

						if ((MAXCOST*R > dis) && (backbone.indexOf(j)<0) && dataIn[j] == false){
							dataset.links.push({source: backbone[i], target:j});
							dataIn[j]=true;	
							dataIn[backbone[i]]=true;

						}
					}
				};
			}

			// ========================================================================================//
			// 									 MAIN    											   //
			// ========================================================================================//
			// Ham Main Chuong trinh
			var main = function(){
				// Tim Nut Truy Nhap
				findNode();

				// Thuc hien lai CG - MARIT
				var maritList = getmarit();
				var maxMarit = 0;

				if (maritList == 0){
					return ; 
				} else {
					maxMarit = Math.max(...maritList);
					if (maxMarit==0){
						return ;
					} else {
						index_new_backbone = maritList.indexOf(maxMarit);
						backbone.push(index_new_backbone);
						dataset.nodes[index_new_backbone].backbone=true;
						dataIn[index_new_backbone]=true;
						main();
					}
				}

				// Tao nut backbone moi
				/*var newBackbone = maritList.indexOf(Math.max(...maritList));*/

			}

			// goi Ham
			main(); // Khi các DataIn đã True hết (có thể ngoại trừ nút backbone)


			// ========================================================================================//
			// 									 Xac dinh NODE ROOT								   //
			// ========================================================================================//

			// Tinh moment cua cac node backbone
			var cost = function(a,b){
				var co = 0;
				var xa = 0,xb=0,ya=0, yb=0;
				xa = dataset.nodes[backbone[a]].degre[0];
				ya = dataset.nodes[backbone[a]].degre[1];
				xb = dataset.nodes[backbone[b]].degre[0];
				yb = dataset.nodes[backbone[b]].degre[1];
				var distance = Math.pow(xa-xb,2)+Math.pow(ya-yb,2);
				var co = Math.sqrt(distance)*alpha;
				return co;
			}
			var moments = []
			for (var i=0; i < backbone.length; i++){
				var mo = 0;
				for (var j =0; j < backbone.length;j++){
					mo += cost(i,j)*dataset.weight[backbone[j]];
				}
				moments.push(mo);
			}
			var maxMoment = Math.min(...moments);
			indexBackboneMaxMoment = moments.indexOf(maxMoment);
			
			// ========================================================================================//
			// 									  Thuat toan Prim  - Dijkstra 						   //
			// ========================================================================================//
			// Algorithms Prim-Dijkstra
			function solve(graph, s) {
			  var solutions = {};
			  solutions[s] = [];
			  solutions[s].dist = 0;

			  while(true) {
			    var parent = null;
			    var nearest = null;
			    var dist = Infinity;
			    
			    //for each existing solution
			    for(var n in solutions) {
			      if(!solutions[n])
			        continue
			      var ndist = solutions[n].dist;
			      var adj = graph[n];
			      //for each of its adjacent nodes...
			      for(var a in adj) {
			       
			        //without a solution already...
			        if(solutions[a])
			          continue;
			        //choose nearest node with lowest *total* cost
			        var d = adj[a] + alpha*ndist;
			        if(d < dist) {
			          //reference parent
			          parent = solutions[n];
			          nearest = a;
			          dist = d;
			        }
			      }
			      
			    }
			    
			    //no more solutions
			    if(dist === Infinity) {
			        break;
			    }
			    
			    //extend parent's solution path
			    solutions[nearest] = parent.concat(nearest);

			    //extend parent's cost
			    solutions[nearest].dist = dist;
			  }

			  return solutions;
			}

			// Tinh toan COST of Backbone
			root = backbone[indexBackboneMaxMoment];
			var costs = {}
			var hasLink = function(a,b){
				for (var i=0; i<costs.length; i++){
					if ((costs[i].source == a) && (costs[i].target == b)){
						return true;
					} else if ((costs[i].source == b) && (costs[i].target == a)){
						return true;
					}
				}
				return false;
			}

			// Add Line of Backbone + tinh costs
			for (var i=0; i < backbone.length; i++){
				for (var j=0; j < backbone.length ; j++){
					if (i!=j){
						if (!costs[i]){
							costs[i]= {}
						}
						costs[i][j] = cost(i,j);
					}
				}
			}

			var start = indexBackboneMaxMoment;
			solutions = solve(costs, start);
			for (var so in solutions){
				solutions[so].unshift(start)
				for (var i =0;i<solutions[so].length-1;i++){
					dataset.links.push({source: backbone[solutions[so][i]], target: backbone[solutions[so][i+1]]});
				}
			}


			// ========================================================================================//
			// 									 VE DO THỊ 											   //
			// ========================================================================================//

			// Check Link
			var checkBackbone = function(a){
				for (var i =0;i < backbone.length; i++){
					if (backbone[i] == a){
						return true;
					}
				}
				return false;
			}
			// GET COLOR
			var getColor = function(index){
				for (var x=0; x < dataset.links.length; x++){
					if (backbone.indexOf(index) != -1){
						return 'rgb(120, 207, 23)';
					}
					if (index == dataset.links[x].target.name-1){
						return colors(dataset.links[x].source.name);
					}
				}

				return 'rgb(120, 207, 23)';
			}

			var xScale = d3.scaleLinear()
								 .domain([0, 1000])
								 .range([padding, w - padding / 2]);
			var yScale = d3.scaleLinear()
								 .domain([0, 1000])
								 .range([h - padding, padding / 2]);
			// Xac dinh X axis
			var xAxis = d3.axisBottom()
							  .scale(xScale)
							  .ticks(10);
			// Xac dinh Y axis
			var yAxis = d3.axisLeft()
							  .scale(yScale)
							  .ticks(10);

			// Tao Force
			var force = d3.forceSimulation(dataset.nodes)
					  .force("charge", d3.forceManyBody().strength(-30))
					  .force("link", d3.forceLink(dataset.links))
					  .force("center", d3.forceCenter((w/2,h/2)));

			var colors = d3.scaleOrdinal(d3.schemeCategory10);

			// Tao SVG
			var svg = d3.select(".show")
						.append("svg")
						.attr("width", w)
						.attr("height", h);

			// Tao Links

			var links = svg.selectAll("line")
							.data(dataset.links)
							.enter()
							.append("line")
							.style("stroke", function(d,i){
								if (backbone.indexOf(d.target.name-1) != -1){
									return 'rgb(90, 239, 255)';
								} else {
									return '#ccc';
								}
							})
							.style("stroke-width", function(d,i){
								return 1;
							});


			//Create nodes as circles
			var nodes = svg.selectAll("circle")
				.data(dataset.nodes)
				.enter()
				.append("circle")
				.attr("r", 9)
				.style("fill",function(d,i){
					if (d.backbone){
						
						if (backbone[indexBackboneMaxMoment]== i){
							return 'rgb(64, 60, 60)'
						} else{
							return '#ffc107'
						}
					} else{
						return getColor(i);
					}

				})
				.call(d3.drag);

			var text = svg.selectAll("text")
				.data(dataset.links)
				.enter()
				.append("text")
				.text(function(d,i){
					if (checkBackbone(d.target.name-1)){
						return cost(backbone.indexOf(d.source.name-1), backbone.indexOf(d.target.name-1)).toFixed(2);
					}
					return ""
				})
				.attr("x", function(d) {
					return ((1.05*d.source.degre[0]+padding)+(1.05*d.target.degre[0]+padding))/2;
				})
				.attr("y", function(d){
					return ((620-0.6*d.source.degre[1])+(620-0.6*d.target.degre[1]))/2;
				})
				.attr("font-family", "sans-serif")
				.attr("font-size", "11px")

			d3.select(".container").select("svg").selectAll("g")
				.data(dataset.nodes)
				.enter()
				.append("text")
				.text(function(d,i) {
					if (backbone[indexBackboneMaxMoment]== i){
						return d.name+' ROOT';
					} else {
						return d.name;
					}
					
				})
				.attr("x", function(d) {
					return 1.05*d.degre[0]+padding+4;
				})
				.attr("y", function(d){
					return 620-0.6*d.degre[1]-4;
				})
				.attr("font-family", "sans-serif")
				.attr("font-size", "11px")
				.attr("fill", "red");


			//Add a simple tooltip
			nodes.append("title")
				 .text(function(d) {
					return d.name;
				 });
			
			//Every time the simulation "ticks", this will be called
			force.on("tick", function() {
				links.attr("x1", function(d) { return 1.05*d.source.degre[0]+padding; })
			        .attr("y1", function(d) { return 620-0.6*d.source.degre[1]; })
			        .attr("x2", function(d) { return 1.05*d.target.degre[0]+padding; })
			        .attr("y2", function(d) { return 620-0.6*d.target.degre[1]; })

				nodes.attr("cx", function(d) { return 1.05*d.degre[0]+padding })
					 .attr("cy", function(d) { return 620-0.6*d.degre[1] });

			});

			//Tao X axis
			svg.append("g")
				.attr("class", "axis")
				.attr("transform", "translate(0," + (h - padding) + ")")
				.call(xAxis);
			
			//Tao Y axis
			svg.append("g")
				.attr("class", "axis")
				.attr("transform", "translate(" + padding + ",0)")
				.call(yAxis);

			// KET THUC VE DO THI

		});
		
		// ========================================================================================//
		// 									 MENTOR II											   //
		// ========================================================================================//
		$(".mentor2").click(function(){
			
			// Sắp xếp thứ tự ngoài -> Trong

			// Tính lưu lượng giữa các node
			var getNode = function(b1){
				var result = [];
				for (var i= 0; i< dataset.links.length; i++){
					if (dataset.links[i].source.name-1 == b1){
						result.push(dataset.links[i].target.name-1)
					}
				}
				result.push(b1);
				return result;
			}

			var tinhLuuLuong = function(b1, b2){
				var result = {};
				var ll = 0;
				var nodeB1 = getNode(b1);
				var nodeB2 = getNode(b2);
				for (var i in nodeB1){
					for (var j in nodeB2){
						if (Math.abs(nodeB2[j] - nodeB1[i]) == 3){
							ll += 1;
						}
						if (Math.abs(nodeB2[j] - nodeB1[i]) == 6){
							ll += 2;
						}
						if (Math.abs(nodeB2[j] - nodeB1[i]) == 7){
							ll += 3;
						}
					}
				}

				var n = Math.ceil(ll/C);
				var u = 0;
				if (ll){
					u = ll/(n*C);
				}
				var nodes = [b1,b2];
				var add = false;
				if (u > Umin){
					add = true;
				} 

				return {n: n, u: u, nodes: nodes, ll: ll, add: add}
			}
			// Tinh HOPS
			var solu = function(itest){
				var hop = 0;
				var row = 0;
				for (var i in solutions){
					for (var j= 0; j< solutions[i].length; j++){
						if (itest == parseInt(solutions[i][j])){
							hop = j;
							break;
						}
					}
					if (hop != 0){
						row = i;
						break;
					}
				}
				return [row, hop];				
			}
			var hops =[];
			var timHop = function(b1, b2){
				var hop = 0;
				hop = parseInt(solu(b1, indexBackboneMaxMoment)[1])+ parseInt(solu(b2, indexBackboneMaxMoment)[1]);
				return hop;
			}

			//
			var luLuong = [];
			var hops = [];
			for (var i = 0; i< backbone.length; i++){
				for (var j= i+1; j< backbone.length; j++){
					if (timHop(i,j) >= 2){
						luLuong.push(tinhLuuLuong(backbone[i], backbone[j]));
					}
				}
			}

			$("tbody").html('')
			for (var i =0; i<luLuong.length; i++){
				$("tbody").append(`<tr>
								      <th scope="row">${i+1}</th>
								      <td>[${luLuong[i].nodes[0]+1},${luLuong[i].nodes[1]+1}]</td>
								      <td>${luLuong[i].n}</td>
								      <td>${luLuong[i].u}</td>
								      <td>${Umin}</td>
								      <td>${luLuong[i].add}</td>
								    </tr>`);

			}

			// ADD LINKS LUU LUONG
			var links = d3.select(".container").select("svg").selectAll("li")
						.data(luLuong)
						.enter()
						.append("line")
						.attr("class", "cau_b")
						.style("stroke", function(d,i){
							return '#1237f5';
						})
						.style("stroke-width", function(d,i){
							if (d.add){
								return 1.5;
							} else {
								return 0;
							}
						})
						.attr("x1", function(d) { return 1.05*dataset.nodes[d.nodes[0]].degre[0]+padding; })
			        	.attr("y1", function(d) { return 620-0.6*dataset.nodes[d.nodes[0]].degre[1]; })
			       		.attr("x2", function(d) { return 1.05*dataset.nodes[d.nodes[1]].degre[0]+padding; })
			        	.attr("y2", function(d) { return 620-0.6*dataset.nodes[d.nodes[1]].degre[1]; });

		})


		// ========================================================================================//
		// 									THAY ĐỔI GIÁ TRỊ									   //
		// ========================================================================================//
		$('.cau_c').click(function(){
			$('.cau_b').remove()
			
			// Sắp xếp thứ tự ngoài -> Trong

			// Tính lưu lượng giữa các node
			var getNode = function(x){
				var result = [];
				for (var i= 0; i< dataset.links.length; i++){
					if (parseInt(dataset.links[i].source.name-1) == parseInt(x)){
						result.push(dataset.links[i].target.name-1)
					}
				}
				result.push(parseInt(x));
				return result;
			}

			var tinhLuuLuong = function(b1, b2){
				var result = {};
				var ll = 0;
				var nodeB1 = getNode(b1);
				var nodeB2 = getNode(b2);
				for (var i in nodeB1){
					for (var j in nodeB2){
						if ((parseInt(nodeB1[i]) == 2 && parseInt(nodeB2[j]) == 9) || (parseInt(nodeB1[i]) == 9 && parseInt(nodeB2[j]) == 2)){
							ll += 5;
						}
						if ((parseInt(nodeB1[i]) == 39 && parseInt(nodeB2[j]) == 67) || (parseInt(nodeB1[i]) == 39 && parseInt(nodeB2[j]) == 67)){
							ll += 1;
						}
						if ((parseInt(nodeB1[i]) == 14 && parseInt(nodeB2[j]) == 29) || (parseInt(nodeB1[i]) == 14 && parseInt(nodeB2[j]) == 29)){
							ll += 3;
						}
						if (Math.abs(nodeB2[j] - nodeB1[i]) == 3){
							ll += 1;
						}
						if (Math.abs(nodeB2[j] - nodeB1[i]) == 6){
							ll += 2;
						}
						if (Math.abs(nodeB2[j] - nodeB1[i]) == 7){
							ll += 3;
						}
					}
				}

				var n = Math.ceil(ll/C);
				var u = 0;
				if (ll){
					u = ll/(n*C);
				}
				var nodes = [b1,b2];
				var add = false;
				if (u > Umin){
					add = true;
				} 

				return {n: n, u: u, nodes: nodes, ll: ll, add: add}
			}

			// Tinh HOPS
			var solu = function(itest){
				var hop = 0;
				var row = 0;
				for (var i in solutions){
					for (var j= 0; j< solutions[i].length; j++){
						if (itest == parseInt(solutions[i][j])){
							hop = j;
							break;
						}
					}
					if (hop != 0){
						row = i;
						break;
					}
				}
				return [row, hop];				
			}
			var hops =[];
			var timHop = function(b1, b2){
				var hop = 0;
				hop = parseInt(solu(b1, indexBackboneMaxMoment)[1])+ parseInt(solu(b2, indexBackboneMaxMoment)[1]);
				return hop;
			}

			var luLuong = [];
			for (var i = 0; i< backbone.length; i++){
				for (var j= i+1; j< backbone.length; j++){
					if (timHop(i,j) >= 2){
						luLuong.push(tinhLuuLuong(backbone[i], backbone[j]));
					}
				}
			}
			$("tbody").html('')
			for (var i =0; i<luLuong.length; i++){
				$("tbody").append(`<tr>
								      <th scope="row">${i+1}</th>
								      <td>[${luLuong[i].nodes[0]+1},${luLuong[i].nodes[1]+1}]</td>
								      <td>${luLuong[i].n}</td>
								      <td>${luLuong[i].u}</td>
								      <td>${Umin}</td>
								      <td>${luLuong[i].add}</td>
								    </tr>`);

			}

			// ADD LINKS LUU LUONG
			var links = d3.select(".container").select("svg").selectAll("li")
						.data(luLuong)
						.enter()
						.append("line")
						.attr("class", "cau_b")
						.style("stroke", function(d,i){
							return '#1237f5';
						})
						.style("stroke-width", function(d,i){
							if (d.add){
								return 1.5;
							} else {
								return 0;
							}
						})
						.attr("x1", function(d) { return 1.05*dataset.nodes[d.nodes[0]].degre[0]+padding; })
			        	.attr("y1", function(d) { return 620-0.6*dataset.nodes[d.nodes[0]].degre[1]; })
			       		.attr("x2", function(d) { return 1.05*dataset.nodes[d.nodes[1]].degre[0]+padding; })
			        	.attr("y2", function(d) { return 620-0.6*dataset.nodes[d.nodes[1]].degre[1]; });


		})

	});