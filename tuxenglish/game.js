String.prototype.capitalizeFirstLetter = function() {
    return this.charAt(0).toUpperCase() + this.slice(1);
}

var game_object=(function(){ 

var width ;
var height ;
var pipe_velocity;    
var game ;
var game_state = {};
var pipes_incoming ,
    flag ,
    count ,
    correct_option,
    bird_position,
    game_started,
    total_marks ;

var option=[];

var animals = ["ant","cat","dog","elephant","fish","hen","insect","giraffe","hen","insect","kingfisher",
"lion","monkey","nutria","owl","parrot","quail","rat","tiger"];

//console.log(animals.length);

game_state.main = function() { };
game_state.main.prototype = {
   
    preload: function() {
        this.game.stage.backgroundColor = '#71c5cf';
        this.game.load.image('bird', 'characters/fairy.png');  
        //this.game.load.image('pipe', 'assets/pipe.png');
        this.game.load.image('ground', 'assets/ground.png');
        this.game.load.audio('flap', 'assets/flap.ogg');
        this.game.load.audio('music', 'assets/music.ogg');
        this.game.load.audio('point', 'assets/point.ogg');
        this.game.load.audio('nope', 'assets/nope.ogg');
        this.game.load.audio('die', 'assets/die.ogg');
    	
    	for(x in animals){
    		this.game.load.image(animals[x],"characters/"+animals[x]+"100.png");
    	}
    },

    create: function() { 
        this.bird = this.game.add.sprite(100, 105, 'bird');
        this.bird.anchor.setTo(0.5, 0.5);

        //this.option = [];/*
        for(x in animals){
        	// console.log(animals[x]);
			 option[x] = this.game.add.sprite(width,50,animals[x]);	
        }
        
        var space_key = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
        space_key.onDown.add(this.jump, this); 

        //add the pipes
        this.pipe = this.game.add.sprite(-width,height/2,'pipe');

        // Add ground tiles
        this.ground = game.add.tileSprite(0, game.world.height - 32, game.world.width, 32, 'ground');
        this.ground.tileScale.setTo(2, 2);
        
        // Timer that calls 'add_options' ever 4 seconds
        this.timer = this.game.time.events.loop(4000, this.add_options, this);
        
        // Add a score label on the top left of the screen
        this.score = 0;
        var style = { font: "30px Arial", fill: "#ffffff" };
        this.label_score = this.game.add.text(20, 20, "0", style);
        
        //Add the text boxes to contain question and answers
        this.question = this.add.text(width/2-100, height-70, "Collect the Animal",style);
        this.result = this.add.text(width/2-100, 50, "Go ahead...",style);
        this.option1_tb = this.add.text(-width, height/2, "", style);
        this.option2_tb = this.add.text(-width, height-90, "", style);

        this.instruction_tb = this.add.text(width/2-200, height/2-50, "Press Space Key to start the Game", style);
        this.result_tb = this.add.text(width, height/2-20, "Correct", { font: "20px Arial", fill: "#ffffff" });
        
        this.flap = game.add.audio('flap',0.1);
        this.point = game.add.audio('point',0.1);
        this.nope = game.add.audio('nope',0.1);
        this.die = game.add.audio('die',0.1);
        
        //Start the game on pressing the space key
        space_key.onDown.addOnce(this.start, this);
    },
    start: function(){
        game_started = true;
        this.bird.body.gravity.y = 1000;
        this.instruction_tb.position.x = -width;
    },
    // This function is called 60 times per second
    update: function() {
        if(game_started == false)
            return 0;
        if (this.bird.inWorld == false || this.bird.position.y > height - 50)
            this.game_over(); 
        this.game.physics.overlap(this.bird, this.pipe, this.game_over, null, this);
        this.game.physics.overlap(this.bird, this.ground, this.game_over, null, this);
        
        if(this.bird.position.y < height/2){    bird_position = 'up'; }
        else{ bird_position = 'down'; }
        this.result.content="";

        if(this.x < 100 && flag == true)
            {
            	if(correct_option==1&&bird_position=="up"||correct_option==0&&bird_position=="down"){
            		this.score = this.score+1;

            		this.result.content = "CORRECT :) ";
            	}
            	else{
            		this.result.content = "";
            	}
            }
        
        if (pipes_incoming == true)
        	//this.question_tb.x -=pipe_velocity/60;
            this.option1_tb.x -= pipe_velocity/60;
            this.option2_tb.x -= pipe_velocity/60;
        
        this.ground.tilePosition.x -= pipe_velocity/160;
        if (this.bird.angle < 20)
            this.bird.angle += 1;
        
    },
    game_over: function(){
    	console.log("Game Over !");
        this.die.play();
        game_started = false;
        this.restart_game();
        var space_key = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
        space_key.onDown.addOnce(this.start, this);
    },
    jump: function() {
        // Add a vertical velocity to the bird
        this.bird.body.velocity.y = -350;
        this.game.add.tween(this.bird).to({angle: -20}, 100).start();
        this.flap.play();
    },

    restart_game: function() {
        this.game.time.events.remove(this.timer);
        this.game.state.start('main');
    },

    add_options: function() {
        if(game_started == false)
            return 0;
        var r = Math.floor(100 + Math.random()*60); 
        
        var random_animal2 = Math.floor(Math.random()*animals.length); 
        
        var random_animal = Math.floor(Math.random()*animals.length);
        random_animal = (random_animal + random_animal2+5)%animals.length;
        
        this.question.content = animals[random_animal2].capitalizeFirstLetter();

        
        
        pipes_incoming = true;
        flag = true;
        var mid = height/2+100;
		total_marks = total_marks + 1;
		console.log(animals[random_animal]+animals[random_animal2]);
        
        correct_option = Math.floor(Math.random()*2);

        if(correct_option==1){
        //Place the correct option at UP
        option[random_animal].reset(width,mid/2+100,1);
        option[random_animal].body.velocity.x = -pipe_velocity;
        
		option[random_animal2].reset(width,mid/2-100,1);
        option[random_animal2].body.velocity.x = -pipe_velocity;
        }
        else{

        option[random_animal].reset(width,mid/2-100,1);
        option[random_animal].body.velocity.x = -pipe_velocity;
        
		option[random_animal2].reset(width,mid/2+100,1);
        option[random_animal2].body.velocity.x = -pipe_velocity;

        }

       },
     show_result:function(op,bp) {
        flag = false;
        if(op == bp){
            this.score+=1;
            this.label_score.content = "Marks"+this.score+"/"+this.total_marks;
            this.result_tb.content = "Correct";
            this.point.play();
        }
        else{
            this.result_tb.content = "Wrong";
            this.nope.play();
        }
        this.game.add.tween(this.result_tb).to({x:width/2}, 100).to({x:width/2}, 1000).to({x:width}, 100).start();
        this.option1_tb.x  = -width;
        this.option2_tb.x  = -width;
    },
};

return {
	initialize:function(){
	 width = 700;
    height = 500;
    pipe_velocity = 200; 
    pipes_incoming = false;
    flag = false;
    game_started = false;
    count = 0,
    total_marks=0 ; 

    game = new Phaser.Game(width,height, Phaser.AUTO, 'game_div');
	game.state.add('main', game_state.main);  
	game.state.start('main'); 
	}
}
})();
game_object.initialize();