import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import emailjs from '@emailjs/browser';

interface SubscribeFormData {
  name: string;
  email: string;
}

const Subscribe = () => {
  const [isSubscribed, setIsSubscribed] = useState(false);
  const { register, handleSubmit, formState: { errors }, reset } = useForm<SubscribeFormData>();

  const onSubmit = async (data: SubscribeFormData) => {
    try {
      // Send welcome email to subscriber
      const templateParams = {
        subscriber_name: data.name,
        subscriber_email: data.email,
        to_email: data.email,
        from_name: 'E-Cell SMEC',
        message: `Hi ${data.name}, 👋

Welcome aboard!

We're thrilled to have you as the newest member of our E-Cell SMEC community. 🚀 Your subscription means you'll now be the first to know about our upcoming events, startup opportunities, workshops, and all things entrepreneurial!

Whether you're a budding entrepreneur, an innovator, or someone curious about the startup world – you're in the right place. 🙌

Keep an eye on your inbox for exciting updates and exclusive invites coming your way soon.

Meanwhile, feel free to check out our past events and initiatives on our website.

Let's build the future,  
Team E-Cell SMEC`
      };

      await emailjs.send(
        'service_ecell_smec', // You'll need to set up EmailJS service
        'template_welcome', // You'll need to create this template
        templateParams,
        'your_public_key' // You'll need to add your public key
      );

      setIsSubscribed(true);
      toast.success("Subscribed successfully!");
      reset();
      
      // Reset button state after 3 seconds
      setTimeout(() => {
        setIsSubscribed(false);
      }, 3000);
    } catch (error) {
      console.error('Subscription error:', error);
      toast.error("Subscription failed. Please try again.");
    }
  };

  return (
    <div className="bg-primary/5 rounded-2xl p-8 border border-primary/20">
      <h3 className="text-2xl font-bold text-foreground mb-4 text-center">
        Stay Updated
      </h3>
      <p className="text-muted-foreground mb-6 text-center">
        Subscribe to get the latest updates on events, workshops, and startup opportunities.
      </p>
      
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <input
            type="text"
            placeholder="Your Name"
            className="w-full px-4 py-3 rounded-lg border border-primary/20 bg-background/50 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all"
            {...register("name", { required: "Name is required" })}
          />
          {errors.name && (
            <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
          )}
        </div>
        
        <div>
          <input
            type="email"
            placeholder="Your Email"
            className="w-full px-4 py-3 rounded-lg border border-primary/20 bg-background/50 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all"
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
        
        <Button 
          type="submit" 
          variant="outline" 
          size="lg" 
          className="w-full"
          disabled={isSubscribed}
        >
          {isSubscribed ? "Subscribed" : "Subscribe"}
        </Button>
      </form>
    </div>
  );
};

export default Subscribe;