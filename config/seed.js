import { dbConnection, closeConnection } from "./mongoConnection.js";
import { signUpUser } from "../data/auth.js";
import { createCollection } from "../data/collections.js";
import { createFigureList } from "../data/figures.js";
import { createListing } from "../data/listings.js";
import { getUserByUsername } from "../data/users.js";
import { createTradeRequest } from "../data/tradeRequests.js";

export const seedDB = async () => {
  const db = await dbConnection();
  await db.dropDatabase();

  try {
    await signUpUser(
      "Testing1",
      "Password1@",
      "New York",
      "NY",
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
    );

    await signUpUser(
      "Testing2",
      "Password1@",
      "Los Angeles",
      "CA",
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
    );

    await signUpUser(
      "Testing3",
      "Password1@",
      "Chicago",
      "IL",
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
    );

    await signUpUser(
      "Testing4",
      "Password1@",
      "Houston",
      "TX",
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
    );
  } catch (e) {
    console.log(e);
  }

  const collection1 = await createCollection(
    "Smiski Series 1",
    "https://smiski.com/wp-content/uploads/2022/11/smiski.com_product_icon01.png"
  );

  const collection2 = await createCollection(
    "Smiski Series 2",
    "https://smiski.com/wp-content/uploads/2022/11/smiski.com_product_icon02.png"
  );

  const figureArr1 = [
    {
      figureName: "Hugging Knee",
      figureImageUrl: "https://smiski.com/wp-content/uploads/2016/03/s1_01.png",
      _id: {
        $oid: "674f6d9b92f33f3870646ad1",
      },
    },
    {
      figureName: "Sitting",
      figureImageUrl: "https://smiski.com/wp-content/uploads/2016/03/s1_02.png",
      _id: {
        $oid: "674f6d9b92f33f3870646ad2",
      },
    },
    {
      figureName: "Looking Back",
      figureImageUrl: "https://smiski.com/wp-content/uploads/2016/03/s1_03.png",
      _id: {
        $oid: "674f6d9b92f33f3870646ad3",
      },
    },
    {
      figureName: "Lounging",
      figureImageUrl: "https://smiski.com/wp-content/uploads/2016/03/s1_04.png",
      _id: {
        $oid: "674f6d9b92f33f3870646ad4",
      },
    },
    {
      figureName: "Hiding",
      figureImageUrl: "https://smiski.com/wp-content/uploads/2016/03/s1_05.png",
      _id: {
        $oid: "674f6d9b92f33f3870646ad5",
      },
    },
    {
      figureName: "Peeking",
      figureImageUrl: "https://smiski.com/wp-content/uploads/2016/03/s1_06.png",
      _id: {
        $oid: "674f6d9b92f33f3870646ad6",
      },
    },
  ];

  const insertedFigures1 = await createFigureList(collection1._id, figureArr1);

  const figureArr2 = [
    {
      figureName: "Kneeling",
      figureImageUrl: "https://smiski.com/wp-content/uploads/2016/03/s2_01.png",
      _id: {
        $oid: "674f6d9b92f33f3870646ad1",
      },
    },
    {
      figureName: "Climbing",
      figureImageUrl: "https://smiski.com/wp-content/uploads/2016/03/s2_02.png",
      _id: {
        $oid: "674f6d9b92f33f3870646ad2",
      },
    },
    {
      figureName: "Daydreaming",
      figureImageUrl: "https://smiski.com/wp-content/uploads/2016/03/s2_03.png",
      _id: {
        $oid: "674f6d9b92f33f3870646ad3",
      },
    },
    {
      figureName: "Pushing",
      figureImageUrl: "https://smiski.com/wp-content/uploads/2016/03/s2_04.png",
      _id: {
        $oid: "674f6d9b92f33f3870646ad4",
      },
    },
    {
      figureName: "Peeking",
      figureImageUrl: "https://smiski.com/wp-content/uploads/2016/03/s2_05.png",
      _id: {
        $oid: "674f6d9b92f33f3870646ad5",
      },
    },
    {
      figureName: "Listening",
      figureImageUrl: "https://smiski.com/wp-content/uploads/2016/03/s2_06.png",
      _id: {
        $oid: "674f6d9b92f33f3870646ad6",
      },
    },
  ];

  const insertedFigures2 = await createFigureList(collection2._id, figureArr2);

  try {
    const user1 = await getUserByUsername("testing1");
    const user2 = await getUserByUsername("testing2");

    const listing1 = await createListing(
      "Trading new Smiski Series 1 figures",
      user1._id,
      collection1._id.toString(),
      insertedFigures1.figures[0]._id.toString(),
      [
        insertedFigures2.figures[0]._id.toString(),
        insertedFigures2.figures[0]._id.toString(),
      ],
      "Looking to trade for any figure from Series 2",
      "New",
      [],
      [],
      "Open"
    );

    const listing2 = await createListing(
      "Smiski series 2 for trade",
      user2._id,
      collection2._id.toString(),
      insertedFigures2.figures[0]._id.toString(),
      [
        insertedFigures1.figures[0]._id.toString(),
        insertedFigures1.figures[0]._id.toString(),
      ],
      "Looking to trade for any figure from Series 1",
      "New",
      [],
      [],
      "Open"
    );

    const tradeRequest1 = await createTradeRequest(
      listing1._id.toString(),
      insertedFigures1.figures[0]._id.toString(),
      insertedFigures2.figures[0]._id.toString(),
      user1._id,
      user2._id,
      "Pending"
    );

    const tradeRequest2 = await createTradeRequest(
      listing2._id.toString(),
      insertedFigures2.figures[0]._id.toString(),
      insertedFigures1.figures[0]._id.toString(),
      user1._id,
      user2._id,
      "Pending"
    );

    const tradeRequest3 = await createTradeRequest(
      listing1._id.toString(),
      insertedFigures1.figures[0]._id.toString(),
      insertedFigures2.figures[0]._id.toString(),
      user2._id,
      user1._id,
      "Pending"
    );

    const tradeRequest4 = await createTradeRequest(
      listing2._id.toString(),
      insertedFigures2.figures[0]._id.toString(),
      insertedFigures1.figures[0]._id.toString(),
      user1._id,
      user2._id,
      "Pending"
    );
  } catch (e) {
    console.log(e);
  }
  console.log("Seed data inserted successfully");
};
