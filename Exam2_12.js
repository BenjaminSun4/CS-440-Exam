"use strict";

var canvas;
var gl;

var pointsArray = [];

var fColor;
var red;
var orange;
var yellow;
var green;
var blue;
var purple;
var white;
var black;
var theta =0.0;
var modelViewMatrix;
var modelViewMatrixLoc; 



window.onload = function init() {
    canvas = document.getElementById( "gl-canvas" );

    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }

    gl.viewport( 0, 0, canvas.width, canvas.height );

    gl.clearColor( 0.8, 0.8, 0.8, 1.0 );

    gl.enable(gl.DEPTH_TEST);

    red = vec4(1.0, 0.0, 0.0, 1.0);
	orange = vec4(1.0, 0.6, 0.0, 1.0);
	yellow = vec4(1.0, 1.0, 0.0, 1.0);
	green = vec4(0.0, 1.0, 0.0, 1.0);
	blue = vec4(0.0, 0.0, 1.0, 1.0);
	purple = vec4(0.6, 0.0, 1.0, 1.0);
	white = vec4(1.0, 1.0, 1.0, 1.0);
	black = vec4(0.0, 0.0, 0.0, 1.0);
	
    // square
	
 	pointsArray.push(vec4( -0.5, -0.5, 0.0, 1.0));
	pointsArray.push(vec4( -0.5,  0.5, 0.0, 1.0));
	pointsArray.push(vec4(  0.5,  0.5, 0.0, 1.0));
	pointsArray.push(vec4(  0.5, -0.5, 0.0, 1.0));
	
    //
    //  Load shaders and initialize attribute buffers
    //
    var program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );
	
    var vBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, vBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(pointsArray), gl.STATIC_DRAW );

    var vPosition = gl.getAttribLocation( program, "vPosition" );
    gl.vertexAttribPointer( vPosition, 4, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPosition );

    fColor = gl.getUniformLocation(program, "fColor");

    modelViewMatrixLoc = gl.getUniformLocation( program, "modelViewMatrix" );

    render();
}

