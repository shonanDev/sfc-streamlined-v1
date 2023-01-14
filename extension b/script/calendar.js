const courseRegExp = new RegExp(/(.*)／(.*)／(.*)/);
const periodRegExp = new RegExp(/(.)曜日(.)時限/g);
const fullWidthNumbers = '０１２３４５６７８９';
const weekDays = '日月火水木金土';

const periods = [
    null,
    {
        hour: 9,
        minute: 25
    },
    {
        hour: 11,
        minute: 10
    },
    {
        hour: 13,
        minute: 0
    },
    {
        hour: 14,
        minute: 45
    },
    {
        hour: 16,
        minute: 30
    },
    {
        hour: 18,
        minute: 10
    },
    {
        hour: 19,
        minute: 50
    }
];

const holidayList = {
    2022: {
        0: [],
        1: [],
        2: [],
        3: [],
        4: [],
        5: [],
        6: [],
        7: [],
        8: [],
        9: [],
        10: [],
        11: []
    },
    2023: {
        0: [10],
        1: [],
        2: [],
        3: [],
        4: [],
        5: [],
        6: [],
        7: [],
        8: [],
        9: [],
        10: [],
        11: [21,22,23,24,25,26,27]
    },
    2024: {
        0: [10],
        1: [],
        2: [],
        3: [],
        4: [],
        5: [],
        6: [],
        7: [],
        8: [],
        9: [],
        10: [],
        11: []
    }
};

const startOfSemester = new Date('2022-10-01');
const endOfSemester = new Date('2023-01-25');

function getPeriods(str) {
    const periods = [];
    let m = [...str.matchAll(periodRegExp)];
    m.forEach(matches => {
        periods.push({
            day: weekDays.indexOf(matches[1]),
            period: fullWidthNumbers.indexOf(matches[2])
        });
    });
    return periods;
}

function getEventsThisSemester(courses) {
    const events = [];
    let day = startOfSemester;
    while (day <= endOfSemester) {
        if (!isHoliday(day)) {
            events.push(...getEventsToday(day, courses));
        }
        day.setDate(day.getDate() + 1);
    }
    return events;
}

function getEventsToday(date, courses) {
    const events = [];

    courses.forEach(course => {
        course.periods.forEach(period => {
            if (period.day === date.getDay()) {
                const periodTimes = periods[period.period];
                const startTime = new Date(date);
                startTime.setHours(periodTimes.hour);
                startTime.setMinutes(periodTimes.minute);

                // Timezone +9
                startTime.setHours(startTime.getHours() - 9);

                const endTime = new Date(startTime);
                endTime.setHours(endTime.getHours() + 1);
                endTime.setMinutes(endTime.getMinutes() + 30);
                events.push({
                    course,
                    start: startTime,
                    end: endTime,
                });
            }
        });
    });

    return events;
}

function pad0(num) {
    if (num < 10) {
        return `0${num}`;
    }
    return `${num}`;
}

function formatDate(date) {
    return `${date.getFullYear()}${pad0(date.getMonth() + 1)}${pad0(date.getDate())}T`
    + `${pad0(date.getHours())}${pad0(date.getMinutes())}${pad0(date.getSeconds())}Z`;
}

function generateICal(events) {
    let iCal = `
BEGIN:VCALENDAR
PRODID:-//xyz Corp//NONSGML PDA Calendar Version 1.0//EN
VERSION:2.0`
    events.forEach((event, index) => {
        iCal += `
BEGIN:VEVENT
DTSTAMP:${formatDate(new Date())}
UID:${event.course.title}${index}
ORGANIZER:mailto:jsmith@example.com
DTSTART:${formatDate(event.start)}
DTEND:${formatDate(event.end)}
STATUS:CONFIRMED
SUMMARY:${event.course.title}
END:VEVENT`;
    });
    iCal += `
END:VCALENDAR
    `;
    return iCal;
}

const downloadCalendarFn = () => {
    const courseTiles = document.querySelectorAll('.ic-DashboardCard__header_content');
    if (courseTiles.length === 0) {
        alert('Please go to the SOL Dashboard first');
        return;
    }
    const courses = [];
    courseTiles.forEach(elem => {
        const title = elem.querySelector('.ic-DashboardCard__header-title').textContent;

        const courseObj = {title};

        const info = elem.querySelector('.ic-DashboardCard__header-description').textContent;
        if (courseRegExp.test(info)) {
            const groups = courseRegExp.exec(info);
            courseObj.room = groups[1];
            courseObj.periods = getPeriods(groups[2]);
            courseObj.lecturer = groups[3];
        } else {
            courseObj.lecturer = info;
            courseObj.room = null;
            courseObj.periods = [];
        }
        courses.push(courseObj);
    });
    console.log(courses);
    const iCal = generateICal(getEventsThisSemester(courses));
    console.log(iCal);
    window.open( "data:text/calendar;charset=utf8," + iCal);
};

function isHoliday (date) {
  // 年月日を取得
  const y = date.getFullYear();
  const m = date.getMonth();
  const d = date.getDate();
  // 祝日リストに日付が含まれるかどうか調べ、結果を返す
  return holidayList[y][m].indexOf(d) !== -1;
}
