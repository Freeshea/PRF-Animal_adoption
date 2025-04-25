import { Router, Request, Response } from "express";
import { Animal } from "../models/Animal";
import { isAdmin } from "../../middlewares/auth";

const router = Router();

// GET /animals lists every animal
router.get('/', async (req:Request, res:Response)=>{
    try{
        const animals = await Animal.find();
        res.status(200).json(animals);
    }catch(err){
        res.status(500).send(err);
    }
});

// GET /animals:id list an animal by ID
router.get('/:id', async (req:Request, res:Response)=>{
    try{
        const animal = await Animal.findById(req.params.id);
        if (!animal){
            res.status(404).send("Animal is not found");
            return;
        }
        res.status(200).json(animal);
    }catch(err){
        res.status(500).send(err);
    }
});


// POST /animals - creating new animal
router.post('/', isAdmin, async (req: Request, res: Response)=>{
    try{
        const newAnimal = new Animal(req.body);
        const savedAnimal = await newAnimal.save();
        res.status(201).json(savedAnimal);
    }catch(err){
        res.status(500).send(err);
    }
});

// PUT /animals/:id - animal update
router.put('/:id', isAdmin, async (req:Request, res: Response)=>{
    // console.log("REQ PARAM ID",req.params.id);
    // console.log("REQ BODY",req.body);
    try{
        const updated = await Animal.findByIdAndUpdate(req.params.id, req.body, {new: true});
        res.status(200).json(updated);
    }catch(err){
        res.status(500).send(err);
    }
});

// DELETE /animals/:id - animal delete
router.delete('/:id', isAdmin, async (req:Request, res: Response)=>{
    try{
        await Animal.findByIdAndDelete(req.params.id);
        res.status(204).send();
    }catch(err){
        res.status(500).send(err);
    }
});

export default router;