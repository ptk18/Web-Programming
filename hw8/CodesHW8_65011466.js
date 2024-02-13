const fileInput = document.getElementById('fileInput');
        const contentBody = document.getElementById('content_body');
        let GPS1, GPS2;
        let GPA;

        fileInput.addEventListener('change', function () {
            const file = fileInput.files[0];
            const reader = new FileReader();

            reader.onload = function (event) {
                const jsonData = JSON.parse(event.target.result);
                GPS1 = calculateGPS(jsonData,'1st Semester').toPrecision(2);
                GPS2 = calculateGPS(jsonData,'2nd Semester').toPrecision(2);
                GPA = calculateGPA(jsonData).toPrecision(2);
                console.log('GPA ',GPA)
                populateForm(jsonData);
                

            };

            reader.readAsText(file);
        });

        function populateForm(data) {
            document.getElementById('student_name').value = data.student_name;
            document.getElementById('date_of_birth').value = data.date_of_birth;
            document.getElementById('student_id').value = data.student_id;
            document.getElementById('date_of_admission').value = data.date_of_admission;
            document.getElementById('date_of_graduation').value = data.date_of_graduation;
            document.getElementById('degree').value = data.degree;
            document.getElementById('major').value = data.major;
            

            // Populate course content table
            const courseData = data.credit['Year, 2022-2023']['1st Semester'];
            contentBody.innerHTML = '';
            const row1 = document.createElement('tr');
            row1.innerHTML = `
                <td style="text-align: center; font-weight: bold; text-decoration: underline;">${"1st Semster, Year,2022-2023"}</td>
                <td></td>
                <td></td>
            `;
            contentBody.appendChild(row1);

            courseData.forEach(course => {
                const row = document.createElement('tr');
                row.innerHTML = `                 
                    <td style="text-align: left;">${course.subject_id}${" "}${course.name}</td>
                    <td>${course.credit}</td>
                    <td>${course.grade}</td>
                `;
                contentBody.appendChild(row);
            });

            const row2 = document.createElement('tr');
            // The GPA of first Semster is same as the GPS1 of first semster. 
            row2.innerHTML = `
                <td style="text-align: center; font-style: italic;">${"GPS: "}${GPS1}${"   "}${"GPA: "}${GPS1}</td> 
                <td></td>
                <td></td>
            `;
            contentBody.appendChild(row2);

            const courseData2 = data.credit['Year, 2022-2023']['2nd Semester'];
            const row3 = document.createElement('tr');
            row3.innerHTML = `
                <td style="text-align: center; font-weight: bold; text-decoration: underline;">${"2nd Semster, Year,2022-2023"}</td>
                <td></td>
                <td></td>
            `;
            contentBody.appendChild(row3);

            courseData2.forEach(course => {
                const row = document.createElement('tr');
                row.innerHTML = `                 
                    <td style="text-align: left;">${course.subject_id}${" "}${course.name}</td>
                    <td>${course.credit}</td>
                    <td>${course.grade}</td>
                `;
                contentBody.appendChild(row);
            });

           
            const row4 = document.createElement('tr');
            row4.innerHTML = `
                <td style="text-align: center; font-style: italic;">${"GPS: "}${GPS2}${"   "}${"GPA: "}${GPA}</td>
                <td></td>
                <td></td>
            `;
            contentBody.appendChild(row4);
        }

        function calculateGPS(jsonData, semester){
            let total_points = 0.0;
            let total_credits = 0.0;
            // Iterate through the courses and retrieve the grades
            for (const course of jsonData.credit['Year, 2022-2023'][semester]) {
                //const courses = jsonData.credit['Year, 2022-2023'][semester];

                    switch(course.grade){
                        case 'A':
                            total_points+= (parseInt(course.credit)*4.0);
                            break;
                        case 'B+':
                            total_points+= (parseInt(course.credit)*3.5);
                            break;
                        case 'B':
                            total_points+= (parseInt(course.credit)*3.0);
                            break;
                        case 'C+':
                            total_points+= (parseInt(course.credit)*2.5);
                            break;
                        case 'C':
                            total_points+= (parseInt(course.credit)*2.0);
                            break;
                        case 'D+':
                            total_points+= (parseInt(course.credit)*1.5);
                            break;
                        case 'D':
                            total_points+= (parseInt(course.credit)*1.0);
                            break;
                        case 'F':
                            break;
                        default:
                            break;
                    }
                    console.log('credit:', course.credit);
                    total_credits += parseInt(course.credit);
                    
            }
            console.log('Total points:',total_points);
            console.log('Total credits:',total_credits);
            console.log('GPS:',total_points / total_credits);
            return total_points / total_credits;
        }
        function calculateGPA(jsonData){
            let CGPS = 0.0;
            let noOfSemster = 0;
            // Iterate through the courses and retrieve the grades
            for (const semester in jsonData.credit['Year, 2022-2023']) {
                CGPS += calculateGPS(jsonData,semester);
                noOfSemster++;
                CGPS = CGPS/noOfSemster;
        }
        return CGPS;
    }