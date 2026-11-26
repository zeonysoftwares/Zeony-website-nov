"use client";

import React from "react";
import AdminSectionManager from "@/components/admin/AdminSectionManager";

export default function TeamMembersAdminPage() {
  return (
    <AdminSectionManager
      sectionKey="team_members"
      title="Team Members"
      subtitle="Add, edit, reorder, and remove team members, department units, roles, bios, and skills shown on the Team Members page."
      fields={[
        {
          key: "title",
          label: "Member or Team Name",
          placeholder: "e.g., Sanjay Kumar K or Frontend Engineering",
          required: true,
          type: "text",
        },
        {
          key: "subtitle",
          label: "Role / Designation",
          placeholder: "e.g., Senior Full-Stack Engineer",
          required: true,
          type: "text",
        },
        {
          key: "category",
          label: "Department",
          placeholder: "Select Department",
          required: true,
          type: "select",
          options: ["Engineering", "Design & Product", "Cloud & AI", "Academy & Mentors"],
        },
        {
          key: "icon",
          label: "Badge Initials (2–3 letters)",
          placeholder: "e.g., SK, FE (shown if no photo is uploaded)",
          type: "text",
        },
        {
          key: "img",
          label: "Profile Photo (Optional URL or Upload)",
          placeholder: "/img/sanjay.jpg or upload below (leave empty for initials badge)",
          type: "text",
        },
        {
          key: "desc",
          label: "Bio / Role Summary",
          placeholder: "Describe responsibilities, expertise, and focus areas...",
          required: true,
          type: "textarea",
        },
        {
          key: "features",
          label: "Core Skills & Technologies",
          placeholder: "e.g., Next.js, TypeScript, Cloud Architecture",
          type: "string-array",
        },
        {
          key: "displayOrder",
          label: "Display Priority (Lower comes first)",
          placeholder: "e.g., 1",
          type: "number",
        },
      ]}
    />
  );
}
