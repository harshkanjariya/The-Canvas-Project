function init(data){
var dragging=false;
var obj=document.getElementById(data.element);
var canvas=document.createElement('canvas');
obj.appendChild(canvas);
canvas.width=obj.offsetWidth;
canvas.height=obj.offsetHeight;
var released;
var ctx=canvas.getContext('2d');
var offset=data.isHorizontal?canvas.height/2:canvas.width/2,curve=500;
if(typeof data.offset=="numeric"){
	offset=data.offset;
}
if(typeof data.curve=="numeric"){
	curve=data.curve;
}
ctx.fillStyle="green";
if(typeof data.bgcolor=="string"){
	ctx.fillStyle=data.bgcolor;
}
function drawNormal() {
ctx.fillRect(0,data.isHorizontal?offset:0,data.isHorizontal?canvas.width:offset,data.isHorizontal?canvas.height:offset);	
}
drawNormal();
obj.addEventListener('mousedown', dragStart, false);
obj.addEventListener('mousemove', drag, false);
obj.addEventListener('mouseup', dragStop, false);
obj.addEventListener('touchstart', dragStart, false);
obj.addEventListener('touchend', dragStop, false);
obj.addEventListener('touchmove', drag, false);
var ev;
obj.addEventListener('mouseleave',function(){
	release();
	showdrawer(ev);
},false);
var initcoords,ww=window.innerWidth;
if (ww<475){
	canvas.width+=100;
}
function dragStart(event){
	var coords=getCanvasCoordinates(event);
	ctx.clearRect(0,0,canvas.width,canvas.height);
	drawNormal();
	if((data.isHorizontal && coords.y <= 30) || (!data.isHorizontal && coords.x<=30)){
    	dragging=true;
    	initcoords=coords;
    	released=false;
	}
}
function release(){
	released=true;
}
function drag(event){
	if (dragging){
    	var coords=getCanvasCoordinates(event);
    	ctx.clearRect(0,0,canvas.width,canvas.height);
    	if (data.isHorizontal) {
    		coords.y-=initcoords.y;
    	} else {
	    	coords.x-=initcoords.x;    		
    	}
    	if (typeof data.onChange=="function")
    		data.onChange({
    			height:coords.x-initcoords.x+0.5,
    			release:release
    		});
    	ev=event;
    	if(!released) {
    		if (data.isHorizontal) {
				reloadcanvas(coords.y,coords.x);
    		} else reloadcanvas(coords.x,coords.y);
    	} else
		    showdrawer(event);
	}
}
function dragStop(event){
	showdrawer(event);
}
function reloadcanvas(h,p){
	ctx.beginPath();
	if (data.isHorizontal) ctx.moveTo(0,canvas.height);
	else ctx.moveTo(-1,0);
	if (data.isHorizontal) ctx.lineTo(0, offset);
	else ctx.lineTo(offset, 0);
	for (var i=1;i<(data.isHorizontal?canvas.width:canvas.height);i++) {
		const v = offset+h*Math.pow(2,-Math.pow(i-p,2)/(ww<475?curve*5:curve*10));
		if (data.isHorizontal) {
			ctx.lineTo(i,v);
		} else {
			ctx.lineTo(v,i);
		}
	}
	if (data.isHorizontal) ctx.lineTo(canvas.width, canvas.height);
	else ctx.lineTo(0,canvas.height);
	ctx.fill();
	ctx.closePath();
}
function showdrawer(event){
	if(dragging){
		dragging=false;
		var coords=getCanvasCoordinates(event);
    	var h=data.isHorizontal ? coords.x  : (coords.x-initcoords.x),
    		p=data.isHorizontal ? coords.y - initcoords.y : coords.y,
    		v=2,a=.3;
    	if (data.isHorizontal) {
    		const t = h;
    		h = p;
    		p = t;
    	}
    	if (typeof data.onChange=="function")
			data.onRelease({height:h});
    	reloadcanvas(h,p);
    	var opening=h>0;
    	var intr=setInterval(function(){
			if (opening){
				v+=a;
				h-=v;
				if(h<0 && a>0){a=-5*a;}
				else if(h>0 && a<0){a=-7*a/5;}
				else if(a>=0.89){
					clearInterval(intr);
					setTimeout(function(){
						ctx.clearRect(0,0,canvas.width,canvas.height);
						drawNormal();
					},10);
				}
			}else{
				v+=a;
				h+=v;
				if(h>0 && a>0){a=-5*a;}
				else if(h<0 && a<0){a=-7*a/5;}
				else if(a>=0.89){
					clearInterval(intr);
					setTimeout(function(){
						ctx.clearRect(0,0,canvas.width,canvas.height);
						drawNormal();
					},10);
				}
			}
	    	ctx.clearRect(0,0,canvas.width,canvas.height);
			reloadcanvas(h,p);
    	},10);
	}
}
function getCanvasCoordinates(event) {
	if (event.type.indexOf('touch')>=0){
var x = event.touches[0].clientX - canvas.getBoundingClientRect().left,y = event.touches[0].clientY - canvas.getBoundingClientRect().top;
	if (data.isHorizontal) return {x: x, y: y - offset};
    else return {x: x-offset, y: y};
	}else{
var x = event.clientX - canvas.getBoundingClientRect().left,y = event.clientY - canvas.getBoundingClientRect().top;
    if (data.isHorizontal) return {x: x, y: y - offset};
    else return {x: x-offset, y: y};
	}
}
}