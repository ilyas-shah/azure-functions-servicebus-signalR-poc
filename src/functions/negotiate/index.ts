import {
  HttpRequest,
  HttpResponseInit,
  InvocationContext,
  app,
  input,
} from "@azure/functions";

const inputSignalRConnectionInfo = input.generic({
  type: "signalRConnectionInfo",
  connection: "AzureSignalRConnectionString",
  hubName: "serverless",
});

async function handleRequest(
  request: HttpRequest,
  context: InvocationContext
): Promise<HttpResponseInit> {
  const response = context.extraInputs.get(inputSignalRConnectionInfo);

  return {
    jsonBody: response,
  };
}

app.http("negotiate", {
  authLevel: "anonymous",
  methods: ["POST"],
  route: "negotiate",
  handler: handleRequest,
  extraInputs: [inputSignalRConnectionInfo],
});
