// Copyright (c) 2016 Guillaume Gomez
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in all
// copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
// SOFTWARE.

var Tetrimino = function(){
	this.x = 4;
	this.y = 0;
	this.current_state = 0;
	this.states = [];
	this.id = 0;
};
Tetrimino.prototype.draw = function(colors){
	var y = 0;
	while (y < this.states[this.current_state].length){
		var x = 0;
		while (x < this.states[this.current_state][y].length){
			if (this.states[this.current_state][y][x] !== 0){
				set_class(document.getElementById("case_"+(this.y+y)+"_"+(this.x+x)), colors[this.id]);
			}
			x += 1;
		}
		y += 1;
	}
};
Tetrimino.prototype.check_lines = function(tetris){
	var y = 0;
	var bonus = 1;
	var remainings = 0;
	var nb_lines = 0;

	while (y < tetris.map.length){
		var x = 0;
		var complete = true;
		var line_remainings = 0;

		while (x < tetris.map[y].length){
			if (tetris.map[y][x] === 0){
				complete = false;
			}else{
				line_remainings += 1;
			}
			x += 1;
		}
		if (complete === true){
			nb_lines += 1;
			tetris.update_score(tetris.current_level * bonus);
			bonus += 1;
			var tmp_y = y;
			while (tmp_y > 0){
				x = 0;
				while (x < tetris.map[tmp_y].length){
					tetris.map[tmp_y][x] = tetris.map[tmp_y - 1][x];
					x += 1;
				}
				tmp_y -= 1;
			}
			if (bonus === 2){
				x = 0;
				while (x < tetris.map[0].length){
					tetris.map[0][x] = 0;
					x += 1;
				}
			}
		}else{
			remainings += line_remainings;
		}
		y += 1;
	}
	if (nb_lines > 0){
		tetris.update_line_number(nb_lines);
	}
	if (remainings===0){
		tetris.span_event("tetris-bonus", 1800);
		tetris.update_score(100);
	}
};
Tetrimino.prototype.test_current_position = function(game_map){
	return this.test_position(game_map, this.current_state, this.x, this.y);
};
Tetrimino.prototype.test_position = function(game_map, tmp_state, pos_x, pos_y) {
	var decal_y = 0;
	while (decal_y < 4) {
		var decal_x = 0;
		while (decal_x < 4) {
			if (this.states[tmp_state][decal_y][decal_x] !== 0 &&
				(pos_y + decal_y >= game_map.length || pos_x + decal_x >= game_map[pos_y + decal_y].length ||
				 game_map[pos_y + decal_y][pos_x + decal_x] !== 0)){
				return false;
			}
			decal_x += 1;
		}
		decal_y += 1;
	}
	return true;
};
Tetrimino.prototype.make_permanent = function(tetris) {
	var decal_y = 0;
	while (decal_y < this.states[this.current_state].length && this.y + decal_y < tetris.map.length){
		var decal_x = 0;
		while (decal_x < this.states[this.current_state][decal_y].length &&
			   this.x + decal_x < tetris.map[this.y + decal_y].length) {
			if (this.states[this.current_state][decal_y][decal_x] !== 0) {
				tetris.map[this.y + decal_y][this.x + decal_x] = this.states[this.current_state][decal_y][decal_x];
			}
			decal_x += 1;
		}
		decal_y += 1;
	}
	tetris.update_score(tetris.current_level);
	this.check_lines(tetris);
	tetris.current_piece = null;
};
Tetrimino.prototype.change_position = function(game_map, new_x, new_y) {
	if (this.test_position(game_map, this.current_state, new_x, new_y) === true){
		this.x = new_x;
		this.y = new_y;
		return true;
	}
	return false;
};
Tetrimino.prototype.change_rotation = function(game_map) {
	var tmp_state = this.current_state + 1;
	if (tmp_state >= this.states.length) {
		tmp_state = 0;
	}
	if (this.test_position(game_map, tmp_state, this.x, this.y) === true){
		this.current_state = tmp_state;
	}else if(this.x > 6 && (this.test_position(game_map, tmp_state, this.x - 1, this.y) === true)){
		this.current_state = tmp_state;
		this.x -= 1;
	}else if(this.x > 6 && this.id === 1){
		if (this.test_position(game_map, tmp_state, this.x - 2, this.y) === true){
			this.current_state = tmp_state;
			this.x -= 2;
		}else if (this.test_position(game_map, tmp_state, this.x - 3, this.y) === true){
			this.current_state = tmp_state;
			this.x -= 3;
		}
	}else if(this.x < 2 && this.test_position(game_map, tmp_state, this.x + 1, this.y) === true){
		this.current_state = tmp_state;
		this.x += 1;
	}
};

