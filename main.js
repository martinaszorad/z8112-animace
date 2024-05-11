import noUiSlider from 'nouislider/dist/nouislider.js'

let index = 0;
let day = '1';
let playing = false;

let slider = document.getElementById('slider');

function addMinutes(date, minutes) {
    return new Date(date.getTime() + minutes * 60000);
}

const settings = {
    '1': {
        first: 0,
        last: 55,
        start_time: new Date(2023, 7, 10, 6, 57, 0)
    },
    '2': {
        first: 147,
        last: 188,
        start_time: new Date(2023, 7, 11, 6, 48, 0)
    }
}

let format = {
    to: function(value) {
        return value;
    },
    from: function(value) {
        return value;
    }
};

noUiSlider.create(slider, {
    start: [index],
    step: 1,
    range: {
        min: settings[day].first,
        max: settings[day].last
    },
    tooltips: {
        to: function(value) {
            return addMinutes(settings[day].start_time, value * 10).toLocaleTimeString('sk-SK')
        }
    },
    format: format,
});

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function getImageUrl() {
    return new URL(`./img/day${day}/hike${index.toFixed().padStart(4, '0')}.png`, import.meta.url).href;
}

function updateImage() {
    document.getElementById('map').src = getImageUrl();
}

function updateIndex(values, handle, unencoded, tap, positions) {
    index = values[0];
    updateImage();
}

function updateSlider() {
    slider.noUiSlider.set(index)
}

slider.noUiSlider.on('update.one', updateIndex);

document.getElementById("play").onclick = async function() {
    if (playing) {
        return;
    }
    playing = true;
    while (playing) {
        if (index == settings[day].last) {
            playing = false;
            break;
        }
        index++;
        updateImage();
        updateSlider();
        await sleep(500);
    }
};

document.getElementById("pause").onclick = function() {
    playing = false;
};

document.getElementById("undo").onclick = function() {
    playing = false;
    index = 0;
    updateImage();
    updateSlider();
};

function updateDay(value, text, $choice) {
    playing = false;
    day = value;
    index = settings[day].first;
    slider.noUiSlider.updateOptions({
        start: [index],
        range: {
            min: settings[day].first,
            max: settings[day].last
        },
    });
    updateImage();
}

$('#day-choice').dropdown({
    values: [{
        name: 'Deň 1. (10.7.2023)',
        value: '1',
        selected: day === '1'
    }, {
        name: 'Deň 2. (11.7.2023)',
        value: '2',
        selected: day === '2'
    }],
    action: 'activate',
    onChange: updateDay
});

updateImage();