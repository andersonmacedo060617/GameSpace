//Iniciando o framework
//Phase.Game(<largura do canvas>, <altura do canvas>, <forma de renderização>)
var game = new Phaser.Game(1000,592,Phaser.AUTO);

//carregar o jogo
game.state.add('GameState', GameSpace.GameState);
game.state.add('GameOver', GameSpace.GameOver);
game.state.add('Congratulation', GameSpace.Congratulation);
game.state.add('HistoryState1', GameSpace.HistoryState1);
game.state.add('Apresentacao', GameSpace.Apresentacao);
game.state.add('GameState2', GameSpace.GameState2);
//iniciar o jogo
game.state.start('Apresentacao');