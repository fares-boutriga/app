/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import express from "express";
import axios from "axios";
import dotenv from "dotenv";
import router from "./routes/index.js";
import controller from "./controllers/projectController.js";
import { sendAudioMessage, sendDocumentMessage, sendImageMessage, sendMessage, sendReactionMessage } from "./utils/messages.js";
import { myData } from "./mydata.js";
dotenv.config();
const app = express();
app.use(express.json());

const { WEBHOOK_VERIFY_TOKEN, GRAPH_API_TOKEN, PORT, ENVIRONMENT } =
  process.env;

app.post("/webhook", async (req, res) => {
  // log incoming messages
  console.log("Incoming webhook message:", JSON.stringify(req.body, null, 2));

  // check if the webhook request contains a message
  // details on WhatsApp text message payload: https://developers.facebook.com/docs/whatsapp/cloud-api/webhooks/payload-examples#text-messages
  const message = req.body.entry?.[0]?.changes[0]?.value?.messages?.[0];
  // let to= message.from + message.text.body
  // check if the incoming message contains text
      // extract the business number to send the reply from it
      const { project, responsables } = await controller.findResponsableByPhone(
        message.from
      );
  if (message?.type === "text") {

    if (ENVIRONMENT === "dev") {
      myData.responsables.map(async (data) => {
        await sendMessage(data.tele, message.text.body);
      });
    } else {
      await responsables?.map(async (responsable) => {
        await sendMessage(responsable.tele, message.text.body);
      });
    }
  }
  if (message?.type === "image") {
    await responsables?.map(async (responsable) => {
      await sendImageMessage(responsable.tele, message.image.id);
    });
  }
  if (message?.type === "audio") {
    await responsables?.map(async (responsable) => {
      await sendAudioMessage(responsable.tele, message.audio.id);
    });
  }
  if (message?.type === "reaction") {
    await responsables?.map(async (responsable) => {
      await sendReactionMessage(responsable.tele, message.id, message.reaction.emoji);
    });
  }
  if (message?.type === "document") {
    await responsables?.map(async (responsable) => {
      await sendDocumentMessage(responsable.tele, message.document.id, message.document.filename);
    });
  }

  res.sendStatus(200);
});

// accepts GET requests at the /webhook endpoint. You need this URL to setup webhook initially.
// info on verification request payload: https://developers.facebook.com/docs/graph-api/webhooks/getting-started#verification-requests
app.get("/webhook", (req, res) => {
  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];

  // check the mode and token sent are correct
  if (mode === "subscribe" && token === WEBHOOK_VERIFY_TOKEN) {
    // respond with 200 OK and challenge token from the request
    res.status(200).send(challenge);
    console.log("Webhook verified successfully!");
  } else {
    // respond with '403 Forbidden' if verify tokens do not match
    res.sendStatus(403);
  }
});

app.get("/", (req, res) => {
  res.send(`<pre>Nothing to see here fares.
Checkout README.md to start.</pre>`);
});

app.use("/api", router); // handle all other routes with the projectRoutes

app.listen(PORT, () => {
  console.log(`Server is listening on port: ${PORT}`);
});
