import * as TWE from "the-world-engine";

import TrrainSpriteAtlas from "@/res/terrain.png";

import type { GridBrush } from "./GridBrush";
import type { AtlasListItem} from "./UIView";
import { BrushType} from "./UIView";
import { BrushMode} from "./UIView";
import { UIView } from "./UIView";

export class BrushController extends TWE.Component {
    public override readonly requiredComponents = [UIView];

    private _view: UIView | null = null;
    private _gridBrush: GridBrush | null = null;

    private _frontTileMap: TWE.CssTilemapChunkRenderer | null = null;
    private _backTileMap: TWE.CssTilemapChunkRenderer | null = null;
    private _collideMap: TWE.GridCollideMap | null = null;

    private _selectedTileIndex = -1;

    public awake(): void {
        this._view = this.gameObject.getComponent(UIView);
    }

    public start(): void {
        if (this._gridBrush === null) {
            throw new Error("GridBrush is null");
        }

        this.testInit();

        this._gridBrush.onDraw.addListener(this.onDraw);
        this._view!.onBrushModeChange.addListener(this.onBrushModeChange);
        this.updateBrushState(this._view!.brushMode);
    }

    public onDestroy(): void {
        this._gridBrush?.onDraw.removeListener(this.onDraw);
        this._view?.onBrushModeChange.removeListener(this.onBrushModeChange);
        this._view = null;
    }

    private readonly updateBrushState = (mode: BrushMode): void => {
        if (this._collideMap) {
            this._collideMap.showCollider = mode === BrushMode.Collider;
        }
    };

    private readonly onBrushModeChange = (mode: BrushMode): void => {
        this.updateBrushState(mode);
    };

    private readonly onDraw = (gridX: number, gridY: number): void => {
        if (this._view === null) return;

        const brushMode = this._view.brushMode;
        if (brushMode === BrushMode.Collider) {
            if (this._collideMap === null) return;
            if (this._view.brushType === BrushType.Draw) {
                this._collideMap.addCollider(gridX, gridY);
            } else {
                this._collideMap.removeCollider(gridX, gridY);
            }
        } else {
            const tileMap = brushMode === BrushMode.TilemapFront ? this._frontTileMap : this._backTileMap;
            if (tileMap === null) return;
            if (this._view.brushType === BrushType.Draw) {
                tileMap.drawTile(gridX, gridY, 0, this._selectedTileIndex);
            } else {
                tileMap.clearTile(gridX, gridY);
            }
        }
    };

    private testInit(): void {
        const listItems: AtlasListItem[] = [];

        for (let i = 0; i < 32; i++) {
            listItems.push({
                title: `t:${i}`,
                image: TrrainSpriteAtlas,
                rowCount: 16,
                columnCount: 16,
                index: i,
                onClick: (item: AtlasListItem) => {
                    this._selectedTileIndex = item.index;
                    const cursorImage = this._gridBrush?.cursorImage;
                    if (!cursorImage) return;
                    cursorImage.asyncSetImageFromPath(item.image, item.columnCount, item.rowCount);
                    cursorImage.imageIndex = item.index;
                }
            });
        }

        for (const item of listItems) {
            this._view!.addTilemapListItem(item);
        }
    }

    public set gridBrush(value: GridBrush | null) {
        this._gridBrush = value;
    }

    public set frontTileMap(value: TWE.CssTilemapChunkRenderer | null) {
        this._frontTileMap = value;
    }

    public set backTileMap(value: TWE.CssTilemapChunkRenderer | null) {
        this._backTileMap = value;
    }

    public set collideMap(value: TWE.GridCollideMap | null) {
        this._collideMap = value;
    }
}
