import Razorpay from "razorpay";
import catchAsync from "../utils/catchAsync.js";
import AppError from "../utils/appError.js";
import crypto from "crypto";
import { Mentorship } from "../models/mentorshipModel.js";

const instance = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

export const checkout = catchAsync(async (req, res, next) => {
  const options = {
    amount: Number(req.body.amount * 100),
    currency: "INR",
  };
  const order = await instance.orders.create(options);
  console.log(order);

  res.status(200).json({
    success: true,
    order,
  });
});

export const paymentVerification = catchAsync(async (req, res, next) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
    req.body;

  if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
    return next(new AppError("Incomplete payment details provided", 400));
  }

  const body = razorpay_order_id + "|" + razorpay_payment_id;

  const expectedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
    .update(body.toString())
    .digest("hex");

  const isAuthentic = expectedSignature === razorpay_signature;

  if (isAuthentic) {
    // Update mentorship model
    const mentorship = await Mentorship.findOneAndUpdate(
      { "razorpay_order_id": razorpay_order_id }, // Find the document with the matching order ID
      {
        paymentDetails: {
          razorpay_order_id,
          razorpay_payment_id,
          razorpay_signature,
        },
        isPaid: true,
      },
      { new: true } // Return the updated document
    );

    // Send response
    res.status(200).json({
      success: true,
      data: {
        razorpay_payment_id,
      },
    });
  } else {
    return next(new AppError("Payment verification failed!", 400));
  }
});

export const fetchReceipt = catchAsync(async (req, res, next) => {
  const { payment_id } = req.params;

  try {
    const paymentDetails = await instance.payments.fetch(payment_id);

    if (!paymentDetails) {
      return next(new AppError("Payment not found!", 404));
    }

    // Extract the receipt (if available)
    const receipt = paymentDetails.receipt;

    if (!receipt) {
      return res.status(200).json({
        status: "success",
        message: "No receipt found for this payment.",
        data: { paymentDetails },
      });
    }

    // If receipt exists, return it
    res.status(200).json({
      status: "success",
      message: "Receipt fetched successfully.",
      data: {
        receipt,
        paymentDetails,
      },
    });
  } catch (error) {
    return next(new AppError("Failed to fetch payment details.", 500));
  }
});
