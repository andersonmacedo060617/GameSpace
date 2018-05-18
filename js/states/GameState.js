var GameSpace = GameSpace || {}

var FIRE = 0, EXPLOSION = 1;

GameSpace.GameState = {
    init: function () {
        //seta a escala do jogo
        this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
        //alinhamento horizontal 
        this.scale.pageAlignHorizontally = true;
        //alinhamento vertical
        this.scale.pageAlignVertically = true;

        //criar o controle.
        this.cursors = this.game.input.keyboard.createCursorKeys();

        //seta o tamanho da fase
        this.game.world.setBounds(0, 0, 1000, 592);

        this.score = 0;

    },

    preload: function () {
        this.load.image('background1', 'assets/image/background1.png');

        this.load.spritesheet('meteor1', 'assets/image/meteor1_spriteSheet.PNG', 64, 64, 16, 0, 0);
        this.load.spritesheet('meteor2', 'assets/image/meteor2_spriteSheet.png', 64, 64, 16, 0, 0);
        this.load.spritesheet('meteor3', 'assets/image/meteor3_spriteSheet.png', 64, 64, 16, 0, 0);

        this.load.spritesheet('ship1', 'assets/image/ship1_spriteSheet.png', 128, 128, 16, 0, 0);
        this.load.spritesheet('ship2', 'assets/image/ship2_spriteSheet.png', 128, 128, 16, 0, 0);
        this.load.spritesheet('ship3', 'assets/image/ship3_spriteSheet.png', 128, 128, 16, 0, 0);
        this.load.spritesheet('ship4', 'assets/image/ship4_spriteSheet.png', 128, 128, 16, 0, 0);
        this.load.spritesheet('ship5', 'assets/image/ship5_spriteSheet.png', 128, 128, 16, 0, 0);


        //this.load.image('rocket', 'assets/image/rocket.png');
        this.load.spritesheet('rocket', 'assets/image/rocket_spriteSheet.png', 128, 128, 63, 0, 0);
        this.load.spritesheet('fire1', 'assets/image/fire1.png', 32, 64);
        this.load.spritesheet('rocketTail', 'assets/image/rocketTail.png', 64, 128);

        this.load.image('mothership', 'assets/image/mothership.png');
        this.load.image('missile', 'assets/image/missile.png');
        this.load.image('star', 'assets/image/star.png');

        //carregar arquivo de dados - Configurações json
        this.load.text('level', 'assets/data/level.json');

        this.load.audio('music', 'assets/sound/music.mp3');
        this.load.audio('soundFire', 'assets/sound/fire.mp3');

    },

    create: function () {

        //faz parse de arquivos json
        this.levelData = JSON.parse(this.game.cache.getText('level'));
        this.habilitaNave == false;



        this.life = this.levelData.level1.rocket.life;
        this.lifeMothership = this.levelData.level1.mothership.life;
        this.sound['fire'] = game.add.audio('soundFire');
        this.sound['music'] = game.add.audio('music');

        if(this.levelData.config.music){
            this.sound['music'].play();
        }

        this.background1 = this.game.add.sprite(0, 0, 'background1');



        this.fireButton = this.input.keyboard.addKey(Phaser.KeyCode.SPACEBAR);

        this.fire = this.game.add.weapon(30, 'fire1');


        /* Rocket */

        this.rocketTail = this.criaSprite(
            this.game.world.centerX,
            this.game.world.centerY,
            'rocketTail',
            0.4,
            0.4,
            0.5,
            -0.56
        );

        this.rocket = this.criaSprite(
            this.game.world.centerX,
            this.game.world.centerY,
            this.levelData.level1.rocket.alias,
            this.levelData.level1.rocket.scaleX,
            this.levelData.level1.rocket.scaleY,
            0.5,
            0.5
        );

        this.stars = this.add.group();
        this.stars.enableBody = true;

        this.ships = this.add.group();
        this.ships.enableBody = true;

        this.meteors = this.add.group();
        this.meteors.enableBody = true;

        this.rocketTail.animations.add('run', null, 5, true);

        this.rocket.animations.add('rocket_center', [34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48], 5, true);
        this.rocket.animations.add('rocket_left', [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16], 5, true);
        this.rocket.animations.add('rocket_right', [17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31], 5, true);
        this.rocket.play('rocket_center');
        this.game.physics.arcade.enable(this.rocket);
        this.rocket.enableBody = true;
        // this.rocket.body.drag.set(70);
        this.rocket.body.maxVelocity.set(100);

        this.rocket.body.collideWorldBounds = true;

        /*Fim Rocket*/

        

        // this.fire.animations.add('fire1', null, 10, true);
        this.fire.trackSprite(this.rocket, 0, 0, false);
        //this.fire.play('fire1');
        // this.fire.bulletRotateToVelocity = true;

        this.fire.bulletAngleOffset = -90;
        //this.fire.rotate(90);
        this.fire.bulletKillType = Phaser.Weapon.KILL_WORLD_BOUNDS;
        this.fire.bulletSpeed = 600;
        this.fire.fireRate = 100;
        //console.log(this.rocket);

        
        //cria meteoros
        this.createMeteors();
        this.loopCreatorMeteor = this.game.time.events.loop(Phaser.Timer.SECOND * this.levelData.level1.meteors.frequencyMeteor, this.createMeteors, this);

        this.loopCreatorStar = this.game.time.events.loop(Phaser.Timer.SECOND * this.levelData.level1.stars.frequencyStar, this.createStar, this);


        this.criaHUD(); 

    },

    update: function () {


        //this.animationShips();

        //this.animationMothership();

        this.rocketDrive();


        this.fire.fireAngle = this.rocket.angle - 90;



        this.game.physics.arcade.overlap(this.rocket, this.meteors, null, this.morreMeteor, this);
        this.game.physics.arcade.overlap(this.rocket, this.stars, null, this.coletarEstrelas, this);
        this.game.physics.arcade.overlap(this.fire.bullets, this.meteors, null, this.destroiMeteoro, this);
        this.game.physics.arcade.overlap(this.rocket, this.mothership, null, this.morreMothership, this);
        this.game.physics.arcade.overlap(this.rocket, this.ships, null, this.overlapRocketShip, this);
        this.game.physics.arcade.overlap(this.mothership, this.fire.bullets, null, this.detroiMothership, this);
    },

    createMeteors: function () {

        var sideInit = Math.floor((Math.random() * 4));
        //console.log(sideInit);


        var meteor;

        var sideInit = Math.floor((Math.random() * 4));
        //console.log(sideInit);

        var initY, initX, finalX, finalY;

        //sideInit 0 Lador esquerdo
        if (sideInit == 0) {
            initX = -200;
            initY = Math.floor((Math.random() * 552) + 20);
            finalX = 1200;
            finalY = Math.floor((Math.random() * 552) + 20);
        } else if (sideInit == 1) {//sideInit 1 Lado Direito
            initX = 1200;
            initY = Math.floor((Math.random() * 552) + 20);
            finalX = -200;
            finalY = Math.floor((Math.random() * 552) + 20);
        } else if (sideInit == 2) {//sideInit 2 Topo da tela
            initX = Math.floor((Math.random() * 960) + 20);
            initY = -200;
            finalX = Math.floor((Math.random() * 960) + 20);
            finalY = 700;
        } else {// senão parte inferior da tela
            initX = Math.floor((Math.random() * 960) + 20);
            initY = 700;
            finalX = Math.floor((Math.random() * 960) + 20);
            finalY = -200;
        }



        // tamanho gerado de forma random
        var sizeMeteor = Math.floor((Math.random() * 2) + 1);

        //var meteor = this.meteors.getFirstExists(false);

        meteor = this.meteors.create(initX, initY, 'meteor' + Math.floor((Math.random() * 3) + 1));


        var meteorMoving = this.game.add.tween(meteor);
        meteorMoving.to({x: finalX, y: finalY}, this.levelData.level1.meteors.velocityMeteor);

        meteor.scale.setTo((sizeMeteor * 0.5) + 0.5);
        meteor.anchor.setTo(0.5);


        meteor.animations.add('spin', null, 5, true);
        meteor.play('spin');



        meteorMoving.start();

    },

    createShips: function () {
        this.ships = this.add.group();
        this.ships.enableBody = true;
        var ship;
        var numShip;

        this.levelData.level1.ships.forEach(function (element) {
            numShip = Math.floor((Math.random() * 5) + 1);
            ship = this.ships.create(element.x, element.y, 'ship' + numShip);
            ship.scale.setTo(element.scale);
            ship.anchor.setTo(0.5);
            ship.angle = numShip * 9;

            ship.animations.add('spin', null, 10, true);
            ship.play('spin');
        }, this);
    },


    criaSprite: function (positionX, positionY, alias, scaleObjectX, scaleObjectY, achorObjectX, achorObjectY) {
        var obj = this.game.add.sprite(positionX, positionY, alias);

        //seta a escala do objeto
        obj.scale.setTo(scaleObjectX, scaleObjectY);
        //seta ancora do objeto
        obj.anchor.setTo(achorObjectX, achorObjectY);

        return obj;
    },

    animationShips: function () {
        this.ships.forEach(function (element) {
            var angleMaxShips = this.levelData.level1.angleMaxShips;
            var angleShipsVariation = this.levelData.level1.angleShipsVariation;
            if (element.rotatePositive && element.angle < angleMaxShips) {
                element.angle += angleShipsVariation;
            } else if (!element.rotatePositive && element.angle > -angleMaxShips) {
                element.angle += -angleShipsVariation;
            } else if (element.rotatePositive && element.angle >= angleMaxShips) {
                element.angle = angleMaxShips;
                element.rotatePositive = false;
            } else if (!element.rotatePositive && element.angle <= -angleMaxShips) {
                element.angle = -angleMaxShips;
                element.rotatePositive = true;
            }
        }, this);
    },


    animationMothership: function () {
        var maxPositionX = this.levelData.level1.mothership.maxPositionX;
        var minPositionX = this.levelData.level1.mothership.minPositionX;
        var speedMovingX = this.levelData.level1.mothership.speedMovingX;
        var positionX = this.mothership.position.x;


        if (this.mothership.movingPositive && positionX < maxPositionX) {
            
            this.mothership.position.x += speedMovingX;
        } else if (!this.mothership.movingPositive && positionX > minPositionX) {
            
            this.mothership.position.x += -speedMovingX;
        } else if (this.mothership.movingPositive && positionX >= maxPositionX) {
            
            this.mothership.movingPositive = false;
            this.mothership.position.X = maxPositionX;
        } else if (!this.mothership.movingPositive && positionX <= minPositionX) {
            
            this.mothership.movingPositive = true;
            this.mothership.position.x = minPositionX;
        }
    },

    rocketDrive: function () {

        if (this.cursors.up.isDown) {

            game.physics.arcade.accelerationFromRotation(this.rocket.rotation - 1.5, 100, this.rocket.body.acceleration);
            this.rocketTail.top = this.rocket.bottom;
            this.rocketTail.position.x = this.rocket.x;
            this.rocketTail.button = this.rocket.bottom - 200;
            this.rocketTail.angle = this.rocket.angle;
            this.rocketTail.visible = true;
            this.rocketTail.play('run');
        }
        else {
            this.rocketTail.visible = false;
            this.rocket.body.acceleration.set(0);
        }

        if (this.cursors.left.isDown) {
            this.rocket.body.angularVelocity = -300;
        }
        else if (this.cursors.right.isDown) {
            this.rocket.body.angularVelocity = 300;
        }
        else {
            this.rocket.body.angularVelocity = 0;
        }

        if (this.fireButton.isDown) {
            if(this.levelData.config.sound){
                this.playSound(FIRE);  
            } 
            this.fire.fire();
        }

        game.world.wrap(this.rocket, 16);

    },

     render : function() {
        //game.debug.spriteInfo(this.rocket, 32, 100);
        
     },

    //criando os sons do jogo
    playSound: function (soundType) {
        var sound = document.createElement("audio");
        if (soundType === EXPLOSION) {
            sound.src = "assets/sound/explosion.mp3";
        } else {
            sound.src = "assets/sound/fire.mp3";
        }

        sound.addEventListener("canplaythrough", function () {
            sound.play();
        }, false);
    },

    createStar: function () {

       // var star = this.stars.getFirstExists(false);

        star = this.stars.create(Math.floor((Math.random() * 960) + 20), -100, 'star');

        var starMoving = this.game.add.tween(star);
        starMoving.to({x: Math.floor((Math.random() * 960) + 20), y: 1200}, this.levelData.level1.stars.velocityStar);

        starMoving.start();

    },

    coletarEstrelas: function (rocket, star) {
        star.kill();
        this.score += 10;
        this.txtHUD.text = 'SCORE: ' + this.score;


        if (this.score == this.levelData.level1.pointsObjective) {
            this.loopCreatorStar.loop = false;
            this.habilitaNave == true;
           

            //Mothership
            this.mothership = this.criaSprite(
                this.game.world.centerX,
                -100,
                this.levelData.level1.mothership.alias,
                this.levelData.level1.mothership.scaleX,
                this.levelData.level1.mothership.scaleY,
                0.5,
                0.5
            );
            game.physics.arcade.enable(this.mothership);

            this.lifeMothershipHUD = this.add.text(this.game.world.centerX, 50, "Mothership - " + this.lifeMothership, {fontSize: '20px', fill: '#D0171B'})
            this.lifeMothershipHUD.anchor.setTo(0.5);

            this.mothership.enableBody = true;
            this.mothership.movingPositive = true;

            var mothershipMoving = this.game.add.tween(this.mothership);
            mothershipMoving.to({y: 200}, 10000);
            mothershipMoving.start();

            this.loopMovingMotherShip = this.game.time.events.loop(Phaser.Timer.SECOND * 0.03, this.animationMothership, this);
            this.loopCreateShips = this.game.time.events.loop(Phaser.Timer.SECOND * 4, this.createShipMotherShip, this);
            //game.state.start('GameState');
        }
    },

    morreMeteor : function (rocket, meteor) {
        meteor.kill();

        this.life -= 1;
        this.lifeHUD.text = " X " + this.life;

        if(this.life == 0){
            game.state.start('GameState');
        }

    },

    morreMothership : function(){
        game.state.start('GameState');
    },

    destroiMeteoro : function (fire, meteor) {
        meteor.kill();
    },



    criaHUD : function  (){
        this.txtHUD = this.add.text(16, 16, 'SCORE: ' + this.score, {fontSize: '32px', fill: '#D0171B'});
        this.rocketHUD = this.game.add.sprite(this.game.world.width - 120, 16, 'rocket');
        this.rocketHUD.scale.setTo(0.35);
        this.lifeHUD = this.add.text(this.game.world.width - 90, 16, " X " + this.levelData.level1.rocket.life, {fontSize: '32px', fill: '#D0171B'})
    },

    createShipMotherShip : function(){

        var ship = this.ships.create(this.mothership.position.x, this.mothership.bottom - 30, 'ship1');

        ship.scale.setTo(0.7, 0.7);
        ship.enableBody = true;

        ship.animations.add('spin', null, 10, true);
        ship.play('spin');

        var shipmoving = this.game.add.tween(ship);
        shipmoving.to({x: Math.floor((Math.random() * 960) + 20), y: 650}, 10000);
        shipmoving.start();



    },

    overlapRocketShip : function(rocket, ship){
        ship.kill();
        this.life -= 1;
        this.lifeHUD.text = " X " + this.life;

        if(this.life == 0){
            game.state.start('GameState');
        }
    },

    detroiMothership : function(nave, fire){
        fire.kill();
        this.lifeMothership -= 1;
        this.lifeMothershipHUD.text = "Mothership - " + this.lifeMothership;

        if(this.lifeMothership == 0){
            game.state.start('GameState');
        }
    }

}