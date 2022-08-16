require("date-time-format-timezone");
const { format } = require("date-fns-tz");
const { getDay, nextDay } = require("date-fns");
const blockTime = require("./blocks");
const { createHash } = require("crypto");
const fs = require("fs");
const path = require("path");

const dayCodes = ["SU", "MO", "TU", "WE", "TH", "FR", "SA"];
const vTimeZone = fs.readFileSync(path.join(__dirname, "../data/vtimezones.txt")).toString().split(/\r?\n/);

function buildSchedule(calendar, schedule, sequence) {
  let result = [
    "BEGIN:VCALENDAR",
    "METHOD:PUBLISH",
    "VERSION:2.0",
    "PRODID:-//Michael B. Klein//ETHS Schedule Generator//EN",
  ].concat(vTimeZone);

  for (const { period, details } of schedule) {
    result = result.concat(buildEvents(calendar, period, details, sequence));
  }

  result.push("END:VCALENDAR");
  return result.flat().join("\r\n");
}

function buildEvents(calendar, period, fields, sequence) {
  let result = [];
  if (!period.includes("LUNCH_6"))
    result.push(
      buildRegularEvent(
        calendar,
        blockTime(calendar.start, period, "monday"),
        fields,
        sequence
      )
    );
  result.push(
    buildRegularEvent(
      calendar,
      blockTime(calendar.start, period, "regular"),
      fields,
      sequence
    )
  );

  for (specialDay of ["lateStart", "earlyDismissal"]) {
    calendar[specialDay].forEach((date) => {
      const block = blockTime(date, period, specialDay);
      if (block.days.includes(getDay(date))) {
        result.push(buildEvent(date, {}, block, fields, sequence));
      }
    });
  }

  return result.flat();
}

function buildRegularEvent(calendar, { start, end, days, period }, fields, sequence) {
  let exdates = [];
  if (Array.isArray(days) && days.length > 0) {
    exdates = calendar.earlyDismissal
      .concat(calendar.lateStart)
      .concat(calendar.nonAttendance)
      .filter((date) => {
        return days.some((day) => date.getDay() == day);
      })
      .map((date) => {
        return [replaceTimePart(date, start), replaceTimePart(date, end)];
      })
      .flat();
  }

  const anchorDate =
    getDay(calendar.start) == days[0]
      ? calendar.start
      : nextDay(calendar.start, days[0]);

  return buildEvent(
    anchorDate,
    { endDate: calendar.end, exdates },
    { start, end, days, period },
    fields,
    sequence
  );
}

function buildEvent(
  anchorDate,
  { endDate, exdates },
  { start, end, days, period },
  fields,
  sequence
) {
  const uid = createHash("md5")
    .update(format(anchorDate, "yyyyMMdd") + period.toString())
    .digest("hex")
    .toUpperCase();
  const timestamp = new Date();
  const eventStart = replaceTimePart(anchorDate, start);
  const eventEnd = replaceTimePart(anchorDate, end);

  let result = ["BEGIN:VEVENT"];
  result.push(`DTEND;${tzDate(eventEnd)}`);
  result.push(`SEQUENCE:${sequence}`);
  result.push(`UID:${uid}`);

  for (const key in fields) {
    result.push([key.toUpperCase(), fields[key]].join(":"));
  }
  result.push(`DTSTART;${tzDate(eventStart)}`);

  if (endDate !== undefined) {
    exdates.forEach((date) => {
      result.push(`EXDATE;${tzDate(date)}`);
    });

    const bydays = days.map((day) => dayCodes[day]).join(",");
    result.push(`RRULE:FREQ=WEEKLY;UNTIL=${isoDate(endDate)};BYDAY=${bydays}`);
  }
  result.push(`CREATED;${tzDate(timestamp)}`);
  result.push(`DTSTAMP;${tzDate(timestamp)}`);
  result.push(`LAST-MODIFIED;${tzDate(timestamp)}`);
  result.push("END:VEVENT");
  return result;
}

function isoDate(date) {
  return format(date, "yyyyMMdd'T'HHmmss'Z'");
}

function replaceTimePart(date, newTime) {
  let result = new Date(date);
  result.setHours(newTime.getHours());
  result.setMinutes(newTime.getMinutes());
  result.setSeconds(newTime.getSeconds());
  return result;
}

function tzDate(date) {
  return [
    "TZID=America/Chicago",
    format(date, "yyyyMMdd'T'HHmmss", { timeZone: "America/Chicago" }),
  ].join(":");
}

module.exports = { buildSchedule };
