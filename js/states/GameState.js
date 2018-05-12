var GameSpace = GameSpace || {}

GameSpace.GameState = {
    init : function(){
        //seta a escala do jogo
        this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
        //alinhamento horizontal 
        this.scale.pageAlignHorizontally = true;
        //alinhamento vertical
        this.scale.pageAlignVertically = true;

        //criar o controle.
        this.cursors = this.game.input.keyboard.createCursorKeys();

        //seta o tamanho da fase
        this.game.world.setBounds(0,0,1000,592);
    },

    preload : function () {
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
        this.load.spritesheet('rocket','assets/image/rocket_spriteSheet.png',128, 128, 63, 0, 0);
        this.load.spritesheet('fire1', 'assets/image/fire1.png', 32, 64);
        this.load.spritesheet('rocketTail', 'assets/image/rocketTail.png', 64, 128);

        this.load.image('mothership', 'assets/image/mothership.png');
        this.load.image('missile', 'assets/image/missile.png');

        //carregar arquivo de dados - Configurações json
        this.load.text('level', 'assets/data/level.json');

    },

    create : function(){
        //faz parse de arquivos json
        this.levelData = JSON.parse(this.game.cache.getText('level'));

        this.background1 = this.game.add.sprite(0, 0, 'background1');

        this.fireButton = this.input.keyboard.addKey(Phaser.KeyCode.SPACEBAR);

        this.fire = this.game.add.weapon(30, 'fire1');



        /* Rocket */
        this.player = this.add.group();

        this.rocketTail = this.criaSprite(
            this.game.world.centerX,
            this.game.world.centerY,
            'rocketTail',
            0.4,
            0.4,
            0.5,
            0
        ) ;

        this.rocket = this.criaSprite( 
            this.game.world.centerX, 
            this.game.world.centerY,
            this.levelData.level1.rocket.alias, 
            this.levelData.level1.rocket.scaleX,
            this.levelData.level1.rocket.scaleY,
            0.5,
            0.5
        );


        this.rocketTail.animations.add('run', null, 5, true);

        this.rocket.animations.add('rocket_center', [34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48], 5, true);
        this.rocket.animations.add('rocket_left', [1,2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16], 5, true);
        this.rocket.animations.add('rocket_right', [17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31], 5, true);
        this.rocket.play('rocket_center');
        game.physics.arcade.enable(this.rocket);
        // this.rocket.body.drag.set(70);
        this.rocket.body.maxVelocity.set(100);

        this.rocket.body.collideWorldBounds = true;

        /*Fim Rocket*/

        //Mothership
        this.mothership = this.criaSprite( 
            this.game.world.centerX, 
            150, 
            this.levelData.level1.mothership.alias, 
            this.levelData.level1.mothership.scaleX,
            this.levelData.level1.mothership.scaleY,
            0.5, 
            0.5
        );
        this.mothership.movingPositive = true;



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
        this.game.time.events.loop(Phaser.Timer.SECOND * this.levelData.level1.meteors.frequencyMeteor,this.createMeteors,this);
        this.createShips();


    },

    update : function(){


        this.animationShips();

        this.animationMothership();

        this.rocketDrive();

        // if(this.cursors.up.isDown){
        //     console.log('fire');
        //     this.createFire();
        // }

        this.fire.fireAngle= this.rocket.angle - 90;


    },

    createMeteors : function(){
        this.meteors = this.add.group();
        
        this.meteors.enableBody = true;

        var sideInit = Math.floor((Math.random() * 4));
        //console.log(sideInit);


        var meteor;
        
        var sideInit = Math.floor((Math.random() * 4));
        //console.log(sideInit);

        var initY, initX, finalX, finalY;

        //sideInit 0 Lador esquerdo
        if(sideInit == 0){
            initX = -200;
            initY = Math.floor((Math.random() * 552) + 20);  
            finalX = 1200;
            finalY = Math.floor((Math.random() * 552) + 20);
        } else if(sideInit == 1){//sideInit 1 Lado Direito
            initX = 1200;
            initY = Math.floor((Math.random() * 552) + 20);  
            finalX = -200;
            finalY = Math.floor((Math.random() * 552) + 20);
        } else if(sideInit == 2){//sideInit 2 Topo da tela
            initX = Math.floor((Math.random() * 960) + 20);;
            initY = -200;  
            finalX = Math.floor((Math.random() * 960) + 20);
            finalY = 700;
        }else{// senão parte inferior da tela
            initX = Math.floor((Math.random() * 960) + 20);;
            initY = 700;  
            finalX = Math.floor((Math.random() * 960) + 20);
            finalY = -200;
        }



        // tamanho gerado de forma random
        var sizeMeteor = Math.floor((Math.random() * 2) + 1);

        var meteor = this.meteors.getFirstExists(false);

        if (!meteor){
            meteor = this.meteors.create(initX,initY,'meteor' + Math.floor((Math.random() * 3) + 1));
        }


        meteor.scale.setTo((sizeMeteor * 0.5) + 0.5);
        meteor.anchor.setTo(0.5);

        meteor.vlrAngle = sizeMeteor / 5;
        meteor.rotatePositive = true;
        meteor.animations.add('spin', null, 5, true);
        meteor.play('spin');
        //var meteorMoving = this.game.add.tween(meteor).to({x : finalX, y:finalY}, this.levelData.level1.meteors.velocityMeteor, Phaser.Easing.Quadratic.InOut, false, 0, 1000, false);

        var meteorMoving = this.game.add.tween(meteor);
        meteorMoving.to({x : finalX, y:finalY}, this.levelData.level1.meteors.velocityMeteor);



        meteorMoving.start();

    },

    createShips : function(){
        this.ships = this.add.group();
        this.ships.enableBody = true;
        var ship;
        var numShip;

        this.levelData.level1.ships.forEach(function(element){
            numShip = Math.floor((Math.random() * 5) + 1);
            ship = this.ships.create(element.x, element.y, 'ship' + numShip);
            ship.scale.setTo(element.scale);
            ship.anchor.setTo(0.5);
            ship.angle = numShip * 9;

            ship.animations.add('spin', null, 10, true);
            ship.play('spin');
        }, this);
    },


    criaSprite : function(positionX, positionY, alias, scaleObjectX, scaleObjectY, achorObjectX, achorObjectY){
        var obj = this.game.add.sprite(positionX, positionY,alias);
        
        //seta a escala do objeto
        obj.scale.setTo(scaleObjectX, scaleObjectY);
        //seta ancora do objeto
        obj.anchor.setTo(achorObjectX, achorObjectY);

        return obj;
    },

    animationShips : function(){
        this.ships.forEach(function(element){
            var angleMaxShips = this.levelData.level1.angleMaxShips;
            var angleShipsVariation = this.levelData.level1.angleShipsVariation;
            if(element.rotatePositive && element.angle < angleMaxShips){
                element.angle += angleShipsVariation;
            }else if(!element.rotatePositive && element.angle > - angleMaxShips){
                element.angle += -angleShipsVariation;
            }else if(element.rotatePositive && element.angle >= angleMaxShips){
                element.angle = angleMaxShips;
                element.rotatePositive = false;
            }else if(!element.rotatePositive && element.angle <= -angleMaxShips){
                element.angle = -angleMaxShips;
                element.rotatePositive = true;
            }
        }, this);
    },

    

    animationMothership : function(){
        var maxPositionY = this.levelData.level1.mothership.maxPositionY;
        var minPositionY = this.levelData.level1.mothership.minPositionY;
        var speedMovingY = this.levelData.level1.mothership.speedMovingY;
        var positionY = this.mothership.position.y;


        if(this.mothership.movingPositive && positionY < maxPositionY){
            this.mothership.position.y += speedMovingY;
        }else if(!this.mothership.movingPositive && positionY > minPositionY){
            this.mothership.position.y += -speedMovingY;
        }else if(this.mothership.movingPositive && positionY >= maxPositionY){
            this.mothership.movingPositive = false;
            this.mothership.position.y = maxPositionY;
        }else if(!this.mothership.movingPositive && positionY <= minPositionY){
            this.mothership.movingPositive = true;
           this.mothership.position.y = minPositionY;
        }
    },

    rocketDrive : function(){

        if (this.cursors.up.isDown)
        {

            game.physics.arcade.accelerationFromRotation(this.rocket.rotation - 1.5, 100, this.rocket.body.acceleration);
            this.rocketTail.top = this.rocket.bottom;
            this.rocketTail.position.x = this.rocket.x;
            this.rocketTail.button = this.rocket.bottom  - 100;
            this.rocketTail.angle = this.rocket.angle;
            this.rocketTail.visible = true;
            this.rocketTail.play('run');
        }
        else
        {
            this.rocketTail.visible = false;
            this.rocket.body.acceleration.set(0);
        }

        if (this.cursors.left.isDown)
        {
            this.rocket.body.angularVelocity = -300;
        }
        else if (this.cursors.right.isDown)
        {
            this.rocket.body.angularVelocity = 300;
        }
        else
        {
            this.rocket.body.angularVelocity = 0;
        }

        if (this.fireButton.isDown)
        {

            this.fire.fire();
        }

        game.world.wrap(this.rocket, 16);

    },

    render : function() {
        game.debug.spriteInfo(this.rocket, 32, 100);

    }


}