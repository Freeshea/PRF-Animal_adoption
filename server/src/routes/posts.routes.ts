import { isAdmin } from '../../middlewares/auth';
import { Post } from './../models/Post';
import { Router, Request, Response } from "express";

const router = Router();

// GET /posts lists all post
router.get('/', async (req:Request, res: Response)=>{
    try{
        const posts = await Post.find().populate('animal_id');
        res.status(200).json(posts);
    }catch(err){
        res.status(500).send(err);
    }
});

// GET post by ID
router.get('/:id', async (req:Request, res: Response)=>{
    try{
        const post = await Post.findById(req.params.id).populate('animal_id');
        if(!post){
            res.status(404).send("Post not found");
            return;
        } 
        res.status(200).json(post);
    }catch(err){
        res.status(500).send(err);
    }
});

// POST create new post
router.post('/', isAdmin, async (req: Request, res: Response)=>{
    try{
        const {title, description, animal_id} = req.body;
        const newPost = new Post({title, description, animal_id});
        const savedPost = await newPost.save();
        res.status(201).json(savedPost);
    }catch(err){
        res.status(500).send(err);
    }
});

// PUT /post/:id - post update
router.put('/:id', isAdmin, async (req:Request, res: Response)=>{
    try{
        const updated = await Post.findByIdAndUpdate(req.params.id, req.body, {new: true});
        res.status(200).json(updated);
    }catch(err){
        res.status(500).send(err);
    }
});

// DELETE delete post by ID
router.delete('/:id', isAdmin, async (req:Request, res: Response)=>{
    try{
        await Post.findByIdAndDelete(req.params.id);
        res.status(204).send();
    }catch(err){
        res.status(500).send(err);
    }
});

export default router;