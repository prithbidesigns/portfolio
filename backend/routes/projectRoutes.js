const express = require("express");
const Project = require("../models/project"); // Correct path to your Project model

const normalizeGalleryItem = (item) => {
  if (typeof item === "string") {
    const url = item.trim();
    return url ? { url, thumbnail: "" } : null;
  }

  if (!item || typeof item !== "object") {
    return null;
  }

  const url = typeof item.url === "string" ? item.url.trim() : "";
  const thumbnail =
    typeof item.thumbnail === "string" ? item.thumbnail.trim() : "";

  if (!url) {
    return null;
  }

  return { url, thumbnail };
};

const normalizeGallery = (gallery) => {
  if (!Array.isArray(gallery)) {
    return [];
  }

  const seenUrls = new Set();

  return gallery.reduce((items, item) => {
    const normalized = normalizeGalleryItem(item);

    if (!normalized || seenUrls.has(normalized.url)) {
      return items;
    }

    seenUrls.add(normalized.url);
    items.push(normalized);
    return items;
  }, []);
};

// This is how your router module should be structured
// It exports a function that takes 'authenticateAdmin' as an argument
module.exports = (authenticateAdmin) => {
  const router = express.Router(); // Initialize router inside the function

  // GET all projects or limited/selected projects
  router.get("/", async (req, res) => {
    try {
      const { limit } = req.query;
      let projects;

      // Check if a valid numeric limit is provided
      if (!isNaN(limit) && Number(limit) > 0) {
        // --- ONLY PERFORM SELECTED/RECENT LOGIC IF LIMIT IS PROVIDED ---
        const desiredLimit = Number(limit);
        let tempProjects = []; // Use a temporary array for building the list

        // 1. Fetch "selected" projects first (up to the desiredLimit)
        const selectedProjects = await Project.find({ selected: true })
          .sort({ createdAt: -1 }) // Sort selected by most recent if you have more than 'desiredLimit' selected
          .limit(desiredLimit);

        tempProjects = selectedProjects;

        // 2. If we don't have enough selected projects, fill with recent ones
        if (tempProjects.length < desiredLimit) {
          const remainingToFetch = desiredLimit - tempProjects.length;

          const recentProjects = await Project.find({
            _id: { $nin: tempProjects.map((p) => p._id) }, // Exclude projects already in 'tempProjects' array
          })
            .sort({ createdAt: -1 }) // Sort by most recent
            .limit(remainingToFetch); // Fetch only the number needed to reach 'desiredLimit'

          tempProjects = [...tempProjects, ...recentProjects];
        }
        projects = tempProjects; // Assign the result to 'projects'
      } else {
        // --- If NO valid limit is provided, fetch ALL projects ---
        projects = await Project.find({});
      }

      res.status(200).json(projects);
    } catch (error) {
      res.status(500).json({ message: "Error fetching projects", error: error.message });
    }
  });

  // GET a single project by ID
  router.get("/:_id", async (req, res) => {
    try {
      const project = await Project.findById(req.params._id);
      if (!project) {
        return res.status(404).json({ message: `Project with ID ${req.params._id} not found.` });
      }
      res.status(200).json(project);
    } catch (error) {
      if (error.name === 'CastError') {
        return res.status(400).json({ message: "Invalid project ID format." });
      }
      res.status(500).json({ message: "Error fetching project", error: error.message });
    }
  });

  // POST (Create) a new project
  router.post("/", authenticateAdmin, async (req, res) => {
    try {
      const data = req.body;

      // Normalize gallery items
      if (data.gallery && Array.isArray(data.gallery)) {
        data.gallery = normalizeGallery(data.gallery);
      }

      const newProject = new Project(data);
      const saved = await newProject.save();
      res.status(201).json(saved);
    } catch (err) {
      if (err.name === 'ValidationError') {
        const messages = Object.values(err.errors).map(val => val.message);
        return res.status(400).json({ message: "Validation error", errors: messages });
      }
      res.status(500).json({ message: "Error saving project", error: err.message });
    }
  });


  // PUT (Update) an existing project by ID
  router.put("/:_id", authenticateAdmin, async (req, res) => {
    try {
      const data = req.body;

      // Normalize gallery items
      if (data.gallery && Array.isArray(data.gallery)) {
        data.gallery = normalizeGallery(data.gallery);
      }

      const updated = await Project.findByIdAndUpdate(
        req.params._id,
        data,
        { new: true, runValidators: true }
      );

      if (!updated) return res.status(404).json({ message: "Project not found" });
      res.status(200).json(updated);
    } catch (err) {
      if (err.name === 'CastError') {
        return res.status(400).json({ message: "Invalid project ID format." });
      }
      if (err.name === 'ValidationError') {
        const messages = Object.values(err.errors).map(val => val.message);
        return res.status(400).json({ message: "Validation error", errors: messages });
      }
      res.status(500).json({ message: "Error updating project", error: err.message });
    }
  });


  // DELETE a project by ID
  router.delete("/:_id", authenticateAdmin, async (req, res) => {
    try {
      const deleted = await Project.findByIdAndDelete(req.params._id);
      if (!deleted) return res.status(404).json({ message: "Project not found" });
      res.status(200).json({ message: "Project deleted", deletedProject: deleted });
    } catch (err) {
      if (err.name === 'CastError') {
        return res.status(400).json({ message: "Invalid project ID format." });
      }
      res.status(500).json({ message: "Error deleting project", error: err.message });
    }
  });

  return router; // Return the configured router
};
