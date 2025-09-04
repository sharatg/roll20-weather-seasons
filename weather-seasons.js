/* Faerûn Calendar for Roll20
Original created by Kirsty (https://app.roll20.net/users/1165285/kirsty)
Updated by Julexar (https://app.roll20.net/users/9989180/julexar)
Enhanced with manual weather setting functionality

GM Commands:
!cal
Displays the Calendar Menu
    --setday --{Insert Number}
    Sets the current day to the number you input
    --setmonth --{Insert Number}
    Sets the current month to the number you input
    --setyear --{Insert Number}
    Sets the current year to the number you input
    --settime --hour --{Insert Number} --minute --{Insert Number}
    Sets the current time to the numbers you input
    --advance --{Insert Number} --{short rest, long rest, hour, minute, day, week, month, year}
    Advances the time by the number/type you input
    --weather
    Randomises the Weather
        --set --{clear|cloudy|rain|storm|snow|blizzard}
        Sets the weather to a specific condition
        --toggle
        Toggles the Weather Display
    --moon
    Resets the Moon Phase
        --phase --{Insert Name/Number}
        Sets the Moon Phase according to the name/number you input
        --toggle
        Toggles the Moon Display
    --show
    Displays the Calendar to the Players
    --reset
    Resets the Calendar to the Default Values

!month --{Insert Name/Number} --{Insert Name}
Renames a Month to the Name you input

!alarm
Displays the Alarm Menu
    --{Insert Number}
    Displays the Alarm Menu for the Alarm you input
        --settile --{Insert Title}
        Sets the Title of the Alarm
        --setdate --{Insert Date}
        Sets the Date of the Alarm (Format: DD.MM.YYYY)
        --settime --{Insert Time}
        Sets the Time of the Alarm (Format: HH:MM [24h])
        --setmessage --{Insert Message}
        Sets the Message of the Alarm
    --new
    Opens the Alarm Creator
        --title --{Insert Title}
        Sets the Title of the Alarm
        --date --{Insert Date}
        Sets the Date of the Alarm (Format: DD.MM.YYYY)
        --time --{Insert Time}
        Sets the Time of the Alarm (Format: HH:MM [24h])
        --message --{Insert Message}
        Sets the Message of the Alarm
    --delete --{Insert Number}
    Deletes the Alarm you input
    --reset
    Resets the Alarms to the Default Values

Player Commands:

!cal
Displays the current Calendar to the Players
*/

const styles = {
	divMenu: 'style="width: 300px; border: 1px solid black; background-color: #ffffff; padding: 5px;"',
	divButton: 'style="text-align:center;"',
	buttonSmall:
		'style="text-align:center; border: 1px solid black; margin: 1px; background-color: #7E2D40; border-radius: 4px;  box-shadow: 1px 1px 1px #707070; width: 75px;',
	buttonMedium:
		'style="text-align:center; border: 1px solid black; margin: 1px; background-color: #7E2D40; border-radius: 4px;  box-shadow: 1px 1px 1px #707070; width: 100px;',
	buttonLarge:
		'style="text-align:center; border: 1px solid black; margin: 1px; background-color: #7E2D40; border-radius: 4px;  box-shadow: 1px 1px 1px #707070; width: 150px;',
	table: 'style="text-align:center; font-size: 12px; width: 100%; border-style: 3px solid #cccccc;"',
	arrow: 'style="border: none; border-top: 3px solid transparent; border-bottom: 3px solid transparent; border-left: 195px solid rgb(126, 45, 64); margin-bottom: 2px; margin-top: 2px;"',
	header: 'style="color: rgb(126, 45, 64); font-size: 18px; text-align: left; font-variant: small-caps; font-family: Times, serif;"',
	sub: 'style="font-size: 11px; line-height: 13px; margin-top: -3px; font-style: italic;"',
	tdReg: 'style="text-align: right;"',
	trTab: 'style="text-align: left; border-bottom: 1px solid #cccccc;"',
	tdTab: 'style="text-align: center; border-right: 1px solid #cccccc;"',
	span: 'style="display: inline; width: 10px; height: 10px; padding: 1px; border: 1px solid black; background-color: white;"',
};

const seasonalProbabilities = {
	Hammer:    { clear: 10, cloudy: 30, snow: 40, blizzard: 20 },
	Alturiak:  { clear: 15, cloudy: 35, snow: 35, blizzard: 15 },
	Ches:      { clear: 25, cloudy: 40, rain: 20, snow: 15 },
	Tarsakh:   { clear: 30, cloudy: 30, rain: 35, storm: 5 },
	Mirtul:    { clear: 35, cloudy: 30, rain: 30, storm: 5 },
	Kythorn:   { clear: 40, cloudy: 30, rain: 25, storm: 5 },
	Flamerule: { clear: 45, cloudy: 25, rain: 20, storm: 10 },
	Eleasias:  { clear: 40, cloudy: 25, rain: 25, storm: 10 },
	Eleint:    { clear: 35, cloudy: 30, rain: 30, storm: 5 },
	Marpenoth: { clear: 30, cloudy: 40, rain: 25, storm: 5 },
	Uktar:     { clear: 25, cloudy: 45, rain: 20, snow: 10 },
	Nightal:   { clear: 15, cloudy: 35, snow: 35, blizzard: 15 }
};

