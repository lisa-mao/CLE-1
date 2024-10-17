let changeNotificationClass = document.getElementById("notification");
let notificationEnabled = false;

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