import { isAdmin } from "../../middlewares/auth";
import { AdoptionRequest } from "./../models/AdoptionRequest";
import { Router, Request, Response } from "express";

const router = Router();

// GET all adoption requests
router.get("/", async (req: Request, res: Response) => {
  try {
    const requests = await AdoptionRequest.find()
      .populate("animal_id")
      .populate("user_id");
    res.status(200).json(requests);
  } catch (err) {
    res.status(500).send(err);
  }
});

// GET adoption request by ID
router.get("/:id", async (req: Request, res: Response) => {
  try {
    const request = await AdoptionRequest.findById(req.params.id)
      .populate("animal_id")
      .populate("user_id");
    if (!request) {
      res.status(404).send("Adoption request not found");
      return;
    }
    res.status(200).json(request);
  } catch (err) {
    res.status(500).send(err);
  }
});

// POST create a new adoption request
router.post('/adopt', async (req: Request, res: Response) => {
  if (!req.isAuthenticated()) {
    res.status(401).json({ message: 'Not authenticated' });
    return;
  }

  try {
    const newRequest = new AdoptionRequest({
      user_id: (req.user as any)._id,
      animal_id: req.body.animalId,
      message: req.body.reason,
      meetingDate: req.body.visitDate
    });    

    await newRequest.save();
    res.status(200).json({ message: 'Adoption request submitted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Something went wrong' });
  }
});


// PUT update adoption request status (admin)
router.put("/:id/status", isAdmin, async (req: Request, res: Response) => {
  try {
    const { status } = req.body;
    if (!["pending", "accepted", "rejected"].includes(status)) {
      res.status(400).send("Invalid status value.");
      return;
    }

    const updated = await AdoptionRequest.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!updated) {
      res.status(404).send("Adoption request not found");
      return;
    }
    res.status(200).json(updated);
  } catch (err) {
    res.status(500).send(err);
  }
});

export default router;
