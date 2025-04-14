'use client';

import { useState } from 'react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search } from 'lucide-react';

const faqs = [
  {
    id: 'item-1',
    question: 'How do I track my order?',
    answer: 'You can track your order by logging into your account and navigating to the "My Orders" section. From there, click on the specific order you want to track and you\'ll see its current status and tracking information if available.'
  },
  {
    id: 'item-2',
    question: 'What is your return policy?',
    answer: 'We offer a 30-day return policy for most items. Products must be unused, in their original packaging, and in the same condition that you received them. To start a return, visit the "My Orders" section in your account or contact our customer support team.'
  },
  {
    id: 'item-3',
    question: 'How long does shipping take?',
    answer: 'Standard shipping typically takes 3-5 business days within the continental United States. Express shipping options are available at checkout for 1-2 business day delivery. International shipping times vary by location and can take 7-14 business days.'
  },
  {
    id: 'item-4',
    question: 'Do you offer gift wrapping?',
    answer: 'Yes! We offer premium gift wrapping services for all our products. You can select this option during checkout for a small additional fee. You can also include a personalized message with your gift.'
  },
  {
    id: 'item-5',
    question: 'Can I change or cancel my order?',
    answer: 'You can change or cancel your order within 1 hour of placing it. Please contact our customer service team immediately if you need to make changes. Once an order has entered the processing stage, we cannot guarantee that changes or cancellations can be accommodated.'
  },
  {
    id: 'item-6',
    question: 'Do you offer international shipping?',
    answer: 'Yes, we ship to most international locations. Shipping costs and delivery times vary by country. Please note that international orders may be subject to customs fees and import taxes, which are the responsibility of the recipient.'
  },
  {
    id: 'item-7',
    question: 'Are gift cards refundable?',
    answer: 'Gift cards are non-refundable but never expire. They can be used for any purchase on our website and can be combined with other payment methods during checkout.'
  },
  {
    id: 'item-8',
    question: 'How can I contact customer support?',
    answer: 'Our customer support team is available Monday-Friday, 9am-6pm EST. You can reach us via email at support@giftorium.com, through our contact form on the website, or by phone at (555) 123-4567.'
  }
];

export default function FAQPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredFaqs, setFilteredFaqs] = useState(faqs);

  const handleSearch = () => {
    if (!searchTerm.trim()) {
      setFilteredFaqs(faqs);
      return;
    }
    
    const filtered = faqs.filter(
      faq => 
        faq.question.toLowerCase().includes(searchTerm.toLowerCase()) || 
        faq.answer.toLowerCase().includes(searchTerm.toLowerCase())
    );
    
    setFilteredFaqs(filtered);
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-center mb-8">Frequently Asked Questions</h1>
      
      <div className="max-w-xl mx-auto mb-12">
        <div className="flex gap-2">
          <Input
            type="text"
            placeholder="Search for questions..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1"
          />
          <Button onClick={handleSearch}>
            <Search className="h-4 w-4 mr-2" />
            Search
          </Button>
        </div>
      </div>
      
      <div className="max-w-3xl mx-auto">
        {filteredFaqs.length > 0 ? (
          <Accordion type="single" collapsible className="space-y-4">
            {filteredFaqs.map((faq) => (
              <AccordionItem key={faq.id} value={faq.id} className="border border-gray-200 rounded-lg px-4">
                <AccordionTrigger className="text-left font-medium py-4">{faq.question}</AccordionTrigger>
                <AccordionContent className="pb-4 text-gray-600">
                  <p>{faq.answer}</p>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        ) : (
          <div className="text-center py-12 bg-gray-50 rounded-lg">
            <p className="text-gray-500">No FAQs match your search. Please try a different term.</p>
          </div>
        )}
        
        <div className="mt-12 p-6 bg-gray-50 rounded-lg text-center">
          <h3 className="text-xl font-bold mb-2">Still have questions?</h3>
          <p className="text-gray-600 mb-4">Our customer support team is ready to help you</p>
          <Button asChild>
            <a href="/contact">Contact Us</a>
          </Button>
        </div>
      </div>
    </div>
  );
}