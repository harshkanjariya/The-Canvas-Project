(function () {
  const canvas = document.getElementById("phyllotaxis");
  const ctx = canvas.getContext("2d");

  // Initialize canvas size
  const width = canvas.width;
  const height = canvas.height;

  // Parameters for the flower
  const totalPoints = 2000; // Total number of points
  const angle = Math.PI * (3 - Math.sqrt(5)); // Golden angle in radians
  const radiusFactor = 4; // Distance between points
  let currentPoint = 0; // To control the animation

  function drawPhyllotaxis() {
    if (currentPoint >= totalPoints) return;

    const radius = radiusFactor * Math.sqrt(currentPoint);
    const theta = currentPoint * angle;

    // Convert polar to Cartesian coordinates
    const x = width / 2 + radius * Math.cos(theta);
    const y = height / 2 + radius * Math.sin(theta);

    // Draw a circle at the current point
    ctx.beginPath();
    ctx.arc(x, y, 2, 0, 2 * Math.PI); // Each point is a small circle
    ctx.fillStyle = `hsl(${(currentPoint / totalPoints) * 360}, 80%, 50%)`; // Rainbow color from center outward
    ctx.fill();

    currentPoint++;

    // Request the next frame for animation
    requestAnimationFrame(drawPhyllotaxis);
  }

  // Start the animation
  drawPhyllotaxis();
})();
