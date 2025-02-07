import { Course } from "../models/course.model.js";
import { v2 as cloudinary } from "cloudinary";
import { Purchase } from "../models/purchase.model.js";



// Create course
export const createCourse = async (req, res) => {
  const adminId = req.adminId;
  const { title, description, price } = req.body;

  try {
    if (!title || !description || !price) {
      return res.status(400).json({
        message: "All fields are required.",
      });
    }

    const { image } = req.files;
    if (!req.files || Object.keys(req.files).length === 0) {
      return res.status(400).json({
        message: "No files uploaded",
      });
    }

    const allowedFormat = ["image/png", "image/jpeg"];
    if (!allowedFormat.includes(image.mimetype)) {
      return res.status(400).json({
        message: "Invalid file format. Only PNG and JPEG are accepted.",
      });
    }

    // Upload image to Cloudinary
    const cloud_response = await cloudinary.uploader.upload(image.tempFilePath);
    if (!cloud_response || cloud_response.error) {
      return res.status(400).json({
        message: "Error uploading file to Cloudinary",
      });
    }

    const courseData = {
      title,
      description,
      price,
      image: {
        public_id: cloud_response.public_id,
        url: cloud_response.url,
      },
      creatorId: adminId,
    };

    const course = await Course.create(courseData);
    res.json({
      message: "Course created successfully",
      course,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Error creating course",
    });
  }
};

// Update course
export const updateCourse = async (req, res) => {
  const adminId = req.adminId;
  const { courseId } = req.params;
  const { title, description, price, image } = req.body;

  try {
    const courseSearch = await Course.findById(courseId);
    if (!courseSearch) {
      return res.status(404).json({
        message: "Course not found",
      });
    }

    const course = await Course.updateOne(
      {
        _id: courseId,
        creatorId: adminId,
      },
      {
        title,
        description,
        price,
        image: {
          public_id: image?.public_id,
          url: image?.url,
        },
      }
    );
    res.status(200).json({
      message: "Course updated successfully", 
      course,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error updating course!",
    });
    console.log("Error updating course:", error);
  }
};

// Delete course
export const deleteCourse = async (req, res) => {
  const adminId = req.adminId;
  const { courseId } = req.params;

  try {
    const course = await Course.findOneAndDelete({
      _id: courseId,
      creatorId: adminId,
    });

    if (!course) {
      return res.status(404).json({
        message: "Course not found",
      });
    }

    res.status(200).json({
      message: "Course deleted successfully!",
    });
  } catch (error) {
    res.status(500).json({
      message: "Error deleting course",
    });
    console.log("Error deleting course:", error);
  }
};

// Get all courses
export const getCourses = async (req, res) => {
  try {
    const courses = await Course.find({});
    res.status(200).json({
      courses,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error retrieving courses",
    });
    console.log("Error retrieving courses:", error);
  }
};

// Get course details
export const courseDetails = async (req, res) => {
  const { courseId } = req.params;

  try {
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({
        message: "Course not found",
      });
    }

    res.status(200).json({
      course,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error retrieving course details",
    });
    console.log("Error retrieving course details:", error);
  }
};

import Stripe from "stripe";
import config from "../config.js";

console.log("STRIPE_SECRET_KEY:", config.STRIPE_SECRET_KEY); // Debugging log

const stripe = new Stripe(config.STRIPE_SECRET_KEY);

export const buyCourses = async (req, res) => {
  const { userId } = req;
  const { courseId } = req.params;

  try {
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ errors: "Course not found" });
    }

    const existingPurchase = await Purchase.findOne({ userId, courseId });
    if (existingPurchase) {
      return res.status(400).json({ errors: "User has already purchased this course" });
    }

    // Stripe Payment Intent
    const amount = course.price * 100; // Convert price to cents
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount,
      currency: "usd",
      automatic_payment_methods: { enabled: true },
    });

    console.log("Payment Intent Data:", paymentIntent); // Debugging log

    if (!paymentIntent.client_secret) {
      throw new Error("Failed to generate client secret");
    }

    res.status(201).json({
      message: "Course purchased successfully",
      course,
      clientSecret: paymentIntent.client_secret,
    });
  } catch (error) {
    console.error("Error in course buying:", error.message, error);
    res.status(500).json({ errors: error.message || "Error in course buying" });
  }
};
