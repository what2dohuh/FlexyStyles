const {onRequest} = require("firebase-functions/v2/https");
const Razorpay = require("razorpay");
const crypto = require("crypto");
const admin = require("firebase-admin");

// Initialize Firebase Admin
if (!admin.apps.length) {
  admin.initializeApp();
}

// Initialize Razorpay
const razorpay = new Razorpay({
  key_id: "",
  key_secret: "",
});

// ========== CREATE ORDER ==========
exports.createOrder = onRequest({
  cors: true,
  invoker: "public"
}, async (req, res) => {
  // Set CORS headers
const allowedOrigins = [
  "https://flexystyles.in",
  "https://www.flexystyles.in"
];

const origin = req.headers.origin;
if (allowedOrigins.includes(origin)) {
  res.set("Access-Control-Allow-Origin", origin);
}
  res.set("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.set("Access-Control-Allow-Headers", "Content-Type");
  
  try {
    // Handle preflight request
    if (req.method === "OPTIONS") {
      res.status(204).send("");
      return;
    }

    // Only allow POST requests
    if (req.method !== "POST") {
      return res.status(405).json({ error: "Method Not Allowed" });
    }

    const { amount, currency, receipt } = req.body;

    // Validate amount
    if (!amount || amount <= 0) {
      return res.status(400).json({ error: "Invalid amount" });
    }

    // Create Razorpay order
    const options = {
      amount: amount, // amount in paise
      currency: currency || "INR",
      receipt: receipt || `receipt_${Date.now()}`,
    };

    const order = await razorpay.orders.create(options);
    
    console.log("Order created:", order.id);
    return res.status(200).json(order);

  } catch (error) {
    console.error("Error creating Razorpay order:", error);
    return res.status(500).json({ 
      error: "Failed to create order",
      message: error.message 
    });
  }
});

// ========== VERIFY PAYMENT ==========
exports.verifyPayment = onRequest({
  cors: true,
  invoker: "public"
}, async (req, res) => {
  // Set CORS headers
const allowedOrigins = [
  "https://flexystyles.in",
  "https://www.flexystyles.in"
];

const origin = req.headers.origin;
if (allowedOrigins.includes(origin)) {
  res.set("Access-Control-Allow-Origin", origin);
}
  res.set("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.set("Access-Control-Allow-Headers", "Content-Type");

  try {
    // Handle preflight request
    if (req.method === "OPTIONS") {
      res.status(204).send("");
      return;
    }

    // Only allow POST requests
    if (req.method !== "POST") {
      return res.status(405).json({ 
        success: false, 
        error: "Method Not Allowed" 
      });
    }

    const { 
      razorpay_order_id, 
      razorpay_payment_id, 
      razorpay_signature,
      orderNumber,
      orderData 
    } = req.body;

    // Validate required fields
    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({ 
        success: false, 
        error: "Missing required payment parameters" 
      });
    }

    // Generate signature for verification
    const generatedSignature = crypto
      .createHmac("sha256", "") // Your key_secret
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    // Verify signature
    if (generatedSignature !== razorpay_signature) {
      console.error("Signature verification failed:", {
        expected: generatedSignature,
        received: razorpay_signature,
        orderId: razorpay_order_id,
        paymentId: razorpay_payment_id
      });
      
      return res.status(400).json({ 
        success: false, 
        error: "Invalid payment signature" 
      });
    }

    // Payment verified successfully
    console.log("Payment verified successfully:", {
      orderNumber,
      paymentId: razorpay_payment_id,
      orderId: razorpay_order_id
    });

    // Optional: Log payment verification in Firestore
    try {
      await admin.firestore().collection("paymentVerifications").add({
        orderNumber: orderNumber,
        razorpayOrderId: razorpay_order_id,
        razorpayPaymentId: razorpay_payment_id,
        verified: true,
        verifiedAt: admin.firestore.FieldValue.serverTimestamp(),
        orderData: orderData || null
      });
    } catch (logError) {
      console.error("Error logging verification:", logError);
      // Don't fail the verification if logging fails
    }

    return res.status(200).json({ 
      success: true, 
      message: "Payment verified successfully",
      paymentId: razorpay_payment_id,
      orderId: razorpay_order_id
    });

  } catch (error) {
    console.error("Payment verification error:", error);
    return res.status(500).json({ 
      success: false, 
      error: "Payment verification failed",
      message: error.message 
    });
  }
});