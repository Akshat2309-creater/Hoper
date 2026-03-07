import { MessageCircle, BookOpen, Calendar, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";

const Services = () => {
  const services = [
    {
      icon: MessageCircle,
      title: "Peer Support",
      description: "Connect with trained volunteers who understand what you're going through and can offer compassionate support.",
      bgColor: "bg-lavender",
    },
    {
      icon: BookOpen,
      title: "Resources & Guides",
      description: "Access comprehensive guides, articles, and tools to help you understand and manage your mental health.",
      bgColor: "bg-mint",
    },
    {
      icon: Calendar,
      title: "Workshops & Events",
      description: "Join interactive workshops, webinars, and community events focused on mental wellness and self-care.",
      bgColor: "bg-sky",
    },
    {
      icon: Phone,
      title: "Crisis Support",
      description: "24/7 access to crisis helplines and emergency resources when you need immediate assistance.",
      bgColor: "bg-primary",
    },
  ];

  return (
    <section id="work" className="py-20 px-4 bg-gradient-to-b from-background to-lavender">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            How We <span className="text-secondary">Help</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Discover the various ways we support mental health awareness and provide assistance to those in need.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {services.map((service) => (
            <div key={service.title} className="bg-card rounded-lg p-8 shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <div className={`${service.bgColor} w-14 h-14 rounded-lg flex items-center justify-center mb-6`}>
                <service.icon className="w-7 h-7 text-foreground" />
              </div>
              <h3 className="text-2xl font-bold text-foreground mb-4">{service.title}</h3>
              <p className="text-muted-foreground leading-relaxed mb-6">{service.description}</p>
              <Button variant="ghost" className="text-secondary hover:text-secondary">
                Learn More →
              </Button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;
