import { useEffect, useRef, useState } from "react";
import { Calendar, Clock, Users, Lightbulb, ChevronDown, ChevronUp, X, CreditCard, Check, QrCode, Smartphone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import emailjs from '@emailjs/browser';
import { processUPIPayment, UPIPaymentData, createUPIUrl } from "@/utils/upiPayment";
import { storeRegistrationData, updatePaymentStatus } from "@/lib/supabase";
import QRCode from 'qrcode';

interface RegistrationFormData {
  name: string;
  email: string;
  phone: string;
  rollNumber: string;
  year: string;
}

const UpcomingEvents = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [expandedEvents, setExpandedEvents] = useState<number[]>([]);
  const [showRegistrationModal, setShowRegistrationModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<string>("");
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [showPaymentSection, setShowPaymentSection] = useState(false);
  const [registrationId, setRegistrationId] = useState<string>("");
  const [qrCodeUrl, setQrCodeUrl] = useState<string>("");
  const [showPaymentConfirmation, setShowPaymentConfirmation] = useState(false);
  const [showThankYou, setShowThankYou] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);
  const { register, handleSubmit, formState: { errors, isValid }, reset, watch } = useForm<RegistrationFormData>({
    mode: 'onChange'
  });

  // Watch all form fields to enable payment section when form is complete
  const watchAllFields = watch();

  const toggleEvent = (index: number) => {
    setExpandedEvents(prev => 
      prev.includes(index) 
        ? prev.filter(i => i !== index)
        : [index] // Only allow one month to be expanded at a time
    );
  };

  const openRegistration = (eventName: string) => {
    setSelectedEvent(eventName);
    setShowRegistrationModal(true);
  };


  const onSubmit = async (data: RegistrationFormData) => {
    try {
      setIsProcessingPayment(true);
      
      // Store registration data first
      const registrationData = await storeRegistrationData({
        name: data.name,
        email: data.email,
        phone: data.phone,
        roll_number: data.rollNumber,
        year: data.year,
        event_name: selectedEvent,
        payment_status: 'pending'
      });
      
      setRegistrationId(registrationData.id!);
      
      // Generate QR Code for UPI payment
      const paymentData: UPIPaymentData = {
        upiId: "9346787524@ibl",
        amount: "100",
        name: "E-Cell SMEC",
        note: `Registration for ${selectedEvent} - ${data.name}`
      };
      
      const upiUrl = createUPIUrl(paymentData);
      const qrDataUrl = await QRCode.toDataURL(upiUrl, {
        width: 256,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#FFFFFF'
        }
      });
      
      setQrCodeUrl(qrDataUrl);
      setShowPaymentConfirmation(true);
      
      // Send confirmation email
      const templateParams = {
        to_email: data.email,
        from_name: 'E-Cell SMEC',
        to_name: data.name,
        roll_number: data.rollNumber,
        event_name: selectedEvent,
        reply_to: 'ecell@smec.ac.in'
      };

      try {
        await emailjs.send(
          'service_ecell_smec', 
          'template_registration_confirmation', 
          templateParams,
          'your_public_key'
        );
        console.log('Confirmation email sent successfully');
      } catch (emailError) {
        console.error('Email send failed:', emailError);
      }
      
    } catch (error) {
      console.error('Registration error:', error);
      toast.error("Registration failed. Please try again.");
    } finally {
      setIsProcessingPayment(false);
    }
  };

  const handleAutoPayment = async () => {
    const paymentData: UPIPaymentData = {
      upiId: "9346787524@ibl",
      amount: "100",
      name: "E-Cell SMEC",
      note: `Registration for ${selectedEvent}`
    };

    const paymentResult = await processUPIPayment(paymentData);
    
    if (paymentResult.success) {
      toast.success("Payment app opened! Complete the payment to confirm registration.");
    } else if (paymentResult.fallback) {
      paymentResult.fallback();
      toast.info("Manual payment instructions provided. Complete payment and we'll confirm your registration.");
    }
  };

  const handlePaymentComplete = async () => {
    try {
      await updatePaymentStatus(registrationId, 'completed');
      setShowPaymentConfirmation(false);
      setShowThankYou(true);
      
      // Auto-hide thank you message after 10 seconds
      setTimeout(() => {
        setShowThankYou(false);
        closeRegistration();
      }, 10000);
      
    } catch (error) {
      console.error('Payment status update failed:', error);
      toast.error("Failed to confirm payment. Please contact support.");
    }
  };

  // Check if form is complete and valid for payment
  const isFormComplete = isValid && 
    watchAllFields.name && 
    watchAllFields.email && 
    watchAllFields.phone && 
    watchAllFields.rollNumber && 
    watchAllFields.year;

  // Show payment section when form is complete
  useEffect(() => {
    setShowPaymentSection(!!isFormComplete);
  }, [isFormComplete]);

  const closeRegistration = () => {
    setShowRegistrationModal(false);
    setSelectedEvent("");
    setShowPaymentSection(false);
    setShowPaymentConfirmation(false);
    setShowThankYou(false);
    setRegistrationId("");
    setQrCodeUrl("");
    reset();
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

  const events = [
    {
      month: "AUGUST 2025",
      theme: "Ignite the Spark",
      icon: <Lightbulb className="w-6 h-6" />,
      activities: [
        "Week 1: Welcome Post – Introduce E-Cell SMEC, vision & mission.",
        "Week 2: Team Introduction – Highlight core team with cool bios.",
        "Week 3: Throwback Reels – Past event memories & testimonials.",
        "Week 4: Startup Saturday Series – Reels/Posts about trending startups."
      ]
    },
    {
      month: "SEPTEMBER 2025",
      theme: "Ideate & Inspire",
      icon: <Users className="w-6 h-6" />,
      activities: [
        "Week 1: Startup Idea Challenge Announcement – Tease & hype post.",
        "Week 2: Knowledge Nuggets – Bite-sized posts on startup terms (MVP, Pivot, etc.)",
        "Week 3: Behind the Scenes – Preparations, teamwork glimpses.",
        "Week 4: Guest Speaker Clip – Snippet from an inspiring entrepreneur."
      ]
    },
    {
      month: "OCTOBER 2025",
      theme: "Build It",
      icon: <Clock className="w-6 h-6" />,
      activities: [
        "Week 1: Mini-Workshop Promo – Design, marketing, or biz model canvas.",
        "Week 2: Student Startup Spotlight – Local or SMEC-based founders.",
        "Week 3: Founder Friday – Quotes + photo from famous founders.",
        "Week 4: Infographic Post – Process of validating a startup idea."
      ]
    },
    {
      month: "NOVEMBER 2025",
      theme: "Pitch & Present",
      icon: <Calendar className="w-6 h-6" />,
      activities: [
        "Week 1: Pitching Basics Carousel – How to make a killer pitch.",
        "Week 2: Myth-Busting Posts – Startup myths vs facts.",
        "Week 3: Pitch Deck Contest – Announce + call for entries.",
        "Week 4: Reel Recap of Pitch Week – Highlights + bloopers."
      ]
    },
    {
      month: "DECEMBER 2025",
      theme: "Startup Culture Month",
      icon: <Users className="w-6 h-6" />,
      activities: [
        "Week 1: Ecosystem Map – Local startup hubs & incubators.",
        "Week 2: Book/Podcast Recommendations – Entrepreneur must-reads/listens.",
        "Week 3: Collab Content – Partner with other college cells.",
        "Week 4: Fun Polls & Memes – Chill & engage with your audience."
      ]
    },
    {
      month: "JANUARY 2026",
      theme: "New Year, New Ventures",
      icon: <Lightbulb className="w-6 h-6" />,
      activities: [
        "Week 1: Goal Setting Challenge – Encourage followers to share biz goals.",
        "Week 2: Trend Posts – 2026 startup trends, AI, Web3, etc.",
        "Week 3: AMA Stories – Let audience ask you questions.",
        "Week 4: Vision Board Posts – What E-Cell SMEC aims for this year."
      ]
    },
    {
      month: "FEBRUARY 2026",
      theme: "Execution Month",
      icon: <Clock className="w-6 h-6" />,
      activities: [
        "Week 1: Startup Toolkit Post – Top free tools for student founders.",
        "Week 2: Event/Bootcamp Teaser – Promo for upcoming major event.",
        "Week 3: Innovation Series – Share futuristic ideas or tech.",
        "Week 4: Campus Founder Interviews – Mini reels or Q&A."
      ]
    },
    {
      month: "MARCH 2026",
      theme: "National Exposure",
      icon: <Calendar className="w-6 h-6" />,
      activities: [
        "Week 1: IIT/IIM E-Cell SMEC Collabs – Shoutouts, collab content.",
        "Week 2: Startup India Awareness – Policies, programs, schemes.",
        "Week 3: Blog Post/Article – \"How SMEC is growing entrepreneurs.\"",
        "Week 4: Documentary-style Reel – Journey so far (montage style)."
      ]
    },
    {
      month: "APRIL 2026",
      theme: "Wrap-up & Reflect",
      icon: <Users className="w-6 h-6" />,
      activities: [
        "Week 1: Year in Review – Milestones achieved, events conducted.",
        "Week 2: Giveaway or Quiz Contest – For engagement.",
        "Week 3: Team Gratitude Post – Highlight efforts of volunteers.",
        "Week 4: Save the Date/What's Next – Tease for next year or summer plans."
      ]
    }
  ];

  return (
    <section id="upcoming-events" ref={sectionRef} className="py-20 bg-background relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-20 left-20 w-64 h-64 rounded-full bg-primary/20"></div>
        <div className="absolute bottom-20 right-20 w-48 h-48 rounded-full bg-primary/10"></div>
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16">
          <h2 className={`text-4xl md:text-6xl font-bold text-foreground mb-6 transition-all duration-1000 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}>
            Our <span className="text-primary">Upcoming Events</span>
          </h2>
          <p className={`text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed transition-all duration-1000 delay-200 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}>
            Join us on an exciting journey through our content calendar, designed to inspire, educate, and empower the next generation of entrepreneurs.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {events.map((event, index) => (
            <div
              key={index}
              className={`p-6 rounded-2xl bg-card border border-primary/10 hover:border-primary/30 transition-all duration-500 hover:scale-105 hover:shadow-lg hover:shadow-primary/10 ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}
              style={{ transitionDelay: `${400 + index * 100}ms` }}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <div className="text-primary mr-3">
                    {event.icon}
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-foreground">{event.month}</h3>
                    <p className="text-sm text-primary font-medium">"{event.theme}"</p>
                  </div>
                </div>
                <div className="ml-2">
                  {index === 0 ? (
                    <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                      Ongoing
                    </span>
                  ) : (
                    <span className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-xs font-medium">
                      Coming Soon
                    </span>
                  )}
                </div>
              </div>
              
              <div className="flex gap-2 mb-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => toggleEvent(index)}
                  className="flex-1 flex items-center justify-center"
                >
                  View Details
                  {expandedEvents.includes(index) ? (
                    <ChevronUp className="ml-2 w-4 h-4" />
                  ) : (
                    <ChevronDown className="ml-2 w-4 h-4" />
                  )}
                </Button>
                {index === 0 && (
                  <Button
                    variant="hero-primary"
                    size="sm"
                    onClick={() => openRegistration(event.month)}
                    className="flex-1"
                  >
                    Register
                  </Button>
                )}
              </div>
              
              <div className={`overflow-hidden transition-all duration-500 ${
                expandedEvents.includes(index) ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
              }`}>
                <ul className="space-y-3">
                  {event.activities.map((activity, actIndex) => (
                    <li key={actIndex} className="text-sm text-muted-foreground flex items-start">
                      <span className="w-2 h-2 bg-primary rounded-full mt-2 mr-3 flex-shrink-0"></span>
                      <span>{activity}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Registration Modal */}
      {showRegistrationModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-background rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-foreground">
                  Register for {selectedEvent}
                </h3>
                <button
                  onClick={closeRegistration}
                  className="text-muted-foreground hover:text-foreground"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 rounded-lg border border-primary/20 bg-card focus:outline-none focus:ring-2 focus:ring-primary/50"
                    placeholder="Your name"
                    {...register("name", { required: "Name is required" })}
                  />
                  {errors.name && (
                    <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
                  )}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    className="w-full px-3 py-2 rounded-lg border border-primary/20 bg-card focus:outline-none focus:ring-2 focus:ring-primary/50"
                    placeholder="your.email@example.com"
                    {...register("email", { 
                      required: "Email is required",
                      pattern: {
                        value: /^\S+@\S+$/i,
                        message: "Invalid email address"
                      }
                    })}
                  />
                  {errors.email && (
                    <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
                  )}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    className="w-full px-3 py-2 rounded-lg border border-primary/20 bg-card focus:outline-none focus:ring-2 focus:ring-primary/50"
                    placeholder="Enter your mobile number"
                    {...register("phone", { required: "Phone number is required" })}
                  />
                  {errors.phone && (
                    <p className="text-red-500 text-sm mt-1">{errors.phone.message}</p>
                  )}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Roll Number
                  </label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 rounded-lg border border-primary/20 bg-card focus:outline-none focus:ring-2 focus:ring-primary/50"
                    placeholder="Enter your roll number"
                    {...register("rollNumber", { 
                      required: "Roll Number is required"
                    })}
                  />
                  {errors.rollNumber && (
                    <p className="text-red-500 text-sm mt-1">{errors.rollNumber.message}</p>
                  )}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Year of Study
                  </label>
                  <select
                    className="w-full px-3 py-2 rounded-lg border border-primary/20 bg-card focus:outline-none focus:ring-2 focus:ring-primary/50"
                    {...register("year", { required: "Year is required" })}
                  >
                    <option value="">Select your year</option>
                    <option value="1st Year">1st Year</option>
                    <option value="2nd Year">2nd Year</option>
                    <option value="3rd Year">3rd Year</option>
                    <option value="4th Year">4th Year</option>
                  </select>
                  {errors.year && (
                    <p className="text-red-500 text-sm mt-1">{errors.year.message}</p>
                  )}
                </div>

                {/* Payment Section - Only shown when form is complete */}
                {showPaymentSection && (
                  <div className="mt-6 p-4 bg-primary/5 rounded-lg border border-primary/10">
                    <div className="flex items-center gap-2 mb-3">
                      <CreditCard className="w-5 h-5 text-primary" />
                      <h4 className="font-semibold text-foreground">Payment Required</h4>
                    </div>
                    <div className="text-sm text-muted-foreground mb-4">
                      <p className="flex items-center gap-2 mb-1">
                        <span className="w-2 h-2 bg-primary rounded-full"></span>
                        Registration Fee: ₹100
                      </p>
                      <p className="flex items-center gap-2 mb-1">
                        <span className="w-2 h-2 bg-primary rounded-full"></span>
                        UPI ID: 9346787524@ibl
                      </p>
                      <p className="flex items-center gap-2">
                        <span className="w-2 h-2 bg-primary rounded-full"></span>
                        Secure iOS & Android compatible payment
                      </p>
                    </div>
                  </div>
                )}

                <Button 
                  type="submit" 
                  variant="hero-primary" 
                  size="lg" 
                  className="w-full"
                  disabled={!showPaymentSection || isProcessingPayment}
                >
                  {isProcessingPayment ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                      Processing Payment...
                    </>
                  ) : showPaymentSection ? (
                    <>
                      <CreditCard className="w-4 h-4 mr-2" />
                      Complete Registration & Pay ₹100
                    </>
                  ) : (
                    <>
                      <Check className="w-4 h-4 mr-2" />
                      Fill Form to Enable Payment
                    </>
                  )}
                </Button>
                
                {!showPaymentSection && (
                  <p className="text-xs text-muted-foreground text-center mt-2">
                    Complete all fields above to proceed with payment
                  </p>
                )}
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Payment Confirmation Modal */}
      {showPaymentConfirmation && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-background rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 text-center">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-foreground">
                  Complete Payment
                </h3>
                <button
                  onClick={closeRegistration}
                  className="text-muted-foreground hover:text-foreground"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="mb-6">
                <div className="flex items-center justify-center mb-4">
                  <QrCode className="w-8 h-8 text-primary mr-2" />
                  <span className="text-lg font-semibold">Scan QR Code</span>
                </div>
                
                {qrCodeUrl && (
                  <div className="bg-white p-4 rounded-lg inline-block mb-4">
                    <img 
                      src={qrCodeUrl} 
                      alt="UPI Payment QR Code" 
                      className="w-48 h-48 mx-auto"
                    />
                  </div>
                )}
                
                <div className="text-sm text-muted-foreground mb-4">
                  <p className="mb-2">Scan with any UPI app:</p>
                  <p className="text-xs">GPay • PhonePe • Paytm • BHIM • Others</p>
                </div>

                <div className="bg-primary/5 rounded-lg p-4 mb-6">
                  <p className="text-sm text-foreground mb-2">
                    <strong>Amount:</strong> ₹100
                  </p>
                  <p className="text-sm text-foreground mb-2">
                    <strong>UPI ID:</strong> 9346787524@ibl
                  </p>
                  <p className="text-sm text-foreground">
                    <strong>Event:</strong> {selectedEvent}
                  </p>
                </div>

                <div className="flex flex-col gap-3">
                  <Button
                    onClick={handleAutoPayment}
                    variant="hero-primary"
                    size="lg"
                    className="w-full"
                  >
                    <Smartphone className="w-4 h-4 mr-2" />
                    Click Here for Auto Payment
                  </Button>
                  
                  <div className="text-xs text-muted-foreground">
                    OR scan the QR code above
                  </div>
                  
                  <Button
                    onClick={handlePaymentComplete}
                    variant="outline"
                    size="lg"
                    className="w-full mt-4"
                  >
                    <Check className="w-4 h-4 mr-2" />
                    I have completed the payment
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Thank You Banner */}
      {showThankYou && (
        <div className="fixed top-4 left-4 right-4 z-50">
          <div className="bg-green-100 border border-green-300 text-green-800 px-4 py-3 rounded-lg shadow-lg mx-auto max-w-2xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Check className="w-5 h-5 mr-2" />
                <span className="font-medium">
                  🎉 Thank you for registering! Your payment is confirmed. Welcome to E-Cell SMEC!
                </span>
              </div>
              <button
                onClick={() => setShowThankYou(false)}
                className="text-green-600 hover:text-green-800"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default UpcomingEvents;