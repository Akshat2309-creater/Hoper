import { Button } from "@/components/ui/button";
import { ArrowRight, Mail, Phone, MapPin } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const CTA = () => {
  const navigate = useNavigate();
  const [showContactDialog, setShowContactDialog] = useState(false);
  return (
    <section id="contact" className="py-12 sm:py-16 md:py-20 px-4 bg-secondary">
      <div className="container mx-auto max-w-6xl text-center">
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-secondary-foreground mb-4 sm:mb-6 px-4">
          Ready to Take the First Step?
        </h2>
        <p className="text-base sm:text-lg md:text-xl text-secondary-foreground/90 mb-6 sm:mb-8 max-w-2xl mx-auto px-4">
          Join thousands of others who have found hope, support, and healing through our community. Your journey to better mental health starts here.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center px-4">
          <Button 
            size="lg" 
            className="text-base sm:text-lg px-6 sm:px-8 py-5 sm:py-6 w-full sm:w-auto active:scale-95 transition-transform" 
            onClick={() => navigate('/chat')}
          >
            Get Started Today <ArrowRight className="ml-2 w-4 h-4 sm:w-5 sm:h-5" />
          </Button>
          <Button 
            size="lg" 
            variant="navbar" 
            className="text-base sm:text-lg px-6 sm:px-8 py-5 sm:py-6 w-full sm:w-auto active:scale-95 transition-transform"
            onClick={() => setShowContactDialog(true)}
          >
            Contact Us
          </Button>
        </div>
        {/* Contact Dialog */}
        <Dialog open={showContactDialog} onOpenChange={setShowContactDialog}>
          <DialogContent className="mx-4 w-[calc(100vw-2rem)] sm:w-auto sm:max-w-lg rounded-2xl p-6">
            <DialogHeader>
              <DialogTitle className="text-xl sm:text-2xl font-bold text-deep-purple">Contact Us</DialogTitle>
              <DialogDescription className="text-sm sm:text-base text-charcoal-gray">
                Choose how you'd like to get in touch with us
              </DialogDescription>
            </DialogHeader>
            <div className="flex flex-col gap-3 sm:gap-4 py-3 sm:py-4">
              <a href="mailto:hoperthechatbot@gmail.com" className="flex w-full items-center gap-3 sm:gap-4 p-3 sm:p-4 bg-soft-lavender rounded-xl hover:bg-soft-lavender/80 transition-all border-2 border-deep-purple/20 hover:border-golden-yellow active:scale-95">
                <div className="bg-deep-purple p-2 sm:p-3 rounded-full">
                  <Mail className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-deep-purple text-sm sm:text-base">Email Us</h4>
                  <p className="text-xs sm:text-sm text-charcoal-gray break-words">hoperthechatbot@gmail.com</p>
                </div>
              </a>
              <a href="tel:+919910498377" className="flex w-full items-center gap-3 sm:gap-4 p-3 sm:p-4 bg-soft-lavender rounded-xl hover:bg-soft-lavender/80 transition-all border-2 border-deep-purple/20 hover:border-golden-yellow active:scale-95">
                <div className="bg-deep-purple p-2 sm:p-3 rounded-full">
                  <Phone className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-deep-purple text-sm sm:text-base">Call Us</h4>
                  <p className="text-xs sm:text-sm text-charcoal-gray">+91 99104 98377</p>
                </div>
              </a>
              <a
                href="https://www.google.com/maps/search/KCC+INSTITUTE+OF+TECHNOLOGY+%26+MANAGEMENT,+2C,+Vashishth+Rd,+Knowledge+Park+III,+Greater+Noida,+Uttar+Pradesh+201310"
                target="_blank"
                rel="noopener noreferrer"
                className="flex w-full items-center gap-3 sm:gap-4 p-3 sm:p-4 bg-soft-lavender rounded-xl hover:bg-soft-lavender/80 transition-all border-2 border-deep-purple/20 hover:border-golden-yellow active:scale-95"
              >
                <div className="bg-deep-purple p-2 sm:p-3 rounded-full">
                  <MapPin className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-deep-purple text-sm sm:text-base">Visit Us</h4>
                  <p className="text-xs sm:text-sm text-charcoal-gray break-words">KCC INSTITUTE OF TECHNOLOGY & MANAGEMENT, 2C, Vashishth Rd, Knowledge Park III, Greater Noida, Uttar Pradesh 201310</p>
                </div>
              </a>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </section>
  );
};

export default CTA;
