"use strict";

var gl;

var nRows = 100;
var nColumns = 100;

// data for radial hat function: sin(Pi*r)/(Pi*r)
var data = [];
for( var i = 0; i < nRows; ++i ) {
    data.push( [] );
    var x = Math.PI*(7*i/nRows-3.0);
	
    for( var j = 0; j < nColumns; ++j ) {
        var y = Math.PI*(7*j/nRows-2.0);
        var r = Math.sqrt(x*x+y*y);

        // take care of 0/0 for r = 0
        data[i][j] = r ? Math.sin(r) / r : 1.0;
    }
}

var pointsArray = [];
var normalsArray = [];

var near = -5.0;
var far = 5.0;
var left = -0.9;
var right = 0.9;
var ytop = 2.5;
var bottom = -0.5;
var fovy = 90.0;

var eye = vec3(0.0, 0.5, 2.0); 
var at  = vec3(0.0, 0.0, 0.0);
var up  = vec3(0.0, 1.0, 0.0);

var apt, bpt, cpt, dpt;

var lightPosition = vec4( 2.0, 1.0, 1.0, 0.0 );
var lightAmbient  = vec4( 0.2, 0.2, 0.2, 1.0 );
var lightDiffuse  = vec4( 1.0, 1.0, 1.0, 1.0 );
var lightSpecular = vec4( 1.0, 1.0, 1.0, 1.0 );

var materialAmbient  = vec4( 0.0, 0.8, 0.1, 1.0 );
var materialDiffuse  = vec4( 0.0, 0.7, 0.2, 1.0 );
var materialSpecular = vec4( 0.2, 0.2, 0.2, 1.0 );
var materialShininess = 180.0;

var ambientProduct, ambientProductLoc; 
var diffuseProduct, diffuseProductLoc;
var specularProduct, specularProductLoc;

var modelViewMatrix, projectionMatrix;
var modelViewMatrixLoc, projectionMatrixLoc;

var normalMatrix, normalMatrixLoc;
var lightPositionLoc;
var shininessLoc;

