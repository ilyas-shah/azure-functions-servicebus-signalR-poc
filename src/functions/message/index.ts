import { readFile } from "fs/promises";
import { join } from "path";
import {
  app,
  HttpRequest,
  HttpResponseInit,
  InvocationContext,
  output,
} from "@azure/functions";

async function handleRequest(
  request: HttpRequest,
  context: InvocationContext
): Promise<HttpResponseInit> {
  if (request.method === "GET") {
    return renderHomePage(request, context);
  } else if (request.method === "POST") {
    context.log(request.body)
    const message = await request.text();
    return sendMessageToQueue(message, context);
  }
  return Promise.resolve({ body: "Request method not supported" });
}

async function getFile() {
  return await readFile(join(__dirname, "../../../content/index.html"));
}

async function renderHomePage(
  request: HttpRequest,
  context: InvocationContext
): Promise<HttpResponseInit> {
  try {
    return {
      headers: {
        "Content-Type": "text/html",
      },
      body: await getFile(),
    };
  } catch (err) {
    context.log(err);
    return {
      body: JSON.stringify(err),
    };
  }
}

const outputServiceBusQueue = output.serviceBusQueue({
  queueName: "testqueue",
  connection: "AzureWebJobsServiceBus",
});

async function sendMessageToQueue(
  message: unknown,
  context: InvocationContext
): Promise<HttpResponseInit> {
  context.log("request", message)
  context.extraOutputs.set(outputServiceBusQueue, message);
  return {
    body: "ok",
  };
}

app.http("message", {
  methods: ["GET", "POST"],
  handler: handleRequest,
  extraOutputs: [outputServiceBusQueue],
});
