import { Router } from "express";
import {
  getAllConversations,
  createConversation,
  getMessages,
  createMessage,
} from "../data/conversation.js";
import { checkAuthenticated } from "../middleware.js";
import * as helper from "../helpers.js";

const router = Router();

router
  .route("/")
  .get(checkAuthenticated, async (req, res) => {
    const user = req.session.user;

    helper.checkId(user._id);

    const conversations = await getAllConversations(user._id);

    if (!conversations || conversations.length === 0) {
      return res.render("conversation", {
        conversations: conversations,
        partial: "conv_script",
        isIndividual: false,
      });
    }

    return res.redirect(`/conversations/${conversations[0]._id}`);
  })
  .post(checkAuthenticated, async (req, res) => {
    const body = req.body;
    const user = req.session.user;

    let conversations;
    try {
      if (!body || Object.keys(body).length === 0) {
        throw new Error("No body provided");
      }

      let { username: otherUsername } = body;

      helper.parameterExists(otherUsername, "otherUsername");

      helper.checkUsername(otherUsername);

      otherUsername = otherUsername.toLowerCase();

      helper.checkId(user._id);

      await createConversation(user._id, otherUsername);

      conversations = await getAllConversations(user._id);

      res.redirect("/conversations");
    } catch (error) {
      console.log(error);
      res.status(400).render("conversation", {
        error: error,
        conversations,
        partial: "conv_script",
      });
    }
  });

router
  .route("/:id")
  .get(checkAuthenticated, async (req, res) => {
    const { id } = req.params;
    const user = req.session.user;

    const isConversation = helper.checkId(id);

    if (!isConversation) {
      return res.redirect("/conversations");
    }

    helper.checkId(user._id);

    const conversations = await getAllConversations(user._id);

    if (!conversations || conversations.length === 0) {
      return res.redirect("/conversations");
    }

    const messages = await getMessages(id, user._id);

    return res.render("conversation", {
      conversations: conversations,
      currConvId: id,
      messages: messages,
      isIndividual: true,
      partial: "conv_script",
    });
  })
  .post(checkAuthenticated, async (req, res) => {
    const { id: conversationId } = req.params;
    const body = req.body;

    try {
      if (!body || Object.keys(body).length === 0) {
        throw new Error("No body provided");
      }

      const { message } = body;

      helper.parameterExists(conversationId, "conversationId");
      helper.parameterExists(message, "message");
      helper.checkId(conversationId);

      const user = req.session.user;

      const newMessage = await createMessage(conversationId, user._id, message);

      res.redirect(`/conversations/${conversationId}`);
    } catch (error) {
      console.log(error);
      res.status(400).render("conversation", {
        error: error,
        partial: "conv_script",
      });
    }
  });

export default router;
