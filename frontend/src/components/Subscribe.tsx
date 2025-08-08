import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";

interface SubscribeFormData {
  name: string;
  email: string;
}

const Subscribe = () => {
  const [isSubscribed, setIsSubscribed] = useState(false);
  const { register, handleSubmit, formState: { errors, isValid }, reset, watch } = useForm<SubscribeFormData>({
    mode: 'onChange'
  });

  // Watch form fields for validation
  const watchAllFields = watch();
  const isFormComplete = isValid && watchAllFields.name && watchAllFields.email;

  const onSubmit = async (data: SubscribeFormData) => {
    try {
      setIsSubscribed(true);
      
      // Store subscription data in Supabase (you can create a subscribers table)
      console.log('Subscription data:', data);

      // Send welcome email
      try {
        await supabase.functions.invoke('send-subscription-welcome', {
          body: {
            name: data.name,
            email: data.email,
            timestamp: new Date().toISOString()
          }
        });
        console.log('Welcome email sent to:', data.email);
      } catch (emailError) {
        console.error('Failed to send welcome email:', emailError);
        // Don't fail the subscription if email fails
      }

      toast({
        title: "Subscribed successfully!",
        description: "Check your email for a welcome message. We'll keep you updated!",
      });
      reset();
      
      // Reset button state after 3 seconds
      setTimeout(() => {
        setIsSubscribed(false);
      }, 3000);
    } catch (error) {
      console.error('Subscription error:', error);
      toast({
        title: "Subscription failed",
        description: "Please try again later.",
        variant: "destructive",
      });
      setIsSubscribed(false);
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
          disabled={isSubscribed || !isFormComplete}
        >
          {isSubscribed ? "Subscribed" : "Subscribe"}
        </Button>
      </form>
    </div>
  );
};

export default Subscribe;