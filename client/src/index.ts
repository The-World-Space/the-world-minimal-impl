import * as TWE from "the-world-engine";

import { Bootstrapper } from "@/game/Bootstrapper";

const gameView = window.document.getElementById("game_view")!;
const game = new TWE.Game(gameView);
game.inputHandler.startHandleEvents();
game.run(Bootstrapper);
