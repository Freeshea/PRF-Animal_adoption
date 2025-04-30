import { AdoptionRequest } from "./../models/AdoptionRequest";
import { Router, Request, Response } from "express";

const router = Router();

// // GET all adoption requests FOR TESTING
// router.get("/", async (req: Request, res: Response) => {
//   try {
//     const requests = await AdoptionRequest.find()
//       .populate("animal_id")
//       .populate("user_id");
//     res.status(200).json(requests);
//   } catch (err) {
//     res.status(500).send(err);
//   }
// });

// GET ALL or just user, depends
router.get("/", async (req: Request, res: Response) => {
  if (!req.isAuthenticated()) {
    res.status(401).json({ message: "Not authenticated" });
    return;
  }

  const user = req.user as any;

  try {
    let requests;
    if (user.role === "admin") {
      // admin = every request
      requests = await AdoptionRequest.find()
        .populate("animal_id")
        .populate("user_id");
    } else {
      // user = only own requests
      requests = await AdoptionRequest.find({ user_id: user._id })
        .populate("animal_id")
        .populate("user_id");
    }

    res.status(200).json(requests);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// POST create a new adoption request
router.post("/adopt", async (req: Request, res: Response) => {
  if (!req.isAuthenticated()) {
    res.status(401).json({ message: "Not authenticated" });
    return;
  }

  try {
    const newRequest = new AdoptionRequest({
      user_id: (req.user as any)._id,
      animal_id: req.body.animalId,
      message: req.body.reason,
      meetingDate: req.body.visitDate,
    });

    await newRequest.save();
    res.status(200).json({ message: "Adoption request submitted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Something went wrong" });
  }
});

// PUT update an adoption request
router.put("/:id", async (req: Request, res: Response) => {
  if (!req.isAuthenticated()) {
    res.status(401).json({ message: "Not authenticated" });
    return;
  }

  try {
    const { meetingDate, status, message } = req.body;
    const requestId = req.params.id;
    const user = req.user as any;

    const adoptionRequest = await AdoptionRequest.findById(requestId);

    if (!adoptionRequest) {
      res.status(404).json({ message: "Request not found" });
      return;
    }

    if (
      user.role === "admin" ||
      adoptionRequest.user_id.toString() === user._id.toString()
    ) {
      if (meetingDate) adoptionRequest.meetingDate = meetingDate;
      if (message !== undefined) adoptionRequest.message = message;
      if (user.role === "admin" && status) adoptionRequest.status = status; // only admin
      await adoptionRequest.save();
      res.status(200).json({ message: "Request updated successfully" });
    } else {
      res
        .status(403)
        .json({ message: "Not authorized to update this request" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// DELETE an adoption request
router.delete("/:id", async (req: Request, res: Response) => {
  if (!req.isAuthenticated()) {
    res.status(401).json({ message: "Not authenticated" });
    return;
  }

  try {
    const requestId = req.params.id;
    const user = req.user as any;

    const adoptionRequest = await AdoptionRequest.findById(requestId);

    if (!adoptionRequest) {
      res.status(404).json({ message: "Request not found" });
      return;
    }

    if (
      user.role === "admin" ||
      adoptionRequest.user_id.toString() === user._id.toString()
    ) {
      await AdoptionRequest.findByIdAndDelete(requestId);
      res.status(200).json({ message: "Request deleted successfully" });
    } else {
      res
        .status(403)
        .json({ message: "Not authorized to delete this request" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
