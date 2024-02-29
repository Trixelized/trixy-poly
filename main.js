function setup() {
    // Set up the canvas in main
    createCanvas(windowWidth, windowHeight);
    // Set the framerate (and other flags)
    frameRate(30);
}

// Callback for resizing the window
function windowResized() {
    // The new width will be in global 'width' and 'height' variables
    resizeCanvas(windowWidth, windowHeight);
}

function draw() {

    background("#1e1e2e");
    stroke("#e594a0");
    strokeWeight(4);
    noFill();

    let circle_size = min(width, height) / 1.5


    // Center drawcalls
    translate(width/2, height/2);

    // Draw the main circle(s)
    circle(0, 0, circle_size - 8)
    circle(0, 0, circle_size + 8)
}
