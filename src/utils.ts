export function e(tag?: string, classes?: string | string[], id?: string, parentNode?: Node, innerHTML?: string) {
    const element = document.createElement(tag);
    if (classes) {
        let classArr;
        if (typeof classes === 'string') {
            classArr = classes.split(' ');
        } else {
            classArr = classes;
        }
        classArr.forEach((className) => {
            element.classList.add(className);
        });
    }
    if (id) {
        element.id = id;
    }
    if (parentNode) {
        parentNode.appendChild(element);
    }
    if (innerHTML) {
        element.innerHTML = innerHTML;
    }
    return element;
}