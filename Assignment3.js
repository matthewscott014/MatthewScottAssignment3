//author: Matthew Scott
//date: 3/2/21
//description: Creates a triangle and a rotating
// square with a slider, button, menu, and key 
//commands to alter speed and direction of rotation.
//proposed points (out of 10): 10/10 because I used 2 
//different colors, a button, a slider, a menu, and key presses.

"use strict";

var canvas;
var gl;

var theta = 0.0;
var thetaLoc;

var vertices;
var verticesTriangle;
var program;
var programTriangle;

var direction = true;

var thetaLoc;
var speed = 0.03; //sets initial speed to 0.03

window.onload = function init()
{
    canvas = document.getElementById( "gl-canvas" );

    gl = canvas.getContext('webgl2');
    if (!gl) alert( "WebGL 2.0 isn't available" );

    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.clearColor(.9, .9, .9, 1.0);

    //  Load shaders and initialize attribute buffers
    program = initShaders(gl, "vertex-shader", "fragment-shader");
    gl.useProgram(program);

    vertices = [ //vertices for square
        vec2(0, 1),
        vec2(-1, 0),
        vec2(1, 0),
        vec2(0, -1)
    ];
    
    verticesTriangle = [ //vertices for triangle
        vec2(.6, .6),
        vec2(1, .6),
        vec2(.8, 1)
    ];


    // establish shaders and uniform variables
    program = initShaders(gl, "vertex-shader", "fragment-shader");
    thetaLoc = gl.getUniformLocation(program, "uTheta");
    programTriangle = initShaders(gl, "vertex-shader-still", "fragment-shader-still");


    //changes direction of rotation when button is pressed
    document.getElementById("Direction").onclick = function(){
        console.log("pressed button")
        direction = !direction;
    }

    //changes speed of rotation based on the slider
    document.getElementById("slider").onchange = function(event) {
    speed = parseFloat(event.target.value);
    console.log("slider activated");
    }

    //makes a menu that can change direction of rotation and increase its speed
    document.getElementById("Controls").onclick = function(event){
        switch(event.target.index) {
            case 0:
                direction = !direction;
                break;
            case 1: speed += 0.05;
        }
    }

    //increasses speed on f press (for "faster"), decreases speed on s press (for "slower"),
    //and stops ratation on space bar press
    window.onkeydown = function(event) {
        var key = String.fromCharCode(event.keyCode);
        switch (key) {
            case "F":
            case "f":
                speed += 0.01;
            break;

            case "S":
            case "s":
                speed -= 0.01;
            break;

            case " ":
                speed = -0.01;
            break;
        }
    }

    render();
};


function render() {
    gl.clear(gl.COLOR_BUFFER_BIT);
    
    theta += speed; //rotates the square based on speed

    if (direction == true){theta += 0.01} // rotates counter-clockwise if direction = true
    if (direction != true){ theta -= 2*speed} //reverses direction if direction = false

    gl.useProgram(program);
   
    // Load the data 
    var bufferId = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, bufferId);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(vertices), gl.STATIC_DRAW);

    // Associate shader variables with our data bufferData
    var positionLoc = gl.getAttribLocation(program, "aPosition");
    gl.vertexAttribPointer(positionLoc, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(positionLoc);

    
    gl.uniform1f(thetaLoc, theta);
    
    
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

    // draws the triangle
    gl.useProgram(programTriangle);
    
    // Load the data
    var bufferId2 = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, bufferId2);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(verticesTriangle), gl.STATIC_DRAW);

    // Associate shader variables with our data bufferData
    var positionLoc2 = gl.getAttribLocation(programTriangle, "aPosition");
    gl.vertexAttribPointer(positionLoc2, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(positionLoc2);

    // DRAW IT!
    gl.drawArrays(gl.TRIANGLES, 0, verticesTriangle.length);

    requestAnimationFrame(render);
}
