GameSpace.Apresentacao = {

    preload: function () {
        this.load.image('background1', 'assets/image/background1.png');
    },

    create: function () {
        this.background1 = this.game.add.sprite(0, 0, 'background1');
        this.apresentacaoText = this.game.add.text(this.game.world.centerX, -100, 'Game Space', {
            font: '84px Arial',
            fill: '#0000FF'
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