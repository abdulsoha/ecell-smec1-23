import { useEffect, useRef, useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

const FAQ = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [expandedFAQ, setExpandedFAQ] = useState<number | null>(null);
  const sectionRef = useRef<HTMLDivElement>(null);

  const toggleFAQ = (index: number) => {
    setExpandedFAQ(expandedFAQ === index ? null : index);
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const faqs = [
    {
      question: "What is E-Cell SMEC and what does it do?",
      answer: "E-Cell SMEC (Entrepreneurship Cell of St. Martin's Engineering College) is a student-driven organization that fosters innovation and entrepreneurial mindset among students. We organize events, workshops, mentorship programs, and provide resources to help students transform their ideas into viable startups."
    },
    {
      question: "How can I join E-Cell SMEC?",
      answer: "You can join E-Cell SMEC by attending our recruitment drives, participating in our events, or reaching out to us through our contact form. We welcome students from all departments who are passionate about entrepreneurship and innovation."
    },
    {
      question: "Do I need to have a business idea to join E-Cell?",
      answer: "Not at all! You don't need to have a business idea to join E-Cell SMEC. We welcome anyone interested in entrepreneurship, whether you have an idea or just want to learn about the startup ecosystem. Our programs will help you develop ideas and skills."
    },
    {
      question: "What kind of events and programs does E-Cell organize?",
      answer: "We organize various events including startup pitch competitions, workshops on business development, guest lectures by successful entrepreneurs, networking sessions, idea validation programs, and mentorship sessions. Check our upcoming events section for the latest activities."
    },
    {
      question: "Can E-Cell help me with funding for my startup idea?",
      answer: "While E-Cell SMEC doesn't directly provide funding, we guide students on various funding opportunities including government schemes, angel investors, venture capital, and startup competitions. We also help you prepare compelling pitches for potential investors."
    }
  ];

  return (
    <section id="faq" ref={sectionRef} className="py-20 bg-background relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-20 right-20 w-64 h-64 rounded-full bg-primary/20"></div>
        <div className="absolute bottom-20 left-20 w-48 h-48 rounded-full bg-primary/10"></div>
      </div>

      <div className="max-w-4xl mx-auto px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16">
          <h2 className={`text-4xl md:text-6xl font-bold text-foreground mb-6 transition-all duration-1000 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}>
            Frequently Asked <span className="text-primary">Questions</span>
          </h2>
          <p className={`text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed transition-all duration-1000 delay-200 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}>
            Find answers to common questions about E-Cell SMEC and our programs.
          </p>
        </div>

        <div className="space-y-4 mb-12">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className={`p-6 rounded-2xl bg-card/80 border border-primary/10 hover:border-primary/30 transition-all duration-500 ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}
              style={{ transitionDelay: `${400 + index * 100}ms` }}
            >
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full flex items-center justify-between text-left"
              >
                <h3 className="text-lg font-bold text-foreground pr-4">{faq.question}</h3>
                {expandedFAQ === index ? (
                  <ChevronUp className="w-5 h-5 text-primary flex-shrink-0" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-primary flex-shrink-0" />
                )}
              </button>
              
              <div className={`overflow-hidden transition-all duration-500 ${
                expandedFAQ === index ? 'max-h-96 opacity-100 mt-4' : 'max-h-0 opacity-0'
              }`}>
                <p className="text-muted-foreground leading-relaxed">{faq.answer}</p>
              </div>
            </div>
          ))}
        </div>

        <div className={`text-center p-6 rounded-2xl bg-primary/5 border border-primary/20 transition-all duration-1000 delay-1000 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}>
          <p className="text-muted-foreground">
            If your question or doubt is not listed, please drop a message in Get in Touch and our team will assist you.
          </p>
        </div>
      </div>
    </section>
  );
};

export default FAQ;