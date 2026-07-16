import React from 'react';
import './PrivacyPolicy.css';

const PrivacyPolicy = () => {
  return (
    <div className="legal-view-container">
      <section className="legal-section">
        <div className="section-title">
          <h2>Privacy Policy</h2>
          <div className="title-underline"></div>
        </div>

        <div className="legal-card">
          <p className="last-updated">Last Updated: June 2026</p>

          <div className="legal-content">
            <p>
              Welcome to <strong>VipNumberGarage</strong>. We value your privacy and are committed to protecting your personal data. This Privacy Policy describes how we collect, use, and share your information when you visit our website and purchase or list VIP mobile numbers.
            </p>

            <h3>1. Information We Collect</h3>
            <p>
              We collect information that you provide directly to us when using our services. This includes:
            </p>
            <ul>
              <li><strong>Personal Identifiable Information:</strong> Your name, email address, phone number, and physical billing address.</li>
              <li><strong>Verification Details:</strong> Government-issued identification documentation required for ownership verification and Unique Porting Code (UPC) generation in compliance with TRAI regulations.</li>
              <li><strong>Transaction Records:</strong> Details of orders, transactions, and coupon usage on our platform. (We do not store credit card or bank details directly; all payments are processed through encrypted payment gateway partners like Razorpay).</li>
            </ul>

            <h3>2. How We Use Your Information</h3>
            <p>
              We use the collected information for the following core purposes:
            </p>
            <ul>
              <li>To process and fulfill your orders, including coordinating number transfers and generating porting codes.</li>
              <li>To verify your identity and ensure the legal transfer of VIP number ownership.</li>
              <li>To authorize user logins via OTP and secure dashboard profiles.</li>
              <li>To respond to your inquiries, special number requests, and list-for-sale applications.</li>
              <li>To improve website performance, detect security anomalies, and customize your experience.</li>
            </ul>

            <h3>3. Data Sharing & Disclosures</h3>
            <p>
              We do not sell, trade, or rent your personal information to third parties. We only share information with:
            </p>
            <ul>
              <li><strong>Telecom Network Operators:</strong> To facilitate the activation, verification, or porting process of your purchased numbers.</li>
              <li><strong>Service Providers:</strong> Payment processors (e.g., Razorpay) and communication services (SMS/Email OTP verification providers) necessary to run our service.</li>
              <li><strong>Legal Compliance:</strong> When required by law, court order, or governmental authorities (such as TRAI or DOT) to prevent fraud or illegal activities.</li>
            </ul>

            <h3>4. Security of Your Data</h3>
            <p>
              We implement industry-standard encryption protocols (SSL/TLS) and secure database access control to protect your sensitive data from unauthorized access, alteration, or disclosure. However, please note that no method of electronic transmission or storage is 100% secure.
            </p>

            <h3>5. Cookies Policy</h3>
            <p>
              Our website uses cookies to enhance your browsing experience. Cookies help us remember items in your cart, store session tokens, and analyze web traffic patterns to improve our layout. You can disable cookies in your browser settings, but some features of our site may not function properly.
            </p>

            <h3>6. Your Rights & Choices</h3>
            <p>
              You have the right to request access to the personal data we hold about you, request corrections to any inaccuracies, or ask for the deletion of your account and personal details (subject to compliance with telecom auditing guidelines).
            </p>

            <h3>7. Contact Us</h3>
            <p>
              If you have any questions or concerns regarding this Privacy Policy, please contact our support team or visit us at our Bathinda office:
            </p>
            <address>
              <strong>VIP NUMBER GARAGE</strong><br />
              Hathi Mandir Street,<br />
              Near Fire Brigade Station,<br />
              Bathinda, Punjab - 151001<br />
              India<br />
              Email: support@vipnumbergarage.com<br />
              Phone: +91 98555-98544, +91 76900-00070
            </address>
          </div>
        </div>
      </section>
    </div>
  );
};

export default PrivacyPolicy;
