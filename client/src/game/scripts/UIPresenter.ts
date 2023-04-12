import * as TWE from "the-world-engine";

import { GameHtmlListView } from "./UIBuilder";
import { UIBuilder } from "./UIBuilder";
import css from "./UiBuilder.module.css";

enum BrushMode {
    TilemapFront,
    TilemapBack,
    Collider
}

enum BrushType {
    Draw,
    Erase
}

export class UIPresenter extends TWE.Component {
    public override readonly requiredComponents = [UIBuilder];

    private _uiBuilder: UIBuilder | null = null;
    private _listView: GameHtmlListView | null = null;

    private _isPanelOpen = true;
    private _brushMode = BrushMode.TilemapFront;
    private _brushType = BrushType.Draw;

    private _isListViewMounted = false;

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

        uiBuilder.brushModeTilemapFront!.addEventListener("change", this.brushModeChangeToTilemapFront);
        uiBuilder.brushModeTilemapBack!.addEventListener("change", this.brushModeChangeToTilemapBack);
        uiBuilder.brushModeCollider!.addEventListener("change", this.brushModeChangeToCollider);

        uiBuilder.brushTypeDraw!.addEventListener("change", this.brushTypeChangeToDraw);
        uiBuilder.brushTypeErase!.addEventListener("change", this.brushTypeChangeToErase);
    }

    private unhandleBaseComponentEvents(): void {
        const uiBuilder = this._uiBuilder;
        if (!uiBuilder) return;
        uiBuilder.panelTogggleButton!.removeEventListener("click", this.panelToggle);

        uiBuilder.brushModeTilemapFront!.removeEventListener("change", this.brushModeChangeToTilemapFront);
        uiBuilder.brushModeTilemapBack!.removeEventListener("change", this.brushModeChangeToTilemapBack);
        uiBuilder.brushModeCollider!.removeEventListener("change", this.brushModeChangeToCollider);

        uiBuilder.brushTypeDraw!.removeEventListener("change", this.brushTypeChangeToDraw);
        uiBuilder.brushTypeErase!.removeEventListener("change", this.brushTypeChangeToErase);
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

            this.brushModeChange(BrushMode.TilemapFront);
        } else {
            panel.classList.add(css.panelClosed);
            panel.classList.remove(css.panelOpen);

            panelToggleButton.innerText = ">";
        }
    }

    private readonly brushModeChangeToTilemapFront = (): void => this.brushModeChange(BrushMode.TilemapFront);

    private readonly brushModeChangeToTilemapBack = (): void => this.brushModeChange(BrushMode.TilemapBack);

    private readonly brushModeChangeToCollider = (): void => this.brushModeChange(BrushMode.Collider);

    public readonly brushModeChange = (brushMode: BrushMode): void => {
        this._brushMode = brushMode;

        const uiBuilder = this._uiBuilder!;
        {
            const brushModeTilemapFront = uiBuilder.brushModeTilemapFront;
            const newState = brushMode === BrushMode.TilemapFront;
            if (brushModeTilemapFront!.checked !== newState) {
                brushModeTilemapFront!.checked = newState;
            }
        }
        {
            const brushModeTilemapBack = uiBuilder.brushModeTilemapBack;
            const newState = brushMode === BrushMode.TilemapBack;
            if (brushModeTilemapBack!.checked !== newState) {
                brushModeTilemapBack!.checked = newState;
            }
        }
        {
            const brushModeCollider = uiBuilder.brushModeCollider;
            const newState = brushMode === BrushMode.Collider;
            if (brushModeCollider!.checked !== newState) {
                brushModeCollider!.checked = newState;
            }
        }

        this.brushModeUpdate();
    };

    private brushModeUpdate(): void {
        const uiBuilder = this._uiBuilder;
        const brushMode = this._brushMode;

        if (brushMode === BrushMode.TilemapFront || brushMode === BrushMode.TilemapBack) {
            if (this._listView === null) {
                this._listView = new GameHtmlListView();
            }

            if (!this._isListViewMounted) {
                this._listView.mount(uiBuilder!.panel!);
                this._isListViewMounted = true;
            }
        } else if (brushMode === BrushMode.Collider) {
            if (this._listView !== null) {
                this._listView.unmount();
                this._isListViewMounted = false;
            }
        }
    }

    private readonly brushTypeChangeToDraw = (): void => this.brushTypeChange(BrushType.Draw);

    private readonly brushTypeChangeToErase = (): void => this.brushTypeChange(BrushType.Erase);

    public readonly brushTypeChange = (brushType: BrushType): void => {
        this._brushType = brushType;

        const uiBuilder = this._uiBuilder!;
        {
            const brushTypeDraw = uiBuilder.brushTypeDraw;
            const newState = brushType === BrushType.Draw;
            if (brushTypeDraw!.checked !== newState) {
                brushTypeDraw!.checked = newState;
            }
        }
        {
            const brushTypeErase = uiBuilder.brushTypeErase;
            const newState = brushType === BrushType.Erase;
            if (brushTypeErase!.checked !== newState) {
                brushTypeErase!.checked = newState;
            }
        }
    };

    public get brushMode(): BrushMode {
        return this._brushMode;
    }

    public get brushType(): BrushType {
        return this._brushType;
    }
}
