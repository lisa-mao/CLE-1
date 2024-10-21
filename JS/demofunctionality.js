let changeNotificationClass = document.getElementById("notification");
let notificationEnabled = false;

//Wanneer de "+" knop word ingedrukt, dan veranderd de klasse van de notificatie van on naar off en andersom, zodat hij word gedisplayed.
document.getElementById("add").onclick = () => {
    if (notificationEnabled === false) {
        notificationEnabled = true;
    } else {
        notificationEnabled = false;
    }

    if (notificationEnabled === false) {
        changeNotificationClass.classList.replace("notification-on", "notification-off")
    }
    if (notificationEnabled === true) {
        changeNotificationClass.classList.replace("notification-off", "notification-on")
    }
}