const canvas = document.getElementById('btree');
const ctx = canvas.getContext('2d');

class Node {
    constructor(v) {
        this.val = v;
        this.color = 'white';
        this.level = 1;
        this.position = 1;
        this.left = null;
        this.right = null;
        this.r = 10;
    }

    print() {
		if (this.val == null) return;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.r, 0, 2 * Math.PI);
        ctx.fillStyle = this.color;
        ctx.fill();
        ctx.stroke();
        ctx.closePath();
		ctx.fillStyle = 'black';
		ctx.fillText(''+this.val, this.x - 2, this.y + 3);
		if (!this.left) return;
		this.left.print();
		this.right.print();
		ctx.beginPath();
		ctx.moveTo(this.left.x, this.left.y - 10);
		ctx.lineTo(this.x, this.y + 10);
		ctx.lineTo(this.right.x, this.right.y - 10);
		ctx.stroke();
		ctx.closePath();
    }

    calculatePosition() {
		if (this.val == null) return;
        this.x = treeWidth / Math.pow(2, this.level - 1);
        this.x = this.x * this.position - this.x / 2;
        this.y = this.level * 30;
		if (!this.left) return;
		this.left.level = this.level + 1;
		this.left.position = this.position * 2 - 1;
		this.right.level = this.level + 1;
		this.right.position = this.position * 2;
		this.left.calculatePosition();
		this.right.calculatePosition();
    }
}

const width = canvas.width;
const height = canvas.height;
const nodeValues = [9, 5, 4, 5, null, 2, 6, 2, 5, null, 8, 3, 9, 2, 3, 1, 1, null, 4, 5, 4, 2, 2, 6, 4, null, null, 1, 7, null, 5, 4, 7, null, null, 7, null, 1, 5, 6, 1, null, null, null, null, 9, 2, null, 9, 7, 2, 1, null, null, null, 6, null, null, null, null, null, null, null, null, null, 5, null, null, 3, null, null, null, 8, null, 1, null, null, 8, null, null, null, null, 2, null, 8, 7];
const root = new Node(nodeValues[0]);
let currentNodes = [root];
let pos = 1;
let level = 1;
while (pos < nodeValues.length) {
    const newNodes = [];
    for (let i = pos; i < pos + Math.pow(2, level); i += 2) {
        const nodePos = (i - pos) / 2;
        const left = new Node(nodeValues[i]);
        const right = new Node(nodeValues[i + 1]);
        newNodes.push(left);
        newNodes.push(right);
        currentNodes[nodePos].left = left;
        currentNodes[nodePos].right = right;
    }
    currentNodes = newNodes;
    pos += Math.pow(2, level);
    level++;
}
root.height = level - 1;
let treeWidth = 20 * currentNodes.length;
root.calculatePosition();

function draw() {
    ctx.fillStyle = 'rgba(255,255,255,.1)';
    ctx.fillRect(0, 0, width, height);
    root.print();
}

draw();

