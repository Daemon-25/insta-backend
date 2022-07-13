const { addMessage, getMessages } = require("../controllers/messageController");

module.exports = (app) => {
app.post("/addmsg", addMessage);

app.post("/getmsg", getMessages);
}
