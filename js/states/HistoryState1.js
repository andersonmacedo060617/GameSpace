
GameSpace.HistoryState1 = {
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
        //carregar arquivo de dados - Configura��es json
        this.load.text('level', 'assets/data/level.json');
    },

    create: function () {
        this.levelData = JSON.parse(this.game.cache.getText('level'));
        

        this.background1 = this.game.add.sprite(0, -200, 'background');
        

        this.background1.inputEnabled = true;
        this.background1.input.pixelPerfectClick = true;
        this.background1.events.onInputDown.add(this.chamaGameState, this);

        this.exibeHistoryP1();
    },

    update: function () {
        
        
    },

    
    exibeHistoryP1: function () {
        this.historyTextP1 = this.game.add.text(this.game.world.centerX, 700, this.levelData.history1p1, {
            font: '20px Arial',
            fill: '#0000FF',
            stroke: '#ffffff',
            //strokeThickness: 5,
            fontWeight: 'bold',
            stroke: '#000000',
            strokeThickness: 10,
            fill: '#FFFFFF',
            align: 'center'

        });

        this.historyTextP1.anchor.setTo(0.5, 0);

        this.historyMovingP1 = this.game.add.tween(this.historyTextP1, this);
        this.historyMovingP1.to({ y: -400 }, 10000);
        this.historyMovingP1.onComplete.add(this.exibeNaveMae, this);
        this.historyMovingP1.start();
    },

    exibeNaveMae: function(){
        this.naveMaeFinal = this.game.add.sprite(this.game.world.centerX, 900, 'naveMaeFinal');
        this.naveMaeFinal.anchor.setTo(0.5, 0.5);

        this.naveMaeFinalMoving = this.game.add.tween(this.naveMaeFinal);
        this.naveMaeFinalMoving.to({ y: this.game.world.centerY  }, 10000);
        this.naveMaeFinalMoving.onComplete.add(this.exibeHistoryP2, this);
        this.naveMaeFinalMoving.start();
    },

    exibeHistoryP2: function () {
        this.historyTextP2 = this.game.add.text(this.game.world.centerX, 700, this.levelData.history1p2, {
            font: '20px Arial',
            fill: '#0000FF',
            stroke: '#ffffff',
            //strokeThickness: 5,
            fontWeight: 'bold',
            stroke: '#000000',
            strokeThickness: 10,
            fill: '#FFFFFF',
            align: 'center'

        });

        this.historyTextP2.anchor.setTo(0.5, 0);

        this.historyMovingP2 = this.game.add.tween(this.historyTextP2);
        this.historyMovingP2.to({ y: -300 }, 10000);
        this.historyMovingP2.onComplete.add(this.chamaGameState);
        this.historyMovingP2.start();
    },

    chamaGameState: function () {
        game.state.start('GameState');
    }
}