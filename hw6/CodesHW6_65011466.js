var monthOfYear = 1;
        function start() {
            show_monthOf2023(monthOfYear, 365);
            var prevBtn = document.getElementById("previous-month");
            prevBtn.addEventListener("click",previousMth,false);
            var nextBtn = document.getElementById("next-month");
            nextBtn.addEventListener("click",nextMth,false);
            
            
        }
        function previousMth(){
            if(monthOfYear>1){
                monthOfYear--;
            }
            show_monthOf2023(monthOfYear, 365);
        }
        function nextMth(){
            if(monthOfYear<12){
                monthOfYear++;
            }
            show_monthOf2023(monthOfYear, 365);
        }

        function show_monthOf2023(monthOfYear, totalDaysOfYear) {
            var currentDate = new Date(2023, monthOfYear - 1, 1); // Adjust month to be 0-based
            var table = document.getElementById("dispaly_days");
    
            document.getElementById("month").textContent = monthOfYear + "/2023";
        
            table.innerHTML = "";

            var startingDay = currentDate.getDay(); 
        
            var daysInMonth = new Date(2023, monthOfYear, 0).getDate();
    
            var dayCounter = 1;
        
            for (var week = 0; dayCounter <= daysInMonth; week++) {
                var row = document.createElement("tr");
        
                for (var dayOfWeek = 0; dayOfWeek < 7; dayOfWeek++) {
                    var cell = document.createElement("td");
        
                    if (week === 0 && dayOfWeek < startingDay) {
                        // Fill in the days from the previous month
                        var lastMonthDay = new Date(2023, monthOfYear - 1, 0).getDate();
                        //cell.textContent = lastMonthDay - (startingDay - dayOfWeek - 1);
                        cell.classList.add("previous-month");
                    } else if (dayCounter > daysInMonth) {
                        // Fill in the days from the next month
                        //cell.textContent = dayCounter - daysInMonth;
                        cell.classList.add("next-month");
                    } else {
                        // Fill in the days of the current month
                        cell.textContent = dayCounter;
                        dayCounter++;
                    }
                   
                    if (dayOfWeek === 6) { 
                        cell.classList.add("saturday");
                    } else if (dayOfWeek === 0) { 
                        cell.classList.add("sunday");
                    }
        
                    row.appendChild(cell);
                }
                table.appendChild(row);
            }
        }
        
        window.addEventListener("load", start, false);