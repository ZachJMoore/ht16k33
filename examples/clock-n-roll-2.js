'use strict';

const moment = require('moment');
const Segments = require('ht16k33').Segments;
const display = new Segments(0x70, 1);

//set roll char
const rollChars = [];
for (let i = 0; i <= 14; i++) {
    rollChars.push('#fullClock' + i + '_');
}
for (let i = 0; i <= 14; i++) {
    rollChars.push('#emptyClock' + i + '_');
}

// set roll digits and start rolling for 3s then start clock
display.setRollChars(rollChars.join(''));
display.rollDigits(50, rollChars.length * 3 * 50, true)
    .then(() => clockNRoll());

function clockNRoll() {
    setInterval(() => {
        const time = moment().format('HHmm');
        let str = zeroToRoll(time);
        str = toDot(str);
        display.setBrightness(3);
        display.writeString(str);
    }, 1000 / rollChars.length);
}

// DOT
function toDot(str) {
    const seconds = moment().format('ss');
    const strArray = display.stringToCharArray(str);
    if ((seconds % 2) === 0) strArray.splice(2, 0, '.');
    return strArray.join('');
}

// ZERO TO ROLL
let rollIndex = 0;

function zeroToRoll(str) {
    if (rollIndex > (rollChars.length - 1)) rollIndex = 0;
    let resultStr = '';
    str.split('').forEach(item => {
        if (item == 0) resultStr += rollChars[rollIndex];
        else resultStr += item;
    });
    rollIndex++;
    return resultStr;
}