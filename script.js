const canvas = document.querySelector("canvas");
const context = canvas.getContext("2d");

class Bear {
  constructor() {
    this.xPosition = 50;
    this.yPosition = 50;
    this.width = 50;
    this.height = 70;
    this.score = 0;
    this.bearImage = new Image();
    this.bearImage.src = "images/Grumpy_bear.png";
    this.keyBindings();
  }

  //if i am erasing the keybindings function the bear is not getting rendered..??? why?
  keyBindings() {
    document.addEventListener("keydown", (event) => {
      //console.log("What is the keycode?" + event.keyCode);
      switch (event.keyCode) {
        case 38:
          this.moveUp();
          this.drawBear();
          break;
        case 40:
          this.moveDown();
          this.drawBear();
          break;
      }
    });
  }

  runLogic() {
    this.draggingDown();
  }

  drawBear() {
    context.drawImage(
      this.bearImage,
      this.xPosition,
      this.yPosition,
      this.width,
      this.height
    );
  }

  moveUp() {
    this.yPosition = this.yPosition - 10;
  }

  moveDown() {
    this.yPosition = this.yPosition + 10;
  }

  draggingDown() {
    let speed = Math.max((this.score * -1) / 60, 0);
    this.yPosition += speed;
  }

  isColliding(obstacle) {
    //collision with bear heart
    let bearhitline = this.xPosition + this.width;
    return (
      bearhitline >= obstacle.x &&
      this.yPosition < obstacle.y + obstacle.height &&
      this.yPosition + this.height > obstacle.y
    );
  }
}

///////////////////////////////////////////////////////////////
class Hearts {
  constructor(speed = 1) {
    this.heartImage = new Image();
    this.heartImage.src = "images/heart_pixel.png";
    this.x = canvas.width;
    this.y = Math.random() * canvas.height;
    this.speed = speed;
    this.width = 30;
    this.height = 30;
  }

  runLogic() {
    this.x -= this.speed;
  }

  isOutofBounds() {
    return this.x + this.width < 0;
  }

  draw() {
    //console.log(this.x + "this is y:" + this.y);
    context.drawImage(this.heartImage, this.x, this.y, this.width, this.height);
  }
}
/////////////////////////////////////////////////////////////

class Clouds {
  constructor(speed = 1) {
    this.cloudImage = new Image();
    this.cloudImage.src = "images/rain_cloud.png";
    this.x = canvas.width;
    this.y = Math.random() * canvas.height;
    this.width = 30;
    this.height = 30;
    this.speed = speed;
  }

  runLogic() {
    this.x -= this.speed;
  }

  isOutofBounds() {
    return this.x + this.width < 0;
  }

  draw() {
    //console.log(this.x + "this is y:" + this.y);
    context.drawImage(this.cloudImage, this.x, this.y, this.width, this.height);
  }
}

//////////////////////////////////////////////////////
class Game {
  constructor() {
    this.newBear = new Bear();
    //this.clouds = [];
    //this.hearts = [];
    this.obstacles = [];
  }

  loop() {
    if (Math.random() < 0.03) {
      //the whole thing runs only for 3% of the loops
      if (Math.random() < 0.4) {
        //only 40% of the time there is a heart
        this.obstacles.push(new Hearts(Math.ceil(Math.random() * 6)));
        //initialises new object with random speed that is pushed into obstacles array
      } else {
        this.obstacles.push(new Clouds(6));
        //always high speed
      }
    }
    //eliminating obstacles that are out of the screen from the list
    for (let value of this.obstacles) {
      //console.log(this.obstacles.length + " " + value.isOutofBounds())
      if (value.isOutofBounds()) {
        const obstindex = this.obstacles.indexOf(value);
        //console.log('delete index %d', obstindex);
        this.obstacles.splice(obstindex, 1);
      }
    }

    this.newBear.runLogic();
    //executes the method by which y gets incremented

    for (let o of this.obstacles) {
      //iterating through every object in the list obstacles
      o.runLogic();
      //drawing every object in the list
      if (this.newBear.isColliding(o)) {
        const obstindex = this.obstacles.indexOf(o);
        //when there is a collision, I want the score to change +
        //eliminating every object that is intersecting with the bear
        if (o instanceof Hearts) {
          this.newBear.score += 10;
        } else if (o instanceof Clouds) {
          this.newBear.score -= 40;
        }

        console.log(this.newBear.score);
        this.obstacles.splice(obstindex, 1);
      }
    }

    this.draw();
    //executes the method by which the canvas gets cleared and then the player drawn

    setTimeout(() => {
      this.loop();
    }, 1000 / 30);
    //the mehod this.loop gets called again after every 1000/30
  }

  draw() {
    context.clearRect(0, 0, canvas.width, canvas.height);
    // Call draw method for every "element" in game

    this.newBear.drawBear();

    for (let o of this.obstacles) {
      //calling the runLogic for every object
      o.draw();
    }
  }
}

/////////////////////////////////////////////////////

/* 

setTimeout erwartet eine Funktion. Die kann auf verschiedene Weisen übergeben werden:

function initBear() {
  newBear.drawBear()
};
//setTimeout(initBear, 500);

const initialiseBear = initBear;
//setTimeout(initialiseBear, 500);


//setTimeout(() => { newBear.drawBear() }, 500);
// >> () => { } denotes a function
//drawBear is a method, not a function, it needs to be encapsulated like this 

*/
/////////////////////////////////////////////////////

const game = new Game();
game.loop();