const seasonalTransitions = {
	Winter: {
		clear:    { clear: 50, cloudy: 30, snow: 15, blizzard: 5 },
		cloudy:   { clear: 20, cloudy: 50, snow: 25, blizzard: 5 },
		snow:     { cloudy: 30, snow: 40, blizzard: 30 },
		blizzard: { snow: 40, blizzard: 60 }
	},
	Spring: {
		clear:    { clear: 55, cloudy: 30, rain: 10, storm: 5 },
		cloudy:   { clear: 25, cloudy: 45, rain: 20, storm: 10 },
		rain:     { clear: 15, cloudy: 35, rain: 30, storm: 20 },
		storm:    { clear: 10, cloudy: 20, rain: 30, storm: 40 }
	},
	Summer: {
		clear:    { clear: 60, cloudy: 25, rain: 10, storm: 5 },
		cloudy:   { clear: 30, cloudy: 40, rain: 20, storm: 10 },
		rain:     { clear: 20, cloudy: 30, rain: 30, storm: 20 },
		storm:    { clear: 15, cloudy: 25, rain: 30, storm: 30 }
	},
	Fall: {
		clear:    { clear: 55, cloudy: 30, rain: 10, storm: 5 },
		cloudy:   { clear: 25, cloudy: 40, rain: 20, storm: 15 },
		rain:     { clear: 10, cloudy: 30, rain: 30, storm: 30 },
		storm:    { clear: 10, cloudy: 20, rain: 30, storm: 40 }
	}
};

const weatherTransitions = {
	clear:    ['clear', 'cloudy'],
	cloudy:   ['clear', 'cloudy', 'rain', 'snow'],
	rain:     ['cloudy', 'rain', 'storm'],
	storm:    ['rain', 'storm'],
	snow:     ['cloudy', 'snow', 'blizzard'],
	blizzard: ['snow', 'blizzard']
};

// Valid weather types for manual setting
const validWeatherTypes = ['clear', 'cloudy', 'rain', 'storm', 'snow', 'blizzard'];

function getSeason(month) {
	switch (month) {
		case 'Hammer':
		case 'Alturiak':
		case 'Ches':
			return 'Winter';
		case 'Tarsakh':
		case 'Mirtul':
			return 'Spring';
		case 'Kythorn':
		case 'Flamerule':
		case 'Eleasias':
			return 'Summer';
		case 'Eleint':
		case 'Marpenoth':
		case 'Uktar':
			return 'Fall';
		case 'Nightal':
			return 'Deep Winter';
		default:
			return 'Spring'; // fallback default
	}
}

function weightedChoice(weights) {
	const total = Object.values(weights).reduce((a, b) => a + b, 0);
	let r = randomInteger(total);
	for (let condition in weights) {
		r -= weights[condition];
		if (r <= 0) return condition;
	}
	return Object.keys(weights)[0]; // fallback
}

function weightedTransitionChoice(transitionMap) {
	const entries = Object.entries(transitionMap);
	const total = entries.reduce((sum, [_, val]) => sum + val, 0);
	let r = randomInteger(total);
	for (let [key, weight] of entries) {
		r -= weight;
		if (r <= 0) return key;
	}
	return entries[0][0]; // fallback
}

const moonPhases = [
	'Full Moon',
	'Waning Gibbous',
	'Last Quarter',
	'Waning Crescent',
	'New Moon',
	'Waxing Crescent',
	'First Quarter',
	'Waxing Gibbous',
];

const monthNames = ['Hammer', 'Alturiak', 'Ches', 'Tarsakh', 'Mirtul', 'Kythorn', 'Flamerule', 'Eleasias', 'Eleint', 'Marpenoth', 'Uktar', 'Nightal'];

class FaerunCalendar {
	constructor() {
		this.style = styles;
		this.default = state.calendar;
		this.moons = moonPhases;
		this.months = monthNames;
		this.alarms = state.alarms;
	}

	handleInput(msg) {
		const args = msg.content.split(/\s+--/);

		if (msg.type !== 'api') return;

		if (playerIsGM(msg.playerid)) {
			switch (args[0]) {
				case '!cal':
					switch (args[1]) {
						default:
							chkAlarms();
							calendarMenu();
							break;
						case 'setday':
							const day = parseInt(args[2]);
							if (isNaN(day)) return sendChat('Faerûn Calendar', 'Please input a valid number for the day.');

							setDay(day);
							chkAlarms();
							calendarMenu();
							break;
                        case 'settemperature':
                            const temp = parseInt(args[2]);
                            if (isNaN(temp)) return sendChat('Faerûn Calendar', 'Please input a valid number for the temperature.');
                            state.calendar.temperature = temp;
                            calendarMenu();
                            break;
                        case 'setmonth':
							const month = args[2];
							if (!monthNames.includes(month)) return sendChat('Faerûn Calendar', 'Please input a valid month.');

							setMonth(month);
							chkAlarms();
							calendarMenu();
							break;
						case 'setyear':
							const year = parseInt(args[2]);
							if (isNaN(year)) return sendChat('Faerûn Calendar', 'Please input a valid number for the year.');

							setYear(year);
							chkAlarms();
							calendarMenu();
							break;
						case 'settime':
							const hour = parseInt(args[3]);
							const minute = parseInt(args[5]);
							if (isNaN(hour) || isNaN(minute))
								return sendChat('Faerûn Calendar', 'Please input a valid number for the hour and minute.');

							setHour(hour);
							setMinute(minute);
							chkAlarms();
							calendarMenu();
							break;
						case 'advance':
							const amount = parseInt(args[2]);
							const type = args[3];
							if (isNaN(amount)) return sendChat('Faerûn Calendar', 'Please input a valid number for the amount.');
							if (!['Short Rest', 'Long Rest', 'Minute', 'Hour', 'Day', 'Week', 'Month', 'Year'].includes(type))
								return sendChat('Faerûn Calendar', 'Please input a valid type.');

							advance(amount, type);
							chkAlarms();
							showCal();
							break;
						case 'weather':
							if (args[2] === 'toggle') {
								toggleWeather();
								calendarMenu();
							} else if (args[2] === 'set') {
								const weatherType = args[3];
								setWeatherManually(weatherType);
								calendarMenu();
							} else {
								randomizeWeather();
								calendarMenu();
							}
							break;
						case 'moon':
							if (args[2] === 'toggle') {
								toggleMoon();
								calendarMenu();
							} else if (args[2] === 'phase') {
								const phase = args[3];
								updMoon(phase);
								calendarMenu();
							} else {
								updMoon();
								calendarMenu();
							}
							break;
						case 'show':
							showCal();
							break;
						case 'reset':
							setCalendarDefaults();
							calendarMenu();
							break;
					}
					break;
				case '!month':
					renameMonth(args[1], args[2]);
					break;
				case '!alarm':
					switch (args[1]) {
						case undefined:
							alarmMenu();
							break;
						default:
							const num = parseInt(args[1]);
							if (isNaN(num)) return sendChat('Faerûn Calendar', 'Please input a valid number for the alarm.');

							switch (args[2]) {
								case 'settitle':
									setTitle(num, args[3]);
									break;
								case 'setdate':
									setDate(num, args[3]);
									break;
								case 'settime':
									setTime(num, args[3]);
									break;
								case 'setmessage':
									setMessage(num, args[3]);
									break;
							}

							alarmMenu(num);
							break;
						case 'new':
							createAlarm(args[2], args[4], args[6], args[8]);
							alarmMenu();
							break;
						case 'delete':
							deleteAlarm(args[2]);
							alarmMenu();
							break;
						case 'reset':
							setAlarmDefaults();
							alarmMenu();
							break;
					}
					break;
			}
		} else {
			switch (args[0]) {
				case '!cal':
					showCal();
					break;
			}
		}
	}

