var GameSpace = GameSpace || {}

GameSpace.Final = {
	init: function () {
		//seta a escala do jogo
		this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
		//alinhamento horizontal 
		this.scale.pageAlignHorizontally = true;
		//alinhamento vertical
		this.scale.pageAlignVertically = true;

		//seta o tamanho da fase
		this.game.world.setBounds(0, 0, 1000, 592);

	},

	preload: function () {
		this.load.image('background', 'assets/image/background4.png');
		this.load.image('naveMaeFinal', 'assets/image/ultimoChefeAbertura.png')
		//carregar arquivo de dados - Configurações json
		this.load.text('level', 'assets/data/level.json');
		this.load.spritesheet('explode', 'assets/image/explode.png', 128, 128, 16, 0, 0);

		this.load.spritesheet('rocket', 'assets/image/rocket_spriteSheet.png', 128, 128, 63, 0, 0);
	},

	create: function () {
		this.levelData = JSON.parse(this.game.cache.getText('level'));
		this.numeroExplosoes = this.levelData.final.positionExplode.length;

		this.background1 = this.game.add.sprite(0, -200, 'background');


		this.background1.inputEnabled = true;
		this.background1.input.pixelPerfectClick = true;
		
		this.naveMaeFinal = this.game.add.sprite(this.game.world.centerX, this.game.world.centerY, 'naveMaeFinal');
		this.naveMaeFinal.anchor.setTo(0.5, 0.5);
		
		this.explosions = this.add.group();
		this.numExplosaoAtual = 0;
		this.game.time.events.loop(Phaser.Timer.SECOND * 0.5, this.explosaoNaveMaeFinal, this);

		
		this.rocket = this.criaSprite(
            this.game.world.centerX,
            800,
            this.levelData.level1.rocket.alias,
            0.8,
            0.8,
            0.5,
            0.5
        );
	},

	update: function () {

	},

	explosaoNaveMaeFinal: function () {
		
		if (this.numExplosaoAtual < this.numeroExplosoes) {
			var explosao = this.explosions.create(
					parseInt(this.naveMaeFinal.position.x) + parseInt(this.levelData.final.positionExplode[this.numExplosaoAtual].x),
					parseInt(this.naveMaeFinal.position.y) + parseInt(this.levelData.final.positionExplode[this.numExplosaoAtual].y),
					'explode'
				);


			//console.log("x" + explosao.position.x + " | y" + explosao.position.y);

			explosao.anchor.setTo(0.5);
			explosao.scale.setTo(1);
			explosao.animations.add('explode', null, 10, false);

			var sound = document.createElement("audio");
			sound.src = "assets/sound/explosion.mp3";
			explosao.play('explode', null, false, true);
			sound.addEventListener("canplaythrough", function () {
				sound.play();
			}, false);

			this.numExplosaoAtual += 1;

			//console.log("NumeroAtual" + this.numExplosaoAtual + "NumeroTotal: " + this.numeroExplosoes);
			if (this.numExplosaoAtual == this.numeroExplosoes) {
				var explosao = this.explosions.create(
					this.naveMaeFinal.position.x, this.naveMaeFinal.position.y, 'explode'
				);
				explosao.anchor.setTo(0.5);
				explosao.scale.setTo(5);
				explosao.animations.add('explode', null, 5, false);

				var sound = document.createElement("audio");
				sound.src = "assets/sound/explosion.mp3";
				explosao.play('explode', null, false, true);
				sound.addEventListener("canplaythrough", function () {
					sound.play();
				}, false);


				this.naveMaeFinal.kill();

				this.rocketMoving = this.game.add.tween(this.rocket);
				this.rocketMoving.to({ y: -100 }, 10000);
				this.rocketMoving.onComplete.add(this.exibeCongratulation, this);
				this.rocketMoving.start();

				var musicFinal = document.createElement("audio");
				musicFinal.src = "assets/sound/musicFinal.mp3";
				musicFinal.addEventListener("canplaythrough", function () {
					musicFinal.play();
				}, false);
			}
		}

	},

	criaSprite: function (positionX, positionY, alias, scaleObjectX, scaleObjectY, achorObjectX, achorObjectY) {
		var obj = this.game.add.sprite(positionX, positionY, alias);

		//seta a escala do objeto
		obj.scale.setTo(scaleObjectX, scaleObjectY);
		//seta ancora do objeto
		obj.anchor.setTo(achorObjectX, achorObjectY);

		return obj;
	},

	exibeCongratulation: function () {
		this.stateTextFimDeJogo = this.game.add.text(this.game.world.centerX, 800, 'CONGRATULATION \n F5 RESTART', {
			font: '84px Arial',
			fill: '#00FF7F',
			stroke: '#ffffff',
			strokeThickness: 10
		});
		this.stateTextFimDeJogo.anchor.setTo(0.5, 0.5);

		this.congratulationMoving = this.game.add.tween(this.stateTextFimDeJogo);
		this.congratulationMoving.to({ y: 100 }, 15000);
		//this.congratulationMoving.onComplete.add(this.exibeCongratulation, this);
		this.congratulationMoving.start();

	}
}