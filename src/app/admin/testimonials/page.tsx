"use client";

import React from "react";
import AdminSectionManager from "@/components/admin/AdminSectionManager";

export default function TestimonialsAdminPage() {
  return (
    <AdminSectionManager
      sectionKey="testimonials"
      title="Client Testimonials & Reviews"
      subtitle="Manage reviews, quotes, and success stories from clients, partners, and university deans."
      fields={[
        { key: "title", label: "Reviewer Name", placeholder: "e.g., Dr. K. Ramanathan, Sarah Jenkins...", required: true, type: "text" },
        { key: "subtitle", label: "Designation & Organization", placeholder: "e.g., Dean of Engineering, PMC Tech...", type: "text" },
        { key: "img", label: "Avatar / Logo URL", placeholder: "/img/pmc.jpg, /img/wise-capital-logo.png...", required: true, type: "text" },
        { key: "desc", label: "Testimonial Quote", placeholder: "Zeony's industry training transformed our students...", required: true, type: "textarea" }
      ]}
    />
  );
}
