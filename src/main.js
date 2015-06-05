/* global mat4 */
var gl;
var lastTime = 0;
var requestNewFrame = window.requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;
var shaderProgram;
var modelViewMatrixStack = [];
var modelViewMatrix = mat4.create();
var projectionMatrix = mat4.create();

// 2D shapes
var triangleVertexPositionBuffer;
var triangleVertexColorBuffer;

var squareVertexPositionBuffer;
var squareVertexColorBuffer;

var triangleRotation = 0;
var squareRotation = 0;

// 3D shapes
var pyramidRotation = 0;
var cubeRotation = 0;

var pyramidVertexPositionBuffer;
var pyramidVertexColorBuffer;

var cubeVertexPositionBuffer;
var cubeVertexColorBuffer;
var cubeVertexIndexBuffer;

function initializeWebGL(canvas) {
    try {
        gl = canvas.getContext("experimental-webgl");
        gl.viewportWidth = canvas.width;
        gl.viewportHeight = canvas.height;
    } catch (e) { }

    if (!gl) {
        alert("Could not initialise WebGL.");
    }
}

function initializeShaders() {
    shaderProgram = shaderCompiler.compileShaderProgram(gl, "shader-fs", "shader-vs");
    
    shaderProgram.vertexPositionAttribute = gl.getAttribLocation(shaderProgram, "aVertexPosition");
    gl.enableVertexAttribArray(shaderProgram.vertexPositionAttribute);

    shaderProgram.vertexColorAttribute = gl.getAttribLocation(shaderProgram, "aVertexColor");
    gl.enableVertexAttribArray(shaderProgram.vertexColorAttribute);

    shaderProgram.pMatrixUniform = gl.getUniformLocation(shaderProgram, "uPMatrix");
    shaderProgram.mvMatrixUniform = gl.getUniformLocation(shaderProgram, "uMVMatrix");
}

function setMatrixUniforms() {
    gl.uniformMatrix4fv(shaderProgram.pMatrixUniform, false, projectionMatrix);
    gl.uniformMatrix4fv(shaderProgram.mvMatrixUniform, false, modelViewMatrix);
}

function initializeBuffers() {
    // triangleVertexPositionBuffer = shapes.createTriangleVertexPositionBuffer(gl);
    // triangleVertexColorBuffer = shapes.createTriangleVertexColorBuffer(gl);
    // 
    // squareVertexPositionBuffer = shapes.createSquareVertexPositionBuffer(gl);
    // squareVertexColorBuffer = shapes.createSquareVertexColorBuffer(gl);
    
    pyramidVertexPositionBuffer = shapes.createPyramidVertexPositionBuffer(gl);
    pyramidVertexColorBuffer = shapes.createPyramidVertexColorBuffer(gl);

    cubeVertexPositionBuffer = shapes.createCubeVertexPositionBuffer(gl);
    cubeVertexColorBuffer = shapes.createCubeVertexColorBuffer(gl);
    cubeVertexIndexBuffer = shapes.createCubeVertexIndexBuffer(gl);
}

function drawScene() {
    gl.viewport(0, 0, gl.viewportWidth, gl.viewportHeight);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    mat4.perspective(45, gl.viewportWidth / gl.viewportHeight, 0.1, 100.0, projectionMatrix);
    
    drawPyramid(-5.0, 0.0, -10.0);
    drawPyramid(-5.0, 2.8, -10.0);
    drawPyramid(-5.0, -2.5, -10.0);
    
    drawPyramid(-5.0, 0.0, -20.0);
    drawPyramid(-5.0, 2.8, -20.0);
    drawPyramid(-5.0, -2.5, -20.0);
    
    drawPyramid(-5.0, 0.0, -40.0);
    drawPyramid(-5.0, 2.8, -40.0);
    drawPyramid(-5.0, -2.5, -40.0);
    
    drawPyramid(-3.0, 0.0, -60.0);
    drawPyramid(-3.0, 2.8, -60.0);
    drawPyramid(-3.0, -2.5, -60.0);
    
    
    drawCube(7.0, 0.0, -13.0);
    drawCube(7.0, 3.2, -13.0);
    drawCube(7.0, -3.2, -13.0);
    
    drawCube(7.0, 0.0, -23.0);
    drawCube(7.0, 3.2, -23.0);
    drawCube(7.0, -3.2, -23.0);
    
    drawCube(7.0, 0.0, -43.0);
    drawCube(7.0, 3.2, -43.0);
    drawCube(7.0, -3.2, -43.0);
    
    drawCube(5.0, 0.0, -63.0);
    drawCube(5.0, 3.2, -63.0);
    drawCube(5.0, -3.2, -63.0);
}

