const _ = require('lodash')
const moment = require('moment')

exports.helper = {
  EOL: {
    char: "\r\n",
  },
  generateLineFromFields: (fields) => {
    return _(fields)
      .sortBy("start")
      .map(function (field) {
        var fieldLength = field.end - field.start + 1;

        if (typeof field.value == "string") {
          return (
            field.value.substring(0, fieldLength) +
            _.times(fieldLength - field.value.length, function (chars) {
              return " ";
            }).join("")
          );
        } else if (typeof field.value == "number") {
          return (
            "" +
            _.times(
              fieldLength - field.value.toString().length,
              function (chars) {
                return "0";
              }
            ).join("") +
            field.value.toString().substring(0, fieldLength)
          );
        } else if (!field.value) {
          return `${field.value}`
        } else {
          return field.value.char.toString().substring(0, fieldLength);
        }
      })
      .join("");
  },
};
