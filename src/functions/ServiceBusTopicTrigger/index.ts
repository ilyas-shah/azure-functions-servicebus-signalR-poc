import { InvocationContext, app, output } from "@azure/functions";

const outputSignalR = output.generic({
  type: "signalR",
  connection: "AzureSignalRConnectionString",
  hubName: "serverless",
});

async function serviceBusHandler(
  message: unknown,
  context: InvocationContext
): Promise<void> {
  context.extraOutputs.set(outputSignalR, {
    target: "newMessage",
    arguments: [
      {
        message,
        timestamp: Date.now(),
      },
    ],
  });
}

app.serviceBusQueue("serviceBusTrigger", {
  connection: "AzureWebJobsServiceBus",
  extraOutputs: [outputSignalR],
  queueName: "testqueue",
  handler: serviceBusHandler,
});
