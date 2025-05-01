import dbConnect from "@/lib/dbConnect";
import Budget from "@/models/Budget";

export default async function handler(req, res) {
  await dbConnect();

  const { method } = req;

  switch (method) {
    case "GET":
      try {
        const { userToken } = req.query;
        const budgets = await Budget.find({ userToken });
        res.status(200).json({ success: true, data: budgets });
      } catch (error) {
        res.status(400).json({ success: false });
      }
      break;

    case "POST":
      try {
        console.log("Received body:", req.body);

        const budget = await Budget.create(req.body);
        res.status(201).json({ success: true, data: budget });
      } catch (error) {
        console.error(error);
        res.status(400).json({ success: false });
      }
      break;

    default:
      res.status(400).json({ success: false });
      break;
  }
}