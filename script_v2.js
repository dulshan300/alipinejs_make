// get root data elements
let roots = document.querySelectorAll('[x-data]');

let data = [];

for (const [i, root] of roots.entries()) {
    const root_id = `root_${i}`;

    let raw_data = getInitialData(root);

    data[root_id] = observe(raw_data);

    registerListners();
    refreshDome()


    function registerListners() {
        domeWalk(root, el => {
            if (el.hasAttribute('@click')) {
                const exp = el.getAttribute('@click')
                console.log(el.outerHTML);
                el.addEventListener('click', () => {
                    eval(`with (data.${root_id}){ (${exp}) }`)
                })
            }
        })
    }


    function observe(data) {
        return new Proxy(data, {
            set(target, key, value) {
                target[key] = value;
                refreshDome();
            }
        })
    }

    function refreshDome() {
        domeWalk(root, el => {
            if (el.hasAttribute('x-text')) {
                const exp = el.getAttribute('x-text');
                el.innerText = eval(`with (data.${root_id}){ (${exp}) }`)
            }
            if (el.hasAttribute('x-if')) {
                const exp = el.getAttribute('x-if');
                el.hidden = !eval(`with (data.${root_id}){ (${exp}) }`)                
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


}


function getInitialData(el) {
    const dataString = el.getAttribute('x-data')
    return eval(`(${dataString})`);
}

/*
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
function observe(data,root_id) {
    return new Proxy(data, {
        set(target, key, value) {
            target[key] = value;
            refreshDome();
        }
    })
}

// refresh root dome
function refreshDome(root_id) {
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

*/