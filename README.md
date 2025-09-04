# Faerûn Calendar for Roll20 (Seasons!)

## Overview

The **Faerûn Calendar** is a Roll20 API script for managing in-game time, weather, moon phases, and alarms. It provides a GM-facing control panel and player-facing displays so that campaigns can track the passage of time and environmental details with immersion.

Originally created by [Kirsty](https://app.roll20.net/users/1165285/kirsty), updated by [Julexar](https://app.roll20.net/users/9989180/julexar), and enhanced here with **manual weather setting functionality**, **temperature simulation**, and **weather transitions**.

---

## Features

* **Calendar Management**: Set day, month, year, time of day.
* **Time Advancement**: Advance time by minutes, hours, days, rests, or larger increments.
* **Weather System**:

  * Randomized seasonal weather with weighted probabilities.
  * **Transition-based logic**: weather is more likely to drift into related states (e.g., cloudy → rain, snow → blizzard) rather than jumping randomly.
  * Manual overrides for GM control.
  * Persistent conditions across days.
* **Moon Phases**: Automatic or manual moon phase control with toggleable display.
* **Alarms**: Schedule reminders (by date and time) with messages.
* **Temperature Simulation**: Dynamically generated based on season, weather, and time of day.
* **GM & Player Views**: GM menu with controls, player display with simplified view.

---

## Installation

1. Open your Roll20 campaign as GM.
2. Go to **Game Settings → API Scripts**.
3. Create a new script called `Faerun Calendar`.
4. Paste the contents of `faerun_calendar.js` into the editor.
5. Save the script.

---

## GM Commands

### Calendar Menu

```text
!cal
```

Displays the Calendar Menu.

* `--setday --{Number}` → set current day.
* `--setmonth --{Month}` → set current month (name or number).
* `--setyear --{Number}` → set current year.
* `--settime --hour --{Number} --minute --{Number}` → set time of day.
* `--advance --{Number} --{short rest|long rest|minute|hour|day|week|month|year}` → advance time.
* `--weather` → randomize weather.

  * `--set --{clear|cloudy|rain|storm|snow|blizzard}` → set manually.
  * `--toggle` → toggle weather display.
* `--moon` → reset moon phase.

  * `--phase --{Name|Number}` → set specific phase.
  * `--toggle` → toggle moon display.
* `--show` → display the calendar to players.
* `--reset` → reset calendar to defaults.

### Month Rename

```text
!month --{Number} --{Name}
```

Renames a month to a custom name.

### Alarms

```text
!alarm
```

Displays the Alarm Menu.

* `--{Number}` → edit an existing alarm.

  * `--settitle --{Text}`
  * `--setdate --{DD.MM.YYYY}`
  * `--settime --{HH:MM}`
  * `--setmessage --{Message}`
* `--new` → create a new alarm.

  * `--title --{Text}`
  * `--date --{DD.MM.YYYY}`
  * `--time --{HH:MM}`
  * `--message --{Message}`
* `--delete --{Number}` → delete an alarm.
* `--reset` → reset all alarms.

---

## Player Commands

```text
!cal
```

Displays the current Calendar to players (simplified view with date, time, season, weather, temperature, and moon).

---

## Example Player View

```
15th of Eleint, 1486
Time of Day: Night
Season: Fall
Weather: Persistent rain patters down.
Temperature: 52°F
Moon Phase: Waxing Crescent
```

---

## Special Systems

### Weather Transitions

The calendar doesn’t just re-roll weather each day — it uses **transition weights** to create continuity. Yesterday’s conditions influence today’s:

* In **Winter**, cloudy skies are more likely to drift into snow than to suddenly clear up.
* In **Spring**, rain may escalate into a storm instead of vanishing immediately.
* Blizzards rarely appear out of nowhere — they usually emerge from snow conditions.

This makes weather feel **natural and narrative-driven** instead of purely random.

### Seasonal Blending

At the edges of months, the script blends conditions from adjacent seasons (e.g., late Tarsakh feels like a mix of Winter and Spring). This creates smoother transitions across the year.

### Temperature Simulation

Temperature is calculated from season + weather + time of day, with some randomness for variety. For example:

* Clear Summer day: \~85°F
* Winter blizzard at night: \~0°F

---

## Notes & Customization

* **Weather**: Seasonal probabilities and transition logic can be edited in `seasonalProbabilities` and `seasonalTransitions`.
* **Moon Phases**: Automatic cycling, but GMs can override at any time.
* **Temperature**: Generated with seasonal/weather ranges, blended at month transitions, and adjusted for time of day.
* **Styles**: HTML/CSS inline styles are defined at the top of the script for menus.
* **Persistence**: Calendar and alarms persist across sessions using the Roll20 `state` object.

---
