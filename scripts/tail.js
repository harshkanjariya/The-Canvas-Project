(function() {
const canvas = document.getElementById('tail');
const ctx = canvas.getContext('2d');

class Ball {
	constructor(x,y,r, vx, vy, color){
		this.x = x;
		this.y = y;
		this.r = r;
		this.color = color;
		this.vx = vx;
		this.vy = vy;
	}
	print() {
	    ctx.beginPath();
	    ctx.arc(this.x, this.y, this.r, 0, 2 * Math.PI);
	    ctx.fillStyle = this.color;
	    ctx.fill();
	    ctx.closePath();
	}
	update() {
		this.x+=this.vx;
		this.y+=this.vy;
		if (this.x < 10) this.vx = 1;
		else if (this.x + 10 > width) this.vx = -1;
		if (this.y < 10) this.vy = 1;
		else if (this.y + 10 > height) this.vy = -1;
	}
}
function random(n) {
	return Math.floor(Math.random() * n);
}

const width = canvas.width;
const height = canvas.height;
const colors = ['green', 'blue', 'red', 'yellow', 'orange', 'cyan', 'pink'];
const c = [];
for (var i = 0; i < colors.length; i++) {
	c.push(new Ball(
		random(width),
		random(height),
		10,
		2 * random(2) - 1,
		2 * random(2) - 1,
		colors[i],
	));
}

function draw() {
	ctx.fillStyle = 'rgba(255,255,255,.1)';
	ctx.fillRect(0, 0, width, height);
	for (var i = c.length - 1; i >= 0; i--) {
		c[i].print();
		c[i].update();
	}
}

setInterval(draw, 10);
})();