	checkInstall() {
		if (!state.calendar) {
			setCalendarDefaults();
		}

		if (!state.alarms) {
			setAlarmDefaults();
		}
	}

	registerEventHandlers() {
		on('chat:message', this.handleInput);
		log('Faerûn Calendar - Registered Event Handlers!');
	}
}

const calendar = new FaerunCalendar();

function setCalendarDefaults() {
	state.calendar = {
	ord: 1,
	day: 1,
	month: 1,
	year: 1486,
	timeOfDay: 'Day',
	weather: 'It is a cool but sunny day',
	moon: 'Full Moon',
	moonImg: '',
	wtype: true,
	mtype: true,
    stormActive: false,
    temperature: null,
};
	log('Faerûn Calendar: Successfully registered Calendar defaults!');
}

function setAlarmDefaults() {
	state.alarms = [];
	log('Faerûn Calendar: Successfully registered Alarm defaults!');
}

function updOrdinal() {
	state.calendar.ord = 30 * (state.calendar.month - 1) + state.calendar.day;
}

function getSuffix() {
	const ordinal = state.calendar.ord;

	if (ordinal >= 11 && ordinal <= 13) return 'th';

	switch (ordinal % 10) {
		case 1:
			return 'st';
		case 2:
			return 'nd';
		case 3:
			return 'rd';
		default:
			return 'th';
	}
}

function updDate() {
	updOrdinal();
	const ordinal = state.calendar.ord;

	let date, month;

	if (Math.ceil(ordinal / 30) <= 1) {
		month = calendar.months[0];
		date = ordinal;
		setMonth(month);
	} else {
		month = monthNames[Math.ceil(ordinal / 30) - 1];
		date = ordinal - 30 * (Math.ceil(ordinal / 30) - 1);
		setMonth(month);
	}

	setDay(date);
}

function setDay(day) {
	state.calendar.day = day;
}

function getBlendedSeason(day, month) {
	const seasonMap = {
		Hammer: 'Winter',
		Alturiak: 'Winter',
		Ches: 'Winter',
		Tarsakh: 'Spring',
		Mirtul: 'Spring',
		Kythorn: 'Summer',
		Flamerule: 'Summer',
		Eleasias: 'Summer',
		Eleint: 'Fall',
		Marpenoth: 'Fall',
		Uktar: 'Fall',
		Nightal: 'Deep Winter',
	};

	const blendDays = 5; // number of days to blend across months
	const prevMonthIndex = (month - 2 + 12) % 12; // for day 1–5
	const nextMonthIndex = month % 12; // for day 26–30
	const prevMonth = monthNames[prevMonthIndex];
	const nextMonth = monthNames[nextMonthIndex];

	if (day <= blendDays) {
		// early month: blend with previous season
		const currentWeight = (day - 1) / blendDays;
		const prevSeason = seasonMap[prevMonth];
		const currentSeason = seasonMap[monthNames[month - 1]];
		return { base: currentSeason, blend: prevSeason, weight: currentWeight };
	} else if (day >= 31 - blendDays) {
		// late month: blend with next season
		const currentWeight = (31 - day) / blendDays;
		const currentSeason = seasonMap[monthNames[month - 1]];
		const nextSeason = seasonMap[nextMonth];
		return { base: currentSeason, blend: nextSeason, weight: currentWeight };
	}

	return { base: seasonMap[monthNames[month - 1]], blend: null, weight: 1 };
}

function getMonth() {
	return monthNames[state.calendar.month - 1];
}

function setMonth(month) {
	state.calendar.month = monthNames.indexOf(month) + 1;
}

function setYear(year) {
	state.calendar.year = year;
}

function getHour() {
	if (state.calendar.hour < 10) return `0${state.calendar.hour}`;
	return `${state.calendar.hour}`;
}

function setHour(hour) {
	state.calendar.hour = hour;
}

function getMinute() {
	if (state.calendar.minute < 10) return `0${state.calendar.minute}`;
	return `${state.calendar.minute}`;
}

function setMinute(minute) {
	state.calendar.minute = minute;
}

function updMoon(phase) {
	if (!phase) {
		const ordinal = state.calendar.ord;
		const year = state.calendar.year;
		const remainder = year / 4 - Math.floor(year / 4);
		let moonArray = [];

		switch (remainder) {
			case 0.25:
				moonArray = getMoonArray(2);
				break;
			case 0.5:
				moonArray = getMoonArray(3);
				break;
			case 0.75:
				moonArray = getMoonArray(4);
				break;
			default:
				moonArray = getMoonArray(1);
				break;
		}

		const moonNum = moonArray.split(',');
		getMoon(moonNum[ordinal % 8]);
	} else {
		state.calendar.moon = phase;
	}
}

