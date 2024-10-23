//Hoofd idee:
//  maak een klok/timer
//  check als onze task geactiveerd kan worden.
//  zo ja, check als het signaal is getriggerd (infrarood sensor)
//  en check als het niet nacht is. (lightsensor)
//  als alles kan, doe alle leds aan.


//houd de tijd bij in een variabele
let hourCounter = 0;
let minCounter = 0;
let secCounter = 0;

//checkt als de eerste uur of dag voorbij is
let firstHourPast = false;
let firstDayPast = false;

//De current time
let appHoursSet = 10;
let appMinutesSet = 19;


//checkt als de current tijd zich in de task blok zit.
let betweenTime = false

//checkt als de infrorood sensor is afgegaan
let signalRead = true; //VOOR TESTING NORMAAL MOET IE OP FALSE

// slaat de status van de task op
let tasksStatus: boolean[] = [];

//checkt als  de lightlevel conditities goed zijn
let lightlevel = 0;
let isDark = false;

let resetTime = 0;
let lightSensorActivated = true;

let taskRepeat = [true, true, true, true, true, true, true, true, true, true];

let selectorModeOn = false
let selectorPhase = 0
let taskSelector = 0
let partOfDaySelectorStart = 0
let partOfDaySelectorEnd = 0
let startTimeSelectorHour = 0
let endTimeSelectorHour = 0
let startTimeSelector15Minutes = 0
let endTimeSelector15Minutes = 0
let taskColorsArray: number[] = [Colors.Blue, Colors.Green, Colors.Indigo, Colors.Orange, Colors.Pink, Colors.Purple, Colors.Red, Colors.Violet, Colors.White, Colors.Yellow]
let activeTasksArray = [false, false, false, false, false, false, false, false, false, false]
let taskRepeat24hReset = [false, false, false, false, false, false, false, false, false, false]
//array om het begin en eind uur van een taak op te slaan.
let taskHourStartArray: number[] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
let taskHourEndArray: number[] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
let task15MinutesStartArray: number[] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
let task15MinutesEndArray: number[] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

function calculationTime() {
    taskHourStartArray[taskSelector] = (partOfDaySelectorStart * 6) + startTimeSelectorHour;
    taskHourEndArray[taskSelector] = (partOfDaySelectorEnd * 6) + endTimeSelectorHour;
    task15MinutesStartArray[taskSelector] = startTimeSelector15Minutes * 15;
    task15MinutesEndArray[taskSelector] = endTimeSelector15Minutes * 15;
}
function resetSelection(colour: number) {
    if (selectorModeOn) {
        for (let i = 0; i < 4; i++) {
            light.setAll(colour);
            pause(100);
        }
    }
    light.clear()
    for (let i = 0; i < 2; i++) {
        light.setPixelColor(0, Colors.Black);
        pause(100)
        light.setPixelColor(0, Colors.Blue);
        pause(100);
    }
    selectorPhase = 1;
    taskSelector = 0;
    selectorModeOn = true;

}


//start met het selecteren van een task
input.buttonA.onEvent(ButtonEvent.LongClick, function () {
    resetSelection(Colors.White);
})
//ab click om de lightsensor aan of uit te zetten
input.buttonsAB.onEvent(ButtonEvent.Click, function () {
    if (lightSensorActivated) {

        lightSensorActivated = false;
        for (let i = 0; i < 3; i++) {
            light.showRing("red red black red red red red black red red");
            pause(100);
            light.clear();
            pause(100);
        }
    } else {
        lightSensorActivated = true;
        for (let i = 0; i < 3; i++) {
            light.showRing("black green green green black black green green green black");
            pause(100);
            light.clear();
            pause(100);
        }
    }

})

//ab longclick om alle waardes weg te halen
input.buttonsAB.onEvent(ButtonEvent.LongClick, function () {

    //reset alle opgeseslagen tasks
    activeTasksArray = [false, false, false, false, false, false, false, false, false, false];
    taskHourStartArray = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    taskHourEndArray = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

    resetSelection(Colors.Red);

})

