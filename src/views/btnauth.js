//按钮权限

function isAuth(el,binding){
    const hasPermission = usePermission()
    const value = binding.value
    if(!value) return
    if(!hasPermission(value)){
        removeEl(el)
    }
}

const mounted = (el,binding)=>{
    isAuth(el,binding)
}

const updated = (el,binding)=>{
    let update = () => {
        let valueNotChange = binding.value === binding.oldValue
        let oldHasPermission = hasPermission(binding.oldValue)
        let newHasPermission = hasPermission(binding.value)
        let permissionNotChange = oldHasPermission === newHasPermission
        if (valueNotChange && permissionNotChange) return
        if (newHasPermission) {
            addEl(el)
        } else {
            removeEl(el)
        }
    };
    if (el._watchEffect) {
        update()
    } else {
        el._watchEffect = watchEffect(() => {
            update()
        })
    }
}

const authDirective = {
    mounted,
    updated
}


const hasPermission = (value) => {
    return [1, 2, 3].includes(value)
}

const removeEl = (el) => {
    // 在绑定元素上存储父级元素
    el._parentNode = el.parentNode
    // 在绑定元素上存储一个注释节点
    el._placeholderNode = document.createComment("auth")
    // 使用注释节点来占位
    el.parentNode?.replaceChild(el._placeholderNode, el)
}

const addEl = (el) => {
    // 替换掉给自己占位的注释节点
    el._parentNode?.replaceChild(el, el._placeholderNode)
}

export default authDirective