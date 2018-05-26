GameSpace.Apresentacao = {

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
        console.log("Clique");
        game.state.start('GameState')
    }
}