var render = function() {



        gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
		theta+=2.00;
		//yellow square
		
		modelViewMatrix = mat4();
		modelViewMatrix = mult( modelViewMatrix, translate(-.6, -.5,0));
		modelViewMatrix = mult( modelViewMatrix, scalem(-.2, -.2, 0));
		modelViewMatrix = mult( modelViewMatrix, rotate( theta ,0.0, 0.0, 1.0 ));
		modelViewMatrix = mult( modelViewMatrix, translate(0.0, 0.0, 0));
	
        gl.uniform4fv(fColor, flatten(yellow));
		gl.uniformMatrix4fv( modelViewMatrixLoc, false, flatten(modelViewMatrix) );
		
        gl.drawArrays(gl.TRIANGLE_FAN, 0, 4);
		
		
		
		//orange square
		
		modelViewMatrix = mat4();
		modelViewMatrix = mult( modelViewMatrix, translate(-.6, -.5,0));
		modelViewMatrix = mult( modelViewMatrix, scalem(-.4, -.4, 0));
		modelViewMatrix = mult( modelViewMatrix, rotate( -theta ,0.0, 0.0, 1.0 ));
		modelViewMatrix = mult( modelViewMatrix, translate(0.0, 0.0, 0));
	
        gl.uniform4fv(fColor, flatten(orange));
		gl.uniformMatrix4fv( modelViewMatrixLoc, false, flatten(modelViewMatrix) );
		
        gl.drawArrays(gl.TRIANGLE_FAN, 0, 4);
		//red square
		
		modelViewMatrix = mat4();
		modelViewMatrix = mult( modelViewMatrix, translate(-.6, -.5,0));
		modelViewMatrix = mult( modelViewMatrix, scalem(-.6, -.6, 0));
		modelViewMatrix = mult( modelViewMatrix, rotate( theta ,0.0, 0.0, 1.0 ));
		modelViewMatrix = mult( modelViewMatrix, translate(0.0, 0.0, 0));
	
        gl.uniform4fv(fColor, flatten(red));
		gl.uniformMatrix4fv( modelViewMatrixLoc, false, flatten(modelViewMatrix) );
		gl.drawArrays(gl.TRIANGLE_FAN, 0, 4);
		
		//green square
		
		modelViewMatrix = mat4();
		modelViewMatrix = mult( modelViewMatrix, translate(.5, .5,0));
		modelViewMatrix = mult( modelViewMatrix, scalem(-.2, -.2, 0));
		modelViewMatrix = mult( modelViewMatrix, rotate( theta ,0.0, 0.0, 1.0 ));
		modelViewMatrix = mult( modelViewMatrix, translate(0.0, 0.0, 0));
	
        gl.uniform4fv(fColor, flatten(green));
		gl.uniformMatrix4fv( modelViewMatrixLoc, false, flatten(modelViewMatrix) );
		
        gl.drawArrays(gl.TRIANGLE_FAN, 0, 4);
		
		//blue square
		
		modelViewMatrix = mat4();
		modelViewMatrix = mult( modelViewMatrix, translate(.5, .5,0));
		modelViewMatrix = mult( modelViewMatrix, scalem(-.4, -.4, 0));
		modelViewMatrix = mult( modelViewMatrix, rotate( -theta ,0.0, 0.0, 1.0 ));
		modelViewMatrix = mult( modelViewMatrix, translate(0.0, 0.0, 0));
	
        gl.uniform4fv(fColor, flatten(blue));
		gl.uniformMatrix4fv( modelViewMatrixLoc, false, flatten(modelViewMatrix) );
		
        gl.drawArrays(gl.TRIANGLE_FAN, 0, 4);
		
			
		//purple square
		
		modelViewMatrix = mat4();
		modelViewMatrix = mult( modelViewMatrix, translate(.5, .5,0));
		modelViewMatrix = mult( modelViewMatrix, scalem(-.6, -.6, 0));
		modelViewMatrix = mult( modelViewMatrix, rotate( theta ,0.0, 0.0, 1.0 ));
		modelViewMatrix = mult( modelViewMatrix, translate(0.0, 0.0, 0));
	
        gl.uniform4fv(fColor, flatten(purple));
		gl.uniformMatrix4fv( modelViewMatrixLoc, false, flatten(modelViewMatrix) );
		
        gl.drawArrays(gl.TRIANGLE_FAN, 0, 4);
		
		//quandrant II black square
		
		
		modelViewMatrix = mat4();
		modelViewMatrix = mult( modelViewMatrix, translate(-.5, .5,0));
		modelViewMatrix = mult( modelViewMatrix, scalem(-.4, -.8, 0));
		modelViewMatrix = mult( modelViewMatrix, rotate( theta ,0.0, 0.0, 1.0 ));
		modelViewMatrix = mult( modelViewMatrix, translate(0.0, .0, 0));
	
        gl.uniform4fv(fColor, flatten(black));
		gl.uniformMatrix4fv( modelViewMatrixLoc, false, flatten(modelViewMatrix) );
		
        gl.drawArrays(gl.LINE_LOOP, 0, 4);
		
		//guandrant II white square
		modelViewMatrix = mat4();
		modelViewMatrix = mult( modelViewMatrix, translate(-.5, .5,0));
		modelViewMatrix = mult( modelViewMatrix, scalem(-.8, -.4, 0));
		modelViewMatrix = mult( modelViewMatrix, rotate( theta*3 ,0.0, 0.0, 1.0 ));
		modelViewMatrix = mult( modelViewMatrix, translate(0.0, .0, 0));
	
        gl.uniform4fv(fColor, flatten(white));
		gl.uniformMatrix4fv( modelViewMatrixLoc, false, flatten(modelViewMatrix) );
		
        gl.drawArrays(gl.LINE_LOOP, 0, 4);
		
		//guandrant IV white square
		modelViewMatrix = mat4();
		modelViewMatrix = mult( modelViewMatrix, translate(.4, -.5,0));
		modelViewMatrix = mult( modelViewMatrix, scalem(-.8, -.4, 0));
		modelViewMatrix = mult( modelViewMatrix, rotate( -theta*3 ,0.0, 0.0, 1.0 ));
		modelViewMatrix = mult( modelViewMatrix, translate(-0.0, -.0, 0));
	
        gl.uniform4fv(fColor, flatten(white));
		gl.uniformMatrix4fv( modelViewMatrixLoc, false, flatten(modelViewMatrix) );
		
        gl.drawArrays(gl.LINE_LOOP, 0, 4);
		
		//guandrant IV Black square
		modelViewMatrix = mat4();
		modelViewMatrix = mult( modelViewMatrix, translate(.4, -.5,0));
		modelViewMatrix = mult( modelViewMatrix, scalem(-.4, -.8, 0));
		modelViewMatrix = mult( modelViewMatrix, rotate( theta*3 ,0.0, 0.0, 1.0 ));
		modelViewMatrix = mult( modelViewMatrix, translate(0.0, 0.0, 0));
	
        gl.uniform4fv(fColor, flatten(black));
		gl.uniformMatrix4fv( modelViewMatrixLoc, false, flatten(modelViewMatrix) );
		
        gl.drawArrays(gl.LINE_LOOP, 0, 4);
		
	
        requestAnimFrame(render);
    }
