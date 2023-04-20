import * as TWE from "the-world-engine";
import * as THREE from "three/src/Three";

import CharacterSprite1 from "@/res/character_sprite1.png";
import TrrainSpriteAtlas from "@/res/terrain.png";

import { BrushController } from "./scripts/BrushController";
import { GridBrush } from "./scripts/GridBrush";
import { UIBuilder } from "./scripts/UIBuilder";
import { UIView } from "./scripts/UIView";

export class Bootstrapper extends TWE.Bootstrapper {
    public run(): TWE.SceneBuilder {

        const playerGameObject = new TWE.PrefabRef<TWE.GameObject>();
        const gridBrush = new TWE.PrefabRef<GridBrush>();
        const frontTileMap = new TWE.PrefabRef<TWE.CssTilemapChunkRenderer>();
        const backTileMap = new TWE.PrefabRef<TWE.CssTilemapChunkRenderer>();
        const collideMap = new TWE.PrefabRef<TWE.GridCollideMap>();

        return this.sceneBuilder
            .withChild(
                this.instantiater.buildGameObject("game-manager")
                    .withComponent(UIBuilder)
                    .withComponent(UIView)
                    .withComponent(BrushController, c => {
                        c.gridBrush = gridBrush.ref;
                        c.frontTileMap = frontTileMap.ref;
                        c.backTileMap = backTileMap.ref;
                        c.collideMap = collideMap.ref;
                    })
            )
            .withChild(
                this.instantiater.buildGameObject("brush", new THREE.Vector3(0, 0, 4))
                    .withComponent(TWE.PointerGridInputListener)
                    .withComponent(GridBrush)
                    .getComponent(GridBrush, gridBrush)
            )
            .withChild(
                this.instantiater.buildGameObject("tile-map-front", new THREE.Vector3(0, 0, 2))
                    .withComponent(TWE.CssTilemapChunkRenderer, async c => {
                        const image = await TWE.AsyncImageLoader.loadImageFromPath(TrrainSpriteAtlas);
                        if (!c.exists) return;

                        c.imageSources = [ new TWE.TileAtlasItem(image, 16, 16) ];
                        c.chunkSize = 15;
                        c.filter.brightness = 1.04;

                        const converter = {
                            /* eslint-disable @typescript-eslint/naming-convention */
                            " ": () => null,
                            "G": () => ({ i: 0, a: 3})
                            /* eslint-enable @typescript-eslint/naming-convention */
                        };

                        c.drawTileFromTwoDimensionalArray(
                            TWE.TwoDimensionalStringMapper.map(
                                [
                                    " G ",
                                    "G G",
                                    "G G"
                                ],
                                converter
                            ),
                            -1, 0
                        );
                    })
                    .getComponent(TWE.CssTilemapChunkRenderer, frontTileMap)
            )
            .withChild(
                this.instantiater.buildGameObject("tile-map-back", new THREE.Vector3(0, 0, -2))
                    .withComponent(TWE.CssTilemapChunkRenderer, async c => {
                        const image = await TWE.AsyncImageLoader.loadImageFromPath(TrrainSpriteAtlas);
                        if (!c.exists) return;

                        c.imageSources = [ new TWE.TileAtlasItem(image, 16, 16) ];
                        c.chunkSize = 15;

                        const converter = {
                            /* eslint-disable @typescript-eslint/naming-convention */
                            " ": () => null,
                            "F": () => ({ i: 0, a: 1})
                            /* eslint-enable @typescript-eslint/naming-convention */
                        };

                        c.drawTileFromTwoDimensionalArray(
                            TWE.TwoDimensionalStringMapper.map(
                                [
                                    "FFFFFFFFFFFFFFFFFFF",
                                    "FFFFFFFFFFFFFFFFFFF",
                                    "FFFFFFFFFFFFFFFFFFF",
                                    "FFFFFFFFFFFFFFFFFFF",
                                    "FFFFFFFFFFFFFFFFFFF",
                                    "FFFFFFFFFFFFFFFFFFF",
                                    "FFFFFFFFFFFFFFFFFFF",
                                    "FFFFFFFFFFFFFFFFFFF",
                                    "FFFFFFFFFFFFFFFFFFF",
                                    "FFFFFFFFFFFFFFFFFFF",
                                    "FFFFFFFFFFFFFFFFFFF",
                                    "FFFFFFFFFFFFFFFFFFF",
                                    "FFFFFFFFFFFFFFFFFFF",
                                    "FFFFFFFFFFFFFFFFFFF",
                                    "FFFFFFFFFFFFFFFFFFF",
                                    "FFFFFFFFFFFFFFFFFFF",
                                    "FFFFFFFFFFFFFFFFFFF",
                                    "FFFFFFFFFFFFFFFFFFF",
                                    "FFFFFFFFFFFFFFFFFFF"
                                ],
                                converter
                            ),
                            -Math.floor(19 / 2), -Math.floor(19 / 2)
                        );
                    })
                    .getComponent(TWE.CssTilemapChunkRenderer, backTileMap)
            )
            .withChild(
                this.instantiater.buildGameObject("collide-map")
                    .withComponent(TWE.GridCollideMap, c => {
                        const converter = {
                            /* eslint-disable @typescript-eslint/naming-convention */
                            " ": () => 0 as const,
                            "X": () => 1 as const
                            /* eslint-enable @typescript-eslint/naming-convention */
                        };

                        c.addColliderFromTwoDimensionalArray(
                            TWE.TwoDimensionalStringMapper.map(
                                [
                                    " X ",
                                    "X X",
                                    "X X"
                                ],
                                converter
                            ), -1, 0
                        );
                    })
                    .getComponent(TWE.GridCollideMap, collideMap)
            )
            .withChild(
                this.instantiater.buildGameObject("player")
                    .withComponent(TWE.CssSpriteAtlasRenderer, c => {
                        c.asyncSetImageFromPath(CharacterSprite1, 4, 4);
                        c.imageWidth = 1;
                        c.imageHeight = 2;
                        c.viewScale = 1;
                        c.centerOffset = new THREE.Vector2(0, 0.3);
                    })
                    .withComponent(TWE.SpriteAtlasAnimator, c => {
                        c.frameDuration = 0.1;
                        c.addAnimation("up_idle", [ 8 ]);
                        c.addAnimation("up_walk", [ 8, 9, 10, 11 ]);
                        c.addAnimation("down_idle", [ 0 ]);
                        c.addAnimation("down_walk", [ 0, 1, 2, 3 ]);
                        c.addAnimation("left_idle", [ 12 ]);
                        c.addAnimation("left_walk", [ 12, 13, 14, 15 ]);
                        c.addAnimation("right_idle", [ 4 ]);
                        c.addAnimation("right_walk", [ 4, 5, 6, 7 ]);
                    })
                    .withComponent(TWE.PlayerGridMovementController, c => {
                        c.addCollideMap(collideMap.ref!);
                        c.speed = 4;
                    })
                    .withComponent(TWE.MovementAnimationController)
                    .getGameObject(playerGameObject)
            )
            .withChild(
                this.instantiater.buildGameObject("camera")
                    .withComponent(TWE.Camera, c => {
                        c.cameraType = TWE.CameraType.Orthographic;
                        c.viewSize = 6;
                    })
                    .withComponent(TWE.TrackCameraController, c => {
                        c.enabled = true;
                        c.cameraDistanceOffset = 8;
                        c.targetOffset = new THREE.Vector2(0, 0.5);
                        c.smoothTrack = true;
                        c.smoothLambda = 12;
                        c.setTrackTarget(playerGameObject.ref!);
                    })
                    .withComponent(class Rotator extends TWE.Component {
                        private _currentX = 0;
                        private readonly _rotationSpeed = 0.5;

                        public update(): void {
                            this._currentX += this.engine.time.deltaTime * this._rotationSpeed;
                            this._currentX %= Math.PI * 2;

                            this.gameObject.transform.eulerAngles.y = Math.sin(this._currentX) * 0.05;
                        }
                    }, c => {
                        c.enabled = false;
                    })
            )
        ;
    }
}
