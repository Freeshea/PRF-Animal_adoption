import { Router, Request, Response, NextFunction } from "express";
import { PassportStatic } from "passport";
import { User } from "../models/User";

const router = Router();

export default (passport: PassportStatic): Router => {
  // GET all users
  router.get("/", async (req: Request, res: Response) => {
    try {
      const users = await User.find();
      res.status(200).json(users);
      return;
    } catch (err) {
      res.status(500).send(err);
      return;
    }
  });

  // GET user by ID
  router.get("/profile", async (req: Request, res: Response) => {
    if (!req.isAuthenticated() || !req.user) {
      res.status(401).json({ message: "User not authenticated" });
      return;
    }
    try {
      const user = await User.findById((req.user as any)._id).select(
        "name email role favourite_animals adoption_requests"
      );
      res.status(200).json(user);
      return;
    } catch (err) {
      res.status(500).json({ message: "Error fetching user profile" });
      return;
    }
  });

  // POST Login
  router.post("/login", (req: Request, res: Response, next: NextFunction) => {
    passport.authenticate(
      "local",
      (error: string | null, user: typeof User) => {
        if (error) {
          console.log(error);
          res.status(500).send(error);
        } else {
          if (!user) {
            res.status(400).send("User not found.");
          } else {
            req.login(user, (err: string | null) => {
              if (err) {
                console.log(err);
                res.status(500).send("Internal server error.");
              } else {
                res.status(200).send(user);
              }
            });
          }
        }
      }
    )(req, res, next);
  });

  // POST Register
  router.post("/register", async (req: Request, res: Response) => {
    try {
      const { name, email, password } = req.body;

      // Double registration check
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        console.log("User already exist.");
        res.status(400).send("User with this email already exists.");
        return;
      }

      // New user
      const user = new User({
        name,
        email,
        password,
        role: email === "admin@admin.com" ? "admin" : "user",
      });

      const savedUser = await user.save();
      res.status(201).send(savedUser);
      return;
    } catch (error) {
      console.error("Registration error:", error);
      res.status(500).send("Error during registration.");
      return;
    }
  });

  // Logout
  router.post("/logout", (req: Request, res: Response) => {
    if (req.isAuthenticated()) {
      req.logout((error) => {
        if (error) {
          console.log("Something went wrong ", error);
          return res.status(500).send(error);
        }
        return res.status(200).send("Successfully logged out.");
      });
    } else {
      res.status(500).send("User is not logged in.");
      return;
    }
  });

  // Check if authenticated
  router.get("/checkAuth", (req: Request, res: Response) => {
    if (req.isAuthenticated()) {
      // console.log("User is logged in.");
      res.status(200).send({ authenticated: true });
      return;
    } else {
      // console.log("User is not logged in.");
      res.status(401).send("User is not logged in");
      return;
    }
  });

  // PUT Update user account
  router.put("/profile", async (req: Request, res: Response) => {
    if (!req.isAuthenticated()) {
      res.status(401).json({ message: "Not authenticated" });
      return;
    }

    try {
      const userId = (req.user as any)._id;
      const { name } = req.body;
  
      const updatedUser = await User.findByIdAndUpdate(
        userId,
        { name },
        { new: true }
      );
  
      if (!updatedUser) {
        res.status(404).json({ message: 'User not found' });
        return;
      }
  
      res.status(200).json(updatedUser);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Failed to update profile' });
    }
  
  });

  // DELETE user account
  router.delete("/delete", async (req: Request, res: Response) => {
    if (!req.isAuthenticated() || !req.user) {
      res.status(401).json({ message: "User not authenticated" });
      return;
    }
    try {
      const user = await User.findByIdAndDelete((req.user as any)._id);
      if (!user) {
        res.status(404).json({ message: "User not found" });
        return;
      }
      res.status(200).json({ message: "Account deleted successfully" });
      return;
    } catch (err) {
      res.status(500).json({ message: "Error deleting account" });
      return;
    }
  });

  // DELETE ALL USERS (for debugging) -- DELETE http://localhost:5000/app/users/delete-all
  // router.delete('/delete-all', async (req: Request, res: Response) => {
  //   try {
  //     await User.deleteMany({});
  //     res.status(200).json({ message: 'All users deleted.' });
  //     return;
  //   } catch (err) {
  //     res.status(500).json({ error: 'Failed to delete users.' });
  //     return;
  //   }
  // });

  // Add to favourites
  router.post("/favourite", async (req: Request, res: Response) => {
    if (!req.isAuthenticated()) {
      res.status(401).json({ message: "User not authenticated" });
      return;
    }
    try {
      const user = await User.findById((req.user as any)._id);
      if (!user!.favourite_animals!.includes(req.body.petId)) {
        user!.favourite_animals!.push(req.body.petId);
        await user!.save();
      }
      res.status(200).json({ message: "Added to favourites" });
      return;
    } catch (err) {
      res.status(500).json({ message: "Error adding to favourites" });
      return;
    }
  });

  // Delete from favourites
  router.post("/unfavourite", async (req: Request, res: Response) => {
    if (!req.isAuthenticated()) {
      res.status(401).json({ message: "User not authenticated" });
      return;
    }

    try {
      const user = await User.findById((req.user as any)._id);
      user!.favourite_animals = user!.favourite_animals!.filter(
        (id: any) => id.toString() !== req.body.petId.toString()
      );
      await user!.save();
      res.status(200).json({ message: "Removed from favourites" });
      return;
    } catch (err) {
      res.status(500).json({ message: "Error removing from favourites" });
      return;
    }
  });

  return router;
};
