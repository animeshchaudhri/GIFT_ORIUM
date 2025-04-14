'use client';

import { Card } from '@/components/ui/card';

export default function TermsPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-center mb-8">Terms & Conditions</h1>
      
      <Card className="max-w-4xl mx-auto p-6 mb-8">
        <div className="prose max-w-none">
          <h2 className="text-xl font-semibold mb-4">1. Introduction</h2>
          <p className="mb-4">
            Welcome to Gift Orium. These Terms & Conditions govern your use of our website and the services we offer. 
            By accessing or using our website, you agree to be bound by these Terms. If you do not agree with any part of these terms, 
            please do not use our website.
          </p>
          
          <h2 className="text-xl font-semibold mb-4">2. Account Registration</h2>
          <p className="mb-4">
            To access certain features of our website, you may need to register for an account. You agree to provide accurate and complete
            information when creating your account and to update such information to keep it accurate and complete. You are responsible
            for maintaining the confidentiality of your account credentials and for all activities that occur under your account.
          </p>
          
          <h2 className="text-xl font-semibold mb-4">3. Product Information</h2>
          <p className="mb-4">
            We strive to provide accurate product descriptions, images, and pricing on our website. However, we do not warrant that 
            product descriptions or other content is accurate, complete, reliable, current, or error-free. If a product offered on our website
            is not as described, your sole remedy is to return it in unused condition.
          </p>
          
          <h2 className="text-xl font-semibold mb-4">4. Pricing and Payment</h2>
          <p className="mb-4">
            All prices listed on our website are in USD unless otherwise specified. We reserve the right to change prices at any time.
            Payment must be made at the time of order placement. We accept major credit cards, debit cards, and other payment methods
            as shown during checkout.
          </p>
          
          <h2 className="text-xl font-semibold mb-4">5. Shipping and Delivery</h2>
          <p className="mb-4">
            Shipping times and costs are estimated and may vary based on location and other factors. Gift Orium is not responsible for 
            delays in delivery due to customs processing, weather conditions, or other circumstances beyond our control.
          </p>
          
          <h2 className="text-xl font-semibold mb-4">6. Returns and Refunds</h2>
          <p className="mb-4">
            You may return most new, unopened items within 30 days of delivery for a full refund. We'll also pay the return shipping costs if the
            return is a result of our error. Custom or personalized items cannot be returned unless they arrive damaged or defective.
          </p>
          
          <h2 className="text-xl font-semibold mb-4">7. Intellectual Property</h2>
          <p className="mb-4">
            All content on this website, including text, graphics, logos, images, and software, is the property of Gift Orium or its content suppliers
            and is protected by international copyright laws. Unauthorized use of this content may violate copyright, trademark, and other laws.
          </p>
          
          <h2 className="text-xl font-semibold mb-4">8. User Content</h2>
          <p className="mb-4">
            By submitting reviews, comments, or other content to our website, you grant Gift Orium a non-exclusive, royalty-free, perpetual right
            to use, reproduce, modify, adapt, publish, and display such content on our website and in our marketing materials.
          </p>
          
          <h2 className="text-xl font-semibold mb-4">9. Limitation of Liability</h2>
          <p className="mb-4">
            Gift Orium will not be liable for any indirect, incidental, special, consequential or punitive damages, or any loss of profits or revenues,
            whether incurred directly or indirectly, or any loss of data, use, goodwill, or other intangible losses resulting from your access to or use of our website.
          </p>
          
          <h2 className="text-xl font-semibold mb-4">10. Changes to These Terms</h2>
          <p className="mb-4">
            We reserve the right to update or modify these Terms & Conditions at any time without prior notice. Your continued use of our website
            following any changes constitutes your acceptance of the revised Terms.
          </p>
          
          <h2 className="text-xl font-semibold mb-4">11. Contact Information</h2>
          <p className="mb-4">
            If you have any questions about these Terms & Conditions, please contact us at legal@giftorium.com.
          </p>
          
          <p className="mt-8 text-sm text-gray-500">
            Last updated: April 6, 2025
          </p>
        </div>
      </Card>
    </div>
  );
}