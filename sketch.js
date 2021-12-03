/*

- Copy your game project code into this file
- for the p5.Sound library look here https://p5js.org/reference/#/libraries/p5.sound
- for finding cool sounds perhaps look here
https://freesound.org/


*/
//character actions
var gameChar_x;
var gameChar_y;
var floorPos_y;
var scrollPos;
var gameChar_world_x;
var isLeft;
var isRight;
var isFalling;
var isPlummeting;

//items
var trees_x;
var trees_y;
var clouds;
var mountains;
var canyons;
var collectables;

//character status
var game_score;
var flagpole;
var lives;
var lifeTokens;
var die;

//sound
var jumpSound;
var fallSound;

//platform
var platforms;


function preload()
{
    soundFormats('mp3','wav');
    
    //load your sounds here
    jumpSound = loadSound('assets/jump.mp3');
    jumpSound.setVolume(0.1);
    
    fallSound = loadSound('assets/fall.mp3');
    fallSound.setVolume(0.2);
}


function setup()
{
	createCanvas(1024, 576);
    floorPos_y = height * 3/4;
    lives = 3;
    
    lifeTokens = [
        {x_pos:150, y_pos:20},
        {x_pos:160, y_pos:20},
        {x_pos:170, y_pos:20}
    ];
    
    startGame();

}

function draw()
{
	
    
    background(100, 155, 255); // fill the sky blue

	noStroke();
	fill(0,155,0);
	rect(0, floorPos_y, width, height/4); // draw some green ground
    
    push();
    translate(scrollPos, 0);
    
    
    

	// Draw clouds.
    drawClouds();

	// Draw mountains.
    drawMountains()

	// Draw trees.
    drawTrees();

	// Draw canyons.
    for(var i = 0; i < canyons.length; i++)
    {
        drawCanyon(canyons[i]);
        checkCanyon(canyons[i]);
    }

	// Draw collectable items.
    for(var i = 0; i < collectables.length; i++)
    {   
        if(collectables[i].isFound == false)
        {
            drawCollectable(collectables[i]);
            checkCollectable(collectables[i]);
        }
    }
    
    renderFlagpole();
    
    // Draw platforms.
    for(var i = 0; i < platforms.length; i++)
    {
        platforms[i].draw();
    }
    
    pop();

	// Draw game character.
	
	drawGameChar();
    
    //Score
    fill(255);
    noStroke();
    text("Score: " + game_score, 20, 20);
    
    //Lives
    drawLifeTokens();
    fill(255);
    noStroke();
    text("Lives: ", 110, 20);
    checkPlayerDie();
    
    //Game Over
    if(lives < 1)
    {
        push();
        fill(0);
        strokeWeight(50);
        textSize(40);
        text("Game over. Press space to continue.", 200, 300);
        pop();
        
        return null;
    }
    
    //Game Win
    if(flagpole.isReached)
    {
        push();
        fill(238,11,76);
        strokeWeight(50);
        textSize(40);
        text("Level complete. Press space to continue.", 200, 300);
        pop();
        
        return null;
    }

	// Logic to make the game character move or the background scroll.
	if(isLeft)
	{
		if(gameChar_x > width * 0.2)
		{
			gameChar_x -= 5;
		}
		else
		{
			scrollPos += 5;
		}
	}

	if(isRight)
	{
		if(gameChar_x < width * 0.8)
		{
			gameChar_x  += 5;
		}
		else
		{
			scrollPos -= 5; // negative for moving against the background
		}
	}

	// Logic to make the game character rise and fall.
    
    if(gameChar_y < floorPos_y)
    {
        var isContact = false;
        
        for(var i = 0; i < platforms.length; i++)
        {
            if(platforms[i].checkContact(gameChar_world_x, gameChar_y) == true)
            {
                isContact = true;
                break;
            };
        };
        
        if(isContact == false)
        {
            isFalling = true;
            gameChar_y += 2.5;
        }
    }
    else
    {
        isFalling = false;
    };
    
    
    //Logic to make the flag rise and fall.
    if(flagpole.isReached == false)
    {
        checkFlagpole();
    }
    

	// Update real position of gameChar for collision detection.
	gameChar_world_x = gameChar_x - scrollPos;
}


