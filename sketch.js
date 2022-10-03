// Flocking
// Daniel Shiffman
// https://thecodingtrain.com/CodingChallenges/124-flocking-boids.html
// https://youtu.be/mhjuuHl6qHM

const flock = [];

let maxSpeedSlider, maxAccelerationSlider, alignSlider, cohesionSlider, separationSlider;

function setup() {
  createCanvas(900, 600);
  frameRate(5);
  createDiv('max speed');
  maxSpeedSlider = createSlider(0, 6, 3, 0.1);
  createDiv('max acceleration');
  maxAccelerationSlider = createSlider(0, 6, 2, 0.1);
  createDiv('alignment mult');
  alignSlider = createSlider(0, 8, 1, 0.1);
  // createDiv('cohesion mult');
  // cohesionSlider = createSlider(0, 8, 1, 0.1);
  createDiv('separation mult');
  separationSlider = createSlider(0, 8, 1, 0.1);
  for (let i = 0; i < 80; i++) {
    flock.push(new Boid());
  }

}

function draw() {
  background(0);
  for (let boid of flock) {
    boid.edges();
    boid.flock(flock);
    boid.update();
  }
  let first = true;
  for (let boid of flock) {
    boid.show(first);
    first = false;
  }  
}
