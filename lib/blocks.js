const { zonedTimeToUtc, format } = require("date-fns-tz");

const blocks = {
  1: {
    monday: { start: "08:30:00", end: "09:03:00", days: [1] },
    regular: { start: "08:30:00", end: "09:55:00", days: [2, 4] },
    earlyDismissal: { start: "08:30:00", end: "09:40:00", days: [2, 4] },
    lateStart: { start: "09:35:00", end: "10:45:00", days: [2, 4] },
  },
  2: {
    monday: { start: "09:08:00", end: "09:41:00", days: [1] },
    regular: { start: "08:30:00", end: "09:55:00", days: [3, 5] },
    earlyDismissal: { start: "08:30:00", end: "09:40:00", days: [3, 5] },
    lateStart: { start: "09:35:00", end: "10:45:00", days: [3, 5] },
  },
  3: {
    monday: { start: "09:46:00", end: "10:19:00", days: [1] },
    regular: { start: "10:05:00", end: "11:30:00", days: [2, 4] },
    earlyDismissal: { start: "09:50:00", end: "11:00:00", days: [2, 4] },
    lateStart: { start: "10:55:00", end: "12:05:00", days: [2, 4] },
  },
  4: {
    monday: { start: "10:24:00", end: "10:57:00", days: [1] },
    regular: { start: "10:05:00", end: "11:30:00", days: [3, 5] },
    earlyDismissal: { start: "09:50:00", end: "11:00:00", days: [3, 5] },
    lateStart: { start: "10:55:00", end: "12:05:00", days: [3, 5] },
  },
  "5A": {
    monday: { start: "11:02:00", end: "11:35:00", days: [1] },
    regular: { start: "11:40:00", end: "13:05:00", days: [2, 4] },
    earlyDismissal: { start: "11:10:00", end: "12:20:00", days: [2, 4] },
    lateStart: { start: "12:15:00", end: "13:25:00", days: [2, 4] },
  },
  "5B": {
    monday: { start: "11:40:00", end: "12:13:00", days: [1] },
    regular: { start: "12:30:00", end: "13:55:00", days: [2, 4] },
    earlyDismissal: { start: "12:00:00", end: "13:10:00", days: [2, 4] },
    lateStart: { start: "13:05:00", end: "14:15:00", days: [2, 4] },
  },
  "6A": {
    monday: { start: "12:18:00", end: "12:51:00", days: [1] },
    regular: { start: "11:40:00", end: "13:05:00", days: [3, 5] },
    earlyDismissal: { start: "11:10:00", end: "12:20:00", days: [3, 5] },
    lateStart: { start: "12:15:00", end: "13:25:00", days: [3, 5] },
  },
  "6B": {
    monday: { start: "12:18:00", end: "12:51:00", days: [1] },
    regular: { start: "12:30:00", end: "13:55:00", days: [3, 5] },
    earlyDismissal: { start: "12:00:00", end: "13:10:00", days: [3, 5] },
    lateStart: { start: "13:05:00", end: "14:15:00", days: [3, 5] },
  },
  LUNCH_A: {
    monday: { start: "11:02:00", end: "11:35:00", days: [1] },
    regular: { start: "11:40:00", end: "12:20:00", days: [] },
    earlyDismissal: { start: "11:10:00", end: "11:50:00", days: [] },
    lateStart: { start: "12:15:00", end: "12:55:00", days: [] },
  },
  LUNCH_B: {
    monday: { start: "11:40:00", end: "12:13:00", days: [1] },
    regular: { start: "13:15:00", end: "13:55:00", days: [] },
    earlyDismissal: { start: "12:30:00", end: "13:10:00", days: [] },
    lateStart: { start: "13:35:00", end: "14:15:00", days: [] },
  },
  7: {
    monday: { start: "12:56:00", end: "13:29:00", days: [1] },
    regular: { start: "14:05:00", end: "15:35:00", days: [2, 4] },
    earlyDismissal: { start: "13:20:00", end: "14:30:00", days: [2, 4] },
    lateStart: { start: "14:25:00", end: "15:35:00", days: [2, 4] },
  },
  8: {
    monday: { start: "13:34:00", end: "14:07:00", days: [1] },
    regular: { start: "14:05:00", end: "15:35:00", days: [3, 5] },
    earlyDismissal: { start: "13:20:00", end: "14:30:00", days: [3, 5] },
    lateStart: { start: "14:25:00", end: "15:35:00", days: [3, 5] },
  },
};

function blockTime(date, period, type) {
  const lunch = /^LUNCH_(?<period>\d)(?<slot>[AB])$/.exec(period);
  if (lunch) {
    period = ["LUNCH", lunch.groups.slot].join("_");
  }

  const block = { ...blocks[period][type] };
  if (block.days.length == 0)
    block.days = lunch.groups.period == "5" ? [2, 4] : [3, 5];

  const dateString = format(date, "yyyy-MM-dd");

  const result = {
    start: zonedTimeToUtc(`${dateString}T${block.start}`, "America/Chicago"),
    end: zonedTimeToUtc(`${dateString}T${block.end}`, "America/Chicago"),
    days: block.days,
    period: period,
  };

  return result;
}

module.exports = blockTime;
