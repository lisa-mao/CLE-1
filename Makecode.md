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
let appHoursSet = 5;
let appMinutesSet = 31;
 
 
 
//array om het begin en eind uur van een taak op te slaan.
let taskMinuteStart: number[] = [32];
let taskMinuteEnd: number[] = [45];
 
//checkt als de current tijd zich in de task blok zit.
let betweenTime = false
 
//checkt als de infrorood sensor is afgegaan
let signalRead = false
 
// slaat de status van de task op
let tasksStatus: boolean[] = [];
 
 
//checkt als  de lightlevel conditities goed zijn
let lightlevel = 0;
let isDark = false;
 
//long press A om task selector aan te zetten
// Je kan 10 tasks gebruiken. Allemaal een aparte kleur
// nadat je een task selecteerd hebt speelt een geluid af op het apparaat
// je moet nu een starttijd en eindtijd selecteren
// je selecteerd eerst het dag deel [ochtend, middag, avond, nacht] voor de startijd, 4 ledjes gaan aan als je er 1 selecteerd krijgt hij een andere kleur.
// long press A om te selecteren er speelt een geluid af
// blokken van 6 uur per dag deel, 6 ledjes gaan aan, als je er 1 selecteerd krijgt die een andere kleur.
// longpress A om te selecteren
// ander geluid als de starttijd geselecteerd is.
// kies nu weer een dagdeel voor de eindtijd
// vervolgens een tijd
// als dit gelukt is speel een geluidje af
 
//task verwijderen toevoegen
 
let selectorModeOn = false
let selectorPhase = 0
let taskSelector = 0
let partOfDaySelectorStart = 0
let partOfDaySelectorEnd = 0
let startTimeSelector = 0
let endTimeSelector = 0
let taskColorsArray: number[] = [Colors.Blue, Colors.Green, Colors.Indigo, Colors.Orange, Colors.Pink, Colors.Purple, Colors.Red, Colors.Violet, Colors.White, Colors.Yellow]
let activeTasksArray = [false, false, false, false, false, false, false, false, false, false]
 
//array om het begin en eind uur van een taak op te slaan.
let taskHourStartArray: number[] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
let taskHourEndArray: number[] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
 
