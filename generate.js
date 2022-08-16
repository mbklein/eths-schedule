#!/usr/bin/env node

const fs = require("fs");
const path = require("path");
const { buildSchedule } = require("./lib/events");
const loadCalendar = require("./lib/calendar");

const calendar = loadCalendar(path.join(__dirname, "./data/eths_calendar.json"));
const validTerms = Object.keys(calendar);

const scheduleFile = process.argv[2];
const term = process.argv[3];
const sequence = process.argv[4] || "0";

if (scheduleFile === undefined || !validTerms.includes(term) || isNaN(Number(sequence))) {
  process.stderr.write(`Usage: ${path.basename(process.argv[1])} SCHEDULE_FILE <${validTerms.join("|")}> [SEQUENCE]\n`);
  process.exit(1);
}
const schedules = JSON.parse(fs.readFileSync(scheduleFile));

process.stdout.write(buildSchedule(calendar[term], schedules[term], sequence));