function TetriminoI(){
	Tetrimino.call(this);
	this.id = 1;
	this.x = 5;
	this.states.push([[1,1,1,1],
					  [0,0,0,0],
					  [0,0,0,0],
					  [0,0,0,0]]);
	this.states.push([[0,1,0,0],
					  [0,1,0,0],
					  [0,1,0,0],
					  [0,1,0,0]]);
}
TetriminoI.prototype = Object.create(Tetrimino.prototype);

function TetriminoJ(){
	Tetrimino.call(this);
	this.id = 2;
	this.states.push([[2,2,2,0],
					  [2,0,0,0],
					  [0,0,0,0],
					  [0,0,0,0]]);
	this.states.push([[2,2,0,0],
					  [0,2,0,0],
					  [0,2,0,0],
					  [0,0,0,0]]);
	this.states.push([[0,0,2,0],
					  [2,2,2,0],
					  [0,0,0,0],
					  [0,0,0,0]]);
	this.states.push([[2,0,0,0],
					  [2,0,0,0],
					  [2,2,0,0],
					  [0,0,0,0]]);
}
TetriminoJ.prototype = Object.create(Tetrimino.prototype);

function TetriminoL(){
	Tetrimino.call(this);
	this.id = 3;
	this.states.push([[3,3,3,0],
					  [0,0,3,0],
					  [0,0,0,0],
					  [0,0,0,0]]);
	this.states.push([[0,3,0,0],
					  [0,3,0,0],
					  [3,3,0,0],
					  [0,0,0,0]]);
	this.states.push([[3,0,0,0],
					  [3,3,3,0],
					  [0,0,0,0],
					  [0,0,0,0]]);
	this.states.push([[3,3,0,0],
					  [3,0,0,0],
					  [3,0,0,0],
					  [0,0,0,0]]);
}
TetriminoL.prototype = Object.create(Tetrimino.prototype);

function TetriminoO(){
	Tetrimino.call(this);
	this.id = 4;
	this.states.push([[4,4,0,0],
					  [4,4,0,0],
					  [0,0,0,0],
					  [0,0,0,0]]);
}
TetriminoO.prototype = Object.create(Tetrimino.prototype);

function TetriminoS(){
	Tetrimino.call(this);
	this.id = 5;
	this.states.push([[0,5,5,0],
					  [5,5,0,0],
					  [0,0,0,0],
					  [0,0,0,0]]);
	this.states.push([[0,5,0,0],
					  [0,5,5,0],
					  [0,0,5,0],
					  [0,0,0,0]]);
}
TetriminoS.prototype = Object.create(Tetrimino.prototype);

function TetriminoZ(){
	Tetrimino.call(this);
	this.id = 6;
	this.states.push([[6,6,0,0],
					  [0,6,6,0],
					  [0,0,0,0],
					  [0,0,0,0]]);
	this.states.push([[0,0,6,0],
					  [0,6,6,0],
					  [0,6,0,0],
					  [0,0,0,0]]);
}
TetriminoZ.prototype = Object.create(Tetrimino.prototype);

function TetriminoT(){
	Tetrimino.call(this);
	this.id = 7;
	this.states.push([[7,7,7,0],
					  [0,7,0,0],
					  [0,0,0,0],
					  [0,0,0,0]]);
	this.states.push([[0,7,0,0],
					  [7,7,0,0],
					  [0,7,0,0],
					  [0,0,0,0]]);
	this.states.push([[0,7,0,0],
					  [7,7,7,0],
					  [0,0,0,0],
					  [0,0,0,0]]);
	this.states.push([[0,7,0,0],
					  [0,7,7,0],
					  [0,7,0,0],
					  [0,0,0,0]]);
}
TetriminoT.prototype = Object.create(Tetrimino.prototype);