// ---------------------
// Key control functions
// ---------------------

function keyPressed(){

	console.log("press" + keyCode);
	console.log("press" + key);
    
    if(keyCode == 37)
    {
        console.log("left arrow");
        isLeft = true;
    }
    else if(keyCode == 39)
    {
        console.log("right arrow");
        isRight = true;
    }
    else if(keyCode == 32 && gameChar_y == floorPos_y)
    {
        console.log("space-bar");
        gameChar_y -= 100;
        jumpSound.play();
        
    }

}

function keyReleased()
{

	console.log("release" + keyCode);
	console.log("release" + key);
    
    if(keyCode == 37)
    {
        console.log("left arrow");
        isLeft = false;
    }
    else if(keyCode == 39)
    {
        console.log("right arrow");
        isRight = false;
    }

}


// ------------------------------
// Game character render function
// ------------------------------

// Function to draw the game character.

function drawGameChar()
{
	
    // draw game character
    noStroke();
    
    if(isLeft && isFalling)
	{
		// add your jumping-left code
        fill(245,222,155);
        ellipse(gameChar_x, gameChar_y-60, 20);
    
        fill(0,107,182);
        triangle(
        gameChar_x-13,gameChar_y-50,
        gameChar_x+13,gameChar_y-50,
        gameChar_x,gameChar_y-16
        );
    
        fill(253,185,39);
        rect(gameChar_x-12,gameChar_y-14,8,7);
        rect(gameChar_x,gameChar_y-14,8,14)

	}
	else if(isRight && isFalling)
	{
		// add your jumping-right code
        fill(245,222,155);
        ellipse(gameChar_x, gameChar_y-60, 20);
    
        fill(0,107,182);
        triangle(
            gameChar_x-13,gameChar_y-50,
            gameChar_x+13,gameChar_y-50,
            gameChar_x,gameChar_y-16
        );
    
        fill(253,185,39);
        rect(gameChar_x-8,gameChar_y-14,8,14);
        rect(gameChar_x+4,gameChar_y-14,8,7)

	}
	else if(isLeft)
	{
		// add your walking left code
        fill(245,222,155);
        ellipse(gameChar_x, gameChar_y-60, 20);
    
        fill(0,107,182);
        triangle(
            gameChar_x-13,gameChar_y-50,
            gameChar_x+13,gameChar_y-50,
            gameChar_x,gameChar_y-16
        );
    
        fill(253,185,39);
        rect(gameChar_x-12,gameChar_y-14,8,14);
        rect(gameChar_x,gameChar_y-14,8,14)
        

	}
	else if(isRight)
	{
		// add your walking right code
        fill(245,222,155);
        ellipse(gameChar_x, gameChar_y-60, 20);
    
        fill(0,107,182);
        triangle(
            gameChar_x-13,gameChar_y-50,
            gameChar_x+13,gameChar_y-50,
            gameChar_x,gameChar_y-16
        );
    
        fill(253,185,39);
        rect(gameChar_x-8,gameChar_y-14,8,14);
        rect(gameChar_x+4,gameChar_y-14,8,14)


	}
	else if(isFalling || isPlummeting)
	{
		// add your jumping facing forwards code
        fill(245,222,155);
        ellipse(gameChar_x, gameChar_y-60, 20);
    
        fill(0,107,182);
        rect(gameChar_x-13,gameChar_y-50,26,36);

        fill(253,185,39);
        rect(gameChar_x-13,gameChar_y-16,8,7);
        rect(gameChar_x+5,gameChar_y-16,8,7)

	}
	else
	{
		// add your standing front facing code
        fill(245,222,155);
        ellipse(gameChar_x, gameChar_y-60, 20)

        fill(0,107,182);
        rect(gameChar_x-13,gameChar_y-50,26,36);

        fill(253,185,39);
        rect(gameChar_x-13,gameChar_y-14,8,14);
        rect(gameChar_x+5,gameChar_y-14,8,14)

	}
}