window.onload = function init()
{
    var canvas = document.getElementById( "gl-canvas" );

    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }

    gl.viewport( 0, 0, canvas.width, canvas.height );
    gl.clearColor( 0.0, 0.0, 0.7, 0.5 );

    // enable depth testing and polygon offset
    // so lines will be in front of filled triangles

    gl.enable(gl.DEPTH_TEST);
    gl.depthFunc(gl.LEQUAL);
    gl.enable(gl.POLYGON_OFFSET_FILL);
    gl.polygonOffset(1.0, 2.0);

	// vertex array of nRows*nColumns quadrilaterals
	// (two triangles/quad) from data

    for(var i=0; i<nRows-1; i++) {
        for(var j=0; j<nColumns-1;j++) {
			var apt = vec4(2*i/nRows-1, data[i][j], 2*j/nColumns-1, 1.0);
			var bpt = vec4(2*(i+1)/nRows-1, data[i+1][j], 2*j/nColumns-1, 1.0);
			var cpt = vec4(2*(i+1)/nRows-1, data[i+1][j+1], 2*(j+1)/nColumns-1, 1.0);
			var dpt = vec4(2*i/nRows-1, data[i][j+1], 2*(j+1)/nColumns-1, 1.0);
	
			var t1 = subtract(bpt, apt);
			var t2 = subtract(cpt, apt);
			var t3 = subtract(dpt, apt);
			var normal1 = normalize(cross(t2, t1));
			var normal2 = normalize(cross(t3, t1));
			normal1 = vec4(normal1);
			normal2 = vec4(normal2);

			normalsArray.push(normal1);
			normalsArray.push(normal1);
			normalsArray.push(normal2);
			normalsArray.push(normal2);
	
			pointsArray.push(apt);
			pointsArray.push(bpt);
			pointsArray.push(cpt);
			pointsArray.push(dpt);
		}
	}
    //
    //  Load shaders and initialize attribute buffers
    //
    var program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );

	var nBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, nBuffer);
    gl.bufferData( gl.ARRAY_BUFFER, flatten(normalsArray), gl.STATIC_DRAW );

    var vNormal = gl.getAttribLocation( program, "vNormal" );
    gl.vertexAttribPointer( vNormal, 4, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vNormal);
	
    var vBufferId = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, vBufferId );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(pointsArray), gl.STATIC_DRAW);

    var vPosition = gl.getAttribLocation( program, "vPosition" );
    gl.vertexAttribPointer( vPosition, 4, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPosition );

	// buttons 
	
	document.getElementById("Button1").onclick = function(){at[1]+=0.1;};
    document.getElementById("Button2").onclick = function(){at[1]-=0.1;};
    document.getElementById("Button3").onclick = function(){at[0]-=0.1; };
    document.getElementById("Button4").onclick = function(){at[0]+=0.1; };
    document.getElementById("Button5").onclick = function(){at[2]+=0.1;};
    document.getElementById("Button6").onclick = function(){at[2]-= 0.1;};
	
    document.getElementById("Button9").onclick = function(){eye[0] += 0.1; };
    document.getElementById("Button10").onclick = function(){eye[0] -= 0.1;};
    document.getElementById("Button8").onclick = function(){eye[1] -= 0.1; };
    document.getElementById("Button7").onclick = function(){eye[1] += 0.1;};
    document.getElementById("Button12").onclick = function(){eye[2] += 0.1;};
    document.getElementById("Button11").onclick = function(){eye[2] -= 0.1;};
	
    document.getElementById("Button13").onclick = function(){fovy += 0.1;};
	document.getElementById("Button14").onclick = function(){fovy -= 0.1;};
	document.getElementById("Button15").onclick = function(){};
	document.getElementById("Button16").onclick = function(){}

    modelViewMatrixLoc = gl.getUniformLocation( program, "modelViewMatrix" );
    projectionMatrixLoc = gl.getUniformLocation( program, "projectionMatrix" );
    normalMatrixLoc = gl.getUniformLocation( program, "normalMatrix" );

    ambientProduct = mult(lightAmbient, materialAmbient);
    diffuseProduct = mult(lightDiffuse, materialDiffuse);
    specularProduct = mult(lightSpecular, materialSpecular);
	
	ambientProductLoc = gl.getUniformLocation(program,"ambientProduct");
	diffuseProductLoc = gl.getUniformLocation(program,"diffuseProduct");
	specularProductLoc = gl.getUniformLocation(program,"specularProduct");
	lightPositionLoc = gl.getUniformLocation(program,"lightPosition");
	shininessLoc = gl.getUniformLocation(program, "shininess");
	
    gl.uniform4fv( ambientProductLoc, flatten(ambientProduct) );
	gl.uniform4fv( diffuseProductLoc, flatten(ambientProduct) );
    gl.uniform4fv( specularProductLoc, flatten(ambientProduct) );	
	gl.uniform4fv( lightPositionLoc,flatten(lightPosition) );
	gl.uniform1f( shininessLoc,materialShininess );
	
    render();
}

function render()
{
    gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    var modelViewMatrix = lookAt( eye, at, up );
    var projectionMatrix = ortho( left, right, bottom, ytop, near, far);
	
    normalMatrix = [
        vec3(modelViewMatrix[0][0], modelViewMatrix[0][1], modelViewMatrix[0][2]),
        vec3(modelViewMatrix[1][0], modelViewMatrix[1][1], modelViewMatrix[1][2]),
        vec3(modelViewMatrix[2][0], modelViewMatrix[2][1], modelViewMatrix[2][2])
    ];
	
    ambientProduct = mult(lightAmbient, materialAmbient);
    diffuseProduct = mult(lightDiffuse, materialDiffuse);
    specularProduct = mult(lightSpecular, materialSpecular);
	
    gl.uniformMatrix4fv( modelViewMatrixLoc, false, flatten(modelViewMatrix) );
    gl.uniformMatrix4fv( projectionMatrixLoc, false, flatten(projectionMatrix) );
	gl.uniformMatrix3fv(normalMatrixLoc, false, flatten(normalMatrix) );
	
	gl.uniform4fv( ambientProductLoc, flatten(ambientProduct) );
    gl.uniform4fv( diffuseProductLoc, flatten(diffuseProduct) );
    gl.uniform4fv( specularProductLoc, flatten(specularProduct) );	
    gl.uniform4fv( lightPositionLoc, flatten(lightPosition) );
    gl.uniform1f( shininessLoc, materialShininess );

    for(var i=0; i<pointsArray.length; i+=4) {
        gl.drawArrays( gl.TRIANGLE_FAN, i, 4 );
    }

    requestAnimFrame(render);
}
