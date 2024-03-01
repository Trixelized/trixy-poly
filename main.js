class Node {
    constructor(interval, angle, tone) {
        this.interval = interval;
        this.angle = angle;
        this.tone = tone;
        this.synth = new Tone.PluckSynth().toDestination();
        this.synth.attackNoise = random(0.5, 1);
        this.synth.dampening = random(3000, 7000);
        this.synth.resonance = random(0.7, 0.9);
        this.synth.connect(feedbackDelay);
        this.synth.connect(pingpongDelay);
        this.prev_prog = 0;
    }
    getProgress(time) {
        return (time / this.interval);
    }
    getPosition(time) {
        let prog = sin(this.getProgress(time) * PI);
        let pos = createVector(
            sin(this.angle) * prog * (ref_size / 2),
            cos(this.angle) * prog * (ref_size / 2)
        );
        return pos;
    }
    draw(x, y) {
        circle(x, y, 4);
    }
    checkForTone(time, i) {
        let prog = this.getProgress(time);

        if (floor(prog) > floor(this.prev_prog)) {
            this.synth.triggerAttack(this.tone);
        }

        // Update previous progress
        this.prev_prog = prog;
    }
}


const bg_color = "#1e1e2e";
const main_color = "#e594a0";
const accent_color = "#FFFFFF";

let time = 0;
let ref_size = 128;

let node_interval = 2;
let node_interval_delay = 0.125;

let tones = ["C2", "D#2", "G2", "A#2", "C3", "D#3", "G3", "A#3", "C4", "D#4", "G4", "A#4"];
let nodes = [];

const pingpongDelay = new Tone.PingPongDelay(node_interval / 6, 0.5).toDestination();
pingpongDelay.wet.value = 0.25;
const feedbackDelay = new Tone.FeedbackDelay(node_interval / 4, 0.5).toDestination();
feedbackDelay.wet.value = 0.5;


function setup() {

    // Set up the canvas in main
    createCanvas(windowWidth, windowHeight);
    // frameRate(24);

    // Set up nodes on start
    setupNodes(tones);

}

function setupNodes(tones) {

    // Clear nodes if needed
    nodes = [];

    // Create new nodes
    for (let i = 0; i < tones.length; i++) {
        let frac = i / tones.length;
        let new_node = new Node(
            node_interval + node_interval_delay * frac,
            frac * TAU,
            tones[i]
        );
        nodes.push(new_node);
    }
}

function windowResized() {
    // The new width will be in global 'width' and 'height' variables
    resizeCanvas(windowWidth, windowHeight);
}

function update() {

    if (document.hasFocus()) {
        let delta = deltaTime / 1000;
        time += delta;

        for (let i = 0; i < nodes.length; i++) {
            nodes[i].checkForTone(time);
        }
    }

}

function draw() {

    // Call update before drawing
    update();

    // Clear background
    background(bg_color);

    // Set up strokes and fill
    stroke(main_color);
    strokeWeight(0.5);
    noFill();

    push();

        // Center and scale drawcalls for center circle
        translate(width / 2, height / 2);
        scale((min(width, height) / 1.5) / ref_size);

        // Draw the main circle(s)
        circle(0, 0, 126);
        circle(0, 0, 130);

        // Stores node points
        let point_array = [];

        push();
            // Draw individual nodes
            noStroke();
            fill(main_color);

            for (let node of nodes) {
                let pos = node.getPosition(time);
                point_array.push([pos.x, pos.y]);
                node.draw(pos.x, pos.y);
            }
        pop();

        push();
            // Draw lines between nodes
            for (let i = 0; i < point_array.length; i++) {
                let pos_a = point_array[i];
                let pos_b = point_array[(i + 1) % point_array.length];
                line(pos_a[0], pos_a[1], pos_b[0], pos_b[1]);
            }
        pop();

    pop();

}
