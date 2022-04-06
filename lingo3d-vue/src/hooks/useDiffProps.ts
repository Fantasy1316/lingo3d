import { reactive, ref, watch, watchEffect } from "vue"

export default (props: Record<string, any>) => {
    let propsOld: Record<string, any> = {}

    const changes = ref<Array<[string, any]>>([])

    watch(props, () => {
        changes.value = []
        for (const [key, value] of Object.entries(props)) {
            const valueOld = propsOld[key]
            if (valueOld === value) continue
            
            if (value && typeof value === "object") {
                if (JSON.stringify(value) !== JSON.stringify(valueOld))
                    changes.value.push([key, value])
            }
            else changes.value.push([key, value])
        }
        propsOld = { ...props }
    })

    return changes
}