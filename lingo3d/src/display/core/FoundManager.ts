import { applyMixins } from "@lincode/utils"
import { MeshStandardMaterial, Object3D } from "three"
import SimpleObjectManager from "./SimpleObjectManager"
import IFound, { foundDefaults, foundSchema } from "../../interface/IFound"
import TexturedBasicMixin from "./mixins/TexturedBasicMixin"
import TexturedStandardMixin from "./mixins/TexturedStandardMixin"
import { Cancellable } from "@lincode/promiselikes"
import AnimationManager from "./SimpleObjectManager/AnimationManager"
import { appendableRoot } from "../../api/core/Appendable"

class FoundManager extends SimpleObjectManager<Object3D> implements IFound {
    public static componentName = "found"
    public static defaults = foundDefaults
    public static schema = foundSchema

    protected material: MeshStandardMaterial

    public constructor(mesh: Object3D) {
        // mesh.castShadow = true
        // mesh.receiveShadow = true
        super(mesh)
        //@ts-ignore
        this.material = mesh.material ??= new MeshStandardMaterial()

        const { modelManager } = this.outerObject3d.userData

        this.parent = modelManager
        ;(modelManager.children ??= new Set()).add(this)
        appendableRoot.delete(this)

        if (!modelManager?.animationManagers) return

        for (const animationManager of Object.values<AnimationManager>(modelManager.animationManagers))
            this.animations[animationManager.name] = this.watch(animationManager.retarget(mesh))
    }

    public override dispose() {
        super.dispose()
        this.material.dispose()
        return this
    }

    private managerSet?: boolean
    protected override addToRaycastSet(set: Set<Object3D>, handle: Cancellable) {
        if (!this.managerSet) {
            this.managerSet = true
            this.object3d.traverse(child => child.userData.manager = this)
        }
        set.add(this.object3d)
        handle.then(() => set.delete(this.object3d))
    }
}
interface FoundManager extends SimpleObjectManager<Object3D>, TexturedBasicMixin, TexturedStandardMixin {}
applyMixins(FoundManager, [TexturedBasicMixin, TexturedStandardMixin])
export default FoundManager