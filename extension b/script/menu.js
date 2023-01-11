console.log('Content Script loaded');

let body = document.querySelector('#wrapper');
if (!body) {
    body = document.querySelector('.PrintDisp');
}

const wrapperElement = document.createElement('div');
wrapperElement.id = 'sfc-streamlined-wrapper';

const contentElement = document.createElement('div');
contentElement.id = 'sfc-streamlined-content';

const menuElement = document.createElement('div');
menuElement.id = 'sfc-streamlined-menu';

const titleElement = document.createElement('h2');
titleElement.textContent = 'SFC Streamlined'
menuElement.append(titleElement);

if (downloadCalendarFn) {
    const calendarButton = document.createElement('button');
    calendarButton.textContent = '🗓 Download Calendar';
    calendarButton.onclick = downloadCalendarFn;
    menuElement.append(calendarButton);
}

if (generateGradeReportFn) {
    const gradeButton = document.createElement('button');
    gradeButton.textContent = '💯 Credits';
    gradeButton.onclick = generateGradeReportFn;
    menuElement.append(gradeButton);
}


wrapperElement.prepend(menuElement);
wrapperElement.append(contentElement);
body.prepend(wrapperElement);