class Ghost {
	constructor(){
		this.id = 0;
		this.x = 0;
		this.y = 0;
	}
}

class Tetris {
	constructor(){
		this.levels_speed = [1000, 850, 700, 600, 500, 400, 300, 250, 221, 190];
		this.levels_score = [800, 1700, 2700, 3800, 4900, 6000, 7000, 8000, 9000, 10000];
		this.score = 0;
		this.current_level = 1;
		this.current_piece = null;
		this.ghost = null;
		this.map = [];
		this.interval_id = null;
		this.prev_time = new Date();
		this.remaining_time = 0;
		this.next_piece = null;
		this.can_repeat = true;
		this.lines = 0;
		this.colors = ["", "red", "yellow", "green", "blue", "purple", "orange", "light_blue"];
		this.is_paused = false;
	}

	update_score(to_add){
		this.score += to_add;
		var score = document.getElementById("score");
		if (score){
			score.innerHTML = "Score: " + this.score;
		}
		if (this.current_level < this.levels_score.length && this.score >= this.levels_score[this.current_level - 1]) {
			this.update_level(this.current_level + 1);
		}
	}

	update_line_number(to_add){
		this.lines += to_add;
		var lines = document.getElementById("lines-number");
		if (lines){
			var txt = "Number of line";
			if (this.lines > 1){
				txt += 's';
			}
			lines.innerHTML = txt+': '+this.lines;
		}
	}

	update_ghost(){
		if (this.current_piece === null){
			return;
		}
		var move_y = this.current_piece.y;
		while (this.current_piece.test_position(this.map, this.current_piece.current_state, this.current_piece.x, move_y + 1) === true){
			move_y += 1;
		}
		this.ghost.y = move_y;
		this.ghost.x = this.current_piece.x;
	}

	update_level(to_set){
		this.current_level = to_set;
		var level = document.getElementById("level");
		if (level){
			level.innerHTML = "Level: " + this.current_level;
		}
		this.span_event("new-level", 2400);
	}

	span_event(event_name, duration){
		add_class(document.getElementById("tetris"), event_name);
		add_class(document.getElementById("tetris-info"), event_name);
		setTimeout(function(){
			remove_class(document.getElementById("tetris"), event_name);
			remove_class(document.getElementById("tetris-info"), event_name);
		}, duration);
	}

	update_preview(){
		var y = 0;
		while (y < this.next_piece.states[0].length){
			var x = 0;
			while (x < this.next_piece.states[0][y].length){
				set_class(document.getElementById("prev_"+y+"_"+x), this.colors[this.next_piece.states[0][y][x]]);
				x += 1;
			}
			y += 1;
		}
	}

	generate_new_piece(){
		this.current_piece = this.next_piece;
		if (this.current_piece !== null){
			this.ghost.id = this.current_piece.id;
			this.update_ghost();
		}
		var pieces = [TetriminoI, TetriminoJ, TetriminoL, TetriminoO, TetriminoS, TetriminoZ, TetriminoT];
		var nb = Math.floor(Math.random() * pieces.length);

		if (this.next_piece !== null && this.next_piece.id === nb + 1){
			nb = Math.floor(Math.random() * pieces.length);
		}
		this.next_piece = new pieces[nb]();
		this.update_preview();
	}

	draw_game(){
		var y = 0;
		while (y < this.map.length){
			var x = 0;
			while (x < this.map[y].length){
				set_class(document.getElementById("case_"+y+"_"+x), this.colors[this.map[y][x]]);
				x += 1;
			}
			y += 1;
		}
		if (this.is_paused === false) {
			var y = 0;
			while (y < this.current_piece.states[this.current_piece.current_state].length){
				var x = 0;
				while (x < this.current_piece.states[this.current_piece.current_state][y].length){
					if (this.current_piece.states[this.current_piece.current_state][y][x] !== 0){
						set_class(document.getElementById("case_"+(y+this.ghost.y)+"_"+(x+this.ghost.x)),
								  "ghost-"+this.colors[this.ghost.id]);
					}
					x += 1;
				}
				y += 1;
			}
			this.current_piece.draw(this.colors);
		}
	}