// ---------------------------
// Background render functions
// ---------------------------

// Function to draw cloud objects.
function drawClouds()
{
    for(var i = 0; i < clouds.length; i++)
    {
        noStroke();
        fill(255,255,255);
        ellipse(clouds[i].x_pos+20,clouds[i].y_pos+5,clouds[i].size*2,clouds[i].size*0.9);
        ellipse(clouds[i].x_pos,clouds[i].y_pos,clouds[i].size);
        ellipse(clouds[i].x_pos,clouds[i].y_pos-5,clouds[i].size);
        ellipse(clouds[i].x_pos+35,clouds[i].y_pos-10,clouds[i].size+10);
    }
}

// Function to draw mountains objects.
function drawMountains()
{
    for(var i = 0; i < mountains.length; i++)
    {
        fill(140,116,108);
        quad(
            mountains[i].x_pos-100, mountains[i].y_pos,
            mountains[i].x_pos+100, mountains[i].y_pos,
            mountains[i].x_pos+70, mountains[i].y_pos-152,
            mountains[i].x_pos-70, mountains[i].y_pos-152
            );
        ellipse(mountains[i].x_pos,mountains[i].y_pos-152,140,70);
        quad(
            mountains[i].x_pos+80, mountains[i].y_pos,
            mountains[i].x_pos+200, mountains[i].y_pos,
            mountains[i].x_pos+170, mountains[i].y_pos-122,
            mountains[i].x_pos+110, mountains[i].y_pos-122,
        );
        ellipse(mountains[i].x_pos+140,mountains[i].y_pos-122,60,30);
    }
}

// Function to draw trees objects.
function drawTrees()
{
    for(var i = 0; i < trees_x.length; i++)
    {
        fill(95,71,63);
        rect(trees_x[i],trees_y,20,100);

        fill(65,133,21);
        triangle(
            trees_x[i]-40,trees_y+35,
            trees_x[i]+60,trees_y+35,
            trees_x[i]+10,trees_y-20,
        );
        triangle(
            trees_x[i]-30,trees_y-5,
            trees_x[i]+50,trees_y-5,
            trees_x[i]+10,trees_y-40
        );  
    }
}

// ---------------------------------
// Canyon render and check functions
// ---------------------------------

// Function to draw canyon objects.

function drawCanyon(t_canyon)
{
    fill(105,188,227);
    rect(t_canyon.x_pos, floorPos_y, t_canyon.width, height);
}

// Function to check character is over a canyon.

function checkCanyon(t_canyon)
{
    if(
        gameChar_world_x > t_canyon.x_pos && 
        gameChar_world_x < (t_canyon.x_pos + t_canyon.width) && 
        gameChar_y >= floorPos_y
    ){
        isPlummeting = true;
        console.log("over the canyon") 
    }
    else{
        isPlummeting = false;
    };
    
    if(isPlummeting)
    {
        gameChar_y += 5;
    };
    
    
}

// ----------------------------------
// Collectable items render and check functions
// ----------------------------------

// Function to draw collectable objects.

function drawCollectable(t_collectable)
{
    noStroke();
    fill(213,41,7);
    ellipse(t_collectable.x_pos,t_collectable.y_pos, t_collectable.size);
    stroke(0);
    line(
        t_collectable.x_pos+5*(t_collectable.size/30),t_collectable.y_pos-5*(t_collectable.size/30),
        t_collectable.x_pos+14*(t_collectable.size/30),t_collectable.y_pos-16*(t_collectable.size/30),
        )
}

// Function to check character has collected an item.

function checkCollectable(t_collectable)
{
    if(
        dist(
            gameChar_world_x,
            gameChar_y,
            t_collectable.x_pos,
            t_collectable.y_pos,
        ) < 20
    ){
        t_collectable.isFound = true;
        console.log("Get!");
        game_score += 1;
    }
}

