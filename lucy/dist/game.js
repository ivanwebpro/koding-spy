var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var KodingSpy;
(function (KodingSpy) {
    var Game = (function (_super) {
        __extends(Game, _super);
        function Game() {
            _super.call(this, 800, 600, Phaser.AUTO, 'gameCanvas', null);
            this.state.add('Boot', KodingSpy.Boot, false);
            this.state.add('Preloader', KodingSpy.Preloader, false);
            this.state.add('Gameplay', KodingSpy.Gameplay, false);
        }
        Game.prototype.boot = function () {
            _super.prototype.boot.call(this);
            this.state.start('Boot');
        };
        return Game;
    })(Phaser.Game);
    KodingSpy.Game = Game;
})(KodingSpy || (KodingSpy = {}));
var KodingSpy;
(function (KodingSpy) {
    var Model;
    (function (Model) {
        (function (Direction) {
            Direction[Direction["N"] = 0] = "N";
            Direction[Direction["E"] = 1] = "E";
            Direction[Direction["S"] = 2] = "S";
            Direction[Direction["W"] = 3] = "W";
        })(Model.Direction || (Model.Direction = {}));
        var Direction = Model.Direction;
        var TileCoordinate = (function () {
            function TileCoordinate(x, y) {
                this.x = x;
                this.y = y;
            }
            return TileCoordinate;
        })();
        Model.TileCoordinate = TileCoordinate;
        var Character = (function () {
            function Character(x, y, direction) {
                this.position = new TileCoordinate(x, y);
                this.direction = direction;
            }
            Character.prototype.moveBy = function (x, y) {
                this.position.x += x;
                this.position.y += y;
            };
            Character.prototype.moveTo = function (coord) {
                this.position = coord;
            };
            return Character;
        })();
        Model.Character = Character;
    })(Model = KodingSpy.Model || (KodingSpy.Model = {}));
})(KodingSpy || (KodingSpy = {}));
var KodingSpy;
(function (KodingSpy) {
    var Controller;
    (function (Controller) {
        var CharacterController = (function () {
            function CharacterController(game) {
                this.game = game;
            }
            CharacterController.prototype.create = function (lucy) {
                this.character = lucy;
            };
            CharacterController.prototype.moveBy = function (x, y, next) {
                var worldPos = KodingSpy.Utils.getWorldPosition(x, y);
                var animationName = 'walk' + this.character.direction;
                var animation = this.sprite.animations.play(animationName);
                var moveTween = this.game.add.tween(this.sprite).to({ 'x': worldPos.x, 'y': worldPos.y }, 1000);
                moveTween.onComplete.add(next);
                moveTween.start();
            };
            CharacterController.prototype.rotateTo = function (direction, next) {
                next();
            };
            return CharacterController;
        })();
        Controller.CharacterController = CharacterController;
    })(Controller = KodingSpy.Controller || (KodingSpy.Controller = {}));
})(KodingSpy || (KodingSpy = {}));
var KodingSpy;
(function (KodingSpy) {
    var Command;
    (function (Command) {
        var ExecutionListItem = (function () {
            function ExecutionListItem(command, lineNumber) {
                this.command = command;
                this.lineNumber = lineNumber;
            }
            return ExecutionListItem;
        })();
        var CommandQueue = (function () {
            function CommandQueue(onExecute) {
                this.commands = [];
                this.onExecute = onExecute;
                this._currentIndex = 0;
            }
            CommandQueue.prototype.append = function (command, lineNumber) {
                command.next = this.proceed.bind(this);
                this.commands.push(new ExecutionListItem(command, lineNumber));
            };
            CommandQueue.prototype.proceed = function () {
                this._currentIndex++;
                this.execute();
            };
            CommandQueue.prototype.execute = function () {
                if (this._currentIndex < this.commands.length) {
                    var executionListItem = this.commands[this._currentIndex];
                    this.onExecute(executionListItem.lineNumber);
                    executionListItem.command.execute();
                }
                else {
                    console.log('command chain finished');
                }
            };
            CommandQueue.prototype.clear = function () {
                this.commands = [];
            };
            return CommandQueue;
        })();
        Command.CommandQueue = CommandQueue;
    })(Command = KodingSpy.Command || (KodingSpy.Command = {}));
})(KodingSpy || (KodingSpy = {}));
var KodingSpy;
(function (KodingSpy) {
    var Command;
    (function (Command) {
        var MoveCommand = (function () {
            function MoveCommand(amount, controller) {
                this.amount = amount;
                this.animator = controller;
            }
            MoveCommand.prototype.execute = function () {
                var character = this.animator.character;
                this.execute = function () {
                    switch (character.direction) {
                        case (0 /* N */):
                            this.animator.moveBy(0, -(this.tiles), this.next);
                            break;
                        case (2 /* S */):
                            this.animator.moveBy(0, (this.tiles), this.next);
                            break;
                        case (1 /* E */):
                            this.animator.moveBy((this.tiles), 0, this.next);
                            break;
                        case (3 /* W */):
                            this.animator.moveBy(-(this.tiles), 0, this.next);
                            break;
                    }
                };
            };
            return MoveCommand;
        })();
        Command.MoveCommand = MoveCommand;
        var TurnLeftCommand = (function () {
            function TurnLeftCommand(controller) {
                this.animator = controller;
            }
            TurnLeftCommand.prototype.execute = function () {
                var newDirection = this.animator.character.direction - 1;
                if (newDirection < 0) {
                    newDirection = 3;
                }
                this.animator.character.direction = newDirection;
                this.animator.rotateTo(newDirection, this.next);
            };
            return TurnLeftCommand;
        })();
        Command.TurnLeftCommand = TurnLeftCommand;
        var TurnRightCommand = (function () {
            function TurnRightCommand(controller) {
                this.animator = controller;
            }
            TurnRightCommand.prototype.execute = function () {
                var newDirection = (this.animator.character.direction + 1) % 4;
                this.animator.character.direction = newDirection;
                this.animator.rotateTo(newDirection, this.next);
            };
            return TurnRightCommand;
        })();
        Command.TurnRightCommand = TurnRightCommand;
    })(Command = KodingSpy.Command || (KodingSpy.Command = {}));
})(KodingSpy || (KodingSpy = {}));
var KodingSpy;
(function (KodingSpy) {
    var Boot = (function (_super) {
        __extends(Boot, _super);
        function Boot() {
            _super.apply(this, arguments);
        }
        Boot.prototype.preload = function () {
            this.load.image('preloadBar', 'lucy/dev/game/assets/loader.png');
        };
        Boot.prototype.create = function () {
            this.game.time.advancedTiming = true;
            this.game.state.start('Preloader', true, false);
        };
        return Boot;
    })(Phaser.State);
    KodingSpy.Boot = Boot;
})(KodingSpy || (KodingSpy = {}));
var KodingSpy;
(function (KodingSpy) {
    var Gameplay = (function (_super) {
        __extends(Gameplay, _super);
        function Gameplay() {
            _super.apply(this, arguments);
        }
        Gameplay.prototype.create = function () {
            this.lucy = new KodingSpy.Model.Character(8, 6, 0 /* N */);
            var kodingSpyGame = this.game;
            this.characterController = new KodingSpy.Controller.CharacterController(kodingSpyGame);
            this.characterController.create(this.lucy);
            var lucyPosition = KodingSpy.Utils.getWorldPosition(this.lucy.position.x, this.lucy.position.y);
            var lucySprite = this.game.add.sprite(lucyPosition.x, lucyPosition.y, 'lucy');
            SkulptAnimator = this.characterController;
        };
        Gameplay.prototype.preload = function () {
            var rows = 12;
            var columns = 16;
            for (var x = 0; x < columns; x++) {
                for (var y = 0; y < rows; y++) {
                    this.placeTileAt(x, y, 'tileFLOOR');
                }
            }
            for (var x = 0; x < columns; x++) {
                this.placeTileAt(x, 0, 'tileWALL_TOP');
                this.placeTileAt(x, 1, 'tileWALL_FACE');
                this.placeTileAt(x, rows - 1, 'tileWALL_BACK');
            }
            for (var y = 0; y < rows - 1; y++) {
                this.placeTileAt(0, y, 'tileWALL_SIDE');
                this.placeTileAt(columns, y, 'tileWALL_SIDE').scale.x = -1;
            }
            this.placeTileAt(0, rows - 1, 'tileWALL_CORNER');
            this.placeTileAt(columns, rows - 1, 'tileWALL_CORNER').scale.x = -1;
            this.placeTileAt(8, 1, 'tileWALL_DOOR');
        };
        Gameplay.prototype.placeTileAt = function (x, y, tile) {
            var position = KodingSpy.Utils.getWorldPosition(x, y);
            return this.game.add.sprite(position.x, position.y, tile);
        };
        return Gameplay;
    })(Phaser.State);
    KodingSpy.Gameplay = Gameplay;
})(KodingSpy || (KodingSpy = {}));
var KodingSpy;
(function (KodingSpy) {
    var Preloader = (function (_super) {
        __extends(Preloader, _super);
        function Preloader() {
            _super.apply(this, arguments);
        }
        Preloader.prototype.preload = function () {
            this.preloadBar = this.add.sprite(200, 250, 'preloadBar');
            this.load.setPreloadSprite(this.preloadBar);
            this.load.image('tileFLOOR', 'lucy/dev/game/assets/tiles/tileFLOOR.png');
            this.load.image('tileWALL_BACK', 'lucy/dev/game/assets/tiles/tileWALL_BACK.png');
            this.load.image('tileWALL_CORNER', 'lucy/dev/game/assets/tiles/tileWALL_CORNER.png');
            this.load.image('tileWALL_DOOR', 'lucy/dev/game/assets/tiles/tileWALL_DOOR.png');
            this.load.image('tileWALL_FACE', 'lucy/dev/game/assets/tiles/tileWALL_FACE.png');
            this.load.image('tileWALL_SIDE', 'lucy/dev/game/assets/tiles/tileWALL_SIDE.png');
            this.load.image('tileWALL_TOP', 'lucy/dev/game/assets/tiles/tileWALL_TOP.png');
            this.load.image('lucy', 'lucy/dev/game/assets/lucy.png');
        };
        Preloader.prototype.create = function () {
            var tween = this.add.tween(this.preloadBar).to({ alpha: 0 }, 1000, Phaser.Easing.Linear.None, true);
            tween.onComplete.add(this.startGame, this);
        };
        Preloader.prototype.startGame = function () {
            this.game.state.start('Gameplay', true, false);
        };
        return Preloader;
    })(Phaser.State);
    KodingSpy.Preloader = Preloader;
})(KodingSpy || (KodingSpy = {}));
var KodingSpy;
(function (KodingSpy) {
    var Utils = (function () {
        function Utils() {
        }
        Utils.getDirectionAngle = function (direction) {
            switch (direction) {
                case 0 /* N */:
                    return 0;
                case 1 /* E */:
                    return Math.PI / 2;
                case 2 /* S */:
                    return Math.PI;
                case 3 /* W */:
                    return 3 * (Math.PI / 2);
            }
        };
        Utils.getWorldPosition = function (x, y) {
            return new Phaser.Point(x * 50, y * 50);
        };
        return Utils;
    })();
    KodingSpy.Utils = Utils;
})(KodingSpy || (KodingSpy = {}));
//# sourceMappingURL=game.js.map