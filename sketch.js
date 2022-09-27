// Flocking
// Daniel Shiffman
// https://thecodingtrain.com/CodingChallenges/124-flocking-boids.html
// https://youtu.be/mhjuuHl6qHM

const flock = [];

let maxSpeedSlider, alignSlider, cohesionSlider, separationSlider;

function setup() {
  createCanvas(900, 600);
  frameRate(60);
  createDiv('max speed');
  maxSpeedSlider = createSlider(0, 6, 5, 0.1);
  createDiv('alignment mult');
  alignSlider = createSlider(0, 2, 1.5, 0.1);
  createDiv('cohesion mult');
  cohesionSlider = createSlider(0, 2, 1, 0.1);
  createDiv('separation mult');
  separationSlider = createSlider(0, 2, 2, 0.1);
  for (let i = 0; i < 200; i++) {
    flock.push(new Boid());
  }

}

function draw() {
  background(0);
  for (let boid of flock) {
    boid.edges();
    boid.flock(flock);
    boid.update();
    boid.show();
  }  
}
