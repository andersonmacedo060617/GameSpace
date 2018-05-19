GameSpace.Congratulation = {

    preload: function () {
        this.load.image('background1', 'assets/image/background1.png');
    },

    create: function () {
        this.background1 = this.game.add.sprite(0, 0, 'background1');
        this.stateTextFimDeJogo = this.game.add.text(this.game.world.centerX, this.game.world.centerY, 'CONGRATULATION \n F5 RESTART', {
            font: '84px Arial',
            fill: '#00FF7F'
        });
        this.stateTextFimDeJogo.anchor.setTo(0.5, 0.5);
    }
}