function getMoonArray(num) {
	let moonArray;

	switch (num) {
		case 1:
			moonArray =
				'0,1,2,2,3,3,4,4,5,6,6,7,7,7,8,8,9,10,10,11,11,12,12,13,14,14,14,15,15,16,16,16,1,2,2,3,3,4,4,5,6,6,7,7,8,8,9,10,10,11,11,11,12,12,13,14,14,15,15,16,16,1,2,2,3,3,3,4,4,5,6,6,7,7,7,8,8,9,10,10,11,11,12,12,13,14,14,15,15,15,16,16,1,2,2,3,3,4,4,5,6,6,7,7,7,8,8,9,10,10,11,11,11,12,12,13,14,14,15,15,15,16,16,1,2,2,3,3,4,4,5,6,6,7,7,8,8,9,10,10,11,11,11,12,12,13,14,14,15,15,15,16,16,1,2,2,3,3,4,4,5,6,6,7,7,7,8,8,9,10,10,11,11,11,12,12,13,14,14,15,15,16,16,1,2,2,3,3,4,4,4,5,6,6,7,7,8,8,9,10,10,11,11,11,12,12,13,14,14,14,15,15,16,16,16,1,2,2,3,4,4,5,6,6,7,7,7,8,8,9,10,10,11,11,12,12,13,14,14,15,15,15,16,16,1,2,2,3,3,3,4,4,5,6,6,7,7,8,8,9,10,10,11,11,11,12,12,13,14,14,15,15,16,16,1,2,2,3,3,3,4,4,5,6,6,7,7,7,8,8,9,10,10,11,11,12,12,13,14,14,15,15,15,16,16,1,2,2,3,3,4,4,5,6,6,7,7,7,8,8,9,10,10,11,11,11,12,12,13,14,14,15,15,16,16,1,2,2,2,3,3,4,4,5,6,6,7,7,7,8,8,9,10,10,11,11,12,12,13,14,14,15,15,15,16,16,1';
			break;
		case 2:
			moonArray =
				'0,2,2,3,3,4,4,5,6,6,7,7,7,8,8,9,10,10,11,11,11,12,12,13,14,14,15,15,16,16,1,2,2,3,3,3,4,4,5,6,6,7,7,8,8,9,10,10,11,11,11,12,12,13,14,14,15,15,15,16,16,1,2,2,3,3,4,4,5,6,6,7,7,7,8,8,9,10,10,11,11,12,12,13,14,14,15,15,15,16,16,1,2,2,3,3,3,4,4,5,6,6,7,7,8,8,9,10,10,11,11,11,12,12,13,14,14,14,15,15,16,16,16,1,2,2,3,4,4,5,6,6,7,7,7,8,8,9,10,10,11,11,12,12,13,14,14,15,15,15,16,16,1,2,2,3,3,3,4,4,5,6,6,7,7,8,8,9,10,10,11,11,11,12,12,13,14,14,15,15,16,16,1,2,2,3,3,3,4,4,5,6,6,7,7,7,8,8,9,10,10,11,11,12,12,13,14,14,14,15,15,16,16,16,0,1,2,2,3,4,4,5,6,6,7,7,7,8,8,9,10,10,11,11,11,12,12,13,14,14,15,15,16,16,1,2,2,3,3,3,4,4,5,6,6,7,7,8,8,9,10,10,11,11,11,12,12,13,14,14,14,15,15,16,16,16,1,2,2,3,4,4,5,6,6,7,7,7,8,8,9,10,10,11,11,11,12,12,13,14,14,15,15,16,16,1,2,2,3,3,3,4,4,5,6,6,7,7,8,8,9,10,10,11,11,11,12,12,13,14,14,14,15,15,16,16,16,1,2,2,3,4,4,5,6,6,7,7,7,8,8,9,10,10,11,11,12,12,13,14,14,15,15,15,16,16,1';
			break;
		case 3:
			moonArray =
				'0,2,2,3,3,3,4,4,5,6,6,7,7,8,8,9,10,10,11,11,11,12,12,13,14,14,15,15,16,16,1,2,2,3,3,3,4,4,5,6,6,7,7,7,8,8,9,10,10,11,11,12,12,13,14,14,15,15,15,16,16,1,2,2,3,3,4,4,5,6,6,7,7,7,8,8,9,10,10,11,11,11,12,12,13,14,14,15,15,16,16,1,2,2,3,3,3,4,4,5,6,6,7,7,7,8,8,9,10,10,11,11,12,12,13,14,14,14,15,15,16,16,16,1,2,2,3,4,4,5,6,6,7,7,7,8,8,9,10,10,11,11,11,12,12,13,14,14,15,15,16,16,1,2,2,3,3,3,4,4,5,6,6,7,7,8,8,9,10,10,11,11,11,12,12,13,14,14,15,15,15,16,16,1,2,2,3,3,4,4,5,6,6,7,7,7,8,8,9,10,10,11,11,12,12,13,14,14,14,15,15,16,16,16,0,1,2,2,3,3,4,4,5,6,6,7,7,8,8,9,10,10,11,11,11,12,12,13,14,14,15,15,15,16,16,1,2,2,3,3,4,4,5,6,6,7,7,7,8,8,9,10,10,11,11,12,12,13,14,14,14,15,15,16,16,16,1,2,2,3,3,4,4,5,6,6,7,7,8,8,9,10,10,11,11,11,12,12,13,14,14,15,15,16,16,1,2,2,3,3,3,4,4,5,6,6,7,7,7,8,8,9,10,10,11,11,12,12,13,14,14,14,15,15,16,16,16,1,2,2,3,4,4,5,6,6,7,7,7,8,8,9,10,10,11,11,11,12,12,13,14,14,15,15,16,16,1';
			break;
		case 4:
			moonArray =
				'0,2,2,3,3,3,4,4,5,6,6,7,7,8,8,9,10,10,11,11,11,12,12,13,14,14,14,15,15,16,16,16,1,2,2,3,4,4,5,6,6,7,7,7,8,8,9,10,10,11,11,11,12,12,13,14,14,15,15,16,16,1,2,2,2,3,3,4,4,5,6,6,7,7,8,8,9,10,10,11,11,11,12,12,13,14,14,15,15,15,16,16,1,2,2,3,3,4,4,5,6,6,7,7,7,8,8,9,10,10,11,11,12,12,13,14,14,14,15,15,16,16,16,1,2,2,3,3,4,4,5,6,6,7,7,8,8,9,10,10,11,11,11,12,12,13,14,14,15,15,16,16,1,2,2,2,3,3,4,4,5,6,6,7,7,7,8,8,9,10,10,11,11,12,12,13,14,14,15,15,15,16,16,1,2,2,3,3,4,4,5,6,6,7,7,7,8,8,9,10,10,11,11,11,12,12,13,14,14,15,15,15,16,16,0,1,2,2,3,3,4,4,5,6,6,7,7,7,8,8,9,10,10,11,11,12,12,13,14,14,15,15,15,16,16,1,2,2,3,3,4,4,5,6,6,7,7,7,8,8,9,10,10,11,11,11,12,12,13,14,14,15,15,15,16,16,1,2,2,3,3,4,4,5,6,6,7,7,8,8,9,10,10,11,11,11,12,12,13,14,14,15,15,15,16,16,1,2,2,3,3,4,4,5,6,6,7,7,7,8,8,9,10,10,11,11,12,12,13,14,14,14,15,15,16,16,16,1,2,2,3,3,4,4,5,6,6,7,7,8,8,9,10,10,11,11,11,12,12,13,14,14,15,15,15,16,16';
			break;
	}

	return moonArray;
}

