"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { MessageSquare, X, Send, ArrowRight, Bot } from "lucide-react";
import { useSiteSettings } from "@/lib/adminStore";

const quickPrompts = [
  "Build a Website",
  "Custom Software",
  "Internships & Training",
  "Pricing & Timelines",
];

export function Chatbot() {
  const { settings } = useSiteSettings();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: "bot",
      content:
        "Welcome to Zeony Technologies. How can we assist you today — software development, enterprise AI, or training & internships?",
    },
  ]);
  const [input, setInput] = useState("");
  const [step, setStep] = useState(0);
  const [projectDetails, setProjectDetails] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const generateBotResponse = (userMsg: string) => {
    const lowerMsg = userMsg.toLowerCase();

    if (
      lowerMsg.includes("intern") ||
      lowerMsg.includes("training") ||
      lowerMsg.includes("workshop") ||
      lowerMsg.includes("course")
    ) {
      return "We offer hands-on internships, certification programs, and corporate workshops across Web Dev, AI/ML, Java Full Stack, Data Analytics, and Cloud. Visit the Internships or Training page to apply directly.";
    }
    if (
      lowerMsg.includes("price") ||
      lowerMsg.includes("cost") ||
      lowerMsg.includes("budget") ||
      lowerMsg.includes("much")
    ) {
      return "Our engagements are tailored to project scope — fixed-price for well-defined deliverables or dedicated teams for ongoing product engineering. Share your requirements on our Contact page for a detailed proposal.";
    }
    if (
      lowerMsg.includes("time") ||
      lowerMsg.includes("long") ||
      lowerMsg.includes("duration") ||
      lowerMsg.includes("when")
    ) {
      return "Standard corporate websites typically deliver in 2–4 weeks, while custom SaaS platforms and mobile applications take 6–14 weeks depending on integrations and complexity.";
    }
    if (
      lowerMsg.includes("technology") ||
      lowerMsg.includes("stack") ||
      lowerMsg.includes("framework")
    ) {
      return "We engineer with Next.js, React, TypeScript, Node.js, Python, PostgreSQL, React Native, AWS, and modern LLM/RAG architectures.";
    }
    if (
      lowerMsg.includes("contact") ||
      lowerMsg.includes("phone") ||
      lowerMsg.includes("email") ||
      lowerMsg.includes("call")
    ) {
      return `You can reach our team directly at ${settings.contactPhone} or ${settings.supportEmail}.`;
    }

    if (step === 0) {
      setStep(1);
      setProjectDetails(userMsg);
      if (lowerMsg.includes("ecommerce") || lowerMsg.includes("e-commerce") || lowerMsg.includes("store")) {
        return "For e-commerce platforms, we build high-conversion storefronts with payment gateway integration and inventory management. Roughly how many SKUs and integrations do you anticipate?";
      }
      if (lowerMsg.includes("website") || lowerMsg.includes("web")) {
        return "We craft fast, SEO-ready corporate websites and web applications. Is this a brand refresh, a SaaS portal, or a marketing site?";
      }
      return "Thank you for sharing. Could you outline the primary goal or key features you need so we can point you to the right engineering team?";
    }

    if (step === 1) {
      setStep(2);
      return `Understood. For a tailored technical roadmap and estimate on "${projectDetails}", please submit your contact details via our Contact page or reach us at ${settings.supportEmail}.`;
    }

    return "Feel free to explore our Services and Products pages, or schedule a 30-minute discovery call through our Contact page.";
  };

  const sendMessage = (text: string) => {
    if (!text.trim()) return;
    const userMsg = text.trim();
    setMessages((prev) => [...prev, { role: "user", content: userMsg }]);
    setInput("");

    setTimeout(() => {
      const response = generateBotResponse(userMsg);
      setMessages((prev) => [...prev, { role: "bot", content: response }]);
    }, 450);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(input);
  };

  return (
    <>
      <div className="fixed bottom-6 right-6 z-40">
        <motion.button
          type="button"
          aria-label="Open Zeony Assistant"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.25 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsOpen((prev) => !prev)}
          className="w-13 h-13 bg-primary text-primary-foreground rounded-full flex items-center justify-center shadow-lg shadow-primary/25 border border-primary/20 hover:bg-primary/90 transition-colors"
        >
          {isOpen ? <X className="w-5 h-5" /> : <MessageSquare className="w-5 h-5" />}
        </motion.button>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 16, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.96 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-22 right-4 sm:right-6 w-[calc(100vw-2rem)] sm:w-[380px] bg-card border border-border rounded-2xl shadow-2xl z-50 overflow-hidden flex flex-col"
          >
            {/* Header */}
            <div className="bg-primary px-4 py-3.5 flex items-center justify-between text-primary-foreground">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-white/15 flex items-center justify-center">
                  <Bot className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-heading font-semibold text-sm leading-tight">
                    Zeony Concierge
                  </h3>
                  <p className="text-[11px] text-primary-foreground/80 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block" />
                    Typical reply in seconds
                  </p>
                </div>
              </div>
              <button
                type="button"
                aria-label="Close chat"
                onClick={() => setIsOpen(false)}
                className="p-1.5 hover:bg-white/15 rounded-lg transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Chat Area */}
            <div
              data-lenis-prevent
              className="h-80 p-4 overflow-y-auto overscroll-contain flex flex-col gap-3 bg-muted/30 custom-scrollbar"
            >
              {messages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[85%] px-3.5 py-2.5 rounded-2xl text-sm leading-relaxed ${
                      msg.role === "user"
                        ? "bg-primary text-primary-foreground rounded-br-sm"
                        : "bg-card border border-border text-card-foreground rounded-bl-sm shadow-xs"
                    }`}
                  >
                    {msg.content}
                  </div>
                </div>
              ))}

              {messages.length === 1 && (
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {quickPrompts.map((prompt) => (
                    <button
                      key={prompt}
                      type="button"
                      onClick={() => sendMessage(prompt)}
                      className="text-xs px-3 py-1.5 rounded-full bg-card border border-border hover:border-primary/50 hover:text-primary text-foreground transition-colors"
                    >
                      {prompt}
                    </button>
                  ))}
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Direct Contact Bar */}
            <div className="px-4 py-2 bg-muted/40 border-t border-border flex items-center justify-between text-xs">
              <span className="text-muted-foreground">Need a dedicated proposal?</span>
              <Link
                href="/contact"
                onClick={() => setIsOpen(false)}
                className="font-semibold text-primary hover:underline inline-flex items-center gap-1"
              >
                Contact Team <ArrowRight className="w-3 h-3" />
              </Link>
            </div>

            {/* Input Area */}
            <form onSubmit={handleSubmit} className="p-3 border-t border-border bg-card flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about services, timelines, or internships..."
                className="flex-1 px-3.5 py-2 bg-muted/60 border border-border rounded-xl text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
              />
              <button
                type="submit"
                disabled={!input.trim()}
                aria-label="Send message"
                className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center text-primary-foreground shrink-0 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-primary/90 transition-colors"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
