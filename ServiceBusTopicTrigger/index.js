module.exports = async function (context, mySbMsg) {
  // Send a push message to SignalR
  context.bindings.signalRMessages = {
    target: "newMessage",
    arguments: [
      {
        message: mySbMsg,
        timestamp: Date.now(),
      },
    ],
  };
  context.done();
};
