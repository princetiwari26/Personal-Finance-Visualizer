import dbConnect from "@/lib/dbConnect";
import User from "@/models/User";

export default async function handler(req, res) {
  await dbConnect();

  const { token } = req.query;

  if (req.method === "POST") {
    const { name } = req.body;

    if (!name || !token) {
      return res.status(400).json({ error: "Name and token are required" });
    }

    try {
      let user = await User.findOne({ token });
      if (!user) {
        user = await User.create({ name, token });
      }
      return res.status(200).json({ message: "User saved", user });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Server error" });
    }
  } else if (req.method === "GET") {
    try {
      const user = await User.findOne({ token });
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      return res.status(200).json({ user });
    } catch (error) {
      return res.status(500).json({ error: "Server error" });
    }
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
}