function getMoon(num) {
	if (num && isNaN(num)) {
		switch (num.toLowerCase()) {
			case 'full moon':
				state.calendar.moon = 'Full Moon';
				break;
			case 'waning gibbous':
				state.calendar.moon = 'Waning Gibbous';
				break;
			case 'last quarter':
				state.calendar.moon = 'Last Quarter';
				break;
			case 'waning crescent':
				state.calendar.moon = 'Waning Crescent';
				break;
			case 'new moon':
				state.calendar.moon = 'New Moon';
				break;
			case 'waxing crescent':
				state.calendar.moon = 'Waxing Crescent';
				break;
			case 'first quarter':
				state.calendar.moon = 'First Quarter';
				break;
			case 'waxing gibbous':
				state.calendar.moon = 'Waxing Gibbous';
				break;
		}
	} else {
		switch (num) {
			case 1 || 0:
				state.calendar.moon = 'Full Moon';
				break;
			case 2 || 3 || 4:
				state.calendar.moon = 'Waning Gibbous';
				break;
			case 5:
				state.calendar.moon = 'Last Quarter';
				break;
			case 6 || 7 || 8:
				state.calendar.moon = 'Waning Crescent';
				break;
			case 9:
				state.calendar.moon = 'New Moon';
				break;
			case 10 || 11 || 12:
				state.calendar.moon = 'Waxing Crescent';
				break;
			case 13:
				state.calendar.moon = 'First Quarter';
				break;
			case 14 || 15 || 16:
				state.calendar.moon = 'Waxing Gibbous';
				break;
		}
	}
}

// NEW FUNCTION: Set weather manually
function setWeatherManually(weatherType) {
	if (!weatherType || !validWeatherTypes.includes(weatherType.toLowerCase())) {
		sendChat('Faerûn Calendar', `/w gm Invalid weather type. Valid options are: ${validWeatherTypes.join(', ')}`);
		return;
	}

	const normalizedType = weatherType.toLowerCase();
	const month = getMonth();
	
	// Update the weather state
	state.calendar.weatherLast = normalizedType;
	
	// Handle storm state
	if (normalizedType === 'storm') {
		state.calendar.stormActive = true;
		state.calendar.weather = `Season: ${month} — A violent thunderstorm crashes overhead.`;
	} else {
		state.calendar.stormActive = false;
		state.calendar.weather = `Season: ${month} — ${formatWeatherDescription(normalizedType)}`;
	}

	// Update temperature based on manually set weather
	const blended = getBlendedSeason(state.calendar.day, state.calendar.month);
	const season = blended.base;
	const blend = blended.blend;
	const weight = blended.weight;

	state.calendar.temperature = generateTemperature(
		season,
		normalizedType,
		state.calendar.timeOfDay,
		blend,
		weight
	);

	sendChat('Faerûn Calendar', `/w gm Weather manually set to: ${formatWeatherDescription(normalizedType)}`);
}

