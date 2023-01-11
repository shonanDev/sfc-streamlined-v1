const passingGrades = 'ＳＡＢＣＰ';
const languages = [
    '01-02-01',
    '01-02-02',
    '01-02-03',
    '01-02-04',
    '01-02-05',
    '01-02-06',
    '01-02-07',
    '01-02-08',
    '01-02-09',
    '01-02-10',
];

const generateGradeReportFn = () => {
    const subjects = [];
    let lastField = null;
    document.querySelectorAll('.main>tbody>tr').forEach((elem) => {
        if (elem.className === 'field') {
            lastField = elem.firstChild.textContent;
        } else if (elem.className === 'subject') {
            const subject = {
                field: lastField,
                name: elem.children[0].textContent,
                lecturer: elem.children[1].textContent,
                grade: elem.children[2].textContent,
                credits: parseFloat(elem.children[3].textContent),
            };
            if (passingGrades.includes(subject.grade)
                && !subject.field.includes('OPTIONAL SUBJECTS')) {
                subjects.push(subject);
            }
        }
    });
    console.log(subjects);
    document.querySelector('#sfc-streamlined-content').innerHTML = getWarningHtml(subjects);
};

function getFields(subjects) {
    const fields = {};
    subjects.forEach(subject => {
        const field = subject.field;
        if (!(field in fields)) {
            fields[field] = 0;
        }
        fields[field]++;
    });
    return fields;
}

function countCredits(subjects, filter) {
    return subjects
        .filter(filter)
        .map(subject => subject.credits)
        .reduce((a, b) => a + b, 0);
}

function countCreditsByFields(subjects, fields) {
    return countCredits(subjects, subject => fields.some(field => subject.field.includes(field)));
}

function getWarnings(subjects) {
    const warnings = {};
    for (let advancementLevel of Object.keys(requirements)) {
        warnings[advancementLevel] = requirements[advancementLevel]
            .map(requirement => requirement(subjects));
    }
    return warnings;
}

const requirements = {
    '1 Advancing to the Second Year': [
        subjects => {
            const introductoryCredits = countCreditsByFields(subjects, ['01-01-01']);
            if (introductoryCredits < 1) {
                return `❌ You need to take your respective introductory course (PM / EI)`;
            }
            return '✅ You have absolved all introductory courses';
        },
        subjects => {
            const wellnessCredits = countCreditsByFields(subjects, ['01-05-01']);
            if (wellnessCredits < 2) {
                return `❌ You need to take PE1 and Physical and Mental Health courses`;
            }
            return '✅ You have taken PE1 and Wellness class';
        },
    ],
    '2 Advancing to the Third Year': [
        subjects => {
            const ds1 = countCreditsByFields(subjects, ['01-03-01']);
            const ds2 = countCreditsByFields(subjects, ['01-03-02']);
            if (ds1 < 2 || ds2 < 2) {
                return `❌ You need to take Data Science 1 + 2 courses`;
            }
            return '✅ You have taken Data Science 1 + 2';
        },
        subjects => {
            const fit = countCreditsByFields(subjects, ['01-04-01']);
            if (fit < 4) {
                return `❌ You need to take have at least 4 credits for FIT courses`;
            }
            return '✅ You have taken FIT courses';
        },
        subjects => {
            const languageCredits = countCreditsByFields(subjects, languages);
            if (languageCredits < 8) {
                return `❌ You need to have at least 8 credits from language subjects`;
            }
            return '✅ You have taken language courses';
        },
    ],
    '3 Advancing to the Fourth Year': [
        subjects => {
            const fundamentalCredits = countCreditsByFields(subjects, ['FUNDAMENTAL SUBJECTS']);
            if (fundamentalCredits < 30) {
                return `❌ Not enough credits of fundamental subjects, ${fundamentalCredits} / 30`;
            }
            return '✅ You have at least 30 credits in fundamental subjects';
        },
        subjects => {
            const peCredits = countCreditsByFields(subjects, ['01-05-02']);
            if (peCredits < 2) {
                return `❌ You need to finish both PE2 and PE3`;
            }
            return '✅ You have finished both PE2 and PE3';
        },
        subjects => {
            const seminarCredits = countCreditsByFields(subjects, ['03-01-01']);
            if (seminarCredits < 2) {
                return `❌ You need take at least one seminar`;
            }
            return '✅ You have taken at least one seminar';
        },
    ],
    '4 Graduation': [
        subjects => {
            const totalCredits = countCredits(subjects, () => true);
            if (totalCredits < 124) {
                return `❌ Not enough credits, ${totalCredits} / 124 in total`;
            }
            return '✅ Congrats, you have at least 124 credits';
        },
        subjects => {
            const gpCredits = countCreditsByFields(subjects, ['03-01-02']);
            if (gpCredits < 4) {
                return `❌ You need to complete GP1 and GP2`;
            }
            return '✅ If you see this message, you have graduated already';
        },
        subjects => {
            const advancedCredits = countCreditsByFields(subjects, ['02-01-01', '02-02-01']);
            if (advancedCredits < 30) {
                return `❌ You need to have at least 30 credits from advanced subjects`;
            }
            return '✅ You have at least 30 credits from advanced subjects';
        }
    ]
};

function getWarningHtml(subjects) {
    const warnings = getWarnings(subjects);
    let html = 'This extension is made by students, please confirm by yourself to make sure!<br>';
    Object.keys(warnings).sort().forEach(level => {
        html += `<h3>${level}</h3>`;
        html += `<ul>`;
        warnings[level].forEach(message => {
            html += `<li>${message}</li>`;
        })
        html += `</ul>`;
    });

    html += '<hr>'

    return html;
}

generateGradeReportFn();
