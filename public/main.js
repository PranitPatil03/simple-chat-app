const socket = io('https://simple-chat-app-psi-six.vercel.app/');

let nameInput = document.getElementById("name-input");
let clientTotal = document.getElementById("client-total");
let messageForm = document.getElementById("message-form");
let messageInput = document.getElementById("message-input");
let messageContainer = document.getElementById("message-container");

const MessageNotification=new Audio('/Message-notification.mp3')

const scrollToBottom = () => {
    messageContainer.scrollTo(0, messageContainer.scrollHeight);
};

messageInput.addEventListener("focus", (e) => {
    socket.emit("feedback", {
        feedback: `✍️${nameInput.value} is typing a message`,
    });
});
messageInput.addEventListener("keypress", (e) => {
    socket.emit("feedback", {
        feedback: `✍️${nameInput.value} is typing a message`,
    });
});
messageInput.addEventListener("blur", (e) => {
    socket.emit("feedback", {
        feedback: "",
    });
});

const sendMessage = () => {
    if (messageInput.value === "") {
        return;
    }
    const messageData = {
        userName: nameInput.value,
        message: messageInput.value,
        date: new Date(),
    };
    socket.emit("send-message", messageData);
    sendMessageToUI(true, messageData);
    messageInput.value = "";
};

const sendMessageToUI = (isOwnMessage, messageData) => {
    clearFeedback()
    const messageElement = `<li class="${isOwnMessage ? "message-right" : "message-left"
        }">
          <p class="message">
            ${messageData.message}
            <span>${messageData.userName} ⚫ ${moment(
            messageData.date
        ).fromNow()} </span>
          </p>
        </li>`;

    messageContainer.innerHTML += messageElement;
    scrollToBottom();
};

const clearFeedback = () => {
    document.querySelectorAll('li.message-feedback').forEach(element => {
        element.parentElement.removeChild(element)
    })
}

messageForm.addEventListener("submit", (e) => {
    e.preventDefault();
    sendMessage();
});
socket.on("clients-total", (data) => {
    clientTotal.innerText = `Total Clients : ${data}`;
});

socket.on("chat-message", (messageData) => {
    MessageNotification.play()
    sendMessageToUI(false, messageData);
});

socket.on("feedback", (data) => {
    clearFeedback()
    const element = `<li class="message-feedback">
          <p class="feedback">${data.feedback}</p>
        </li>`;

    messageContainer.innerHTML += element;
});
