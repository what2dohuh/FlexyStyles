
export default function TermsAndConditions() {
  const sections = [
    {
      title: "1. General Terms",
      content: [
        "By accessing and using this website, you accept and agree to be bound by the terms and provision of this agreement.",
        "We reserve the right to modify these terms at any time without prior notice. Your continued use of the site following any changes indicates your acceptance of the new terms.",
        "All products and prices are subject to change without notice.",
        "We reserve the right to refuse service to anyone for any reason at any time."
      ]
    },
    {
      title: "2. Products and Pricing",
      content: [
        "We strive to display product colors and images as accurately as possible. However, we cannot guarantee that your device's display will accurately reflect the actual color of the products.",
        "All prices are listed in Indian Rupees (INR) and are inclusive of applicable taxes unless stated otherwise.",
        "We reserve the right to correct any pricing errors on our website or on pending orders.",
        "Product availability is subject to change without notice. In case of unavailability, we will notify you and offer alternatives or a full refund."
      ]
    },
    {
      title: "3. Orders and Payment",
      content: [
        "All orders are subject to acceptance and availability.",
        "We accept payment through secure payment gateways including credit cards, debit cards, UPI, and net banking.",
        "Payment must be received in full before your order is processed.",
        "You will receive an order confirmation email once your payment is successfully processed.",
        "We reserve the right to cancel any order at our discretion, including cases of suspected fraud or unauthorized transactions."
      ]
    },
    {
      title: "4. Shipping Policy",
      content: [
        "We partner with reliable third-party shipping providers to deliver your orders.",
        "Shipping typically takes 7-10 business days from the date of order confirmation, depending on your location.",
        "Delivery times may vary during peak seasons, holidays, or due to unforeseen circumstances.",
        "Once your order is dispatched, you will receive a tracking number via email to monitor your shipment.",
        "Shipping charges, if applicable, will be calculated at checkout based on your delivery location and order value.",
        "We are not responsible for delays caused by the shipping carrier or circumstances beyond our control (weather, strikes, etc.).",
        "Please ensure that the shipping address provided is accurate and complete. We are not responsible for orders delivered to incorrect addresses provided by customers."
      ]
    },
    {
      title: "5. No Return Policy",
      content: [
        "All sales are final. We do not accept returns, exchanges, or refunds on any products purchased from our store.",
        "Please review your order carefully before completing your purchase, including product details, size, color, and quantity.",
        "We encourage you to contact us before placing an order if you have any questions or concerns about a product.",
        "In the rare event that you receive a damaged or defective product, please contact us within 48 hours of delivery with photographic evidence. We will assess the situation on a case-by-case basis.",
        "Products must be unused, unwashed, and in their original condition with all tags attached for any damage claims to be considered.",
        "This no-return policy applies to all products including sale and discounted items."
      ]
    },
    {
      title: "6. Product Quality and Defects",
      content: [
        "While we do not accept returns, we stand behind the quality of our products.",
        "If you receive a damaged or defective item, please contact our customer service within 48 hours of delivery.",
        "You must provide clear photographs showing the defect or damage for our review.",
        "If the defect is confirmed to be a manufacturing fault or shipping damage, we may offer a replacement or store credit at our discretion.",
        "Minor variations in color, fabric texture, or stitching are not considered defects and are not grounds for claims."
      ]
    },
    {
      title: "7. User Account",
      content: [
        "You are responsible for maintaining the confidentiality of your account and password.",
        "You agree to accept responsibility for all activities that occur under your account.",
        "You must notify us immediately of any unauthorized use of your account.",
        "We reserve the right to terminate accounts that violate these terms and conditions."
      ]
    },
    {
      title: "8. Privacy and Security",
      content: [
        "Your privacy is important to us. We collect and use your personal information in accordance with our Privacy Policy.",
        "We use secure payment gateways to protect your financial information.",
        "We will never share your personal information with third parties without your consent, except as required by law.",
        "By using our website, you consent to the collection and use of your information as described in our Privacy Policy."
      ]
    },
    {
      title: "9. Intellectual Property",
      content: [
        "All content on this website, including text, images, logos, and designs, is the property of our company and protected by copyright laws.",
        "You may not reproduce, distribute, or use any content from this website without our express written permission.",
        "Product images and descriptions are for reference only and may not be used for commercial purposes."
      ]
    },
    {
      title: "10. Limitation of Liability",
      content: [
        "We shall not be liable for any indirect, incidental, special, or consequential damages arising out of your use of our website or products.",
        "Our total liability to you for any claim arising from your use of our website or products shall not exceed the amount you paid for the product.",
        "We do not guarantee uninterrupted or error-free operation of our website.",
        "We are not responsible for any loss or damage caused by viruses or other harmful components."
      ]
    },
    {
      title: "11. Contact Information",
      content: [
        "For any questions, concerns, or support regarding these terms and conditions, please contact us:",
        "Email: helloasianfashion@gmail.com",
        "Phone: +91 9864782009",
        "Business Hours: Monday to Saturday, 10:00 AM - 6:00 PM IST"
      ]
    },
    {
      title: "12. Governing Law",
      content: [
        "These terms and conditions are governed by the laws of India.",
        "Any disputes arising from these terms shall be subject to the exclusive jurisdiction of the courts in [Your City], India.",
        "If any provision of these terms is found to be invalid or unenforceable, the remaining provisions shall remain in full force and effect."
      ]
    }
  ];

  return (
    <div className="terms-page">
      {/* Hero Section */}
      <section className="terms-hero">
        <div className="hero-content">
          <h1 className="hero-title">Terms & Conditions</h1>
          <p className="hero-subtitle">Please read these terms carefully before using our services</p>
          <div className="hero-line"></div>
          <p className="last-updated">Last Updated: October 27, 2025</p>
        </div>
      </section>

      {/* Content Section */}
      <section className="terms-content">
        <div className="container">
          {/* Important Notice */}
          <div className="notice-box">
            <h3>⚠️ Important Notice</h3>
            <p><strong>No Returns Policy:</strong> All sales are final. We do not accept returns or exchanges.</p>
            <p><strong>Shipping Time:</strong> Delivery typically takes 7-10 business days via our third-party shipping partners.</p>
          </div>

          {/* Terms Sections */}
          <div className="terms-sections">
            {sections.map((section, index) => (
              <div key={index} className="term-section">
                <h2 className="section-title">{section.title}</h2>
                <div className="section-content">
                  {section.content.map((paragraph, pIndex) => (
                    <p key={pIndex} className="section-paragraph">{paragraph}</p>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Acceptance Section */}
          <div className="acceptance-box">
            <h3>Acceptance of Terms</h3>
            <p>
              By using our website and making a purchase, you acknowledge that you have read, 
              understood, and agree to be bound by these Terms and Conditions. If you do not 
              agree with any part of these terms, please do not use our website or services.
            </p>
          </div>
        </div>
      </section>

      <style>{`
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        .terms-page {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
          color: #1a1a1a;
          background: #ffffff;
        }

        /* Hero Section */
        .terms-hero {
          padding: 100px 20px 80px;
          background: #fafafa;
          text-align: center;
          border-bottom: 1px solid #e0e0e0;
        }

        .hero-content {
          max-width: 800px;
          margin: 0 auto;
        }

        .hero-title {
          font-size: 3.5rem;
          font-weight: 300;
          margin-bottom: 20px;
          color: #1a1a1a;
          letter-spacing: -1px;
        }

        .hero-subtitle {
          font-size: 1.2rem;
          font-weight: 400;
          color: #666;
          margin-bottom: 30px;
          letter-spacing: 0.5px;
        }

        .hero-line {
          width: 60px;
          height: 2px;
          background: #1a1a1a;
          margin: 0 auto 30px;
        }

        .last-updated {
          font-size: 0.95rem;
          color: #888;
          font-style: italic;
        }

        /* Container */
        .container {
          max-width: 900px;
          margin: 0 auto;
          padding: 0 20px;
        }

        /* Content Section */
        .terms-content {
          padding: 80px 20px;
        }

        /* Notice Box */
        .notice-box {
          background: #fff3cd;
          border: 2px solid #ffc107;
          border-radius: 8px;
          padding: 30px;
          margin-bottom: 60px;
        }

        .notice-box h3 {
          font-size: 1.5rem;
          font-weight: 600;
          margin-bottom: 20px;
          color: #856404;
        }

        .notice-box p {
          font-size: 1rem;
          line-height: 1.8;
          color: #856404;
          margin-bottom: 10px;
        }

        .notice-box p:last-child {
          margin-bottom: 0;
        }

        /* Terms Sections */
        .terms-sections {
          margin-bottom: 60px;
        }

        .term-section {
          margin-bottom: 50px;
          padding-bottom: 50px;
          border-bottom: 1px solid #f0f0f0;
        }

        .term-section:last-child {
          border-bottom: none;
        }

        .section-title {
          font-size: 1.8rem;
          font-weight: 500;
          margin-bottom: 25px;
          color: #1a1a1a;
          letter-spacing: -0.5px;
        }

        .section-content {
          padding-left: 20px;
        }

        .section-paragraph {
          font-size: 1.05rem;
          line-height: 1.9;
          color: #4a4a4a;
          margin-bottom: 15px;
          font-weight: 300;
        }

        .section-paragraph:last-child {
          margin-bottom: 0;
        }

        /* Acceptance Box */
        .acceptance-box {
          background: #f8f9fa;
          border-left: 4px solid #1a1a1a;
          padding: 30px;
          margin-top: 60px;
        }

        .acceptance-box h3 {
          font-size: 1.5rem;
          font-weight: 500;
          margin-bottom: 15px;
          color: #1a1a1a;
        }

        .acceptance-box p {
          font-size: 1.05rem;
          line-height: 1.8;
          color: #4a4a4a;
          font-weight: 300;
        }

        /* Responsive Design */
        @media (max-width: 768px) {
          .hero-title {
            font-size: 2.5rem;
          }

          .hero-subtitle {
            font-size: 1.1rem;
          }

          .terms-hero {
            padding: 80px 20px 60px;
          }

          .terms-content {
            padding: 60px 20px;
          }

          .section-title {
            font-size: 1.5rem;
          }

          .section-content {
            padding-left: 10px;
          }

          .section-paragraph {
            font-size: 1rem;
          }

          .notice-box {
            padding: 25px 20px;
          }

          .notice-box h3 {
            font-size: 1.3rem;
          }

          .acceptance-box {
            padding: 25px 20px;
          }

          .acceptance-box h3 {
            font-size: 1.3rem;
          }
        }

        @media (max-width: 480px) {
          .hero-title {
            font-size: 2rem;
          }

          .container {
            padding: 0 15px;
          }
        }
      `}</style>
    </div>
  );
}