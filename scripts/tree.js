(function(){
const canvas = document.getElementById('tree');
const context = canvas.getContext('2d');
function line(x1, y1, x2, y2) {
	context.moveTo(x1,y1);
	context.lineTo(x2,y2);
	context.stroke();
	context.closePath();
}
const angleChange = Math.PI / 6;
const baseLength = 100;

function tree(x, y, angle, length) {
	if (length > 5) {
		length *= .7;
		const xl = x - length * Math.cos(angle + angleChange);
		const yl = y - length * Math.sin(angle + angleChange);
		line(x, y, xl, yl);
		tree(xl, yl, angle + angleChange, length);

		const xr = x - length * Math.cos(angle - angleChange);
		const yr = y - length * Math.sin(angle - angleChange);
		line(x, y, xr, yr);
		tree(xr, yr, angle - angleChange, length);
	}
}

function draw(width, height) {
	context.clearRect(0, 0, width, height);
	line(width/2,height,width/2,height-baseLength);
	tree(width/2, height - baseLength, Math.PI / 2, baseLength);
}

draw(canvas.width, canvas.height);
}());