import { getOrbitControls } from "../states/useOrbitControls"
import { container } from "./renderLoop/renderSetup"
import { createEffect } from "@lincode/reactivity"
import mainCamera from "./mainCamera"
import { getCamera } from "../states/useCamera"
import { getOrbitControlsScreenSpacePanning } from "../states/useOrbitControlsScreenSpacePanning"
import OrbitCamera from "../display/cameras/OrbitCamera"
import { getTransformControlsDragging } from "../states/useTransformControlsDragging"
import { appendableRoot } from "../api/core/Appendable"
import { onSceneGraphDoubleClick } from "../events/onSceneGraphDoubleClick"

export default {}

const mainOrbitCamera = new OrbitCamera(mainCamera)
mainOrbitCamera.enablePan = true
mainOrbitCamera.enableZoom = true
mainOrbitCamera.enableFly = true
appendableRoot.delete(mainOrbitCamera)

onSceneGraphDoubleClick(manager => {
    const pos = manager.getCenter()
    mainOrbitCamera.targetX = pos.x
    mainOrbitCamera.targetY = pos.y
    mainOrbitCamera.targetZ = pos.z
})

//@ts-ignore
const { controls } = mainOrbitCamera

getOrbitControlsScreenSpacePanning(val => controls.screenSpacePanning = val)

createEffect(() => {
    if (!getOrbitControls() || getCamera() !== mainCamera || getTransformControlsDragging()) return

    mainOrbitCamera.enabled = true
    container.style.cursor = "grab"

    return () => {
        mainOrbitCamera.enabled = false
        container.style.cursor = "auto"
    }
}, [getOrbitControls, getTransformControlsDragging, getCamera])