	game_loop() {
		if (this.is_paused === false) {
			if (this.current_piece === null){
				this.generate_new_piece();
			}
			var new_time = new Date();
			this.remaining_time -= new_time.getTime() - this.prev_time.getTime();
			this.prev_time = new_time;
			if (this.remaining_time < 0){
				if (this.current_piece.change_position(this.map, this.current_piece.x, this.current_piece.y + 1) === false){
					this.current_piece.make_permanent(this);
					this.generate_new_piece();
				}
				this.remaining_time += this.levels_speed[this.current_level - 1];
			}
			if (this.current_piece.test_current_position(this.map) === false){
				// end of the game
				clearInterval(this.interval_id);
				this.interval_id = null;
				document.onkeydown = null;
				add_class(document.getElementById("tetris"), "game-over");
				add_class(document.getElementById("tetris-info"), "game-over");

				var end = document.getElementById("game-over");
				end.innerHTML = "<div>End of the game.<br>Your score: "+this.score+"<br><br><button class='fonter but' onclick='tetris_game.start_new_game();'>Restart</button></div>";
				remove_class(end, "hidden");
				this.check_highest_score(this.score);
				return;
			}
		}
		this.draw_game();
	}

	check_highest_score(new_score){
		var highest = document.getElementById("highest-score");
		if (highest && typeof(Storage) !== "undefined" && new_score > localStorage.highest_score) {
			localStorage.highest_score = new_score;
			highest.innerHTML = 'Highest score: '+localStorage.highest_score;
		}
	}

	create_grid(){
		var grid = document.getElementById("tetris");
		var y = 0;
		var inner = "";

		inner += '<div id="game-over"><div><button class="fonter but" onclick="tetris_game.start_new_game();">Start</button></div></div>';
		while (y < 16) {
			inner += "<div class='grid-line' id='line_" + y + "'>";
			var x = 0;
			while (x < 10) {
				inner += "<div class='grid-case' id='case_" + y + "_" + x + "'></div>";
				x += 1;
			}
			y += 1;
			inner += "<br></div>";
		}
		grid.innerHTML = inner;
	}

	create_preview(){
		var preview = document.getElementById("tetris-info");

		if (preview){
			var content = '';
			if (typeof(Storage) !== "undefined") {
				if (localStorage.highest_score === undefined){
					localStorage.highest_score = 0;
				}
				content += '<div id="highest-score" class="fonter">Highest score: '+localStorage.highest_score+'</div>';
			}
			content += '<div id="score" class="fonter">Score: 0</div><div id="level" class="fonter">Level: 1</div><div id="lines-number" class="fonter">Number of line: 0</div><div id="preview-tetris">';
			var y = 0;
			while (y < 4){
				var x = 0;
				var line = 
				content += '<div class="grid-line">';
				while (x < 4){
					content += '<div class="grid-case" id="prev_'+y+'_'+x+'"></div>';
					x += 1;
				}
				content += '</div>';
				y += 1;
			}
			preview.innerHTML = content + '</div>';
		}
	}

	start_timer(){
		this.interval_id = setInterval(function() {
			tetris_game.game_loop();
		}, 17);
	}

	stop_timer(){
		if (this.interval_id && this.interval_id !== null){
			clearInterval(this.interval_id);
		}
	}

	resume(){
		var end = document.getElementById("game-over");
		add_class(end, "hidden");
		this.is_paused = false;
		this.prev_time = new Date();
		this.draw_game();
		this.start_timer();
	}

