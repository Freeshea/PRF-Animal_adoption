import { Router, Request, Response } from "express";
import { Animal } from "../models/Animal";
import { isAdmin } from "../../middlewares/auth";
import { User } from "../models/User";
import { Post } from "../models/Post";
import { AdoptionRequest } from "../models/AdoptionRequest";

const router = Router();

// GET /animals lists every animal
router.get("/", async (req: Request, res: Response) => {
  try {
    const animals = await Animal.find();
    res.status(200).json(animals);
  } catch (err) {
    res.status(500).send(err);
  }
});

// GET /animals:id list an animal by ID
router.get("/:id", async (req: Request, res: Response) => {
  try {
    const animal = await Animal.findById(req.params.id);
    if (!animal) {
      res.status(404).send("Animal is not found");
      return;
    }
    res.status(200).json(animal);
  } catch (err) {
    res.status(500).send(err);
  }
});

// POST /animals - creating new animal
router.post("/", isAdmin, async (req: Request, res: Response) => {
  try {
    const newAnimal = new Animal(req.body);
    const savedAnimal = await newAnimal.save();
    res.status(201).json(savedAnimal);
  } catch (err) {
    res.status(500).send(err);
  }
});

// PUT /animals/:id - animal update
router.put("/:id", isAdmin, async (req: Request, res: Response) => {
  // console.log("REQ PARAM ID",req.params.id);
  // console.log("REQ BODY",req.body);
  try {
    const updated = await Animal.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.status(200).json(updated);
  } catch (err) {
    res.status(500).send(err);
  }
});

// DELETE /animals/:id - animal delete
router.delete("/:id", isAdmin, async (req: Request, res: Response) => {
  try {
    const animalId = req.params.id;

    const deletedAnimal = await Animal.findByIdAndDelete(animalId);
    if (!deletedAnimal) {
      res.status(404).send("Animal not found");
      return;
    }

    // Delete from User: fav_animals array
    await User.updateMany(
      { favourite_animals: animalId },
      { $pull: { favourite_animals: animalId } }
    );

    // Delete posts from Posts, containing the animal_id.
    await Post.deleteMany({ animal_id: animalId });

    // Delete requests from AdoptionRequests, containing the animal_id
    await AdoptionRequest.deleteMany({ animal_id: animalId });

    res.status(204).send();
  } catch (err) {
    res.status(500).send(err);
  }
});

export default router;
