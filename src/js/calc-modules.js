export function keyValueGetter(key) {
	const keyValuelog = key.dataset.value;
	return keyValuelog;
}

export function addToExp(item, location) {
	location.textContent += item;
}

export function setDisplay(node, item) {
	node.textContent = item;
}

export function getDisplay(node) {
	return node.textContent;
}

export function expCharLengthExceeded(exp, limit) {
	if (exp.length >= limit) {
		return true;
	}
}

export function clear(display) {
	setDisplay(display, "");
}
