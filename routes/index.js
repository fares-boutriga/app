import express from "express";
const router = express.Router();
import controller from "../controllers/projectController.js";
import dotenv from "dotenv";
import axios from "axios";
import {sendMessage ,sendImageMessage} from "../utils/messages.js";
dotenv.config();
const { WEBHOOK_VERIFY_TOKEN, GRAPH_API_TOKEN, PORT ,FROM_PHONE_NUMBER_ID} = process.env;

// Projet routes
router.post("/projets", controller.createProjet);
router.get("/projets", controller.getAllProjets);
router.get("/projets/:id", controller.getProjetById);
router.put("/projets/:id", controller.updateProjet);
router.delete("/projets/:id", controller.deleteProjet);

// Responsable routes
router.post("/responsables", controller.createResponsable);
router.get("/responsables", controller.getAllResponsables);
router.get("/responsables/:id", controller.getResponsableById);
router.put("/responsables/:id", controller.updateResponsable);
router.delete("/responsables/:id", controller.deleteResponsable);
router.post('/fares', async ()=>{

    try {
       await sendImageMessage('21654258313', '976070004643027')

    } catch (err) {
      console.error("Error fetching project and responsables:", err.message);
      res.status(500).json({ error: err.message });
    }
}
  )

router.post('/test', async (req, res) => {
    const { phoneNumber } = req.query;
    try {
      const { project, responsables } = await controller.findResponsableByPhone(phoneNumber);
      res.status(200).json({ project, responsables });
    } catch (err) {
      console.error("Error fetching project and responsables:", err.message);
      res.status(500).json({ error: err.message });
    }
  }
  );
router.post('/send-message', async (req, res) => {
    try {
      const { to, message } = req.body;
      const url = `https://graph.facebook.com/v22.0/${FROM_PHONE_NUMBER_ID}/messages`;
      const headers = {
        Authorization: `Bearer ${WEBHOOK_VERIFY_TOKEN}`,
        'Content-Type': 'application/json',
      };
      const data = {
        messaging_product: 'whatsapp',
        recipient_type: 'individual',
        to,
        type: 'text',
        text: {
          preview_url: false,
          body: message,
        },
      };
  
      const response = await axios.post(url, data, { headers });
      res.json(response.data);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to send message' });
    }
  });;

export default router;