function renderFlagpole()
{
    push();
    
    //to draw the flagpole
    stroke(195,191,190);
    strokeWeight(5);
    line(flagpole.x_pos, floorPos_y, flagpole.x_pos, floorPos_y - 150);
    
    //to draw the flag
    fill(107, 46,144);
    noStroke();
    
    if(flagpole.isReached)
    {   
        rect(flagpole.x_pos, floorPos_y - 150, 80, 50);
    }
    else
    {
        rect(flagpole.x_pos, floorPos_y - 50, 80, 50);
    }   
    
    pop();
}

function checkFlagpole()
{
    var distance = abs(gameChar_world_x - flagpole.x_pos);
    
    if(distance < 10)
    {
        flagpole.isReached = true;
    }
}

function checkPlayerDie()
{
    if(gameChar_y > floorPos_y) 
    {
        die = true;
        
    };
    
    if(die && gameChar_y > height)
    {
        lives -= 1;
        startGame();
        fallSound.play();
    };
    
}

function startGame()
{
    gameChar_x = width/2;
	gameChar_y = floorPos_y;

	// Variable to control the background scrolling.
	scrollPos = 0;

	// Variable to store the real position of the gameChar in the game
	// world. Needed for collision detection.
	gameChar_world_x = gameChar_x - scrollPos;

	// Boolean variables to control the movement of the game character.
	isLeft = false;
	isRight = false;
	isFalling = false;
	isPlummeting = false;

	// Initialise arrays of scenery objects.
    trees_x = [100, 200, 450, 500, 850, 1000, 1200, 1550, 1600, 1900];
    trees_y = floorPos_y-100;
    
    clouds = [
        {x_pos: 160, y_pos: 115, size:50},
        {x_pos: 400, y_pos: 80, size:60},
        {x_pos: 760, y_pos: 115, size:50},
        {x_pos: 320, y_pos: 130, size:40},
        {x_pos: 500, y_pos: 80, size:70},
        {x_pos: 860, y_pos: 115, size:50},
        {x_pos: 1100, y_pos: 80, size:60},
        {x_pos: 1460, y_pos: 115, size:50},
        {x_pos: 1020, y_pos: 130, size:40},
        {x_pos: 1200, y_pos: 80, size:70}
    ];
    
    mountains = [
        {x_pos: 100, y_pos: floorPos_y},
        {x_pos: 700, y_pos: floorPos_y},
        {x_pos: 1200, y_pos: floorPos_y},
        {x_pos: 1800, y_pos: floorPos_y}
    ];
    
    canyons = [
        {x_pos: 300, width: 70},
        {x_pos: 900, width: 70},
    ];
    
    collectables = [
        {x_pos: 100, y_pos: floorPos_y-15, size: 30, isFound: false},
        {x_pos: 200, y_pos: floorPos_y-15, size: 30, isFound: false},
        {x_pos: 600, y_pos: floorPos_y-15, size: 30, isFound: false},
        {x_pos: 800, y_pos: floorPos_y-15, size: 30, isFound: false}
    ];
    
    platforms = [];
    platforms.push(createPlatforms(490, floorPos_y-70, 80));
    
    game_score = 0;
    
    flagpole = {isReached: false, x_pos: 1800};
    
    die = false;
}

function drawLifeTokens()
{
    for(var i = 0; i < lives; i++)
    {
        noStroke();
        fill(236,120,17);
        ellipse(lifeTokens[i].x_pos, lifeTokens[i].y_pos-3, 8);   
    }
}

function createPlatforms(x, y, length)
{
    var p = {
        x: x,
        y: y,
        length: length,
        draw: function()
        {
            noStroke();
            fill(230, 222, 197);
            rect(this.x, this.y, this.length, 20);
        },
        checkContact: function(gameChar_x, gameChar_y)
        {
            if(gameChar_x > this.x && gameChar_x < this.length)
            {
                console.log("inline");
                var d = this.y - gameChar_y;
                if(d >=0 && d < 5)
                {
                    console.log("above platform")
                    return true;
                }
            }
            return false;
        },
    }
    return p;
}







