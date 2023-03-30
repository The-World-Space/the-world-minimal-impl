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
            <div class={css.outerPanel}>
                <button class={css.closeButton}>X</button>
                <div>
                    <label>
                        <input type="radio" name="test" value="1" />
                        Test
                    </label>
                </div>
                <div>
                    <label>
                        <input type="radio" name="test" value="2" />
                        Test
                    </label>
                </div>
            </div>
        );
    }
}
