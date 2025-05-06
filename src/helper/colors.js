const colors = ["\x1b[31m", "\x1b[32m", "\x1b[33m"]

function defineColor(message, color) {
    if(color == "red") {
        return colors[0] + message + "\x1b[0m";
    } else if(color == "green") {
        return colors[1] + message + "\x1b[0m";
    } else if(color == "yellow") {
        return colors[2] + message + "\x1b[0m";
    } else {
        return colors[0] + "Cor inválida..." + "\x1b[0m";
    }
}

module.exports = defineColor;