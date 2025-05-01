import dbConnect from "@/lib/dbConnect";
import Transaction from "@/models/Transaction";

export default async function handler(req, res) {
  await dbConnect();

  const {
    query: { id },
    method,
  } = req;

  switch (method) {
    case "PUT":
      try {
        const transaction = await Transaction.findByIdAndUpdate(id, req.body, { new: true });
        if (!transaction) {
          return res.status(400).json({ success: false });
        }
        res.status(200).json({ success: true, data: transaction });
      } catch (error) {
        res.status(400).json({ success: false });
      }
      break;

    case "DELETE":
      try {
        const deletedTransaction = await Transaction.deleteOne({ _id: id });
        if (!deletedTransaction) {
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