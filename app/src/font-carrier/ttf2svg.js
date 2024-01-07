var fontCarrier = require("./index.js");

function ttf2svg(buffer) {
    var transFont = fontCarrier.transfer(buffer);

    var output = transFont.output({
        types: ["svg"],
    });

    return output.svg.toString();
}

module.exports = ttf2svg;
