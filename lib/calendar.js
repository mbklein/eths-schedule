const { eachDayOfInterval } = require("date-fns");
const { zonedTimeToUtc } = require("date-fns-tz");
const fs = require("fs");

function loadCalendar(file) {
  const calendar = JSON.parse(fs.readFileSync(file));
  for (const term in calendar) {
    calendar[term].start += "T00:00:00";
    calendar[term].end += "T23:59:59";
  }
  return parse(calendar);
}

function parseString(value) {
  let match = value.match(/(\d{4}-\d{2}-\d{2})\/(\d{4}-\d{2}-\d{2})/);

  if (match) {
    return eachDayOfInterval({
      start: parseString(match[1]),
      end: parseString(match[2]),
    });
  }

  return zonedTimeToUtc(value, "America/Chicago");
}

function parseArray(value) {
  return value.map(parseString).flat();
}

function parseObject(value) {
  const result = {};
  for (const key in value) {
    result[key] = parse(value[key]);
  }
  return result;
}

function parse(value) {
  if (typeof value === "string") return parseString(value);
  else if (Array.isArray(value)) return parseArray(value);
  else return parseObject(value);
}

module.exports = loadCalendar;
