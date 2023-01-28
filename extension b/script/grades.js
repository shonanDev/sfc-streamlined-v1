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

function countCredits(subjects) {
    return subjects
        .map(subject => subject.credits)
        .reduce((a, b) => a + b, 0);
}

function filterCourses(subjects, filter) {
    return subjects
        .filter(filter);
}

function countCreditsByFields(subjects, fields) {
    return filterCourses(subjects, subject => fields.some(field => subject.field.includes(field)));
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
            if (countCredits(introductoryCredits) < 1) {
                return buildValidationResult(`❌ You need to take your respective introductory course (PM / EI)`, introductoryCredits);
            }
            return buildValidationResult('✅ You have absolved all introductory courses', introductoryCredits);
        },
        subjects => {
            const wellnessCredits = countCreditsByFields(subjects, ['01-05-01']);
            if (countCredits(wellnessCredits) < 2) {
                return buildValidationResult(`❌ You need to take PE1 and Physical and Mental Health courses`, wellnessCredits);
            }
            return buildValidationResult('✅ You have taken PE1 and Wellness class', wellnessCredits);
        },
    ],
    '2 Advancing to the Third Year': [
        subjects => {
            const ds1 = countCreditsByFields(subjects, ['01-03-01']);
            const ds2 = countCreditsByFields(subjects, ['01-03-02']);
            const ds = ds1.concat(ds2);
            if (countCredits(ds1) < 2 || countCredits(ds2) < 2) {
                return buildValidationResult(`❌ You need to take Data Science 1 + 2 courses`, ds);
            }
            return buildValidationResult('✅ You have taken Data Science 1 + 2', ds);
        },
        subjects => {
            const fit = countCreditsByFields(subjects, ['01-04-01']);
            if (countCredits(fit) < 4) {
                return buildValidationResult(`❌ You need to take have at least 4 credits for FIT courses`, fit);
            }
            return buildValidationResult('✅ You have taken FIT courses', fit);
        },
        subjects => {
            const languageCredits = countCreditsByFields(subjects, languages);
            if (countCredits(languageCredits) < 8) {
                return buildValidationResult(`❌ You need to have at least 8 credits from language subjects`, languageCredits);
            }
            return buildValidationResult('✅ You have taken language courses', languageCredits);
        },
    ],
    '3 Advancing to the Fourth Year': [
        subjects => {
            const fundamentalCredits = countCreditsByFields(subjects, ['FUNDAMENTAL SUBJECTS']);
            if (countCredits(fundamentalCredits) < 30) {
                return buildValidationResult(`❌ Not enough credits of fundamental subjects, ${countCredits(fundamentalCredits)} / 30`, fundamentalCredits);
            }
            return buildValidationResult('✅ You have at least 30 credits in fundamental subjects', fundamentalCredits);
        },
        subjects => {
            const peCredits = countCreditsByFields(subjects, ['01-05-02']);
            if (countCredits(peCredits) < 2) {
                return buildValidationResult(`❌ You need to finish both PE2 and PE3`, peCredits);
            }
            return buildValidationResult('✅ You have finished both PE2 and PE3', peCredits);
        },
        subjects => {
            const seminarCredits = countCreditsByFields(subjects, ['03-01-01']);
            if (countCredits(seminarCredits) < 2) {
                return buildValidationResult(`❌ You need take at least one seminar`, seminarCredits);
            }
            return buildValidationResult('✅ You have taken at least one seminar', seminarCredits);
        },
    ],
    '4 Graduation': [
        subjects => {
            const totalCredits = filterCourses(subjects, () => true);
            if (countCredits(totalCredits) < 124) {
                return buildValidationResult(`❌ Not enough credits, ${countCredits(totalCredits)} / 124 in total`, totalCredits);
            }
            return buildValidationResult('✅ Congrats, you have at least 124 credits', totalCredits);
        },
        subjects => {
            const gpCredits = countCreditsByFields(subjects, ['03-01-02']);
            if (countCredits(gpCredits) < 4) {
                return buildValidationResult(`❌ You need to complete GP1 and GP2`, gpCredits);
            }
            return buildValidationResult('✅ If you see this message, you have graduated already', gpCredits);
        },
        subjects => {
            const advancedCredits = countCreditsByFields(subjects, ['02-01-01', '02-02-01']);
            if (countCredits(advancedCredits) < 30) {
                return buildValidationResult(`❌ You need to have at least 30 credits from advanced subjects`, advancedCredits);
            }
            return buildValidationResult('✅ You have at least 30 credits from advanced subjects', advancedCredits);
        }
    ]
};

function buildValidationResult(message, courses) {
    return {message, courses};
}

function getWarningHtml(subjects) {
    const warnings = getWarnings(subjects);
    let html = 'This extension is made by students, please confirm by yourself to make sure!<br>';
    Object.keys(warnings).sort().forEach(level => {
        html += `<h3>${level}</h3>`;
        html += `<ul>`;
        warnings[level].forEach(message => {
            html += `<li>
${message.message}
<br>
<small>
${message.courses.map(course => `${course.name} <strong style="background-color: yellow;">(${course.credits})</strong>`).join(', ')}
</small>
</li>`;
        })
        html += `</ul>`;
    });

    html += '<hr>'

    return html;
}
