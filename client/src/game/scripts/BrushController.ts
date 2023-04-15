import * as TWE from "the-world-engine";

import TrrainSpriteAtlas from "@/res/terrain.png";

import type { AtlasListItem} from "./UIView";
import { UIView } from "./UIView";

export class BrushController extends TWE.Component {
    public override readonly requiredComponents = [UIView];

    private _view: UIView | null = null;
    private _gridPointer: TWE.GridPointer | null = null;

    public awake(): void {
        this._view = this.gameObject.getComponent(UIView);

        if (this._gridPointer === null) {
            throw new Error("GridPointer is null");
        }

        this.testInit();
    }

    private testInit(): void {
        const listItems: AtlasListItem[] = [];

        for (let i = 0; i < 10; i++) {
            listItems.push({
                title: `t:${i}`,
                image: TrrainSpriteAtlas,
                rowCount: 16,
                columnCount: 16,
                index: i,
                onClick: (item: AtlasListItem) => {
                    console.log(item);
                }
            });
        }

        for (const item of listItems) {
            this._view!.addTilemapListItem(item);
        }
    }

    public set gridPointer(value: TWE.GridPointer | null) {
        this._gridPointer = value;
    }
}