//longclick
input.buttonB.onEvent(ButtonEvent.LongClick, function () {
    if (selectorPhase === 1 && activeTasksArray[taskSelector]) {
        activeTasksArray[taskSelector] = false
        light.setPixelColor(taskSelector, Colors.Black)
    }
})


function selectorPhaseChange(pos: number, color: number, amountRepeat: number) {
    selectorPhase = pos + 1;
    light.clear()

    for (let i = 0; i < amountRepeat + 1; i++) {
        light.setPixelColor(i, Colors.Blue);
    }
    for (let i = 0; i < 2; i++) {
        light.setPixelColor(0, Colors.Black);
        pause(100)
        light.setPixelColor(0, color);
        pause(100);
    }

}

input.buttonB.onEvent(ButtonEvent.Click, function () {



    if (selectorModeOn) {
        //zet de task vast met begin en eindtijd
        if (selectorPhase === 8) {
            music.playTone(Note.B, 1000);
            activeTasksArray[taskSelector] = true
            light.clear();
            selectorModeOn = false;

        }



        if (selectorPhase === 7) {
            selectorPhase++;
            calculationTime();
            // activeTasksArray[taskSelector] = true;
            light.clear()
            taskRepeat[taskSelector] = true
            light.showRing("black black black black black green green green green green");

            // selectorModeOn = false

        }
        // zet de uren van de eindtijd vast en zet de 15 minutes klaar
        if (selectorPhase === 6) {
            selectorPhaseChange(6, Colors.Green, 3);
            endTimeSelector15Minutes = 0
        }
        //zet het dag deel van de eindtijd vast en zet de startpositie van de eindtijd uren klaar
        if (selectorPhase === 5) {
            selectorPhaseChange(5, Colors.Orange, 5);
            endTimeSelectorHour = 0
        }
        //zet de 15 minutes van de startijd vast en zet het dagdeel van de eindtijd klaar
        if (selectorPhase === 4) {
            selectorPhaseChange(4, Colors.Red, 3);
            partOfDaySelectorEnd = 0
        }
        // zet de uren van het dagdeel vast en zet het selecteren van de 15 minutes klaar
        if (selectorPhase === 3) {
            selectorPhaseChange(3, Colors.Green, 3);
            startTimeSelector15Minutes = 0
        }
        //zet het dagdeel van de starttijd vast en zet de uren van de starttijd klaar
        if (selectorPhase === 2) {
            selectorPhaseChange(2, Colors.Orange, 5);
            startTimeSelectorHour = 0;
        }
        //zet het selecteren van het dagdeel voor de starttijd klaar
        if (selectorPhase === 1) {
            selectorPhaseChange(1, Colors.Red, 3);
            partOfDaySelectorStart = 0;
        }
    }
})




function blinkColours(pos: number, colour: number) {
    light.setPixelColor(pos, Colors.Black);
    pause(100)
    light.setPixelColor(pos, colour);
    pause(100);
}

function blinkAnimation() {
    for (let i = 0; i < 2; i++) {
        if (selectorPhase === 1) {
            blinkColours(taskSelector, taskColorsArray[taskSelector]);
        }
        if (selectorPhase === 2) {
            blinkColours(partOfDaySelectorStart, Colors.Red);
        }
        if (selectorPhase === 3) {
            blinkColours(startTimeSelectorHour, Colors.Orange);
        }
        if (selectorPhase === 4) {
            blinkColours(startTimeSelector15Minutes, Colors.Green);
        }
        if (selectorPhase === 5) {
            blinkColours(partOfDaySelectorEnd, Colors.Red);
        }
        if (selectorPhase === 6) {
            blinkColours(endTimeSelectorHour, Colors.Orange);
        }
        if (selectorPhase === 7) {
            blinkColours(endTimeSelector15Minutes, Colors.Green);

        }
    }

}

