"use client";

import React from "react";
import AdminSectionManager from "@/components/admin/AdminSectionManager";

export default function HeroAdminPage() {
  return (
    <AdminSectionManager
      sectionKey="hero"
      title="Homepage Hero Slides"
      subtitle="Manage the primary hero carousels and promotional slides displayed on the main landing page."
      fields={[
        { key: "title", label: "Slide Headline", placeholder: "e.g., Engineering the Future of Digital Innovation...", required: true, type: "text" },
        { key: "subtitle", label: "Subheading / Tag", placeholder: "e.g., Next-Gen Software Solutions...", type: "text" },
        { key: "img", label: "Background Image URL", placeholder: "/img/web-dev.jpg...", required: true, type: "text" },
        { key: "desc", label: "Slide Body Text", placeholder: "We transform visionary concepts into high-performance web apps...", type: "textarea" }
      ]}
    />
  );
}
