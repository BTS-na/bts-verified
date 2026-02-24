import { Star, Quote, Heart } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const testimonials = [
  {
    name: "Sarah M.",
    location: "Toronto",
    text: "Got Floor B5 tickets for face value! Avoided scalpers charging $900+. Thank you fellow ARMY! 💜",
    rating: 5,
    date: "2 days ago",
  },
  {
    name: "Jessica K.",
    location: "Los Angeles",
    text: "The transfer was so smooth. Got my tickets within hours of paying. Legit seller, would recommend!",
    rating: 5,
    date: "1 week ago",
  },
  {
    name: "Michelle T.",
    location: "Tampa",
    text: "I almost gave up on seeing BTS because of crazy resale prices. Found this and saved $400!",
    rating: 5,
    date: "2 weeks ago",
  },
];

const TestimonialsSection = () => {
  return (
    <section className="py-8">
      {/* Header */}
      <div className="flex items-center gap-2 mb-5">
        <Quote className="h-5 w-5 text-primary" />
        <h2 className="text-lg font-bold text-foreground">What ARMY Says</h2>
        <div className="flex items-center gap-0.5 ml-auto">
          {[1, 2, 3, 4, 5].map((star) => (
            <Star key={star} className="h-4 w-4 text-yellow-500 fill-yellow-500" />
          ))}
        </div>
        <span className="text-xs text-muted-foreground">5.0</span>
      </div>

      {/* Testimonial Cards */}
      <div className="space-y-3">
        {testimonials.map((t, i) => (
          <Card key={i} className="border-0 shadow-sm bg-gradient-to-r from-purple-50/50 to-transparent">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                {/* Avatar */}
                <div className="flex-shrink-0 w-10 h-10 rounded-full gradient-purple flex items-center justify-center text-white font-bold text-sm">
                  {t.name.charAt(0)}
                </div>

                <div className="flex-1 min-w-0">
                  {/* Name & Rating */}
                  <div className="flex items-center justify-between mb-1">
                    <div>
                      <p className="text-sm font-semibold text-foreground">{t.name}</p>
                      <p className="text-[10px] text-muted-foreground">{t.location} • {t.date}</p>
                    </div>
                    <div className="flex items-center gap-0.5">
                      {[...Array(t.rating)].map((_, j) => (
                        <Star key={j} className="h-3 w-3 text-yellow-500 fill-yellow-500" />
                      ))}
                    </div>
                  </div>

                  {/* Review Text */}
                  <p className="text-sm text-foreground leading-relaxed">
                    "{t.text}"
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Stats */}
      <div className="mt-5 grid grid-cols-3 gap-3">
        <div className="bg-secondary/50 rounded-xl p-3 text-center">
          <p className="text-xl font-extrabold text-primary">200+</p>
          <p className="text-[10px] text-muted-foreground">Happy Fans</p>
        </div>
        <div className="bg-secondary/50 rounded-xl p-3 text-center">
          <p className="text-xl font-extrabold text-primary">$85K+</p>
          <p className="text-[10px] text-muted-foreground">Saved vs Scalpers</p>
        </div>
        <div className="bg-secondary/50 rounded-xl p-3 text-center">
          <div className="flex items-center justify-center gap-1">
            <Heart className="h-5 w-5 text-primary fill-primary" />
          </div>
          <p className="text-[10px] text-muted-foreground">ARMY Trusted</p>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
