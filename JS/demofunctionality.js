//Ik maak een variabele aan voor het ID van het HTML element wat veranderd moet worden.
//Ik maak ook een bolean aan voor de status van het notificatie-element.
let changeNotificationClass = document.getElementById("notification");
let notificationEnabled = false;

//Wanneer de "+" knop word ingedrukt, dan veranderd de klasse van de notificatie van on naar off en andersom, zodat hij word gedisplayed.
//De functie hieronder kijkt naar het HTML element met de ID "add", en triggered wanneer die wordt aangeklikt.
document.getElementById("add").onclick = () => {
    //Hij kijkt of de bolean voor het aan en uitzetten van de notificatie op false staat, en wanneer hij wel op false staat als het HTML element word aangeklikt. dan wordt hij op true gezet.
    //Ook als hij op true zou staan dan veranderd hij hem weer terug naar false.
    if (notificationEnabled === false) {
        notificationEnabled = true;
    } else {
        notificationEnabled = false;
    }
    //Als de bolean voor het aanzetten van de notificatie op false staat, veranderd hij de klasse van de notificatie van on naar off. Deze heeft controle over de Display van dit element en zet het hele element dus uit.
    if (notificationEnabled === false) {
        changeNotificationClass.classList.replace("notification-on", "notification-off")
    }
    //Dit doet het tegenovergestelde van de functie hierboven en zet dus de klasse van de notificatie op on, waardoor het element zichtbaar word.
    if (notificationEnabled === true) {
        changeNotificationClass.classList.replace("notification-off", "notification-on")
    }
}