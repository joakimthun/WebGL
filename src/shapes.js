var shapes = shapes || {};

shapes.createTriangleVertexPositionBuffer = function (gl) {
    var buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);

    gl.bufferData(
        gl.ARRAY_BUFFER,
        new Float32Array([
            0.0, 1.0, 0.0,
            -1.0, -1.0, 0.0,
            1.0, -1.0, 0.0
        ]),
        gl.STATIC_DRAW);

    buffer.itemSize = 3;
    buffer.numItems = 3;

    return buffer;
};

shapes.createTriangleVertexColorBuffer = function (gl) {
    var buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);

    var colors = [
        1.0, 0.0, 0.0, 1.0,
        0.0, 1.0, 0.0, 1.0,
        0.0, 0.0, 1.0, 1.0
    ];

    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);
    buffer.itemSize = 4;
    buffer.numItems = 3;

    return buffer;
};

shapes.createSquareVertexPositionBuffer = function (gl) {
    var buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    
    gl.bufferData(
        gl.ARRAY_BUFFER,
        new Float32Array([
         1.0, 1.0, 0.0,
        -1.0, 1.0, 0.0,
         1.0, -1.0, 0.0,
        -1.0, -1.0, 0.0
        ]),
        gl.STATIC_DRAW);

    buffer.itemSize = 3;
    buffer.numItems = 4;

    return buffer;
};

shapes.createSquareVertexColorBuffer = function (gl) {
    var buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);

    var colors = [];
    for (var i = 0; i < 4; i++) {
        colors = colors.concat([0.5, 0.5, 1.0, 1.0]);
    }

    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);

    buffer.itemSize = 4;
    buffer.numItems = 4;

    return buffer;
};
