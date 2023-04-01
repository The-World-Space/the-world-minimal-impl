import * as Nano from "nano-jsx";
import * as TWE from "the-world-engine";

import css from "./UiBuilder.module.css";

export class UIBuilder extends TWE.Component {
    private _renderRoot: HTMLDivElement | null = null;

    public start(): void {
        this.render();
    }

    public onDestroy(): void {
        if (this._renderRoot !== null) this._renderRoot.remove();
    }

    public render(): void {
        if (this._renderRoot === null) {
            const rootElement = this.engine.domElement;
            const renderRootElement = document.createElement("div");
            renderRootElement.className = css.renderRoot;
            rootElement.appendChild(renderRootElement);
            this._renderRoot = renderRootElement;
        }
        Nano.render(<this.createUI />, this._renderRoot);
    }

    private createUI(): any {
        return (
            <div class={css.outerPanel}>
                <button class={css.closeButton}>X</button>
                <div>
                    <label>
                        <input type="radio" name="tilemap front" value="1" />
                        tilemap front
                    </label>
                    <label>
                        <input type="radio" name="tilemap back" value="2" />
                        tilemap back
                    </label>
                    <label>
                        <input type="radio" name="collider" value="3" />
                        collider
                    </label>
                </div>
            </div>
        );
    }
}
