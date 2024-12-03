(function () {
	const canvas = document.getElementById('metaballs');
	const ctx = canvas.getContext('2d');

	class Ball {
		constructor(x, y, r, vx, vy) {
			this.x = x;
			this.y = y;
			this.r = r;
			this.vx = vx;
			this.vy = vy;
		}
		update() {
			this.x += this.vx;
			this.y += this.vy;

			// Bounce off the walls
			if (this.x - this.r < 0 || this.x + this.r > canvas.width) {
				this.vx *= -1;
			}
			if (this.y - this.r < 0 || this.y + this.r > canvas.height) {
				this.vy *= -1;
			}
		}

		// Get bounding box of the ball
		getBoundingBox() {
			return {
				left: Math.max(0, Math.floor(this.x - this.r * 2)),
				right: Math.min(canvas.width, Math.ceil(this.x + this.r * 2)),
				top: Math.max(0, Math.floor(this.y - this.r * 2)),
				bottom: Math.min(canvas.height, Math.ceil(this.y + this.r * 2)),
			};
		}
	}

	// Initialize canvas size
	const width = canvas.width;
	const height = canvas.height;

	// Create two balls
	const balls = [
		new Ball(200, 200, 50, 2, 1), // Ball 1
		new Ball(400, 300, 50, -1, -2) // Ball 2
	];

	// Metaball calculation function
	function calculateMetaballs(x, y) {
		let sum = 0;
		for (const ball of balls) {
			const dx = x - ball.x;
			const dy = y - ball.y;
			const distanceSquared = dx * dx + dy * dy;
			sum += ball.r * ball.r / distanceSquared; // Influence formula
		}
		return sum;
	}

	function draw() {
		// Clear the canvas
		ctx.clearRect(0, 0, width, height);

		// Create an empty image data
		const imageData = ctx.createImageData(width, height);
		const data = imageData.data;

		// Spatial partitioning with bounding boxes
		for (const ball of balls) {
			const { left, right, top, bottom } = ball.getBoundingBox();

			// Process pixels only within the bounding box of the ball
			for (let y = top; y <= bottom; y++) {
				for (let x = left; x <= right; x++) {
					const sum = calculateMetaballs(x, y);

					// Metaball threshold
					const threshold = 1;
					if (sum > threshold) {
						const index = (x + y * width) * 4;
						data[index] = 100; // Red
						data[index + 1] = 150; // Green
						data[index + 2] = 255; // Blue
						data[index + 3] = 255; // Alpha
					}
				}
			}
		}

		ctx.putImageData(imageData, 0, 0);

		// Update ball positions
		for (const ball of balls) {
			ball.update();
		}
	}

	// Run the animation
	setInterval(draw, 16); // ~60 FPS
})();
