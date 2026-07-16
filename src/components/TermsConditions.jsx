import React from 'react';
import './TermsConditions.css';

const TermsConditions = () => {
  return (
    <div className="legal-view-container">
      <section className="legal-section">
        <div className="section-title">
          <h2>Terms & Conditions</h2>
          <div className="title-underline"></div>
        </div>

        <div className="legal-card">
          <p className="last-updated">Last Updated: June 2026</p>

          <div className="legal-content">
            <p>
              Welcome to <strong>VipNumberGarage</strong>. By accessing our website and utilizing our services, you agree to comply with and be bound by the following Terms and Conditions. Please read them carefully.
            </p>

            <h3>1. General Terms</h3>
            <p>
              VipNumberGarage provides an online marketplace and booking platform for premium, luxury, and VIP mobile numbers. These terms apply to all buyers, sellers, and visitors who access or use our services.
            </p>

            <h3>2. Purchase and Porting Process</h3>
            <p>
              The purchase and transfer of VIP mobile numbers are subject to telecom regulation guidelines:
            </p>
            <ul>
              <li><strong>KYC Verification:</strong> Buyers are required to submit valid government identity proof to complete ownership verification prior to code delivery.</li>
              <li><strong>UPC Code Delivery:</strong> Once the payment is verified, we will generate and deliver the Unique Porting Code (UPC) and transfer documentation (NOC) within 24 to 48 business hours.</li>
              <li><strong>Porting Responsibility:</strong> The buyer is responsible for submitting the UPC to their preferred telecom operator to port and activate the number. The UPC is valid for 4 days (or as per active TRAI guidelines). Porting must be initiated by the buyer within this timeframe. We are not responsible for expired UPC codes due to buyer delay.</li>
            </ul>

            <h3>3. Listing & Selling VIP Numbers</h3>
            <p>
              Sellers who submit numbers for listing on VipNumberGarage agree to the following:
            </p>
            <ul>
              <li>You warrant that you are the legal and rightful owner of the mobile number being listed.</li>
              <li>The listed number must be active, in good standing with the carrier, and free from any outstanding bills or legal disputes.</li>
              <li>We reserve the right to verify, reject, or remove any listing at our sole discretion.</li>
              <li>Upon sale, you agree to provide the UPC promptly to facilitate the transfer of the number.</li>
            </ul>

            <h3>4. Pricing, Payments & Refunds</h3>
            <p>
              * All prices listed on the website are in Indian Rupees (INR) and are subject to change without notice.<br />
              * Payments must be made in full through our integrated Razorpay payment gateway before any code delivery is initiated.<br />
              * <strong>Refund Policy:</strong> Due to the unique nature of VIP telecom assets, all successful purchases are final and non-refundable once the UPC is generated and delivered. Refunds will only be initiated if we are unable to deliver the UPC or transfer document within 7 business days from the payment verification date.
            </p>

            <h3>5. User Registration & Security</h3>
            <p>
              To purchase or list numbers, you may need to register using your mobile number and authenticate via OTP. You are responsible for keeping your login credentials confidential and are fully responsible for all activities that occur under your account.
            </p>

            <h3>6. Prohibited Actions</h3>
            <p>
              Users are strictly prohibited from:
            </p>
            <ul>
              <li>Listing numbers they do not legally own or authorize to transfer.</li>
              <li>Using fraudulent payment details or engaging in malicious activities on the website.</li>
              <li>Attempting to bypass our system to conduct transactions directly with buyers/sellers discovered on the platform.</li>
              <li>Attempting to bypass our system to conduct transactions directly with buyers/sellers discovered on the platform.</li>
            </ul>

            <h3>7. Limitation of Liability</h3>
            <p>
              VipNumberGarage is not liable for any network operator porting delays, carrier signal issues, or network terminations initiated by telecom operators. We serve as a transfer coordinator and guarantee legal transfer code delivery, but standard network operations are governed by the telecom providers.
            </p>

            <h3>8. Dispute Resolution & Jurisdiction</h3>
            <p>
              These terms shall be governed by and construed in accordance with the laws of India. Any legal actions or disputes arising from transactions on this platform shall be subject to the exclusive jurisdiction of the courts in <strong>Bathinda, Punjab</strong>.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default TermsConditions;
