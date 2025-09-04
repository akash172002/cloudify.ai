import sql from "../configs/db.js";

export const getUserCreations = async (req, res) => {
  try {
    const { userId } = req.auth();

    const creations =
      await sql`SELECT * FROM creations where user_id = ${userId} ORDER BY created_at DESC`;

    res.json({ success: true, creations });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

export const getPublishedCreations = async (req, res) => {
  try {
    const creations =
      await sql`SELECT * FROM creations where publish = true ORDER BY created_at DESC`;

    res.json({ success: true, creations });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

export const toggleLikeCreation = async (req, res) => {
  try {
    const { userId } = req.auth();
    const { id } = req.body;

    const [creation] = await sql`SELECT * FROM creations where id = ${id}`;

    if (!creation) {
      return res.json({ success: false, message: "creation not found" });
    }

    const currentLike = creation.likes;
    const userIdStr = userId.toString();

    let updatedLikes;
    let message;

    if (currentLike.includes(userIdStr)) {
      updatedLikes = currentLike.filter((user) => user !== userIdStr);
      message = "Creation Unliked";
    } else {
      updatedLikes = [...currentLike, userIdStr];
      message: "Creation Liked";
    }

    const formatedArray = `{${updatedLikes.join(",")}}`;

    await sql`UPDATE creations SET likes = ${formatedArray}::text[] WHERE id = ${id}`;

    res.json({ success: true, message });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};
