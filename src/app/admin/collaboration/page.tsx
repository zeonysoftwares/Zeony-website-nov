"use client";

import React from "react";
import AdminSectionManager from "@/components/admin/AdminSectionManager";

export default function CollaborationAdminPage() {
  return (
    <AdminSectionManager
      sectionKey="collaboration"
      title="Industry & Academia Collaborations"
      subtitle="Add and remove institutional partnerships, research programs, and ecosystem alliances."
      fields={[
        { key: "title", label: "Partner / Alliance Name", placeholder: "e.g., IIT Madras Research Park...", required: true, type: "text" },
        { key: "subtitle", label: "Collaboration Type", placeholder: "e.g., Innovation Partner, Institutional Training...", type: "text" },
        { key: "siteUrl", label: "Partner Website URL", placeholder: "https://example.com (optional)", type: "text" },
        { key: "img", label: "Image / Logo URL", placeholder: "/img/culture_collaboration.png...", required: true, type: "text" },
        { key: "desc", label: "Partnership Details", placeholder: "Describe the joint initiative and outcomes...", type: "textarea" }
      ]}
    />
  );
}