	pause(){
		var end = document.getElementById("game-over");
		end.innerHTML = "<div>Game is paused.<br>To resume, press ESC or click on the button below.<br><br><button class='fonter but' onclick='tetris_game.resume();'>Resume</button></div>";
		remove_class(end, "hidden");
		this.is_paused = true;
		this.stop_timer();
		this.draw_game();
	}

	create_map(){
		var y = 0;
		this.map = [];
		while (y < 16){
			this.map.push([0,0,0,0,0,0,0,0,0,0]);
			y += 1;
		}
	}

	start_new_game(){
		document.getElementById("tetris").focus();
		remove_class(document.getElementById("tetris"), "game-over");
		remove_class(document.getElementById("tetris-info"), "game-over");
		add_class(document.getElementById("game-over"), "hidden");
		this.ghost = new Ghost();
		this.create_map();
		this.score = 0;
		this.update_score(0);
		this.lines = 0;
		this.update_line_number(0);
		this.update_level(1);
		this.remaining_time = this.levels_speed[0];
		document.onkeydown = keyboard_function;
		document.onkeyup = keyboard_up_function;
		this.prev_time = new Date();
		this.current_piece = null;
		this.next_piece = null;
		this.is_paused = false;
		this.generate_new_piece();
		this.stop_timer();
		this.start_timer();
	}

	key_event(ev){
		if (this.current_piece === null){
			return;
		}

		var intKeyCode = ev.keyCode;
		var intAltKey = ev.altKey;
		var intCtrlKey = ev.ctrlKey;

		if (intAltKey || intCtrlKey) {
			return false;
		}

		var KEY_DOWN = 40;
		var KEY_UP = 38;
		var KEY_RIGHT = 39;
		var KEY_LEFT = 37;
		var KEY_SPACE = 32;
		var KEY_ESC = 27;

		if (this.is_paused === true) {
			if (intKeyCode === KEY_ESC) {
				this.resume();
			}
		} else {
			var tmp_x = this.current_piece.x;
			var tmp_y = this.current_piece.y;

			if (intKeyCode === KEY_DOWN){
				tmp_y += 1;
				this.remaining_time = this.levels_speed[this.current_level - 1];
			}else if (intKeyCode === KEY_RIGHT){
				tmp_x += 1;
			}else if (intKeyCode === KEY_LEFT){
				tmp_x -= 1;
			}else if (intKeyCode === KEY_UP){
				this.current_piece.change_rotation(this.map);
				this.update_ghost();
				return true;
			}else if (intKeyCode === KEY_SPACE && this.can_repeat === true){
				this.can_repeat = false;
				while (this.current_piece.change_position(this.map, this.current_piece.x, this.current_piece.y + 1) === true){
					this.update_score(this.current_level);
				}
				this.current_piece.make_permanent(this);
				this.remaining_time = this.levels_speed[this.current_level - 1];
				return true;
			} else if (intKeyCode === KEY_ESC){
				this.pause();
			}else{
				return false;
			}
			if (this.current_piece.change_position(this.map, tmp_x, tmp_y) === true){
				if (intKeyCode === KEY_LEFT || intKeyCode === KEY_RIGHT){
					this.update_ghost();
				}
			}else if (intKeyCode === KEY_DOWN) {
				this.current_piece.make_permanent(this);
			}
		}
		return true;
	}

	key_up_event(ev){
		this.can_repeat = true;
	}
}

function add_class(elem, class_name){
	if (elem){
		elem.classList.remove(class_name);
		elem.classList.add(class_name);
	}
}

function remove_class(elem, class_name){
	if (elem){
		elem.classList.remove(class_name);
	}
}

function set_class(elem, class_name){
	if (elem){
		elem.className = "grid-case " + class_name;
	}
}

function checkEventObj(_event_){
	// IE explorer
	if (window.event)
		return window.event;
	// Netscape and other explorers
	return _event_;
}

function keyboard_function(_event_){
	if (tetris_game.key_event(checkEventObj(_event_)) === true){
		_event_.preventDefault();
	}
}

function keyboard_up_function(_event_){
	tetris_game.key_up_event(checkEventObj(_event_));
}

tetris_game = new Tetris();
tetris_game.create_grid();
tetris_game.create_preview();