function calendarMenu() {
	updDate();

	const suffix = getSuffix();
	const day = state.calendar.day;
	const month = getMonth();
	const year = state.calendar.year;
	const timeOfDay = state.calendar.timeOfDay;
	const weather = state.calendar.wtype ? state.calendar.weather : null;
	const moon = state.calendar.mtype ? state.calendar.moon : null;

	let months = monthNames.join('|');
	let weatherTypes = validWeatherTypes.join('|');

	let output = `<div ${calendar.style.divMenu}>` +
		`<div ${calendar.style.header}>Calendar Menu</div>` +
		`<div ${calendar.style.arrow}></div>` +
		`<table>` +
		`<tr><td ${calendar.style.tdReg}>Day: </td><td ${calendar.style.tdReg}><a ${calendar.style.buttonMedium}" href="!cal --setday --?{Day?|${day}}">${day}${suffix}</a></td></tr>` +
		`<tr><td ${calendar.style.tdReg}>Month: </td><td ${calendar.style.tdReg}><a ${calendar.style.buttonMedium}" href="!cal --setmonth --?{Month?|${months}}">${month}</a></td></tr>` +
		`<tr><td ${calendar.style.tdReg}>Year: </td><td ${calendar.style.tdReg}><a ${calendar.style.buttonMedium}" href="!cal --setyear --?{Year?|${year}}">${year}</a></td></tr>` +
		`<tr><td ${calendar.style.tdReg}>Time of Day: </td><td ${calendar.style.tdReg}>${timeOfDay}</td></tr>` +
		`<tr><td ${calendar.style.tdReg}>Temperature: </td><td ${calendar.style.tdReg}><a ${calendar.style.buttonMedium}" href="!cal --settemperature --?{Temperature?|${state.calendar.temperature || 70}}">${state.calendar.temperature !== null ? state.calendar.temperature + '°F' : 'Unset'}</a></td></tr>`;

	if (moon) {
		output += `<tr><td ${calendar.style.tdReg}>Moon: </td><td ${calendar.style.tdReg}><a ${calendar.style.buttonMedium}" href="!cal --moon --phase --?{Phase?|${moon}}">${moon}</a></td></tr>`;
	}
	if (weather) {
		output += `<tr><td ${calendar.style.tdReg}>Weather: </td><td ${calendar.style.tdReg}>${weather}</td></tr>`;
	}

	output += `</table><br><br>` +
		`<div ${calendar.style.divButton}><a ${calendar.style.buttonLarge}" href="!cal --advance --1 --Long Rest">Advance Time</a></div>` +
		`<div ${calendar.style.divButton}><a ${calendar.style.buttonLarge}" href="!cal --weather --toggle">Toggle Weather Display</a></div>` +
		`<div ${calendar.style.divButton}><a ${calendar.style.buttonLarge}" href="!cal --moon --toggle">Toggle Moon Display</a></div>` +
		`<div ${calendar.style.divButton}><a ${calendar.style.buttonLarge}" href="!cal --weather">Randomise Weather</a></div>` +
		`<div ${calendar.style.divButton}><a ${calendar.style.buttonLarge}" href="!cal --weather --set --?{Weather Type?|${weatherTypes}}">Set Weather</a></div>` +
		`<div ${calendar.style.divButton}><a ${calendar.style.buttonLarge}" href="!cal --moon">Reset Moon Phase</a></div>` +
		`<div ${calendar.style.divButton}><a ${calendar.style.buttonLarge}" href="!alarm">Open Alarm Menu</a></div>` +
		`<div ${calendar.style.divButton}><a ${calendar.style.buttonLarge}" href="!cal --show">Show to Players</a></div>` +
		`</div>`;

	sendChat('Faerûn Calendar', `/w gm ${output}`);
}


function showCal() {
	updDate();

	const suffix = getSuffix();
	const day = state.calendar.day;
	const month = getMonth();
	const year = state.calendar.year;
	const timeOfDay = state.calendar.timeOfDay;
	const moon = state.calendar.mtype ? state.calendar.moon : null;

	let season = getSeason(month);
	let weatherText = state.calendar.wtype ? state.calendar.weather : null;
	let cleanWeather = '';

	// Strip "Season: X — " prefix if present
	if (weatherText && weatherText.startsWith('Season:')) {
		const split = weatherText.split('—');
		if (split.length > 1) {
			cleanWeather = split[1].trim();
		} else {
			cleanWeather = weatherText;
		}
	} else {
		cleanWeather = weatherText;
	}

	let output = `<div ${calendar.style.divMenu}>` +
		`<div ${calendar.style.header}>Faerûn Calendar</div>` +
		`<div ${calendar.style.sub}>Player View</div>` +
		`<div ${calendar.style.arrow}></div>` +
		`<b>${day}${suffix}</b> of <b>${month}, ${year}</b>` +
		`<br><b>Time of Day:</b> ${timeOfDay}`;

        if (season) {
            output += `<br><b>Season:</b> ${season}`;
        }
        if (cleanWeather) {
            output += `<br><b>Weather:</b> ${cleanWeather}`;
        }
        if (state.calendar.temperature !== null) {
            output += `<br><b>Temperature:</b> ${state.calendar.temperature}°F`; // or °C
        }
        if (moon) {
            output += `<br><b>Moon Phase:</b> ${moon}`;
        }

	output += `</div>`;

	sendChat('Faerûn Calendar', output);
}

function advance() {
	const cycle = ['Day', 'Afternoon', 'Night'];
	let current = state.calendar.timeOfDay;
	let index = cycle.indexOf(current);

	if (index === -1) index = 0;

	if (index < 2) {
		// Just advance time of day
		state.calendar.timeOfDay = cycle[index + 1];
	} else {
		// End of day: advance the date
		state.calendar.timeOfDay = 'Day';
		state.calendar.day += 1;
		state.calendar.ord += 1;

		while (state.calendar.day > 30) {
			state.calendar.month += 1;
			state.calendar.day -= 30;
		}

		while (state.calendar.month > 12) {
			state.calendar.year += 1;
			state.calendar.month -= 12;
		}

		randomizeWeather(); // Only randomize at the start of a new day
	}

	const blended = getBlendedSeason(state.calendar.day, state.calendar.month);
	const season = blended.base;
	const blend = blended.blend;
	const weight = blended.weight;

	const weatherType = (state.calendar.weatherLast || 'clear').toLowerCase();

	state.calendar.temperature = generateTemperature(
		season,
		weatherType,
		state.calendar.timeOfDay,
		blend,
		weight
	);

	updDate();
	chkAlarms();
}

function randomizeWeather() {
	const month = getMonth(); // e.g., "Eleasias"
	const lastWeather = (state.calendar.weatherLast || 'clear').toLowerCase();

	const seasonalCategory = (month => {
		const winter = ['Hammer', 'Alturiak', 'Nightal', 'Uktar'];
		const spring = ['Ches', 'Tarsakh', 'Mirtul'];
		const summer = ['Kythorn', 'Flamerule', 'Eleasias'];
		const fall   = ['Eleint', 'Marpenoth'];

		if (winter.includes(month)) return 'Winter';
		if (spring.includes(month)) return 'Spring';
		if (summer.includes(month)) return 'Summer';
		if (fall.includes(month)) return 'Fall';
		return 'Spring'; // Fallback
	})(month);

	const transitions = seasonalTransitions[seasonalCategory][lastWeather] || seasonalTransitions[seasonalCategory].clear;
	const chosen = weightedTransitionChoice(transitions);

	state.calendar.weatherLast = chosen;

	if (chosen === 'storm') {
		state.calendar.weather = state.calendar.stormActive
			? `Season: ${month} — A violent thunderstorm crashes overhead.`
			: `Season: ${month} — A thunderstorm looms.`;
		state.calendar.stormActive = true;
	} else {
		state.calendar.stormActive = false;
		state.calendar.weather = `Season: ${month} — ${formatWeatherDescription(chosen)}`;
	}

	const blended = getBlendedSeason(state.calendar.day, state.calendar.month);
	const season = blended.base;
	const blend = blended.blend;
	const weight = blended.weight;

	state.calendar.temperature = generateTemperature(
		season,
		chosen,
		state.calendar.timeOfDay,
		blend,
		weight
	);
}