function drawPyramid(x, y, z) {
    mat4.identity(modelViewMatrix);
    mat4.translate(modelViewMatrix, [x, y, z]);

    pushModelViewMatrix();
    mat4.rotate(modelViewMatrix, degreesToRadians(pyramidRotation), [0, 1, 0]);

    gl.bindBuffer(gl.ARRAY_BUFFER, pyramidVertexPositionBuffer);
    gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, pyramidVertexPositionBuffer.itemSize, gl.FLOAT, false, 0, 0);
    gl.bindBuffer(gl.ARRAY_BUFFER, pyramidVertexColorBuffer);
    gl.vertexAttribPointer(shaderProgram.vertexColorAttribute, pyramidVertexColorBuffer.itemSize, gl.FLOAT, false, 0, 0);

    setMatrixUniforms();

    gl.drawArrays(gl.TRIANGLES, 0, pyramidVertexPositionBuffer.numItems);

    popModelViewMatrix();
}

function drawCube(x, y, z) {
    mat4.identity(modelViewMatrix);
    mat4.translate(modelViewMatrix, [x, y, z]);

    pushModelViewMatrix();
    mat4.rotate(modelViewMatrix, degreesToRadians(cubeRotation), [1, 1, 1]);

    gl.bindBuffer(gl.ARRAY_BUFFER, cubeVertexPositionBuffer);
    gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, cubeVertexPositionBuffer.itemSize, gl.FLOAT, false, 0, 0);
    gl.bindBuffer(gl.ARRAY_BUFFER, cubeVertexColorBuffer);
    gl.vertexAttribPointer(shaderProgram.vertexColorAttribute, cubeVertexColorBuffer.itemSize, gl.FLOAT, false, 0, 0);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, cubeVertexIndexBuffer);
    setMatrixUniforms();

    //gl.drawArrays(gl.TRIANGLE_STRIP, 0, squareVertexPositionBuffer.numItems);
    gl.drawElements(gl.TRIANGLES, cubeVertexIndexBuffer.numItems, gl.UNSIGNED_SHORT, 0);

    popModelViewMatrix();
}

function animate(dt) {
    if (lastTime != 0) {
        var factor = dt * 1000;
        pyramidRotation += (90 * factor) / 1000.0;
        cubeRotation += (75 * factor) / 1000.0;
    }
}

function loop(timeStamp) {
    var dt = ((timeStamp - lastTime) / 1000).toFixed(3);
    lastTime = timeStamp;

    //console.log(dt);

    requestNewFrame(loop);
    drawScene();
    animate(dt);
}

function start() {
    requestNewFrame(loop);
}

function main() {
    var canvas = document.getElementById("canvas");
    initializeWebGL(canvas);
    initializeShaders();
    initializeBuffers();

    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.enable(gl.DEPTH_TEST);

    start();
}

function degreesToRadians(d) {
    return d * Math.PI / 180;
}

function pushModelViewMatrix() {
    var copy = mat4.create();
    mat4.set(modelViewMatrix, copy);
    modelViewMatrixStack.push(copy);
}

function popModelViewMatrix() {
    if (modelViewMatrixStack.length == 0) {
        throw "Nothing on the matrix stack.";
    }

    modelViewMatrix = modelViewMatrixStack.pop();
}

function drawTriangle(x, y, z) {
    mat4.identity(modelViewMatrix);
    mat4.translate(modelViewMatrix, [x, y, z]);

    pushModelViewMatrix();
    mat4.rotate(modelViewMatrix, degreesToRadians(triangleRotation), [0, 1, 0]);

    gl.bindBuffer(gl.ARRAY_BUFFER, triangleVertexPositionBuffer);
    gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, triangleVertexPositionBuffer.itemSize, gl.FLOAT, false, 0, 0);
    gl.bindBuffer(gl.ARRAY_BUFFER, triangleVertexColorBuffer);
    gl.vertexAttribPointer(shaderProgram.vertexColorAttribute, triangleVertexColorBuffer.itemSize, gl.FLOAT, false, 0, 0);

    setMatrixUniforms();

    gl.drawArrays(gl.TRIANGLES, 0, triangleVertexPositionBuffer.numItems);

    popModelViewMatrix();
}

function drawSquare(x, y, z) {
    mat4.identity(modelViewMatrix);
    mat4.translate(modelViewMatrix, [x, y, z]);

    pushModelViewMatrix();
    mat4.rotate(modelViewMatrix, degreesToRadians(squareRotation), [1, 0, 0]);

    gl.bindBuffer(gl.ARRAY_BUFFER, squareVertexPositionBuffer);
    gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, squareVertexPositionBuffer.itemSize, gl.FLOAT, false, 0, 0);
    gl.bindBuffer(gl.ARRAY_BUFFER, squareVertexColorBuffer);
    gl.vertexAttribPointer(shaderProgram.vertexColorAttribute, squareVertexColorBuffer.itemSize, gl.FLOAT, false, 0, 0);

    setMatrixUniforms();

    gl.drawArrays(gl.TRIANGLE_STRIP, 0, squareVertexPositionBuffer.numItems);

    popModelViewMatrix();
}