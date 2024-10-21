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
let appHoursSet = 0;
let appMinutesSet = 30;



//array om het begin en eind uur van een taak op te slaan.
let taskMinuteStart: number[] = [32];
let taskMinuteEnd: number[] = [45];

//checkt als de current tijd zich in de task blok zit.
let betweenTime = false

//checkt als de infrorood sensor is afgegaan
let signalRead = true;

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

// per kwartier tijd instellen
//task oneindig maken of een paar keer laten repeaten. 1 kleur led voor oneindig en een andere kleur met steeds donkerdere tinten voor hoeveel repeaten.
//task verwijderen toevoegen met longclick b, zet de leds aan van de tasks die active zijn. die kan je vervolgens selecteren.
// longclick a+b om alles te verwijderen
// a+b om selectie proces te laten starten

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
    light.setPixelColor(0, Colors.Blue);
    selectorPhase = 1;
    taskSelector = 0;
    selectorModeOn = true;

}




//start met het selecteren van een task
input.buttonA.onEvent(ButtonEvent.LongClick, function () {
    resetSelection(Colors.White)
})
//ab click om de selectie opnieuwe te doen, zonder de oude waardes weg te halen.
input.buttonsAB.onEvent(ButtonEvent.Click, function () {
    resetSelection(Colors.White);
})

//ab longclick om alle waardes weg te halen
input.buttonsAB.onEvent(ButtonEvent.LongClick, function () {

    //reset alle opgeseslagen tasks
    activeTasksArray = [false, false, false, false, false, false, false, false, false, false];
    taskHourStartArray = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    taskHourEndArray = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

    resetSelection(Colors.Red);

})
input.buttonB.onEvent(ButtonEvent.Click, function () {



    if (selectorModeOn) {
        //zet de task vast met begin en eindtijd
        if (selectorPhase === 7) {
            calculationTime();
            activeTasksArray[taskSelector] = true
            light.clear()
            selectorModeOn = false
            music.playTone(Note.A, 1000);
            console.log(taskHourStartArray)
            console.log(task15MinutesStartArray)
            console.log(taskHourEndArray)
            console.log(task15MinutesEndArray)


        }
        // zet de uren van de eindtijd vast en zet de 15 minutes klaar
        if (selectorPhase === 6) {
            selectorPhase = 7
            light.clear()
            light.setPixelColor(0, Colors.Green)
            light.setPixelColor(1, Colors.Blue)
            light.setPixelColor(2, Colors.Blue)
            light.setPixelColor(3, Colors.Blue)
            endTimeSelector15Minutes = 0
        }
        //zet het dag deel van de eindtijd vast en zet de startpositie van de eindtijd uren klaar
        if (selectorPhase === 5) {
            selectorPhase = 6
            light.clear()
            light.setPixelColor(0, Colors.Orange)
            light.setPixelColor(1, Colors.Blue)
            light.setPixelColor(2, Colors.Blue)
            light.setPixelColor(3, Colors.Blue)
            light.setPixelColor(4, Colors.Blue)
            light.setPixelColor(5, Colors.Blue)
            endTimeSelectorHour = 0
        }
        //zet de 15 minutes van de startijd vast en zet het dagdeel van de eindtijd klaar
        if (selectorPhase === 4) {
            selectorPhase = 5
            light.clear()
            light.setPixelColor(0, Colors.Red)
            light.setPixelColor(1, Colors.Blue)
            light.setPixelColor(2, Colors.Blue)
            light.setPixelColor(3, Colors.Blue)
            partOfDaySelectorEnd = 0
        }
        // zet de uren van het dagdeel vast en zet het selecteren van de 15 minutes klaar
        if (selectorPhase === 3) {
            selectorPhase = 4
            light.clear()
            light.setPixelColor(0, Colors.Green)
            light.setPixelColor(1, Colors.Blue)
            light.setPixelColor(2, Colors.Blue)
            light.setPixelColor(3, Colors.Blue)
            startTimeSelector15Minutes = 0
        }
        //zet het dagdeel van de starttijd vast en zet de uren van de starttijd klaar
        if (selectorPhase === 2) {
            selectorPhase = 3
            light.clear()
            light.setPixelColor(0, Colors.Orange)
            light.setPixelColor(1, Colors.Blue)
            light.setPixelColor(2, Colors.Blue)
            light.setPixelColor(3, Colors.Blue)
            light.setPixelColor(4, Colors.Blue)
            light.setPixelColor(5, Colors.Blue)
            startTimeSelectorHour = 0
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
    if (selectorModeOn) {
        if (selectorPhase === 1) {
            light.setPixelColor(taskSelector, Colors.Black)
            taskSelector++
            if (taskSelector > 9) {
                taskSelector = 0
            }
            light.setPixelColor(taskSelector, taskColorsArray[taskSelector])
        }
        //selecteer het dagdeel van de starttijd
        if (selectorPhase === 2) {
            light.setPixelColor(partOfDaySelectorStart, Colors.Blue)
            partOfDaySelectorStart++
            if (partOfDaySelectorStart > 3) {
                partOfDaySelectorStart = 0
            }
            light.setPixelColor(partOfDaySelectorStart, Colors.Red)
        }
        //selecteer het uur van de starttijd
        if (selectorPhase === 3) {
            light.setPixelColor(startTimeSelectorHour, Colors.Blue)
            startTimeSelectorHour++
            if (startTimeSelectorHour > 5) {
                startTimeSelectorHour = 0
            }
            light.setPixelColor(startTimeSelectorHour, Colors.Orange)
        }
        //selecteer starttijd per kwartier
        if (selectorPhase === 4) {
            light.setPixelColor(startTimeSelector15Minutes, Colors.Blue)
            startTimeSelector15Minutes++
            if (startTimeSelector15Minutes > 3) {
                startTimeSelector15Minutes = 0
            }
            light.setPixelColor(startTimeSelector15Minutes, Colors.Green)
        }
        //selecteer het dagdeel van de eindtijd
        if (selectorPhase === 5) {
            light.setPixelColor(partOfDaySelectorEnd, Colors.Blue)
            partOfDaySelectorEnd++
            if (partOfDaySelectorEnd > 3) {
                partOfDaySelectorEnd = 0
            }
            light.setPixelColor(partOfDaySelectorEnd, Colors.Red)
        }
        //selecteer het uur van de eindtijd
        if (selectorPhase === 6) {
            light.setPixelColor(endTimeSelectorHour, Colors.Blue)
            endTimeSelectorHour++
            if (endTimeSelectorHour > 5) {
                endTimeSelectorHour = 0
            }
            light.setPixelColor(endTimeSelectorHour, Colors.Orange)
        }
        //eindtijd per kwartier instellen
        if (selectorPhase === 7) {
            light.setPixelColor(endTimeSelector15Minutes, Colors.Blue)
            endTimeSelector15Minutes++
            if (endTimeSelector15Minutes > 3) {
                endTimeSelector15Minutes = 0
            }
            light.setPixelColor(endTimeSelector15Minutes, Colors.Green)
        }
    }
})














//===============================







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

                    //checkt als het niet donker is
                    if (!isDark) {
                        activateAlarm(i);
                        tasksStatus[i] = true;
                    }
                }
            }
            else if ((taskHourStartArray[i] <= hourCounter) && (hourCounter <= taskHourEndArray[i]) && activeTasksArray[i]) {

                if (!isDark) {
                    betweenTime = true;
                    activateAlarm(i); //new
                    tasksStatus[i] = true;
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
