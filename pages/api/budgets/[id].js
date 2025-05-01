import dbConnect from "@/lib/dbConnect";
import Budget from "@/models/Budget";

export default async function handler(req, res) {
  await dbConnect();

  const {
    query: { id },
    method,
  } = req;

  switch (method) {
    case "PUT":
      try {
        const budget = await Budget.findByIdAndUpdate(id, req.body, { new: true });
        if (!budget) {
          return res.status(400).json({ success: false });
        }
        res.status(200).json({ success: true, data: budget });
      } catch (error) {
        res.status(400).json({ success: false });
      }
      break;

    case "DELETE":
      try {
        const deletedBudget = await Budget.deleteOne({ _id: id });
        if (!deletedBudget) {
          return res.status(400).json({ success: false });
        }
        res.status(200).json({ success: true, data: {} });
      } catch (error) {
        res.status(400).json({ success: false });
      }
      break;

    default:
      res.status(400).json({ success: false });
      break;
  }
}