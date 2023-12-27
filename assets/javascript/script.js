// Javascript program to run solar system simulation

// Converts seconds to days
function secsToDay(seconds) {
    return seconds / 86400 // 86400 seconds make one day
}

// Converts seconds to Hours
function secsToHour(seconds) {
    return seconds / 3600; // 3600 seconds make one hour
}

// Checks if a given year is a leap year or not
function isLeapYear(year) {
    if (year % 4 == 0) {
        return true;
    } else {
        return false;
    }
}

// Rotates a body
function rotate(parameter, accum_param, body, rotation=null) {
    var position = (360 / parameter) * accum_param;
    var body = document.getElementById(body);
    if (rotation === null) {
        body.style.transform = `rotate(${position}deg)`;
    } else{
        body.style.transform = `${rotation} rotate(${position}deg)`;
    }
    return position;
}

// Updates current time
function updateTime() {
    var date_obj = new Date();
    var date = date_obj.toDateString(); // converts date_obj to a date string
    var time = date_obj.toTimeString().slice(0, 8); // Slices time string to obtain only current time without timezone

    document.getElementById("date").innerHTML = date;
    document.getElementById("time").innerHTML = time;
}

// toggles between display and hide orbits 
function showOrbits() {
    var orbits = document.querySelectorAll(".orbit");
    orbits.forEach(orbit => {
        if (orbit.style.border === "") {
            orbit.style.border = "0.1px solid";
        } else {
            orbit.style.border = "";
        }
    })
}

// Main simulation program
function runSimulation() {
    // Converts the date string for first second of this year to epoch datetime
    var year_param; // Leap year or normal year
    let date = new Date();
    let this_year = date.getFullYear();

    // Definition of epoch checkpoint periods corresponding to initial state of all objects in program
    const CHECKPOINT_YEAR = Date.parse(`${this_year}-01-01T00:00:00`); // Converts datetime string to epoch time
    const CHECKPOINT_DATE = Date.parse(`${this_year}-${date.getMonth() + 1}-${date.getDate()}T00:00:00`);
    // const CHECKPOINT_MONTH = Date.parse(`2022-11-08T00:00:00`); // Last lunar eclipse
    const CHECKPOINT_MONTH = 1667905140000 // Last lunar eclipse in epoch time

    // Current Epoch time
    var current_time = Date.now(); 

    // Elapsed time from checkpoint year
    var accum_secs_frm_yr = (current_time - CHECKPOINT_YEAR) / 1000; 
    var accum_days = secsToDay(accum_secs_frm_yr); 

    // Elapsed time from last lunar eclipse (Novemeber 8, 2022; 5:59 AM EST)
    var accum_secs_frm_eclipse = (current_time - CHECKPOINT_MONTH) / 1000;
    var accum_days_frm_eclipse = secsToDay(accum_secs_frm_eclipse);
    var month_accum_days = accum_days_frm_eclipse % 27.3 // Accumulated days from last full moon 

    // Elapsed time from the beginning of today
    var accum_secs_frm_day = (current_time - CHECKPOINT_DATE) / 1000;
    var accum_hrs = secsToHour(accum_secs_frm_day);

    // Checks if current year is leap year
    if (this_year % 4 === 0) {
        year_param = 366;
    } else {
        year_param = 365;
    }

    // Rotation on objects based on their elapsed time from respective checkpoints
    rotate(year_param, accum_days, "main-orbit"); 

    var moon_rotation = `translateX(-50%)`;
    let moon_rot_deg = rotate(27.3, month_accum_days, "moon-orbit", moon_rotation);

    var earth_rotation = `rotate(${-moon_rot_deg}deg)`;
    rotate(24, accum_hrs, "earth", earth_rotation);

    document.getElementById("main-orbit").style.display = "flex";
}

// Gets initial position of the moon in degrees based on the position of the earth
// from the begining of the day of the last lunar eclipse to the time of maximum total eclipse
// function initialMoonPos() {
//     var start = 1667865600;
//     var end = 1667905140;
//     var diff = end - start;
//     var accum_dys = secsToDay(diff);
//     var dys_degrees = (360/27.3) * accum_dys;
//     return dys_degrees;
// }

// Toggles between animation and simulation modes
function animSim() {
    var anim_sim_btn = document.getElementById("anim-sim");
    if (anim_sim_btn.innerHTML === "Animation"){
        // Animation
        anim_sim_btn.innerHTML = "Simulation";
        clearInterval(simulation); // stops simulation

        // new KeyframeEffect()

        // Animates bodies in orbit
        document.getElementById("main-orbit").style.animation = "revolve 365s linear infinite";
        document.getElementById("sun").style.animation = "maintain 365s linear infinite";
        document.getElementById("moon-orbit").style.animation = "moon-revolve 27.3s linear infinite";
        let earth_rotation = 1 - (1 / 27.3);
        document.getElementById("earth").style.animation = `revolve ${earth_rotation}s linear infinite`;
    } else {
        // Simulation
        anim_sim_btn.innerHTML = "Animation";

        // Removes animations and starts simulation again
        document.getElementById("main-orbit").style.animation = "";
        document.getElementById("moon-orbit").style.animation = "";
        document.getElementById("moon-orbit").style.animation = "";
        document.getElementById("earth").style.animation = "";
        var simulation = setInterval(runSimulation(), 1000);  
    }
}

// Generates a random percentage number between 0 and 100%
function randomPercentage() {
    return Math.floor(Math.random() * 100);
}

// Updates time
updateTime();
setInterval(()=>{
    updateTime();
}, 1000);

// Run simulation
var simulation = setInterval(runSimulation, 1000);

// Clone several stars onto space
for (var i = 0; i < 50; i++) {
    var star = document.getElementById("star");
    var stars = document.getElementById("stars");
    // Returns a clone of the star element
    var cloned_star = star.cloneNode(true);
    cloned_star.style.top = `${randomPercentage()}%`;
    cloned_star.style.right = `${randomPercentage()}%`;
    document.body.append(cloned_star);
}

// Christmas Message
var date = new Date();

var year;
var current_year = date.getFullYear();
var current_year_epoch = Date.parse(`${current_year}-01-01T00:00:00`);
var current_time = Date.now();

var elapsed_time = (current_time - current_year_epoch) / 1000;
var elapsed_days = secsToDay(elapsed_time);

if (elapsed_days > 351) {
    year = current_year + 1;
} else if (elapsed_days < 7) {
    year = current_year;
}

document.getElementById("x-mas-msg").style.display = "block";
document.getElementById("x-mas-msg-text").innerHTML = `Merry Christmas and a Happy New Year - ${year}`;
