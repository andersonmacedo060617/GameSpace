//Iniciando o framework
//Phase.Game(<largura do canvas>, <altura do canvas>, <forma de renderização>)
var game = new Phaser.Game(1000,592,Phaser.AUTO);

//carregar o jogo
game.state.add('GameState', GameSpace.GameState);
//iniciar o jogo
game.state.start('GameState');