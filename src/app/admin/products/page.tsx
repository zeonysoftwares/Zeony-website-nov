"use client";

import React from "react";
import AdminSectionManager from "@/components/admin/AdminSectionManager";

export default function ProductsAdminPage() {
  return (
    <AdminSectionManager
      sectionKey="products"
      title="Enterprise Software Products"
      subtitle="Manage custom software suites, SaaS products, and proprietary tools developed by Zeony."
      fields={[
        { key: "title", label: "Product Name", placeholder: "e.g., Zeony ERP Suite, DriveLogs Pro...", required: true, type: "text" },
        { key: "subtitle", label: "Product Category", placeholder: "e.g., Enterprise Software, SaaS Application...", type: "text" },
        { key: "img", label: "Product Preview Image URL", placeholder: "/img/custom_software_bento.png...", required: true, type: "text" },
        { key: "desc", label: "Product Overview", placeholder: "Describe features, target industries, and business value...", type: "textarea" },
        { key: "features", label: "Core Features", placeholder: "e.g., Cloud Dashboard, API Access...", type: "string-array" },
        { key: "audience", label: "Target Audience", placeholder: "e.g., Enterprise Teams & Businesses...", type: "text" },
        { key: "roadmap", label: "Roadmap (Coming Soon)", placeholder: "e.g., AI Integration...", type: "string-array" },
        { key: "siteUrl", label: "Product Website URL", placeholder: "e.g., https://drivelogs.com", type: "text" },
        { key: "testimonialText", label: "Testimonial Text", placeholder: "e.g., An absolute game changer...", type: "textarea" },
        { key: "testimonialAuthor", label: "Testimonial Author", placeholder: "e.g., Product Manager, TechCorp", type: "text" },
        { key: "statsArr", label: "Product Stats", placeholder: "", type: "object-array", subFields: [{ key: "name", label: "Stat Name", placeholder: "e.g., Users" }, { key: "value", label: "Stat Value", placeholder: "e.g., 5K+" }] },
        { key: "displayOrder", label: "Display Priority (Lower comes first)", placeholder: "e.g., 1", type: "number" }
      ]}
    />
  );
}