function calculationTime() {
    taskHourStartArray[taskSelector] = (partOfDaySelectorStart * 6) + startTimeSelector;
    taskHourEndArray[taskSelector] = (partOfDaySelectorEnd * 6) + endTimeSelector;
}
 
 
 
 
//start met het selecteren van een task
input.buttonA.onEvent(ButtonEvent.LongClick, function () {
    selectorModeOn = true
    light.setPixelColor(0, Colors.Blue)
    selectorPhase = 1
})
input.buttonB.onEvent(ButtonEvent.Click, function () {
 
    console.log(taskHourStartArray);
    console.log(taskHourEndArray);
 
    if (selectorModeOn) {
        //zet de task vast met begin en eindtijd
        if (selectorPhase === 5) {
            calculationTime();
            activeTasksArray[taskSelector] = true
            light.clear()
            selectorModeOn = false
            music.playTone(Note.C, BeatFraction.Half)
        }
        //zet het dag deel van de eindtijd vast en zet de startpositie van de eindtijd uren klaar
        if (selectorPhase === 4) {
            selectorPhase = 5
            light.clear()
            light.setPixelColor(0, Colors.Red)
            light.setPixelColor(1, Colors.Blue)
            light.setPixelColor(2, Colors.Blue)
            light.setPixelColor(3, Colors.Blue)
            light.setPixelColor(4, Colors.Blue)
            light.setPixelColor(5, Colors.Blue)
            endTimeSelector = 0
        }
        //zet de uren van de starttijd vast en zet het dagdeel van de eindtijd klaar
        if (selectorPhase === 3) {
            selectorPhase = 4
            light.clear()
            light.setPixelColor(0, Colors.Red)
            light.setPixelColor(1, Colors.Blue)
            light.setPixelColor(2, Colors.Blue)
            light.setPixelColor(3, Colors.Blue)
            partOfDaySelectorEnd = 0
        }
        //zet het dagdeel van de starttijd vast en zet de uren van de starttijd klaar
        if (selectorPhase === 2) {
            selectorPhase = 3
            light.clear()
            light.setPixelColor(0, Colors.Red)
            light.setPixelColor(1, Colors.Blue)
            light.setPixelColor(2, Colors.Blue)
            light.setPixelColor(3, Colors.Blue)
            light.setPixelColor(4, Colors.Blue)
            light.setPixelColor(5, Colors.Blue)
            startTimeSelector = 0
        }
        //zet het selecteren van het dagdeel voor de starttijd klaar
        if (selectorPhase === 1) {
            selectorPhase = 2
            light.clear()
            light.setPixelColor(0, Colors.Red)
            light.setPixelColor(1, Colors.Blue)
            light.setPixelColor(2, Colors.Blue)
            light.setPixelColor(3, Colors.Blue)
            partOfDaySelectorStart = 0
        }
    }
})
input.buttonA.onEvent(ButtonEvent.Click, function () {
    //selecteer welke task je wilt aanmaken
    if (selectorPhase === 1) {
        light.setPixelColor(taskSelector, Colors.Black)
        taskSelector--
        if (taskSelector < 0) {
            taskSelector = 9
        }
        light.setPixelColor(taskSelector, taskColorsArray[taskSelector])
    }
    //selecteer het dagdeel van de starttijd
    if (selectorPhase === 2) {
        light.setPixelColor(partOfDaySelectorStart, Colors.Blue)
        partOfDaySelectorStart--
        if (partOfDaySelectorStart < 0) {
            partOfDaySelectorStart = 3
        }
        light.setPixelColor(partOfDaySelectorStart, Colors.Red)
    }
    //selecteer het uur van de starttijd
    if (selectorPhase === 3) {
        light.setPixelColor(startTimeSelector, Colors.Blue)
        startTimeSelector--
        if (startTimeSelector < 0) {
            startTimeSelector = 5
        }
        light.setPixelColor(startTimeSelector, Colors.Red)
    }
    //selecteer het dagdeel van de eindtijd
    if (selectorPhase === 4) {
        light.setPixelColor(partOfDaySelectorEnd, Colors.Blue)
        partOfDaySelectorEnd--
        if (partOfDaySelectorEnd < 0) {
            partOfDaySelectorEnd = 3
        }
        light.setPixelColor(partOfDaySelectorEnd, Colors.Red)
    }
    //selecteer het uur van de eindtijd
    if (selectorPhase === 5) {
        light.setPixelColor(endTimeSelector, Colors.Blue)
        endTimeSelector--
        if (endTimeSelector < 0) {
            endTimeSelector = 5
        }
        light.setPixelColor(endTimeSelector, Colors.Red)
    }
})
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
//===============================
console.log(`minuten: ${minCounter + appMinutesSet} uren: ${hourCounter + appHoursSet}`);
 
 
 
 
 
 
function signalTriggerd() {
    if (!crickit.signal2.digitalRead()) {
        signalRead = true;
    }
}
 
//De functie die alles kwa tijd bijhoudt.
function currentTime() {
 
    //telt seconden op
    pause(125); //pause(1000);
    if (secCounter > 60) {
        minCounter++;
        secCounter = 1;
    } else {
        // console.log(secCounter);
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
 
    // console.log(`minuten: ${minCounter + appMinutesSet} uren: ${hourCounter + appHoursSet}`);
 
 
}
 
function checkTask() {
    //check als de IR-sensoor is afgegaan
    if (signalRead) {
 
 
 
        //de main for loop om te checken als er een task is.
        for (let i = 0; i < taskHourStartArray.length; i++) {
 
            if ((taskHourStartArray[i] === hourCounter + appHoursSet && firstHourPast === false) || ((firstHourPast === true) && taskHourStartArray[i] === hourCounter)) {
                if (taskMinuteStart[i] <= minCounter + appMinutesSet) {
                    // vertel het programma dat je in de goede time slot zit.
                    betweenTime = true;
 
                    //checkt als het niet donker is
                    if (!isDark) {
                        activateAlarm(i);
                        tasksStatus[i] = true;
                    }
                }
            }
            else if ((taskHourStartArray[i] <= hourCounter) && (hourCounter <= taskHourEndArray[i])) {
                betweenTime = true;
                tasksStatus[i] = true;
            }
            else {
                betweenTime = false;
            }
 
        }
    }
}
 
//functie om het alarm te activeren
function activateAlarm(pos: number) {
    if (betweenTime && !tasksStatus[pos]) {
        light.setAll(Colors.White);
        pause(1000);
        music.playTone(Note.E, 1000);
        light.clear();
        betweenTime = false;
        signalRead = false;
    }
}
 
 
 
//START VAN PROGRAMMA
// for (let i = 0; i < taskHourStartArray.length; i++) {
//     tasksStatus.push(false);
// }
 
music.setVolume(1000);
 
 
forever(function () {
    signalTriggerd();
    currentTime();
    checkTask();
    signalRead = false;
 
 
    lightlevel = input.lightLevel();
    if (lightlevel < 30) {
        isDark = true;
    } else {
        isDark = false;
    }
 
})
