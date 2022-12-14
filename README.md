## Description

This project was created to assist with getting an [Evanston Township High School class schedule](https://www.eths.k12.il.us/domain/53) into an iCloud Calendar. Between WildKit Mondays, Blue Days, Orange Days, Late Start Days, Early Dismissal Days, and Non-Attendance Days, figuring out what to put where, what repeating rules to use, how to account for exceptions, etc. could be an extremely time consuming task.

## Prerequisites

- [`Node.js`](https://nodejs.org/) (v16.x or greater recommended)
- Access to (and some understanding of) `bash`, `zsh`, or some other UNIX-like shell

## Installation

1. Clone this repository and open a command prompt in the working directory.
   
2. Install dependencies:
   ```shell
   $ npm ci
   ```

## Usage

1. Create a JSON-formatted schedule file with the student's schedule in it, e.g.:
   ```json
   {
     "fall2022": [
       { "period": "1", "details": { "summary": "Block 1 Class Name", "location": "Block 1 Room #", "description": "Block 1 Teacher" } },
       { "period": "2", "details": { "summary": "Block 2 Class Name", "location": "Block 2 Room #", "description": "Block 2 Teacher" } },
       { "period": "3", "details": { "summary": "Block 3 Class Name", "location": "Block 3 Room #", "description": "Block 3 Teacher" } },
       { "period": "4", "details": { "summary": "Block 4 Class Name", "location": "Block 4 Room #", "description": "Block 4 Teacher" } },
       { "period": "5A", "details": { "summary": "Block 5A Class Name", "location": "Block 5A Room #", "description": "Block 5A Teacher" } },
       { "period": "LUNCH_5B", "details": { "summary": "Lunch", "location": "N120", "description": "Staff" } },
       { "period": "LUNCH_6A", "details": { "summary": "Lunch", "location": "S120", "description": "Staff" } },
       { "period": "6B", "details": { "summary": "Block 6B Class Name", "location": "Block 6B Room #", "description": "Block 6B Teacher" } },
       { "period": "7", "details": { "summary": "Block 7 Class Name", "location": "Block 7 Room #", "description": "Block 7 Teacher" } },
       { "period": "8", "details": { "summary": "Block 8 Class Name", "location": "Block 8 Room #", "description": "Block 8 Teacher" } }],
     "spring2023":  [
       { "period": "1", "details": { "summary": "Block 1 Class Name", "location": "Block 1 Room #", "description": "Block 1 Teacher" } },
       { "period": "2", "details": { "summary": "Block 2 Class Name", "location": "Block 2 Room #", "description": "Block 2 Teacher" } },
       { "period": "3", "details": { "summary": "Block 3 Class Name", "location": "Block 3 Room #", "description": "Block 3 Teacher" } },
       { "period": "4", "details": { "summary": "Block 4 Class Name", "location": "Block 4 Room #", "description": "Block 4 Teacher" } },
       { "period": "5A", "details": { "summary": "Block 5A Class Name", "location": "Block 5A Room #", "description": "Block 5A Teacher" } },
       { "period": "LUNCH_5B", "details": { "summary": "Lunch", "location": "N120", "description": "Staff" } },
       { "period": "LUNCH_6A", "details": { "summary": "Lunch", "location": "S120", "description": "Staff" } },
       { "period": "6B", "details": { "summary": "Block 6B Class Name", "location": "Block 6B Room #", "description": "Block 6B Teacher" } },
       { "period": "7", "details": { "summary": "Block 7 Class Name", "location": "Block 7 Room #", "description": "Block 7 Teacher" } },
       { "period": "8", "details": { "summary": "Block 8 Class Name", "location": "Block 8 Room #", "description": "Block 8 Teacher" } }
     ]
   }
   ```
   Pick the Block 5, 6, and Lunch periods appropriate to the schedule. Ignore `5X` and `6X` if they appear on the schedule.

2. Run the command to turn that schedule into an [iCalendar (`.ics`) file](https://icalendar.org/RFC-Specifications/iCalendar-RFC-5545/):
   ```shell
   $ ./generate.js path/to/above/schedule.json fall2022 > fall2022.ics
   ```

3. Open or import the `.ics` file using your calendar app.

## Notes

- iCalendar entries generated by this script use the same unique ID for every combination of start date and block number, so re-importing a new file into the same calendar *should* update existing events instead of creating new ones.
