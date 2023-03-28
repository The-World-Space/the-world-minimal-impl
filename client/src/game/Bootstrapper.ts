import CharacterSprite1 from "res/CharacterSprite1.png";
import * as TWE from "the-world-engine";
import * as THREE from "three/src/Three";

export class Bootstrapper extends TWE.Bootstrapper {
    public run(): TWE.SceneBuilder {

        return this.sceneBuilder
            .withChild(
                this.instantiater.buildGameObject("camera", new THREE.Vector3())
                    .withComponent(TWE.Camera)
            )
            .withChild(
                this.instantiater.buildGameObject("sprite", new THREE.Vector3())
                    .withComponent(TWE.CssSpriteRenderer, c => {
                        c.asyncSetImageFromPath(CharacterSprite1);
                    })
            )
        ;
    }
}
