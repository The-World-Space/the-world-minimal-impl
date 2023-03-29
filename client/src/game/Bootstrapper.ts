import * as TWE from "the-world-engine";
import * as THREE from "three/src/Three";

import CharacterSprite1 from "@/res/character_sprite1.png";
import TrrainSpriteAtlas from "@/res/terrain.png";

export class Bootstrapper extends TWE.Bootstrapper {
    public run(): TWE.SceneBuilder {

        const playerGameObject = new TWE.PrefabRef<TWE.GameObject>();
        const collideMap = new TWE.PrefabRef<TWE.GridCollideMap>();

        return this.sceneBuilder
            .withChild(
                this.instantiater.buildGameObject("camera-root")
                    .withComponent(class Rotator extends TWE.Component {
                        public override readonly executionOrder = 0;

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
                    .withChild(
                        this.instantiater.buildGameObject("camera",
                            new THREE.Vector3(0, 0, 8),
                            new THREE.Quaternion().setFromEuler(new THREE.Euler(0, 0, 0))
                        )
                            .withComponent(TWE.Camera, c => {
                                c.cameraType = TWE.CameraType.Orthographic;
                            })
                            .withComponent(class extends TWE.TrackCameraController {
                                public override readonly executionOrder = 1;
                            }, c => {
                                c.enabled = true;
                                c.setTrackTarget(playerGameObject.ref!);
                            })
                    )
            )
            .withChild(
                this.instantiater.buildGameObject("player", new THREE.Vector3())
                    .withComponent(TWE.CssSpriteAtlasRenderer, c => {
                        c.asyncSetImageFromPath(CharacterSprite1, 4, 4);
                        c.imageWidth = 1;
                        c.imageHeight = 2;
                        c.viewScale = 1;
                        c.centerOffset = new THREE.Vector2(0, 0.4);
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
                this.instantiater.buildGameObject("tile-object", new THREE.Vector3())
                    .withComponent(TWE.CssSpriteRenderer, c => {
                        c.imageWidth = 1;
                        c.imageHeight = 1;
                    })
            )
            .withChild(
                this.instantiater.buildGameObject("tile-map")
                    .withComponent(TWE.CssTilemapChunkRenderer, async c => {
                        const image = await TWE.AsyncImageLoader.loadImageFromPath(TrrainSpriteAtlas);
                        if (!c.exists) return;

                        c.imageSources = [ new TWE.TileAtlasItem(image, 16, 16) ];
                        c.chunkSize = 15;

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
            )
            .withChild(
                this.instantiater.buildGameObject("collide-map")
                    .withComponent(TWE.GridCollideMap, c => {
                        c.showCollider = true;

                        c.addColliderFromTwoDimensionalArray([
                            [0, 1, 0],
                            [1, 0, 1],
                            [1, 0, 1]
                        ], -1, 0);
                    })
                    .getComponent(TWE.GridCollideMap, collideMap)
            )
        ;
    }
}
