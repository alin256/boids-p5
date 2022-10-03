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
      // this.maxForce = 0.2;
      this.radius = 5;
      this.comfortZone = 15;

      this.avoidanceRadius = this.comfortZone + this.radius;
      this.directionalPerceptionRadius = this.avoidanceRadius * 1.5;
      this.perceptionRadius = this.avoidanceRadius * 2;
      
      // this.directionalPerceptionRadius = this.perceptionRadius - this.comfortZone;

      this.maxSpeed = 5;
      this.minSpeed = this.maxSpeed / 2;
      this.maxForce = this.minSpeed / 2;
      this.forceVectors = [];
      this.touched = false;
      this.even = false;
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
      let perceptionRadius = this.directionalPerceptionRadius;
      let steering = createVector();
      let total = 0;
      for (let other of boids) {
        let d = dist(this.position.x, this.position.y, other.position.x, other.position.y);
        if (other != this && d < perceptionRadius) {
          let accelVector = other.velocity.copy();
          steering.add(accelVector);
          total++;
          this.forceVectors.push([accelVector, [0 , 255, 255]]);
        }
      }
      if (total > 0) {
        steering.div(total);
        // steering.setMag(this.maxSpeed);
        // steering.sub(this.velocity);
        // steering.limit(this.maxForce);
      }
      return steering;
    }
  
    symmetricPoint(point, center, radius, attractionMult = 0.0) {
      let diffVec = p5.Vector.sub(point, center);
      let vecMag = p5.Vector.mag(diffVec);
      // let correctedVec = diffVec.copy();
      // diffVec.normalize();
      // diffVec.mult(radius * radius / vecMag / vecMag);
      diffVec.mult(radius * (radius - vecMag) / vecMag / vecMag);
      if (vecMag > radius) {
        diffVec.mult(attractionMult);
      } 
      // return [diffVec.add(center), correctedVec.add(center)];
      return diffVec;
    }

    separation(boids, attractionMult = 1.0) {
      // let perceptionRadius = 50;
      let steering = createVector();
      let total = 0;

      for (let other of boids) {
        let distance = dist(this.position.x, this.position.y, other.position.x, other.position.y);

        if (other != this && distance < this.perceptionRadius) {
          // let diffVec = p5.Vector.sub(this.position, other.position);
          // // todo the reflection does not work correctly
          // diffVec.div(distance * distance);
          // // now it's length is 1 / distance
          // diffVec.mult(this.avoidanceRadius);
          // // Now multiplied by radius

          let diffVec = this.symmetricPoint(this.position, other.position, this.avoidanceRadius, attractionMult);

          this.forceVectors.push([diffVec, [255, 0, 0]]);

          steering.add(diffVec);
          total++;
        }
      }
      if (total > 0) {
        steering.div(total);
        // steering.setMag(this.maxSpeed);
        // steering.sub(this.velocity);
        // steering.limit(this.maxForce);
      }
      return steering;
    }
  
    // cohesion(boids) {
    //   const perceptionRadius = this.perceptionRadius;
    //   let steering = createVector();
    //   let total = 0;
    //   for (let other of boids) {
    //     let d = dist(this.position.x, this.position.y, other.position.x, other.position.y);
    //     if (other != this && d < perceptionRadius) {
    //       steering.add(other.position);
    //       total++;
    //       other.touched = true;
    //     }
    //   }
    //   if (total > 0) {
    //     steering.div(total);
    //     steering.sub(this.position);
    //     // steering.setMag(this.maxSpeed);
    //     // steering.sub(this.velocity);
    //     // steering.limit(this.maxForce);
    //   }
    //   this.forceVectors.push([steering, [255, 255, 0]]);
    //   return steering;
    // }
  
    flock(boids) {
      this.maxSpeed = maxSpeedSlider.value();
      this.minSpeed = maxSpeedSlider.value() / 2;
      this.maxForce = maxAccelerationSlider.value();

      this.forceVectors = [];

      let alignment = this.align(boids);
      // let cohesion = this.cohesion(boids);
      let separation = this.separation(boids, cohesionSlider.value() / separationSlider.value());
  
      alignment.mult(alignSlider.value());
      // cohesion.mult(cohesionSlider.value());
      separation.mult(separationSlider.value());
  
      this.acceleration.add(alignment);
      // this.acceleration.add(cohesion);
      this.acceleration.add(separation);
    }
  
    update() {
      this.position.add(this.velocity);

      this.velocity.add(this.acceleration);
      this.velocity.limit(this.maxSpeed);

      let absVelocity = this.velocity.mag();
      if (absVelocity < this.minSpeed) {
        const speedUpVector = this.velocity.copy().normalize().mult(this.minSpeed / 2)
        this.forceVectors.push([speedUpVector, [0, 255, 0]]);
        this.acceleration.add(speedUpVector);
      }
      this.acceleration.limit(this.maxForce);
      
      this.acceleration.mult(0);
    }
  
    show(drawAuxiliary = false) {
      push();

      translate(this.position.x, this.position.y);
      rotate(atan2(this.velocity.y, this.velocity.x));

      this.drawFireHelicopter();
      if (drawAuxiliary) {
        this.drawAuxiliaryLocal();
      }

      pop();

      if (drawAuxiliary) {
        this.drawAuxiliaryGlobal();
      }

      this.even = !this.even;
    }

    drawFireHelicopter(){
      stroke(255, 0, 0);
      fill(125);
      triangle(0, 2, 0, -2, -this.radius*2, 0);
      ellipse(0, 0, this.radius * 2, 4);
      // blades
      strokeWeight(1);
      stroke(127);
      // front
      const bladeRadius = (this.comfortZone + this.radius) / 2;
      let bladeAngle = 1.0;
      if (this.even) {
        bladeAngle += 1;
      } 
      const n = 4;
      for (let i = 0; i < n; i++) {
        line(0, 0, bladeRadius * cos(bladeAngle + i * 2 * PI / n), bladeRadius * sin(bladeAngle + i * 2 * PI / n));
      }
      // // back
      // if (this.even) {
      //   line(-8, 1, -this.radius*2-2, 1);
      // }else{
      //   line(-8-1, 1, -this.radius*2-2+1, 1);
      // }
    }

    drawBird(){
      stroke(255);
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
    }

    drawAuxiliaryLocal(){
      // point(this.position.x, this.position.y);
      stroke(0, 255, 0);
      strokeWeight(1);
      
      if (this.touched) {
        stroke(255, 0, 0, 150);
      }
      else{
        stroke(255, 0, 0, 50);
      }

      strokeWeight(1);
      noFill();
      ellipse(0, 0, (this.comfortZone + this.radius));

      if (this.forceVectors.length > 0) {
        stroke(255, 255, 0, 100);
        strokeWeight(1);
        noFill();
        ellipse(0, 0, (this.perceptionRadius)*2 - this.comfortZone - this.radius);

        stroke(0, 255, 255, 100);
        ellipse(0, 0, (this.directionalPerceptionRadius)*2 - this.comfortZone - this.radius);
      }

    }

    drawAuxiliaryGlobal(){

      // auxiliary visualization of force vectors
      strokeWeight(1);
      for (let forceVector of this.forceVectors) {
        let forcePart = forceVector[0];
        let colorPart = forceVector[1];
        stroke(colorPart);
        line(this.position.x, this.position.y, 
          this.position.x + forcePart.x*10, this.position.y + forcePart.y*10);
      }
      this.touched = false;
    }

  }
  
