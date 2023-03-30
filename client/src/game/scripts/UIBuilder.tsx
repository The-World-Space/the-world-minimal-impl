import * as Nano from "nano-jsx";
import * as TWE from "the-world-engine";

import css from "./UiBuilder.module.css";

export class UIBuilder extends TWE.Component {
    public start(): void {
        const rootElement = this.engine.domElement;

        Nano.render(<this.createUI />, rootElement, false);
    }

    private createUI(): any {
        return (
            <div class={css.outer}>

            </div>
        );
    }
}
