"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ArrowRight,
  CheckCircle,
  Clock,
  DollarSign,
  FileText,
  Globe,
  Mail,
  MapPin,
  MessageSquare,
  Phone,
  Shield,
  Star,
  TrendingUp,
  Users,
  Zap,
} from "lucide-react";

export default function LandingPage() {
  const projects = [
    {
      title: "E-commerce Website Development",
      category: "Web Development",
      budget: "$2,500 - $5,000",
      bids: 12,
      timeLeft: "3 days left",
      skills: ["React", "Node.js", "MongoDB"],
    },
    {
      title: "Mobile App UI/UX Design",
      category: "Design",
      budget: "$800 - $1,500",
      bids: 8,
      timeLeft: "5 days left",
      skills: ["Figma", "UI/UX", "Mobile Design"],
    },
    {
      title: "Content Marketing Strategy",
      category: "Marketing",
      budget: "$1,000 - $2,000",
      bids: 15,
      timeLeft: "2 days left",
      skills: ["Content Strategy", "SEO", "Social Media"],
    },
  ];

  const benefits = {
    buyers: [
      {
        icon: Users,
        title: "Access Top Talent",
        description: "Connect with verified freelancers worldwide",
      },
      {
        icon: DollarSign,
        title: "Competitive Pricing",
        description: "Get the best value through competitive bidding",
      },
      {
        icon: Shield,
        title: "Secure Payments",
        description: "Protected transactions with milestone-based payments",
      },
      {
        icon: Clock,
        title: "Fast Delivery",
        description: "Set deadlines and track progress in real-time",
      },
    ],
    sellers: [
      {
        icon: FileText,
        title: "Quality Projects",
        description: "Access to high-value projects from serious buyers",
      },
      {
        icon: TrendingUp,
        title: "Grow Your Business",
        description: "Build your reputation and expand your client base",
      },
      {
        icon: MessageSquare,
        title: "Direct Communication",
        description: "Collaborate directly with clients seamlessly",
      },
      {
        icon: Star,
        title: "Build Your Brand",
        description: "Showcase your portfolio and earn reviews",
      },
    ],
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Navigation */}
      <nav className="border-b border-gray-700 bg-gray-900/95 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center">
                <Zap className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-white">BidConnect</span>
            </div>
            <div className="hidden md:flex items-center space-x-8">
              <a
                href="#how-it-works"
                className="text-gray-300 hover:text-white transition-colors"
              >
                How It Works
              </a>
              <a
                href="#benefits"
                className="text-gray-300 hover:text-white transition-colors"
              >
                Benefits
              </a>
              <a
                href="#projects"
                className="text-gray-300 hover:text-white transition-colors"
              >
                Projects
              </a>
              <Button
                variant="outline"
                className="border-gray-600 text-gray-300 hover:bg-gray-800 hover:text-white bg-transparent"
              >
                Sign In
              </Button>
              <Button
                onClick={() => {
                  window.location.href = "/login";
                }}
                className="bg-red-500 hover:bg-red-600 text-white"
              >
                Get Started
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative py-20 lg:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <Badge className="mb-6 bg-gray-800 text-gray-300 border-gray-700">
              🚀 Trusted by 50,000+ professionals worldwide
            </Badge>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
              Connecting Ambitious Buyers with Top Freelancers
            </h1>
            <p className="text-xl md:text-2xl text-gray-400 mb-8 max-w-3xl mx-auto leading-relaxed">
              The ultimate platform where buyers post projects and sellers
              compete to deliver exceptional results. Transparent bidding,
              secure payments, seamless collaboration.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button
                size="lg"
                className="bg-red-500 hover:bg-red-600 text-white px-8 py-4 text-lg"
              >
                Post Your First Project
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-gray-600 text-gray-300 hover:bg-gray-800 hover:text-white px-8 py-4 text-lg bg-transparent"
                onClick={() => {
                  window.location.href = "/projects";
                }}
              >
                Browse Projects
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section
        id="how-it-works"
        className="py-20 bg-gradient-to-b from-gray-900 to-black"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-4 text-white">
              How It Works
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Simple, transparent, and efficient. Get your project done in four
              easy steps.
            </p>
          </div>
          <div className="grid md:grid-cols-4 gap-8">
            {[
              {
                step: "01",
                icon: FileText,
                title: "Post Project",
                description:
                  "Describe your project requirements, budget, and timeline in detail",
              },
              {
                step: "02",
                icon: Users,
                title: "Receive Bids",
                description:
                  "Qualified freelancers submit competitive proposals with their approach",
              },
              {
                step: "03",
                icon: CheckCircle,
                title: "Select Winner",
                description:
                  "Review portfolios, compare bids, and choose the perfect freelancer",
              },
              {
                step: "04",
                icon: Star,
                title: "Get Results",
                description:
                  "Collaborate seamlessly and receive high-quality deliverables on time",
              },
            ].map((item, index) => (
              <Card
                key={index}
                className="bg-gray-800 border-gray-700 text-center relative"
              >
                <CardHeader>
                  <div className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <item.icon className="w-8 h-8 text-white" />
                  </div>
                  <div className="absolute -top-4 -right-4 w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center text-sm font-bold text-gray-300">
                    {item.step}
                  </div>
                  <CardTitle className="text-white text-xl">
                    {item.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-gray-400 text-base">
                    {item.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section id="benefits" className="py-20 bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-4 text-white">
              Why Choose BidConnect?
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Designed for success. Built for both buyers and sellers to thrive.
            </p>
          </div>
          <div className="grid lg:grid-cols-2 gap-12">
            {/* For Buyers */}
            <div>
              <h3 className="text-2xl font-bold mb-8 text-center lg:text-left text-white">
                For Buyers
              </h3>
              <div className="space-y-6">
                {benefits.buyers.map((benefit, index) => (
                  <Card key={index} className="bg-gray-800 border-gray-700">
                    <CardContent className="p-6 flex items-start space-x-4">
                      <div className="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center flex-shrink-0">
                        <benefit.icon className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h4 className="text-lg font-semibold text-white mb-2">
                          {benefit.title}
                        </h4>
                        <p className="text-gray-400">{benefit.description}</p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* For Sellers */}
            <div>
              <h3 className="text-2xl font-bold mb-8 text-center lg:text-left text-white">
                For Sellers
              </h3>
              <div className="space-y-6">
                {benefits.sellers.map((benefit, index) => (
                  <Card key={index} className="bg-gray-800 border-gray-700">
                    <CardContent className="p-6 flex items-start space-x-4">
                      <div className="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center flex-shrink-0">
                        <benefit.icon className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h4 className="text-lg font-semibold text-white mb-2">
                          {benefit.title}
                        </h4>
                        <p className="text-gray-400">{benefit.description}</p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Projects */}
      <section
        id="projects"
        className="py-20 bg-gradient-to-b from-gray-900 to-black"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-4 text-white">
              Featured Projects
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Discover high-quality projects from buyers around the world
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {projects.map((project, index) => (
              <Card
                key={index}
                className="bg-gray-800 border-gray-700 hover:border-gray-600 transition-colors"
              >
                <CardHeader>
                  <div className="flex justify-between items-start mb-2">
                    <Badge className="bg-red-500 text-white hover:bg-red-500">
                      {project.category}
                    </Badge>
                    <span className="text-sm text-gray-400">
                      {project.timeLeft}
                    </span>
                  </div>
                  <CardTitle className="text-white text-lg">
                    {project.title}
                  </CardTitle>
                  <CardDescription className="text-gray-400">
                    Budget:{" "}
                    <span className="text-white font-semibold">
                      {project.budget}
                    </span>
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {project.skills.map((skill, skillIndex) => (
                      <Badge
                        key={skillIndex}
                        variant="outline"
                        className="border-gray-600 text-gray-300"
                      >
                        {skill}
                      </Badge>
                    ))}
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">{project.bids} bids</span>
                    <Button
                      size="sm"
                      className="bg-red-500 hover:bg-red-600 text-white"
                    >
                      View Project
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="text-center mt-12">
            <Button
              size="lg"
              variant="outline"
              className="border-gray-600 text-gray-300 hover:bg-gray-800 hover:text-white bg-transparent"
            >
              View All Projects
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gray-900">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Card className="bg-gradient-to-r from-red-500 to-red-600 border-0">
            <CardContent className="p-12">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Ready to Start Your Next Project?
              </h2>
              <p className="text-xl text-red-100 mb-8 max-w-2xl mx-auto">
                Join thousands of successful buyers and sellers. Post your
                project today and connect with top talent worldwide.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  size="lg"
                  className="bg-white text-red-500 hover:bg-gray-100 px-8 py-4 text-lg font-semibold"
                >
                  Post Your First Project
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-white text-white hover:bg-white hover:text-red-500 px-8 py-4 text-lg bg-transparent"
                >
                  Start Bidding
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black border-t border-gray-800 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="col-span-1">
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center">
                  <Zap className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold text-white">BidConnect</span>
              </div>
              <p className="text-gray-400 mb-4">
                The ultimate platform connecting buyers with top freelancers
                worldwide.
              </p>
              <div className="flex space-x-4">
                <div className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-gray-700 cursor-pointer">
                  <Globe className="w-5 h-5 text-gray-400" />
                </div>
                <div className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-gray-700 cursor-pointer">
                  <Mail className="w-5 h-5 text-gray-400" />
                </div>
              </div>
            </div>

            <div>
              <h4 className="text-white font-semibold mb-4">For Buyers</h4>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Post a Project
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Browse Freelancers
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    How It Works
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Success Stories
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-semibold mb-4">For Sellers</h4>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Find Projects
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Create Profile
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Seller Resources
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Community
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Help Center
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Contact Us
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Terms of Service
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400">
              © 2025 BidConnect. All rights reserved.
            </p>
            <div className="flex items-center space-x-6 mt-4 md:mt-0">
              <span className="text-gray-400 flex items-center">
                <MapPin className="w-4 h-4 mr-1" />
                Global Platform
              </span>
              <span className="text-gray-400 flex items-center">
                <Phone className="w-4 h-4 mr-1" />
                24/7 Support
              </span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
