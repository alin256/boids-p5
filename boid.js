// Flocking
// Daniel Shiffman
// https://thecodingtrain.com/CodingChallenges/124-flocking-boids.html
// https://youtu.be/mhjuuHl6qHM

class Boid {
    constructor() {
      this.position = createVector(random(width), random(height));
      this.velocity = p5.Vector.random2D();
      this.velocity.setMag(random(2, 4));
      this.acceleration = createVector();
      this.maxForce = 0.2;
      this.maxSpeed = 5;
    }
  
    edges() {
      if (this.position.x > width) {
        this.position.x = 0;
      } else if (this.position.x < 0) {
        this.position.x = width;
      }
      if (this.position.y > height) {
        this.position.y = 0;
      } else if (this.position.y < 0) {
        this.position.y = height;
      }
    }
  
    align(boids) {
      let perceptionRadius = 25;
      let steering = createVector();
      let total = 0;
      for (let other of boids) {
        let d = dist(this.position.x, this.position.y, other.position.x, other.position.y);
        if (other != this && d < perceptionRadius) {
          steering.add(other.velocity);
          total++;
        }
      }
      if (total > 0) {
        steering.div(total);
        steering.setMag(this.maxSpeed);
        steering.sub(this.velocity);
        steering.limit(this.maxForce);
      }
      return steering;
    }
  
    separation(boids) {
      let perceptionRadius = 24;
      let steering = createVector();
      let total = 0;
      for (let other of boids) {
        let d = dist(this.position.x, this.position.y, other.position.x, other.position.y);
        if (other != this && d < perceptionRadius) {
          let diff = p5.Vector.sub(this.position, other.position);
          diff.div(d * d);
          steering.add(diff);
          total++;
        }
      }
      if (total > 0) {
        steering.div(total);
        steering.setMag(this.maxSpeed);
        steering.sub(this.velocity);
        steering.limit(this.maxForce);
      }
      return steering;
    }
  
    cohesion(boids) {
      let perceptionRadius = 50;
      let steering = createVector();
      let total = 0;
      for (let other of boids) {
        let d = dist(this.position.x, this.position.y, other.position.x, other.position.y);
        if (other != this && d < perceptionRadius) {
          steering.add(other.position);
          total++;
        }
      }
      if (total > 0) {
        steering.div(total);
        steering.sub(this.position);
        steering.setMag(this.maxSpeed);
        steering.sub(this.velocity);
        steering.limit(this.maxForce);
      }
      return steering;
    }
  
    flock(boids) {
      let alignment = this.align(boids);
      let cohesion = this.cohesion(boids);
      let separation = this.separation(boids);
  
      alignment.mult(alignSlider.value());
      cohesion.mult(cohesionSlider.value());
      separation.mult(separationSlider.value());
  
      this.acceleration.add(alignment);
      this.acceleration.add(cohesion);
      this.acceleration.add(separation);
    }
  
    update() {
      this.position.add(this.velocity);
      this.velocity.add(this.acceleration);
      this.velocity.limit(this.maxSpeed);
      this.acceleration.mult(0);
    }
  
    show() {

      stroke(255);
      push();
      translate(this.position.x, this.position.y);
      rotate(atan2(this.velocity.y, this.velocity.x));
      // scale(5);
      // body
      strokeWeight(1);
      line(2, 0, -2, 0);
      // tail
      strokeWeight(1);
      line(2, 0, -4, 1);
      line(2, 0, -4, -1);

      //wings
      stroke(255);
      strokeWeight(1);
      line(0, 0, 1, 3);
      line(0, 0, 1, -3);
      line(-1, 0, 1, 3);
      line(-1, 0, 1, -3);
      strokeWeight(1);
      line(1, 3, 0, 5);
      line(1, -3, 0, -5);

      // head
      stroke(255,0,0);
      // strokeWeight(1);
      point(1, 0);
      // point(this.position.x, this.position.y);
      pop();
    }
  }
  