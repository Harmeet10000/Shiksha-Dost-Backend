import Razorpay from "razorpay";
import catchAsync from "../utils/catchAsync.js";
import AppError from "../utils/appError.js";
import crypto from "crypto";
import { Mentorship } from "../models/mentorshipModel.js";
import { sendMeetMail } from "../controllers/mentorshipController.js";

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
  // console.log(order);

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
      { razorpay_order_id: razorpay_order_id }, // Find the document with the matching order ID
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
    // console.log(mentorship);
    sendMeetMail(mentorship);
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
  const { razorpay_payment_id } = req.body;
  const { mentorshipId } = req.params;

  // Fetch mentorship details
  const mentorship = await Mentorship.findById(mentorshipId);

  console.log(mentorship);
  // Extract user details
  const name = req.user.name;
  const email = req.user.email;
  const contact = mentorship.userPhone;

  // Fetch payment details from Razorpay
  const paymentDetails = await instance.payments.fetch(razorpay_payment_id);

  // Construct invoice details
  const invoiceData = {
    type: "invoice",
    description: `Invoice for Mentorship Session with ${mentorship.mentor.name}`,
    customer: {
      name,
      email,
      contact,
    },
    line_items: [
      {
        name: "Mentorship",
        description: "One-on-one mentorship session conducted online.",
        amount: paymentDetails.amount,
        currency: paymentDetails.currency,
        quantity: 1,
      },
    ],
    sms_notify: 1,
    email_notify: 1,
  };

  // Create invoice
  const invoice = await instance.invoices.create(invoiceData);

  // Send invoice via email
  await instance.invoices.notifyBy("email", invoice.id);

  res.status(200).json({
    success: true,
    message: "Invoice generated and sent successfully",
    invoice,
  });
});
