import * as Nano from "nano-jsx";
import * as TWE from "the-world-engine";

import css from "./UiBuilder.module.css";

export class UIBuilder extends TWE.Component {
    private static readonly _brushModeTilemapFrontUid = "tm_f" + Math.random();
    private static readonly _brushModeTilemapBackUid = "tm_b" + Math.random();
    private static readonly _brushModeColliderUid = "col" + Math.random();

    private _renderRoot: HTMLDivElement | null = null;
    private _panel: HTMLDivElement | null = null;
    private _panelTogggleButton: HTMLButtonElement | null = null;
    private _brushModeTilemapFront: HTMLInputElement | null = null;
    private _brushModeTilemapBack: HTMLInputElement | null = null;
    private _brushModeCollider: HTMLInputElement | null = null;

    public start(): void {
        this.renderUIBaseComponent();
        this.initializeUI();
    }

    public onDestroy(): void {
        if (this._renderRoot !== null) this._renderRoot.remove();
        this._renderRoot = null;
        this._panel = null;
        this._panelTogggleButton = null;
        this._brushModeTilemapFront = null;
        this._brushModeTilemapBack = null;
        this._brushModeCollider = null;
    }

    private renderUIBaseComponent(): void {
        if (this._renderRoot === null) {
            const rootElement = this.engine.domElement;
            const renderRootElement = document.createElement("div");
            renderRootElement.id = css.renderRoot;
            rootElement.appendChild(renderRootElement);
            this._renderRoot = renderRootElement;
        }
        Nano.render(<this.baseUI />, this._renderRoot);
    }

    private initializeUI(): void {
        this._panel = document.getElementById(css.outerPanel) as HTMLDivElement;
        this._panelTogggleButton = document.getElementById(css.closeButton) as HTMLButtonElement;
        this._brushModeTilemapFront = document.getElementById(UIBuilder._brushModeTilemapFrontUid) as HTMLInputElement;
        this._brushModeTilemapBack = document.getElementById(UIBuilder._brushModeTilemapBackUid) as HTMLInputElement;
        this._brushModeCollider = document.getElementById(UIBuilder._brushModeColliderUid) as HTMLInputElement;
    }

    private baseUI(): any {
        return (
            <div id={css.outerPanel} class={css.panelOpen}>
                <button id={css.closeButton}>X</button>
                <form>
                    <fieldset>
                        <legend>Brush Mode</legend>
                        <div>
                            <input type="radio" id={UIBuilder._brushModeTilemapFrontUid} name="brush_mode" />
                            <label for="tm_f"> tilemap front </label>

                            <input type="radio" id={UIBuilder._brushModeTilemapBackUid} name="brush_mode" />
                            <label for="tm_b"> tilemap back </label>

                            <input type="radio" id={UIBuilder._brushModeColliderUid} name="brush_mode" />
                            <label for="col"> collider </label>
                        </div>
                    </fieldset>
                </form>
            </div>
        );
    }

    public get panel(): HTMLDivElement | null {
        return this._panel;
    }

    public get panelTogggleButton(): HTMLButtonElement | null {
        return this._panelTogggleButton;
    }

    public get brushModeTilemapFront(): HTMLInputElement | null {
        return this._brushModeTilemapFront;
    }

    public get brushModeTilemapBack(): HTMLInputElement | null {
        return this._brushModeTilemapBack;
    }

    public get brushModeCollider(): HTMLInputElement | null {
        return this._brushModeCollider;
    }
}
