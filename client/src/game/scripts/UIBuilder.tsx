import * as Nano from "nano-jsx";
import * as TWE from "the-world-engine";

import css from "./UiBuilder.module.css";

type GameHtmlListViewItem = {
    title: string;
    image: string;
    imageStyle: string;
}

class GameHtmlListView {
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
                image={item.image}
                imageStyle={item.imageStyle} />);
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
                    image={item.image}
                    imageStyle={item.imageStyle} />,
                itemView
            )
        );
    }

    public removeItem(index: number): void {
        this._items.splice(index, 1);
        const itemView = this._itemViews.splice(index, 1)[0];
        this._root.removeChild(itemView);
    }

    private renderUI(): any {
        return (
            <div class={css.listViewPanel}>
            </div>
        );
    }

    private renderListItem(item: GameHtmlListViewItem): any {
        return (
            <div class={css.listViewItem}>
                <div class={css.listViewItemTitle}>{item.title}</div>
                <img src={item.image} style={item.imageStyle} />
            </div>
        );
    }
}

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

        const listview = new GameHtmlListView();
        listview.mount(this._panel!);

        listview.addItem({
            title: "test",
            image: "https://www.google.com/images/branding/googlelogo/1x/googlelogo_color_272x92dp.png",
            imageStyle: "width: 100px; height: 100px;"
        });
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
                            <label for={UIBuilder._brushModeTilemapFrontUid}> tilemap front </label>

                            <input type="radio" id={UIBuilder._brushModeTilemapBackUid} name="brush_mode" />
                            <label for={UIBuilder._brushModeTilemapBackUid}> tilemap back </label>

                            <input type="radio" id={UIBuilder._brushModeColliderUid} name="brush_mode" />
                            <label for={UIBuilder._brushModeColliderUid}> collider </label>
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