input.buttonA.onEvent(ButtonEvent.Click, function () {

    resetTime = control.timer1.seconds() + 30;//NIEUW

    //selecteer welke task je wilt aanmaken
    if (selectorModeOn) {
        if (selectorPhase === 1) {
            light.setPixelColor(taskSelector, Colors.Black)
            taskSelector++
            if (taskSelector > 9) {
                taskSelector = 0
            }
            light.setPixelColor(taskSelector, taskColorsArray[taskSelector])
            blinkAnimation();
        }
        //selecteer het dagdeel van de starttijd
        if (selectorPhase === 2) {
            partOfDaySelectorStart++
            if (partOfDaySelectorStart > 3) {
                partOfDaySelectorStart = 0
                light.setPixelColor(1, Colors.Blue)
                light.setPixelColor(2, Colors.Blue)
                light.setPixelColor(3, Colors.Blue)
            }
            light.setPixelColor(partOfDaySelectorStart, Colors.Red)
            blinkAnimation();
        }
        //selecteer het uur van de starttijd
        if (selectorPhase === 3) {
            startTimeSelectorHour++
            if (startTimeSelectorHour > 5) {
                startTimeSelectorHour = 0
                light.setPixelColor(1, Colors.Blue)
                light.setPixelColor(2, Colors.Blue)
                light.setPixelColor(3, Colors.Blue)
                light.setPixelColor(4, Colors.Blue)
                light.setPixelColor(5, Colors.Blue)
            }
            light.setPixelColor(startTimeSelectorHour, Colors.Orange)
            blinkAnimation();
        }
        //selecteer starttijd per kwartier
        if (selectorPhase === 4) {
            startTimeSelector15Minutes++
            if (startTimeSelector15Minutes > 3) {
                startTimeSelector15Minutes = 0
                light.setPixelColor(1, Colors.Blue)
                light.setPixelColor(2, Colors.Blue)
                light.setPixelColor(3, Colors.Blue)
            }
            light.setPixelColor(startTimeSelector15Minutes, Colors.Green)
            blinkAnimation();
        }
        //selecteer het dagdeel van de eindtijd
        if (selectorPhase === 5) {
            partOfDaySelectorEnd++
            if (partOfDaySelectorEnd > 3) {
                partOfDaySelectorEnd = 0
                light.setPixelColor(1, Colors.Blue)
                light.setPixelColor(2, Colors.Blue)
                light.setPixelColor(3, Colors.Blue)
            }
            light.setPixelColor(partOfDaySelectorEnd, Colors.Red)
            blinkAnimation();
        }
        //selecteer het uur van de eindtijd
        if (selectorPhase === 6) {
            endTimeSelectorHour++
            if (endTimeSelectorHour > 5) {
                endTimeSelectorHour = 0
                light.setPixelColor(1, Colors.Blue)
                light.setPixelColor(2, Colors.Blue)
                light.setPixelColor(3, Colors.Blue)
                light.setPixelColor(4, Colors.Blue)
                light.setPixelColor(5, Colors.Blue)
            }
            light.setPixelColor(endTimeSelectorHour, Colors.Orange)
            blinkAnimation();
        }
        //eindtijd per kwartier instellen
        if (selectorPhase === 7) {
            endTimeSelector15Minutes++
            if (endTimeSelector15Minutes > 3) {
                endTimeSelector15Minutes = 0
                light.setPixelColor(1, Colors.Blue)
                light.setPixelColor(2, Colors.Blue)
                light.setPixelColor(3, Colors.Blue)
            }
            light.setPixelColor(endTimeSelector15Minutes, Colors.Green)
            blinkAnimation();
        }

        if (selectorPhase === 8) {
            light.clear();
            if (taskRepeat[taskSelector]) {
                taskRepeat[taskSelector] = false;
                light.showRing("red red red red red black black black black black");
            } else {
                taskRepeat[taskSelector] = true;
                light.showRing("black black black black black green green green green green");
            }
        }
    }
})


function tookTooLong() {
    if (selectorPhase >= 2) {
        if (control.timer1.seconds() >= resetTime) {
            resetSelection(Colors.White);
            selectorPhase = 0;
            light.clear();
        }
    }
}











//===============================







function signalTriggerd() {
    if (!crickit.signal2.digitalRead()) {
        signalRead = true;
    }
}




