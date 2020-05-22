var bSlider, brushVal, clr;
var btn1, btn2, indexRef, db;
var sPos = [];
var tool = "brush";
var userRef;
var allUsers;

function setup() {
  createCanvas(550, 450);
  db = firebase.database();
  
  db.ref('index').once('value', (data) => {
    indexRef = data.val() + 1;
    db.ref('/').set({
      index: indexRef
    });
  });

  db.ref('users').on('value', (data) => {
    allUsers = data.val();
  });

  bSlider = createSlider(3, 35, 18, 2);
  bSlider.position(30, 430);

  clr = createInput("", 'color');
  clr.position(200, 430);

  btn1 = createButton("Brush");
  btn1.position(350, 406);
  btn2 = createButton("Eraser");
  btn2.position(350, 435);
}

function draw() {
  background(255);
  rectMode(CENTER);
  ellipseMode(CENTER);
  
  // Text
  fill("black");
  noStroke();
  textSize(15);
  text("Stroke Weight:", 35, 410);
  text("Stroke Colour:", 190, 410);

  // Strokes
  for (var s in sPos) {
    if (sPos[s][4] == "brush") {
      fill(sPos[s][3]);
      noStroke();
      ellipse(sPos[s][0], sPos[s][1], sPos[s][2]);
    }
    
    if (sPos[s][4] == "eraser") {
      fill("white");
      noStroke();
      rect(sPos[s][0], sPos[s][1], sPos[s][2] + 5, sPos[s][2] + 5);
    }
  }

  if (allUsers != null){
    for (var value of Object.values(allUsers)) {
      for (var v of Object.values(value)) {
        for (var cords of Object.values(v)) {
          noStroke();
          if (cords[4] == "brush") {
            fill(cords[3]);
            ellipse(cords[0], cords[1], cords[2]);
          }
          if (cords[4] == "eraser") {
            fill("white");
            rect(cords[0], cords[1], cords[2], cords[2]);
          }
        }
      }
    }
  }


  // Border
  stroke("black");
  textSize(15);
  strokeWeight(3);
  line(0, 390, 550, 390);

  // Tool Indicator
  if (tool == "brush") {
    stroke("black")
    strokeWeight(1);
    fill(clr.value());
    
    if (mouseX < 535 && mouseX > 10 && mouseY < 375 && mouseY > 10) {
      ellipse(mouseX, mouseY, bSlider.value());
    } else {
      ellipse(30, 360, bSlider.value());
    }

  } else if (tool == "eraser") {
    stroke("black");
    strokeWeight(1);
    fill("white");
    if (mouseX < 530 && mouseX > 10 && mouseY < 380 && mouseY > 10) {
      rect(mouseX, mouseY, bSlider.value() + 5, bSlider.value() + 5);
    } else {
      rect(30, 360, bSlider.value() + 5, bSlider.value() + 5);
    }
  }

  // Buttons
  btn1.mousePressed(() => {
    tool = "brush";
  })

  btn2.mousePressed(() => {
    tool = "eraser";
  })

  userRef = "users/user" + indexRef;
  db.ref(userRef).update({
    co_ords: sPos,
    turn: 0
  });
}

function mouseDragged() {
  if (mouseX < 530 && mouseX > 10 && mouseY < 380 && mouseY > 10) {
    sPos.push([Math.round(mouseX), Math.round(mouseY), bSlider.value(), clr.value(), tool]);
  }
}

function keyPressed() {
  if (keyCode == 66) {
    tool = "brush";
  } else if (keyCode == 69) {
    tool = "eraser";
  }
}