function formatWeatherDescription(type) {
	switch (type) {
		case 'clear': return 'A bright and sunny day.';
		case 'cloudy': return 'Overcast skies with muted light.';
		case 'rain': return 'Persistent rain patters down.';
		case 'storm': return 'A thunderstorm looms.';
		case 'snow': return 'Snowfall covers the land.';
		case 'blizzard': return 'A fierce blizzard howls.';
		default: return 'Unusual weather grips the region.';
	}
}

function generateTemperature(season, weather, timeOfDay, blendSeason = null, blendWeight = 1) {
	const ranges = {
		Winter:   { clear: [20, 35], cloudy: [15, 30], snow: [5, 20], blizzard: [-10, 10] },
		Spring:   { clear: [50, 70], cloudy: [45, 65], rain: [40, 60], storm: [50, 70] },
		Summer:   { clear: [75, 95], cloudy: [70, 90], rain: [65, 85], storm: [70, 90] },
		Fall:     { clear: [50, 70], cloudy: [45, 65], rain: [40, 60], storm: [50, 70] },
		'Deep Winter': { clear: [10, 30], cloudy: [5, 25], snow: [-5, 15], blizzard: [-20, 5] },
	};

	const getAvg = ([low, high]) => (low + high) / 2;

	let baseRange = ranges[season]?.[weather] || [50, 70];
	let baseAvg = getAvg(baseRange);

	if (blendSeason && blendSeason !== season) {
		const blendRange = ranges[blendSeason]?.[weather] || [50, 70];
		const blendAvg = getAvg(blendRange);
		baseAvg = Math.round(baseAvg * blendWeight + blendAvg * (1 - blendWeight));
	}

	// Add a little randomness within ±3°F
	let final = baseAvg + randomInteger(7) - 4;

	// Adjust by time of day
	if (timeOfDay === 'Day') final -= 5;
	else if (timeOfDay === 'Night') final -= 10;

	return final;
}

function toggleWeather() {
	state.calendar.wtype = !state.calendar.wtype;
}

function toggleMoon() {
	state.calendar.mtype = !state.calendar.mtype;
}

function alarmMenu(num) {
	const alarm = state.alarms[num];
	const list = [];
	const len = state.alarms.length;

	if (!num || !alarm) {
		if (!len || len === 0) {
			sendChat(
				'Faerûn Calendar',
				`/w gm <div ${calendar.style.divMenu}>` + //--
					`<div ${calendar.style.header}>Alarm Menu</div>` + //--
					`<div ${calendar.style.arrow}></div>` + //--
					`<div ${calendar.style.divButton}>No Alarms set</div>` + //--
					`<br><br>` + //--
					`<div ${calendar.style.divButton}><a ${calendar.style.buttonLarge}" href="!alarm --new --title --?{Title?|Insert Title} --date --?{Date?|DD.MM.YYYY} --time --?{Time?|HH:MM} --message --?{Message?|Insert Message}">Create Alarm</a></div>` + //--
					`<div ${calendar.style.divButton}><a ${calendar.style.buttonLarge}" href="!cal">Open Calendar</a></div>` + //--
					`</div>`
			);
		} else {
			for (let i = 0; i < len; i++) {
				list.push(i);
			}

			let alarmList = list.toString();

			for (let i = 0; i < len; i++) {
				alarmList = alarmList.replace(',', '|');
			}

			sendChat(
				'Faerûn Calendar',
				`/w gm <div ${calendar.style.divMenu}>` + //--
					`<div ${calendar.style.header}>Alarm Menu</div>` + //--
					`<div ${calendar.style.arrow}></div>` + //--
					`<table>` + //--
					`<tr><td>Alarm: </td><td ${calendar.style.tdReg}><a ${calendar.style.buttonMedium}" href="!alarm --?{Alarm?|${alarmList}}>Not selected</a></td></tr>` + //--
					`</table>` + //--
					`<br><br>` + //--
					`<div ${calendar.style.divButton}><a ${calendar.style.buttonLarge}" href="!alarm --new --title --?{Title?|Insert Title} --date --?{Date?|DD.MM.YYYY} --time --?{Time?|HH:MM} --message --?{Message?|Insert Message}">Create Alarm</a></div>` + //--
					`<div ${calendar.style.divButton}><a ${calendar.style.buttonLarge}" href="!cal">Open Calendar</a></div>` + //--
					`</div>`
			);
		}
	} else {
		for (let i = 0; i < len; i++) {
			list.push(i);
		}

		let alarmList = list.toString();

		for (let i = 0; i < len; i++) {
			alarmList = alarmList.replace(',', '|');
		}

		const title = alarm.title;
		const date = `${alarm.day}.${alarm.month}.${alarm.year}`;
		const time = `${alarm.hour}:${alarm.minute}`;
		const splitDate = date.split('.');
		const splitTime = time.split(':');

		sendChat(
			'Faerûn Calendar',
			`/w gm <div ${calendar.style.divMenu}>` + //--
				`<div ${calendar.style.header}>Alarm Menu</div>` + //--
				`<div ${calendar.style.arrow}></div>` + //--
				`<table>` + //--
				`<tr><td ${calendar.style.tdReg}>Alarm: </td><td ${calendar.style.tdReg}><a ${calendar.style.buttonMedium}" href="!alarm --?{Alarm?|${alarmList}}">${num}</a></td></tr>` + //--
				`<tr><td ${calendar.style.tdReg}>Title: </td><td ${calendar.style.tdReg}><a ${calendar.style.buttonMedium}" href="!alarm --${num} --settitle --?{Title?|${title}}">${title}</a></td></tr>` + //--
				`<tr><td ${calendar.style.tdReg}>Date: </td><td ${calendar.style.tdReg}><a ${calendar.style.buttonMedium}" href="!alarm --${num} --setdate --?{Day?|${splitDate[0]}}.?{Month?|${splitDate[1]}}.?{Year?|${splitDate[2]}}">${date}</a></td></tr>` + //--
				`<tr><td ${calendar.style.tdReg}>Time: </td><td ${calendar.style.tdReg}><a ${calendar.style.buttonMedium}" href="!alarm --${num} --settime --?{Hour?|${splitTime[0]}}:?{Minute?|${splitTime[1]}}">${time}</a></td></tr>` + //--
				`<tr><td ${calendar.style.tdReg}>Message: </td><td ${calendar.style.tdReg}>${alarm.message}</td></tr>` + //--
				`</table>` + //--
				`<br><br>` + //--
				`<div ${calendar.style.divButton}><a ${calendar.style.buttonLarge}" href="!alarm --${num} --setmessage --?{Message?|${alarm.message}}">Set Message</a></div>` + //--
				`<div ${calendar.style.divButton}><a ${calendar.style.buttonLarge}" href="!alarm --new --title --?{Title?|Insert Title} --date --?{Date?|DD.MM.YYYY} --time --?{Time?|HH:MM} --message --?{Message?|Insert Message}">Create Alarm</a></div>` + //--
				`<div ${calendar.style.divButton}><a ${calendar.style.buttonLarge}" href="!cal">Open Calendar</a></div>` + //--
				`</div>`
		);
	}
}

