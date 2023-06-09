import * as Nano from "nano-jsx";
import * as TWE from "the-world-engine";

import css from "./UiBuilder.module.css";

export type GameHtmlListViewItem = Readonly<{
    title: string;
    imageStyle: string;
    onClick?: (item: GameHtmlListViewItem) => void;
}>;

export class GameHtmlListView {
    private _parent: HTMLElement | null;
    private readonly _root: HTMLElement;
    private readonly _items: GameHtmlListViewItem[];
    private readonly _itemViews: HTMLElement[];

    public constructor() {
        this._parent = null;
        this._root = Nano.render(<this.renderUI />);
        this._items = [];
        this._itemViews = [];
    }

    public mount(parent: HTMLElement): void {
        this._parent = parent;
        this._parent.appendChild(this._root);
    }

    public unmount(): void {
        if (this._parent !== null) this._parent.removeChild(this._root);
        this._parent = null;
    }

    public get items(): readonly GameHtmlListViewItem[] {
        return this._items;
    }

    public addItem(item: GameHtmlListViewItem): void {
        this._items.push(item);
        const itemView = Nano.render(
            <this.renderListItem
                title={item.title}
                imageStyle={item.imageStyle}
                onClick={item.onClick} />);
        this._itemViews.push(itemView);
        this._root.appendChild(itemView);
    }

    public updateItem(index: number, item: GameHtmlListViewItem): void {
        this._items[index] = item;
        const itemView = this._itemViews[index];

        this._root.replaceChild(
            itemView,
            Nano.render(
                <this.renderListItem
                    title={item.title}
                    imageStyle={item.imageStyle}
                    onClick={item.onClick} />,
                itemView
            )
        );
    }

    public removeItem(index: number): void {
        this._items.splice(index, 1);
        const itemView = this._itemViews.splice(index, 1)[0];
        this._root.removeChild(itemView);
    }

    public removeItemByValue(item: GameHtmlListViewItem): void {
        const index = this._items.indexOf(item);
        if (index >= 0) this.removeItem(index);
    }

    public clear(): void {
        this._items.length = 0;
        this._itemViews.length = 0;
        this._root.innerHTML = "";
    }

    private renderUI(): any {
        return (
            <div class={css.listViewPanel}>
            </div>
        );
    }

    private renderListItem(item: GameHtmlListViewItem): any {
        if (item.onClick !== undefined) {
            return (
                <div class={css.listViewItem} onClick={(): void => item.onClick!(item)}>
                    <div class={css.listViewItemTitle}>{item.title}</div>
                    <div style={item.imageStyle} />
                </div>
            );
        } else {
            return (
                <div class={css.listViewItem}>
                    <div class={css.listViewItemTitle}>{item.title}</div>
                    <div style={item.imageStyle} />
                </div>
            );
        }
    }
}

export class UIBuilder extends TWE.Component {
    private static readonly _brushModeTilemapFrontUid = "tm_f" + Math.random();
    private static readonly _brushModeTilemapBackUid = "tm_b" + Math.random();
    private static readonly _brushModeColliderUid = "col" + Math.random();

    private static readonly _brushTypeDrawUid = "draw" + Math.random();
    private static readonly _brushTypeEraseUid = "erase" + Math.random();

    private _renderRoot: HTMLDivElement | null = null;
    private _outerPanel: HTMLDivElement | null = null;
    private _panel: HTMLDivElement | null = null;
    private _panelTogggleButton: HTMLButtonElement | null = null;

    private _brushModeTilemapFront: HTMLInputElement | null = null;
    private _brushModeTilemapBack: HTMLInputElement | null = null;
    private _brushModeCollider: HTMLInputElement | null = null;

    private _brushTypeDraw: HTMLInputElement | null = null;
    private _brushTypeErase: HTMLInputElement | null = null;

    public start(): void {
        this.renderUIBaseComponent();
        this.initializeUI();
    }

    public onDestroy(): void {
        if (this._renderRoot !== null) this._renderRoot.remove();
        this._renderRoot = null;
        this._outerPanel = null;
        this._panel = null;
        this._panelTogggleButton = null;

        this._brushModeTilemapFront = null;
        this._brushModeTilemapBack = null;
        this._brushModeCollider = null;

        this._brushTypeDraw = null;
        this._brushTypeErase = null;
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
        this._outerPanel = document.getElementById(css.outerPanel) as HTMLDivElement;
        this._panel = document.getElementById(css.innerPanel) as HTMLDivElement;
        this._panelTogggleButton = document.getElementById(css.closeButton) as HTMLButtonElement;

        this._brushModeTilemapFront = document.getElementById(UIBuilder._brushModeTilemapFrontUid) as HTMLInputElement;
        this._brushModeTilemapBack = document.getElementById(UIBuilder._brushModeTilemapBackUid) as HTMLInputElement;
        this._brushModeCollider = document.getElementById(UIBuilder._brushModeColliderUid) as HTMLInputElement;

        this._brushTypeDraw = document.getElementById(UIBuilder._brushTypeDrawUid) as HTMLInputElement;
        this._brushTypeErase = document.getElementById(UIBuilder._brushTypeEraseUid) as HTMLInputElement;
    }

    private baseUI(): any {
        return (
            <div id={css.outerPanel} class={css.panelOpen}>
                <div id={css.innerPanel}>
                    <button id={css.closeButton}>X</button>
                    <form id={css.brushForm}>
                        <fieldset>
                            <legend>Brush Mode</legend>
                            <div>
                                <input type="radio" id={UIBuilder._brushModeTilemapFrontUid} name="brush_mode" />
                                <label for={UIBuilder._brushModeTilemapFrontUid}> tilemap front </label>

                                <input type="radio" id={UIBuilder._brushModeTilemapBackUid} name="brush_mode" />
                                <label for={UIBuilder._brushModeTilemapBackUid}> tilemap back </label>

                                <input type="radio" id={UIBuilder._brushModeColliderUid} name="brush_mode" />
                                <label for={UIBuilder._brushModeColliderUid}> collider </label>
                            </div>
                        </fieldset>
                        <fieldset>
                            <legend>Brush Type</legend>
                            <div>
                                <input type="radio" id={UIBuilder._brushTypeDrawUid} name="brush_type" />
                                <label for={UIBuilder._brushTypeDrawUid}> draw </label>

                                <input type="radio" id={UIBuilder._brushTypeEraseUid} name="brush_type" />
                                <label for={UIBuilder._brushTypeEraseUid}> erase </label>
                            </div>
                        </fieldset>
                    </form>
                </div>
            </div>
        );
    }

    public get outerPanel(): HTMLDivElement | null {
        return this._outerPanel;
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

    public get brushTypeDraw(): HTMLInputElement | null {
        return this._brushTypeDraw;
    }

    public get brushTypeErase(): HTMLInputElement | null {
        return this._brushTypeErase;
    }
}
