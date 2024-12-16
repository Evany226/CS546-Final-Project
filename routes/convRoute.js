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

router.route("/").get(checkAuthenticated, async (req, res) => {
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
});

router.post("/", checkAuthenticated, async (req, res) => {
  const body = req.body;
  const user = req.session.user;

  const conversations = await getAllConversations(user._id);

  try {
    if (!body || Object.keys(body).length === 0) {
      throw new Error("No body provided");
    }

    let { username: otherUsername } = body;

    helper.parameterExists(otherUsername, "otherUsername");

    otherUsername = helper.checkUsername(otherUsername);

    otherUsername = otherUsername.toLowerCase();

    helper.checkId(user._id);

    const newConv = await createConversation(user._id, otherUsername);

    console.log(newConv);

    return res.status(200).json(newConv);
  } catch (error) {
    console.log(error);
    return res.status(400).json({ error: error.message });
  }
});

router
  .route("/:id")
  .get(checkAuthenticated, async (req, res) => {
    let { id } = req.params;
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

    const currConv = conversations.find((conversation) => {
      return conversation._id === id;
    });

    const otherUsername = currConv.otherUsername;

    return res.render("conversation", {
      title: "Messages",
      conversations: conversations,
      currConvId: id,
      messages: messages,
      isIndividual: true,
      partial: "conv_script",
      otherUsername: otherUsername,
    });
  })
  .post(checkAuthenticated, async (req, res) => {
    let { id: conversationId } = req.params;
    const body = req.body;

    try {
      if (!body || Object.keys(body).length === 0) {
        throw new Error("No body provided");
      }

      let { message } = body;

      helper.parameterExists(conversationId, "conversationId");
      helper.parameterExists(message, "message");
      message = helper.checkString(message, "message");
      conversationId = helper.checkId(conversationId);

      const user = req.session.user;

      const newMessage = await createMessage(conversationId, user._id, message);

      res.redirect(`/conversations/${conversationId}`);
    } catch (error) {
      console.log(error);
      res.redirect(`/conversations/${conversationId}`);
    }
  });

export default router;