function createAlarm(title, date, time, message) {
	const splitDate = date.split('.');
	const splitTime = time.split(':');

	state.alarms.push({
		title: title,
		day: splitDate[0],
		month: splitDate[1],
		year: splitDate[2],
		hour: splitTime[0],
		minute: splitTime[1],
		message: message,
	});

	sendChat(
		'Faerûn Calendar',
		`/w gm Alarm #${state.alarms.length - 1} created!\n` + //--
			`Title: ${title}\n` + //--
			`Date: ${date}\n` + //--
			`Time: ${time}\n` + //--
			`Message: ${message}`
	);

	alarmMenu(state.alarms.length - 1);
}

function setTitle(num, title) {
	state.alarms[num].title = title;

	sendChat('Faerûn Calendar', `/w gm Alarm #${num} title set to \"${title}\"`);
	alarmMenu(num);
}

function setDate(num, date) {
	const splitDate = date.split('.');

	state.alarms[num].day = splitDate[0];
	state.alarms[num].month = splitDate[1];
	state.alarms[num].year = splitDate[2];

	sendChat('Faerûn Calendar', `/w gm Alarm #${num} date set to ${date}`);
	alarmMenu(num);
}

function setTime(num, time) {
	const splitTime = time.split(':');

	state.alarms[num].hour = splitTime[0];
	state.alarms[num].minute = splitTime[1];

	sendChat('Faerûn Calendar', `/w gm Alarm #${num} time set to ${time}`);
	alarmMenu(num);
}

function setMessage(num, message) {
	state.alarms[num].message = message;

	sendChat('Faerûn Calendar', `/w gm Alarm #${num} message set to \"${message}\"`);
	alarmMenu(num);
}

function deleteAlarm(num) {
	state.alarms.splice(num, 1);

	sendChat('Faerûn Calendar', `/w gm Alarm #${num} deleted`);
	alarmMenu();
}

function updateAlarm(num) {
	const alarm = state.alarms[num];

	if (!alarm) sendChat('Faerûn Calendar', `/w gm This Alarm does not exist!`);
	else {
		const title = alarm.title;
		const date = `${alarm.day}.${alarm.month}.${alarm.year}`;
		const time = `${alarm.hour}:${alarm.minute}`;
		const message = alarm.message;

		let hand = findObjs({ _type: 'handout', name: 'Alarms' }, { caseInsensitive: true })[0];

		if (!hand) {
			hand = createObj('handout', {
				name: `Alarm #${num}`,
			});
		}

		hand.set(
			'notes',
			`Title: ${title}\n` + //--
				`Date: ${date}\n` + //--
				`Time: ${time}\n` + //--
				`Message: ${message}`
		);
	}
}

function chkAlarms() {
	for (let i = 0; i < state.alarms.length; i++) {
		const alarm = state.alarms[i];

		if (alarm.hour) {
			if (
				alarm.year === state.calendar.year &&
				alarm.month === state.calendar.month &&
				alarm.day >= state.calendar.day &&
				!(alarm.day >= state.calendar.day + 7) &&
				alarm.hour >= state.calendar.hour &&
				!(alarm.hour >= state.calendar.hour + 12) &&
				alarm.minute >= state.calendar.minute &&
				!(alarm.minute >= state.calendar.minute + 30)
			) {
				sendChat(
					'Faerûn Calendar',
					`/w gm Alarm #${i} triggered!\n` + //--
						`Title: ${alarm.title}\n` + //--
						`Date: ${alarm.day}.${alarm.month}.${alarm.year}\n` + //--
						`Time: ${alarm.hour}:${alarm.minute}\n` + //--
						`Message: ${alarm.message}`
				);

				deleteAlarm(i);
			}
		} else {
			if (
				alarm.year === state.calendar.year &&
				alarm.month === state.calendar.month &&
				alarm.day >= state.calendar.day &&
				!(alarm.day >= state.calendar.day + 7)
			) {
				sendChat(
					'Faerûn Calendar',
					`/w gm Alarm #${i} triggered!\n` + //--
						`Title: ${alarm.title}\n` + //--
						`Date: ${alarm.day}.${alarm.month}.${alarm.year}\n` + //--
						`Message: ${alarm.message}`
				);

				deleteAlarm(i);
			}
		}
	}
}

on('ready', () => {
	calendar.checkInstall();
	calendar.registerEventHandlers();
});