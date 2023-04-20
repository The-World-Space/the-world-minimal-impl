import * as TWE from "the-world-engine";

export class GridBrush extends TWE.Component {
    public override readonly requiredComponents = [TWE.PointerGridInputListener];

    private _gridInputListener: TWE.PointerGridInputListener | null = null;

    private _cursorImage: TWE.CssSpriteAtlasRenderer | null = null;
    private _cursorObject: TWE.GameObject | null = null;
    private _isPointerDown = false;
    private readonly _onDrawEvent = new TWE.EventContainer<(gridX: number, gridY: number) => void>();

    public awake(): void {
        this._gridInputListener = this.gameObject.getComponent(TWE.PointerGridInputListener);
    }

    public start(): void {
        const cursorImageRef = new TWE.PrefabRef<TWE.CssSpriteAtlasRenderer>();
        const cursorObject = this.gameObject.addChildFromBuilder(
            this.engine.instantiater.buildGameObject("cursor")
                .withComponent(TWE.CssSpriteAtlasRenderer, c => {
                    c.imageWidth = 1;
                    c.imageHeight = 1;
                    c.viewScale = 1;
                    c.pointerEvents = false;
                    c.opacity = 0.5;
                    c.filter.brightness = 1.5;
                })
                .getComponent(TWE.CssSpriteAtlasRenderer, cursorImageRef)
        );

        this._cursorImage = cursorImageRef.ref!;
        this._cursorObject = cursorObject;

        const gridInputListener = this._gridInputListener!;
        gridInputListener.onPointerEnter.addListener(this.onPointerEnter);
        gridInputListener.onPointerLeave.addListener(this.onPointerLeave);
        gridInputListener.onPointerMove.addListener(this.onPointerMove);
        gridInputListener.onPointerDown.addListener(this.onPointerDown);
        gridInputListener.onPointerUp.addListener(this.onPointerUp);
    }

    public onDestroy(): void {
        const gridInputListener = this._gridInputListener!;
        gridInputListener.onPointerEnter.removeListener(this.onPointerEnter);
        gridInputListener.onPointerLeave.removeListener(this.onPointerLeave);
        gridInputListener.onPointerMove.removeListener(this.onPointerMove);
        gridInputListener.onPointerDown.removeListener(this.onPointerDown);
        gridInputListener.onPointerUp.removeListener(this.onPointerUp);
    }

    private updateCursor(event: TWE.PointerGridEvent): void {
        const gridPosition = event.gridPosition;
        const gridInputListener = this._gridInputListener!;
        this._cursorObject?.transform.localPosition.set(
            gridPosition.x * gridInputListener.gridCellWidth,
            gridPosition.y * gridInputListener.gridCellHeight, 0
        );

        if (this._isPointerDown) {
            this._onDrawEvent.invoke(gridPosition.x, gridPosition.y);
        }
    }

    private readonly onPointerEnter = (event: TWE.PointerGridEvent): void => {
        if (this._cursorObject) {
            this._cursorObject.activeSelf = true;
        }
        this.updateCursor(event);
    };

    private readonly onPointerLeave = (): void => {
        if (this._cursorObject) {
            this._cursorObject.activeSelf = true;
        }
    };

    private readonly onPointerMove = (event: TWE.PointerGridEvent): void => {
        this.updateCursor(event);
    };

    private readonly onPointerDown = (event: TWE.PointerGridEvent): void => {
        this._isPointerDown = true;
        this.updateCursor(event);
    };

    private readonly onPointerUp = (event: TWE.PointerGridEvent): void => {
        this._isPointerDown = false;
        this.updateCursor(event);
    };

    public get cursorImage(): TWE.CssSpriteAtlasRenderer | null {
        return this._cursorImage;
    }

    public get onDraw(): TWE.IEventContainer<(gridX: number, gridY: number) => void> {
        return this._onDrawEvent;
    }
}
