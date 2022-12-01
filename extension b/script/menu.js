console.log('Content Script loaded');

const body = document.querySelector('#wrapper');

const menuElement = document.createElement('div');
menuElement.className = 'sfc-streamlined-menu';

const titleElement = document.createElement('h2');
titleElement.textContent = 'SFC Streamlined'
menuElement.append(titleElement);

if (downloadCalendarFn) {
    const calendarButton = document.createElement('button');
    calendarButton.textContent = '🗓 Download Calendar';
    calendarButton.onclick = downloadCalendarFn;
    menuElement.append(calendarButton);
}


body.prepend(menuElement);
