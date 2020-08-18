// Constants declarations
const step = 0.0001;
let direction;
let rates;
let directionTimer;
let ratesTimer;

const ratesElements = {
    eurToUsd: document.getElementById('eurToUsd'),
    eurToAud: document.getElementById('eurToAud'),
    eurToCad: document.getElementById('eurToCad'),
    eurToBgn: document.getElementById('eurToBgn')
}

// Fetching the data from currencies.json file
// through http-server, which is used for developing purposes
fetch('http://localhost:8080/currencies.json', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    })
    // parse json string to JavaScript object
    .then(raw => raw.json())
    // initial function
    .then(init)
    // catch an error, if there is such
    .catch(err => console.log(err));

// Initial function:
function init(data) {
    // Init state
    rates = data.rates;

    // Init and update view
    updateView();

    // Init Intervals and Timeout
    directionTimer = setInterval(toggleDirection, 60 * 1000);
    ratesTimer = setInterval(updateRates, 5 * 1000);
    setTimeout(stopUpdating, 5 * 60 * 1000);
}

function toggleDirection() {
    if (direction === 'UP') direction = 'DOWN';
    else direction = 'UP';
}

function updateRates() {
    if (!direction) direction = 'UP';
    if (direction === 'UP') {
        increaseRates(rates);
    } else { // DOWN
        decreaseRates(rates);
    }
}

function stopUpdating() {
    clearInterval(directionTimer);
    clearInterval(ratesTimer);
}

function increaseRates(data) {
    // Update state
    Object.keys(rates).forEach((currency) => rates[currency] += step);

    // Update view
    updateView();
}

function decreaseRates(data) {
    // Update state
    Object.keys(rates).forEach((currency) => rates[currency] -= step);

    // Update view
    updateView();
}

function updateView() {
    ratesElements.eurToUsd.textContent = rates.USD.toFixed(4);
    ratesElements.eurToAud.textContent = rates.AUD.toFixed(4);
    ratesElements.eurToCad.textContent = rates.CAD.toFixed(4);
    ratesElements.eurToBgn.textContent = rates.BGN.toFixed(4);

    let bgColor;
    switch (direction) {
        case 'UP':
            bgColor = '#88da81';
            break;
        case 'DOWN':
            bgColor = '#f76c77';
            break;
        default:
            bgColor = 'none';
    }

    Object.keys(ratesElements).forEach((item) => {
        ratesElements[item].style.backgroundColor = bgColor;
    });
}