//De functie die alles kwa tijd bijhoudt.
function currentTime() {

    //telt seconden op
    pause(1000);
    if (secCounter > 60) {
        minCounter++;
        secCounter = 1;
    } else {

        secCounter++;
    }

    // berekening eerste uur na zetten van starttijd
    if ((minCounter + appMinutesSet) > 60 && firstHourPast === false) {
        minCounter = 1;
        appMinutesSet = 1;
        hourCounter++;
        firstHourPast = true;

    } // berekening rest van de uren
    else if (minCounter > 60 && firstHourPast === true) {
        minCounter = 1;
        hourCounter++;
    }

    //EVENTUEEL MODULES 24 GEBRUIKEN VOOR UREN

    // berekening eerste dag na zetten van starttijd
    if ((hourCounter + appHoursSet) > 24 && firstDayPast === false) {
        hourCounter = 0;
        appHoursSet = 0;
        firstDayPast = true;
    }

    // berekening rest van de dagen
    if ((hourCounter > 24 && firstDayPast === true)) {
        hourCounter = 0;
    }




}


function checkTask() {
    //check als de IR-sensoor is afgegaan
    if (signalRead) {



        //de main for loop om te checken als er een task is.
        for (let i = 0; i < taskHourStartArray.length; i++) {
            //als je het apparaat aan zet wordt het eerste deel voor de || gebruikt om te kijken of de task binnen het eerste uur valt. 
            if ((taskHourStartArray[i] === hourCounter + appHoursSet && firstHourPast === false && activeTasksArray[i]) || ((firstHourPast === true) && taskHourStartArray[i] === hourCounter) && activeTasksArray[i]) {
                if (task15MinutesStartArray[i] <= minCounter + appMinutesSet) {
                    // vertel het programma dat je in de goede time slot zit.
                    betweenTime = true;

                    if (lightSensorActivated) {
                        //checkt als het niet donker is
                        if (!isDark) {
                            activateAlarm(i);
                            for (let j = 0; j < taskRepeat.length; j++) {
                                if (!taskRepeat[j]) {
                                    tasksStatus[j] = true;
                                } else {
                                    taskRepeat24hReset[j] = true
                                }

                            }
                        }
                    } else {
                        activateAlarm(i);
                        for (let j = 0; j < taskRepeat.length; j++) {
                            if (!taskRepeat[j]) {
                                tasksStatus[j] = true;
                            } else {
                                taskRepeat24hReset[j] = true
                            }

                        }
                    }
                }
            }
            else if ((taskHourStartArray[i] <= hourCounter) && (hourCounter <= taskHourEndArray[i]) && activeTasksArray[i]) {

                if (lightSensorActivated) {
                    if (!isDark) {
                        betweenTime = true;
                        activateAlarm(i);


                        for (let j = 0; j < taskRepeat.length; j++) {
                            if (!taskRepeat[j]) {
                                tasksStatus[j] = true;
                            } else {
                                taskRepeat24hReset[j] = true
                            }

                        }
                    }
                } else {
                    betweenTime = true;
                    activateAlarm(i);
                    for (let j = 0; j < taskRepeat.length; j++) {
                        if (!taskRepeat[j]) {
                            tasksStatus[j] = true;
                        } else {
                            taskRepeat24hReset[j] = true
                        }

                    }
                }
            }
            else {
                betweenTime = false;
            }

        }
    }
}

//functie om het alarm te activeren
function activateAlarm(pos: number) {
    console.log(tasksStatus[pos]);
    if (betweenTime && !tasksStatus[pos]) {
        console.log("value")
        light.setAll(Colors.Green);
        pause(1000);
        music.playTone(Note.E, 1000);
        light.clear();
        betweenTime = false;
        signalRead = false;

    }
}



//START VAN PROGRAMMA
for (let i = 0; i < taskHourStartArray.length; i++) {
    tasksStatus.push(false);
}

music.setVolume(1000);


forever(function () {
    signalTriggerd();
    currentTime();
    checkTask();
    signalRead = false;

    tookTooLong();

    console.log(minCounter)
    // console.log(`seconden: ${secCounter}`);
    if (selectorModeOn && selectorPhase === 1) {
        for (let i = 0; i < taskColorsArray.length; i++) {
            if (activeTasksArray[i]) {
                light.setPixelColor(i, taskColorsArray[i])
            }
        }
    }
    lightlevel = input.lightLevel();
    if (lightlevel < 30) {
        isDark = true;
    } else {
        isDark = false;
    }

})
