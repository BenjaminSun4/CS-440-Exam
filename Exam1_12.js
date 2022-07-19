"use strict";

var gl;

var theta = 0.0;
var thetaLoc;


var delay = 100;
var direction = true;
var yshift;

window.onload = function init()
{
    var canvas = document.getElementById( "gl-canvas" );

    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }

    //
    //  Configure WebGL
    //
    gl.viewport( 0, 0, canvas.width, canvas.height );
    gl.clearColor( 0.8, 0.8, 0.8, 1.0 );

    //  Load shaders and initialize attribute buffers
    var program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );

    var vertices = [
        vec3(  0,  0.5,  0 ),
        vec3( -0.5,  0,  0 ),
        vec3(  0.5,  0,  0 ),
        vec3(  0, -0.5,  0 )
    ];
	
	var colors = [

	vec4( 1.0, 1.0, 1.0),//white
	vec4( 1.0, 0.0, 0.0),//red
	vec4( 0.0, 1.0, 0.0),//green
	vec4( 0.0, 0.0, 1.0),//blue
	];

    // Load the data into the GPU
    // Associate out shader variables with our data buffer
    var vBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(vertices), gl.STATIC_DRAW);

    var vPosition = gl.getAttribLocation( program, "vPosition");
    gl.vertexAttribPointer(vPosition, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vPosition);

 var bufferColor = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, bufferColor );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(colors), gl.STATIC_DRAW );
	
	 var vColor = gl.getAttribLocation( program, "vColor" );
    gl.vertexAttribPointer( vColor, 4, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vColor );
	
    thetaLoc = gl.getUniformLocation( program, "theta" );
	
    // Initialize event handlers
    document.getElementById("Controls" ).onclick = function(event) {
        switch( event.target.index ) {
         case 0:
            delay /= 2.0;
            break;
         case 1:
            delay *= 2.0;
            break;
		
       }
    };

    document.getElementById("Direction").onclick = function () {
        direction = !direction;
    };

    render();
};

function render()
{
    gl.clear( gl.COLOR_BUFFER_BIT );

    theta += (direction ? 0.1 : -0.1);
    gl.uniform1f(thetaLoc, theta);

    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

    setTimeout(
        function (){requestAnimFrame(render);}, delay
    );
}
