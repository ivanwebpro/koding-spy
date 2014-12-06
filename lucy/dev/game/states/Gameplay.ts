module KodingSpy {
    declare var SkulptAnimator : KodingSpy.Interfaces.ICharacterController;
    declare var SkulptQueue : KodingSpy.Command.CommandQueue;
    declare var AceLoader : (string)=>void;

    export class Gameplay extends Phaser.State {
        characterController : KodingSpy.Controller.CharacterController;
        levelController : KodingSpy.Controller.LevelController;
        lucy : KodingSpy.Model.Character;

        create() {

            var levelToPlay = 'Level01';

            this.lucy = new KodingSpy.Model.Character(8, 6, KodingSpy.Model.Direction.N);
            var kodingSpyGame = <KodingSpy.Game> this.game;

            this.levelController = new KodingSpy.Controller.LevelController(kodingSpyGame, levelToPlay);
            this.levelController.create();
            AceLoader(levelToPlay);

            this.characterController = new KodingSpy.Controller.CharacterController(kodingSpyGame);
            this.characterController.create(this.lucy);

            SkulptAnimator = this.characterController;
        }

        preload() {
        }
    }
}
