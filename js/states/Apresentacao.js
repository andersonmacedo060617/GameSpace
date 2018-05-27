GameSpace.Apresentacao = {
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
        this.load.image('apresentacao', 'assets/image/apresentacao.png');
    },

    create: function () {
        this.background1 = this.game.add.sprite(0, 0, 'apresentacao');
        this.apresentacaoText = this.game.add.text(this.game.world.centerX, -100, 'Patrulha Espacial', {
            font: '84px Arial',
            fill: '#0000FF',
            stroke: '#ffffff',
            strokeThickness: 10,
            fontWeight: 'bold',
            stroke: '#000000',
            strokeThickness: 20,
            fill: '#43d637',


        });

        this.apresentacaoText.anchor.setTo(0.5, 0.5);

        var apresentacaoMoving = this.game.add.tween(this.apresentacaoText);
        apresentacaoMoving.to({y: this.game.world.centerY}, 2000);
        apresentacaoMoving.start();

        this.background1.inputEnabled = true;
        this.background1.input.pixelPerfectClick = true;
        this.background1.events.onInputDown.add(this.chamaGameState, this);
    },

    chamaGameState : function () {
        game.state.start('HistoryState1');
    }
}