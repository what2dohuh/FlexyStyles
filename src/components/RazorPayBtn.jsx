import { useState } from 'react';

const PaymentButton = ({ 
  getOrderData, 
  onSuccess, 
  onError,
  disabled 
}) => {
  const [isProcessing, setIsProcessing] = useState(false);

  const loadRazorpay = () => {
    return new Promise((resolve) => {
      if (window.Razorpay) return resolve(true);
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const verifyPayment = async (paymentData) => {
    try {
      const response = await fetch(
        " https://us-central1-wabclone-763ba.cloudfunctions.net/verifyPayment ", // Replace with your actual URL after deployment
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(paymentData),
        }
      );
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Verification failed");
      }
      
      const result = await response.json();
      return result;
    } catch (error) {
      console.error("Verification failed:", error);
      return { success: false, error: error.message };
    }
  };

  const handlePayment = async () => {
    setIsProcessing(true);
    const orderData = getOrderData ? getOrderData() : null;
    try {
      const res = await loadRazorpay();
      if (!res) {
        alert("Razorpay SDK failed to load. Please try again.");
        setIsProcessing(false);
        return;
      }

      // Create order from Firebase Function
      const response = await fetch(
        "https://createorder-2ciswvcw5q-uc.a.run.app",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ 
            amount: Math.round(orderData.totalAmount * 100), // Convert to paise
            currency: "INR",
            receipt: orderData.orderNumber
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to create Razorpay order");
      }

      const data = await response.json();

      const options = {
        key: "rzp_test_RVM3TBM0GpnfHN",
        amount: data.amount,
        currency: data.currency,
        order_id: data.id,
        name: "FlexyStyles",
        description: `Order #${orderData.orderNumber}`,
        image: "/logo.png",
        handler: async function (response) {
          // Payment successful - now verify it
          const paymentData = {
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature,
            orderNumber: orderData.orderNumber,
            orderData: orderData // Send complete order data for database creation
          };

          const verification = await verifyPayment(paymentData);

          if (verification.success) {
            // Call success callback to create order in database
            onSuccess({
              paymentId: response.razorpay_payment_id,
              orderId: response.razorpay_order_id,
              orderNumber: orderData.orderNumber
            });
          } else {
            onError(new Error(verification.error || "Payment verification failed"));
          }
        },
        modal: {
          ondismiss: function() {
            setIsProcessing(false);
            alert("Payment cancelled. Please try again.");
          }
        },
        theme: { color: "#0c0e0fff" },
        prefill: {
          name: orderData.shippingInfo.fullName,
          email: orderData.shippingInfo.email,
          contact: orderData.shippingInfo.phone
        }
      };

      const paymentObject = new window.Razorpay(options);
      paymentObject.open();
      
      // Reset processing state when modal opens
      setIsProcessing(false);

    } catch (error) {
      console.error("Payment initiation error:", error);
      onError(error);
      setIsProcessing(false);
    }
  };

  return (
    <button 
      onClick={handlePayment} 
      className="btn-place-order"
      disabled={disabled || isProcessing}
    >
      {isProcessing ? 'Initializing Payment...' : 'Pay Now'}
    </button>
  );
};

export default PaymentButton;