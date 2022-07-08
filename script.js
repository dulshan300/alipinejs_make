// get root data element
let root = document.querySelector('[x-data]');

let rawData = getInitialData();

let data = observe(rawData);

registerListners();

refreshDome()



// register listners 
function registerListners() {
    domeWalk(root, el => {
        if (el.hasAttribute('@click')) {
            const exp = el.getAttribute('@click')
            el.addEventListener('click', () => {
                eval(`with (data){ (${exp}) }`)
            })
        }
    })
}

// observe data
function observe(data) {
    return new Proxy(data, {
        set(target, key, value) {
            target[key] = value;
            refreshDome();
        }
    })
}

// refresh root dome
function refreshDome() {
    domeWalk(root, el => {
        if (el.hasAttribute('x-text')) {
            const exp = el.getAttribute('x-text');
            el.innerText = eval(`with (data){ (${exp}) }`)
        }
    })
}

function domeWalk(el, callback) {
    callback(el)
    el = el.firstElementChild;

    while (el) {
        domeWalk(el, callback)
        el = el.nextElementSibling
    }
}

// get initial data from root
function getInitialData() {
    const dataString = root.getAttribute('x-data');
    return eval(`(${dataString})`);
}