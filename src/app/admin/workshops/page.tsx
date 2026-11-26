"use client";

import React from "react";
import AdminSectionManager from "@/components/admin/AdminSectionManager";

export default function WorkshopsAdminPage() {
  return (
    <AdminSectionManager
      sectionKey="workshops"
      title="Workshops & Webinars"
      subtitle="Add and delete technical workshops, guest lectures, and student webinar sessions."
      fields={[
        { key: "title", label: "Workshop Track", placeholder: "e.g., AI Engineering, Full Stack Software Developer...", required: true, type: "text" },
        { key: "img", label: "Banner Image URL", placeholder: "/img/workshp-webinars.jpg...", required: true, type: "text" },
        { key: "desc", label: "Workshop Highlights", placeholder: "List key topics covered in the session...", type: "textarea" }
      ]}
    />
  );
}
