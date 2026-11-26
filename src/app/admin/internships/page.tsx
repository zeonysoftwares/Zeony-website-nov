"use client";

import React from "react";
import AdminSectionManager from "@/components/admin/AdminSectionManager";

export default function InternshipsAdminPage() {
  return (
    <AdminSectionManager
      sectionKey="internships"
      title="Internships & Live Projects"
      subtitle="Manage internship domains, live project tracks, and technical specializations."
      fields={[
        { key: "title", label: "Domain / Track Name", placeholder: "e.g., AIML And Generative AI, Java Full Stack...", required: true, type: "text" },
        { key: "subtitle", label: "Category", placeholder: "e.g., Core Engineering, Artificial Intelligence...", type: "text" },
        { key: "img", label: "Domain Image URL", placeholder: "/img/web-dev.jpg...", required: true, type: "text" },
        { key: "desc", label: "Domain Description & Skills", placeholder: "Describe the technologies and project scope...", type: "textarea" }
      ]}
    />
  );
}
