import * as TWE from "the-world-engine";

import type { GameHtmlListViewItem } from "./UIBuilder";
import { GameHtmlListView } from "./UIBuilder";
import { UIBuilder } from "./UIBuilder";
import css from "./UiBuilder.module.css";

export enum BrushMode {
    TilemapFront,
    TilemapBack,
    Collider
}

export enum BrushType {
    Draw,
    Erase
}

export type AtlasListItem = Readonly<{
    title: string;
    image: string;
    rowCount: number;
    columnCount: number;
    index: number;
    onClick?: (item: AtlasListItem) => void;
}>

export class UIView extends TWE.Component {
    public override readonly requiredComponents = [UIBuilder];

    private _uiBuilder: UIBuilder | null = null;
    private _listView: GameHtmlListView | null = null;

    private _isPanelOpen = true;
    private _brushMode = BrushMode.TilemapFront;
    private _brushType = BrushType.Draw;

    private _isListViewMounted = false;
    private readonly _listViewItemMap = new Map<AtlasListItem, GameHtmlListViewItem>();

    private readonly _onPanelToggleEvent = new TWE.EventContainer<(isOpen: boolean) => void>();
    private readonly _onBrushModeChangeEvent = new TWE.EventContainer<(mode: BrushMode) => void>();
    private readonly _onBrushTypeChangeEvent = new TWE.EventContainer<(type: BrushType) => void>();

    public awake(): void {
        this._uiBuilder = this.gameObject.getComponent(UIBuilder);
    }

    public start(): void {
        this.handleBaseComponentEvents();
        this.panelUpdate();
    }

    public onDestroy(): void {
        this.unhandleBaseComponentEvents();
        this._listView?.unmount();
        this._listViewItemMap.clear();
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
        this.panelToggleFromState(!this._isPanelOpen);
    };

    public panelToggleFromState(isOpen: boolean): void {
        if (this._isPanelOpen === isOpen) return;

        this._isPanelOpen = isOpen;
        this.panelUpdate();
        this._onPanelToggleEvent.invoke(isOpen);
    }

    private panelUpdate(): void {
        if (!this._uiBuilder) return;
        const outerPanel = this._uiBuilder.outerPanel;
        if (!outerPanel) return;
        const panelToggleButton = this._uiBuilder.panelTogggleButton;
        if (!panelToggleButton) return;

        if (this._isPanelOpen) {
            outerPanel.classList.add(css.panelOpen);
            outerPanel.classList.remove(css.panelClosed);

            panelToggleButton.innerText = "<";

            this.brushModeChange(this._brushMode);
            this.brushTypeChange(this._brushType);
        } else {
            outerPanel.classList.add(css.panelClosed);
            outerPanel.classList.remove(css.panelOpen);

            panelToggleButton.innerText = ">";
        }
    }

    private readonly brushModeChangeToTilemapFront = (): void => this.brushModeChange(BrushMode.TilemapFront);

    private readonly brushModeChangeToTilemapBack = (): void => this.brushModeChange(BrushMode.TilemapBack);

    private readonly brushModeChangeToCollider = (): void => this.brushModeChange(BrushMode.Collider);

    public brushModeChange(brushMode: BrushMode): void {
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

        this._onBrushModeChangeEvent.invoke(brushMode);
    }

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

    public brushTypeChange(brushType: BrushType): void {
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

        this._onBrushTypeChangeEvent.invoke(brushType);
    }

    public get isPanelOpen(): boolean {
        return this._isPanelOpen;
    }

    public get brushMode(): BrushMode {
        return this._brushMode;
    }

    public get brushType(): BrushType {
        return this._brushType;
    }

    public addTilemapListItem(item: AtlasListItem): void {
        if (this._listView === null) {
            this._listView = new GameHtmlListView();
        }

        const verticalIndex = Math.floor(item.index / item.columnCount);
        const horizontalIndex = item.index % item.columnCount;

        const imageSize = 100;
        let style = `width: ${imageSize}px; height: ${imageSize}px;`;
        style += "object-fit: none; image-rendering: pixelated;";
        style += `background-image: url(${item.image});`;
        style += `background-size: ${item.columnCount * imageSize}px ${item.rowCount * imageSize}px;`;
        style += `background-position: ${horizontalIndex * -imageSize}px ${verticalIndex * -imageSize}px;`;

        this._listView.addItem({
            title: item.title,
            imageStyle: style,
            onClick: () => item.onClick?.(item)
        });
    }

    public removeTilemapListItem(item: AtlasListItem): void {
        if (this._listView === null) return;

        const listViewItem = this._listViewItemMap.get(item);
        if (listViewItem === undefined) return;

        this._listView.removeItemByValue(listViewItem);
    }

    public clearTilemapListItems(): void {
        if (this._listView === null) return;

        this._listView.clear();
    }

    public get onPanelToggle(): TWE.IEventContainer<(isOpen: boolean) => void> {
        return this._onPanelToggleEvent;
    }

    public get onBrushModeChange(): TWE.IEventContainer<(brushMode: BrushMode) => void> {
        return this._onBrushModeChangeEvent;
    }

    public get onBrushTypeChange(): TWE.IEventContainer<(brushType: BrushType) => void> {
        return this._onBrushTypeChangeEvent;
    }
}
