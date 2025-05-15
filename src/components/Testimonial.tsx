import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Star, Shield, Globe, Zap } from 'lucide-react';

// Define types for our testimonials
interface Testimonial {
  id: number;
  name: string;
  role: string;
  company: string;
  avatar: string;
  content: string;
  rating: number;
}

const TestimonialsPage: React.FC = () => {
  // Sample testimonial data
  const testimonials: Testimonial[] = [
    {
      id: 1,
      name: "Sarah Johnson",
      role: "CTO",
      company: "TechFlow Solutions",
      avatar: "./testimonial/becky-snider.png",
      content: "UptimeMonitor's decentralized node structure has completely transformed how we manage our web services. We've seen a 99.99% uptime since implementation, and the real-time alerts have saved us countless hours of potential downtime.",
      rating: 5
    },
    {
      id: 2,
      name: "Michael Chen",
      role: "Lead DevOps Engineer",
      company: "GlobalServe",
      avatar: "./testimonial/mark-erixon.png",
      content: "As someone managing infrastructure across multiple continents, I needed a monitoring solution that wouldn't fail when a single region goes down. UptimeMonitor's decentralized approach ensures we're alerted even when traditional monitoring systems would fail.",
      rating: 5
    },
    {
      id: 3,
      name: "Jessica Rodriguez",
      role: "Webmaster",
      company: "E-commerce Dynamics",
      avatar: "./testimonial/alicia-barker.png",
      content: "Our online store can't afford even minutes of downtime. UptimeMonitor has detected issues before they became critical failures multiple times. The distributed node network means we get accurate uptime measurements from various geographic locations.",
      rating: 5
    },
    {
      id: 4,
      name: "Aiden Kumar",
      role: "IT Director",
      company: "FinSecure Banking",
      avatar: "./testimonial/jim-bradley.png",
      content: "In the financial sector, reliability isn't just important—it's mandatory. UptimeMonitor gives us confidence that our customer-facing applications are constantly monitored from multiple vantage points. The detailed reporting helps with our compliance requirements too.",
      rating: 4
    },
    {
      id: 5,
      name: "Emily Watson",
      role: "Site Reliability Engineer",
      company: "StreamNow Media",
      avatar: "./testimonial/jessica-saunders.png",
      content: "We've tried numerous monitoring solutions, but UptimeMonitor stands out with its resilient architecture. The dashboard is intuitive, and the alerting system is remarkably fast. Our team's response time has improved by 40% since adopting this platform.",
      rating: 5
    }
  ];

  // State for featured testimonial carousel
  const [currentIndex, setCurrentIndex] = useState(0);

  // Navigation functions
  const goToPrevious = () => {
    const isFirstSlide = currentIndex === 0;
    const newIndex = isFirstSlide ? testimonials.length - 1 : currentIndex - 1;
    setCurrentIndex(newIndex);
  };

  const goToNext = () => {
    const isLastSlide = currentIndex === testimonials.length - 1;
    const newIndex = isLastSlide ? 0 : currentIndex + 1;
    setCurrentIndex(newIndex);
  };

  // Render stars based on rating
  const renderStars = (rating: number) => {
    return Array(5).fill(0).map((_, i) => (
      <Star 
        key={i} 
        className={`h-5 w-5 ${i < rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-400'}`} 
      />
    ));
  };

  return (
    <div className="bg-gray-950 min-h-screen text-white">
      {/* Hero section */}
      <div className="container mx-auto py-16 px-4 md:px-6">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
            Trusted by <span className="text-blue-500">Thousands</span> of Businesses
          </h1>
          <p className="text-gray-300 text-lg md:text-xl max-w-3xl mx-auto">
            See why companies worldwide rely on UptimeMonitor's decentralized network for their critical monitoring needs.
          </p>
        </div>

        {/* Featured testimonial carousel */}
        <div className="relative max-w-5xl mx-auto bg-gray-900 rounded-xl p-6 md:p-10 shadow-2xl mb-24">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-blue-700 rounded-t-lg"></div>
          
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="relative">
              <div className="w-24 h-24 md:w-32 md:h-32 rounded-full overflow-hidden ring-4 ring-blue-500">
                <img 
                  src={testimonials[currentIndex].avatar} 
                  alt={testimonials[currentIndex].name} 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -bottom-2 -right-2 bg-blue-500 rounded-full p-2">
                <Shield className="h-6 w-6 text-white" />
              </div>
            </div>
            
            <div className="flex-1">
              <div className="flex items-center mb-4">
                {renderStars(testimonials[currentIndex].rating)}
              </div>
              
              <p className="text-gray-200 text-lg md:text-xl italic mb-6">
                "{testimonials[currentIndex].content}"
              </p>
              
              <div>
                <h4 className="text-xl font-semibold">{testimonials[currentIndex].name}</h4>
                <p className="text-blue-400">{testimonials[currentIndex].role} at {testimonials[currentIndex].company}</p>
              </div>
            </div>
          </div>
          
          {/* Navigation buttons */}
          <div className="flex justify-center mt-8 gap-4">
            <button 
              onClick={goToPrevious}
              className="bg-gray-800 hover:bg-blue-900 text-white p-3 rounded-full transition-all"
              aria-label="Previous testimonial"
            >
              <ChevronLeft className="h-6 w-6" />
            </button>
            <button 
              onClick={goToNext}
              className="bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-full transition-all"
              aria-label="Next testimonial"
            >
              <ChevronRight className="h-6 w-6" />
            </button>
          </div>
        </div>

        {/* Stats section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
          <div className="bg-gray-900 rounded-lg p-6 text-center">
            <div className="bg-blue-500/20 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <Globe className="h-8 w-8 text-blue-500" />
            </div>
            <h3 className="text-3xl font-bold text-white mb-2">150+</h3>
            <p className="text-gray-400">Countries Covered</p>
          </div>
          
          <div className="bg-gray-900 rounded-lg p-6 text-center">
            <div className="bg-blue-500/20 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <Zap className="h-8 w-8 text-blue-500" />
            </div>
            <h3 className="text-3xl font-bold text-white mb-2">99.995%</h3>
            <p className="text-gray-400">Average Uptime Improvement</p>
          </div>
          
          <div className="bg-gray-900 rounded-lg p-6 text-center">
            <div className="bg-blue-500/20 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <Shield className="h-8 w-8 text-blue-500" />
            </div>
            <h3 className="text-3xl font-bold text-white mb-2">5,000+</h3>
            <p className="text-gray-400">Happy Customers</p>
          </div>
        </div>

        {/* Testimonial grid */}
        <h2 className="text-3xl font-bold mb-8 text-center">What Our Customers Say</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {testimonials.map((testimonial) => (
            <div key={testimonial.id} className="bg-gray-900 border border-gray-800 rounded-lg p-6 hover:border-blue-500 transition-all">
              <div className="flex items-center mb-4">
                {renderStars(testimonial.rating)}
              </div>
              
              <p className="text-gray-300 mb-6">"{testimonial.content}"</p>
              
              <div className="flex items-center">
                <div className="mr-4">
                  <img 
                    src={testimonial.avatar} 
                    alt={testimonial.name} 
                    className="w-12 h-12 rounded-full"
                  />
                </div>
                <div>
                  <h4 className="font-semibold">{testimonial.name}</h4>
                  <p className="text-gray-400 text-sm">{testimonial.role}, {testimonial.company}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* CTA Section */}
        {/* <div className="bg-gradient-to-r from-blue-900 to-blue-700 rounded-xl p-8 md:p-12 text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">Ready to experience reliable monitoring?</h2>
          <p className="text-blue-100 mb-8 max-w-2xl mx-auto">
            Join thousands of businesses that trust UptimeMonitor's decentralized node structure for their critical website monitoring.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-white text-blue-900 font-semibold px-6 py-3 rounded-lg hover:bg-blue-50 transition-colors">
              Start Free Trial
            </button>
            <button className="bg-transparent border border-white text-white font-semibold px-6 py-3 rounded-lg hover:bg-blue-800/50 transition-colors">
              Schedule Demo
            </button>
          </div>
        </div> */}
      </div>
      
      {/* Footer */}
      {/* <footer className="border-t border-gray-800 py-8 mt-12">
        <div className="container mx-auto px-4 text-center text-gray-400">
          <p>© {new Date().getFullYear()} UptimeMonitor. All rights reserved.</p>
        </div>
      </footer> */}
    </div>
  );
};

export default TestimonialsPage;