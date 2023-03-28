import CharacterSprite1 from "res/CharacterSprite1.png";
import * as TWE from "the-world-engine";
import * as THREE from "three/src/Three";

export class Bootstrapper extends TWE.Bootstrapper {
    public run(): TWE.SceneBuilder {

        const playerGameObject = new TWE.PrefabRef<TWE.GameObject>();

        return this.sceneBuilder
            .withChild(
                this.instantiater.buildGameObject("camera", new THREE.Vector3())
                    .withComponent(TWE.Camera)
                    .withComponent(class extends TWE.TrackCameraController {
                        public override readonly executionOrder = 1;
                    }, c => {
                        c.setTrackTarget(playerGameObject.ref!);
                    })
            )
            .withChild(
                this.instantiater.buildGameObject("player", new THREE.Vector3())
                    .withComponent(TWE.CssSpriteAtlasRenderer, c => {
                        c.asyncSetImageFromPath(CharacterSprite1, 4, 4);
                        c.imageWidth = 1;
                        c.imageHeight = 2;
                        c.viewScale = 1;
                    })
                    .withComponent(TWE.SpriteAtlasAnimator, c => {
                        c.frameDuration = 0.1;
                        c.addAnimation("up_idle", [ 0 ]);
                        c.addAnimation("up_walk", [ 0, 1, 2, 3 ]);
                        c.addAnimation("down_idle", [ 4 ]);
                        c.addAnimation("down_walk", [ 4, 5, 6, 7 ]);
                        c.addAnimation("left_idle", [ 8 ]);
                        c.addAnimation("left_walk", [ 8, 9, 10, 11 ]);
                        c.addAnimation("right_idle", [ 12 ]);
                        c.addAnimation("right_walk", [ 12, 13, 14, 15 ]);
                    })
                    .withComponent(TWE.PlayerGridMovementController)
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
        ;
    }
}
