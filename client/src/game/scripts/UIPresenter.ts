import * as TWE from "the-world-engine";

import { UIBuilder } from "./UIBuilder";
import css from "./UiBuilder.module.css";

export class UIPresenter extends TWE.Component {
    public override readonly requiredComponents = [UIBuilder];

    private _uiBuilder: UIBuilder | null = null;

    private _isPanelOpen = true;

    public awake(): void {
        this._uiBuilder = this.gameObject.getComponent(UIBuilder);
    }

    public start(): void {
        this.handleBaseComponentEvents();

        this.panelToggleUpdate();
    }

    public onDestroy(): void {
        this.unhandleBaseComponentEvents();

        this._uiBuilder = null;
    }

    private handleBaseComponentEvents(): void {
        const uiBuilder = this._uiBuilder;
        if (!uiBuilder) throw new Error("UIBuilder is null");
        uiBuilder.panelTogggleButton!.addEventListener("click", this.panelToggle);
    }

    private unhandleBaseComponentEvents(): void {
        const uiBuilder = this._uiBuilder;
        if (!uiBuilder) return;
        uiBuilder.panelTogggleButton!.removeEventListener("click", this.panelToggle);
    }

    public readonly panelToggle = (): void => {
        this._isPanelOpen = !this._isPanelOpen;
        this.panelToggleUpdate();
    };

    private panelToggleUpdate(): void {
        if (!this._uiBuilder) return;
        const panel = this._uiBuilder.panel;
        if (!panel) return;
        const panelToggleButton = this._uiBuilder.panelTogggleButton;
        if (!panelToggleButton) return;

        if (this._isPanelOpen) {
            panel.classList.add(css.panelOpen);
            panel.classList.remove(css.panelClosed);

            panelToggleButton.innerText = "<";
        } else {
            panel.classList.add(css.panelClosed);
            panel.classList.remove(css.panelOpen);

            panelToggleButton.innerText = ">";
        }
    }
}
