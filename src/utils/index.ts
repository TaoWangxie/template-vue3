//判断对象是否有属性
export function hasOwn(obj: any, propName: any) {
	return Object.prototype.hasOwnProperty.call(obj, propName);
}
/**
 * 监听dom自身点击
 * @param id id名
 * @param inCb 不在范围内回调
 * @param outCb 在范围内回调
 */
export function monitorSelfClick(id: any, inCb?: any, outCb?: any) {
	document.addEventListener('click', (e: any) => {
		let isSelf: any = document.getElementById(id)?.contains(e.target)  // 这个是自己的区域
		if (!isSelf) {
			//   console.log('没在区域里面-->>>')
			inCb && inCb()
		} else {
			//   console.log('在区域里--->>>>>')
			outCb && outCb()
		}
	})
}
/**
 * 存储sessionStorage
 */
export const setSessionStorage = (name: any, content: any) => {
	if (!name) return;
	if (typeof content !== 'string') {
		content = JSON.stringify(content);
	}
	window.sessionStorage.setItem(name, content);
}

/**
 * 获取sessionStorage
 */
export const getSessionStorage = (name: any) => {
	if (!name) return;
	let data = window.sessionStorage.getItem(name)

	return data ? JSON.parse(data) : undefined;
}
