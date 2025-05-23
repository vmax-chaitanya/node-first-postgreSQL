
const Blog = require("./../models/blogModel");
const User = require("./../models/userModel");


// Create a blog
exports.createBlog = async (req, res) => {
    try {
        const { title, content, user_id } = req.body;
        const blog = await Blog.create({ title, content, user_id });
        res.status(201).json({
            status: "success",
            data: blog
        });
    } catch (error) {
        res.status(500).json({ error: "Failed to create blog", message: error.message });
    }
};

// Get all blogs (with user details)
exports.getAllBlogs = async (req, res) => {
    try {
        const blogs = await Blog.findAll({
            include: {
                model: User,
                attributes: ["user_id", "firstName", "lastName", "email"],
            },
        });
        res.json(blogs);
    } catch (error) {
        res.status(500).json({ error: "Failed to retrieve blogs", message: error.message });
    }
};

// Get blog by ID
exports.getBlogById = async (req, res) => {
    try {
        const blog = await Blog.findByPk(req.params.id, {
            include: {
                model: User,
                attributes: ["user_id", "firstName", "lastName", "email"],
            },
        });
        if (!blog) return res.status(404).json({ error: "Blog not found" });
        res.json(blog);
    } catch (error) {
        res.status(500).json({ error: "Failed to retrieve blog", message: error.message });
    }
};

// Update blog
exports.updateBlog = async (req, res) => {
    try {
        const blog = await Blog.findByPk(req.params.id);
        if (!blog) return res.status(404).json({ error: "Blog not found" });

        const { title, content } = req.body;
        await blog.update({ title, content });
        res.json(blog);
    } catch (error) {
        res.status(500).json({ error: "Failed to update blog", message: error.message });
    }
};

// Delete blog
exports.deleteBlog = async (req, res) => {
    try {
        const blog = await Blog.findByPk(req.params.id);
        if (!blog) return res.status(404).json({ error: "Blog not found" });

        await blog.destroy();
        res.json({ message: "Blog deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: "Failed to delete blog", message: error.message });
    }
};
