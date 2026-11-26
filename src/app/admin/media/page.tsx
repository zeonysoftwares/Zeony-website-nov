"use client";

import React, { useState, useMemo } from "react";
import Image from "next/image";
import {
  FolderOpen,
  Search,
  Copy,
  Check,
  ExternalLink,
  Image as ImageIcon,
  Upload,
  Eye,
  Filter,
  Sparkles,
  Info,
  Crop,
  Plus
} from "lucide-react";
import { supabase } from "@/lib/supabase";
import { TiltCard3D } from "@/components/ui/TiltCard3D";
import ImageCropModal from "@/components/admin/ImageCropModal";

interface MediaAsset {
  name: string;
  path: string;
  category: "logos" | "3d" | "graphic_design" | "team" | "banners" | "general";
  format: string;
}

const BUILT_IN_ASSETS: MediaAsset[] = [
  // Brand Logos
  { name: "Wise Capital Logo", path: "/img/wise-capital-logo.png", category: "logos", format: "PNG" },
  { name: "PMC Tech Logo", path: "/img/pmc.jpg", category: "logos", format: "JPG" },
  { name: "Joyson Enterprises", path: "/img/Joyson.jpeg", category: "logos", format: "JPEG" },
  { name: "Divya Driving School", path: "/img/divya-driving-logo.jpeg", category: "logos", format: "JPEG" },
  { name: "DDRR Clinic Logo", path: "/img/ddrr-logo.jpg", category: "logos", format: "JPG" },
  { name: "DDRR Main Logo", path: "/img/ddrr.png", category: "logos", format: "PNG" },
  { name: "AUMM Cloths", path: "/img/AUMM logo.png", category: "logos", format: "PNG" },
  { name: "Happy Sunday Biriyani", path: "/img/happy sunday biriyani.png", category: "logos", format: "PNG" },
  { name: "Ramamoorthy Nursery", path: "/img/ramamoorthy-nusery-logo.png", category: "logos", format: "PNG" },
  { name: "Zeony Brand Logo", path: "/img/zeony-logo.jpg", category: "logos", format: "JPG" },
  { name: "Zeony Z Symbol", path: "/img/z-logo.jpg", category: "logos", format: "JPG" },
  { name: "Netfra Logo", path: "/img/netfra.png", category: "logos", format: "PNG" },

  // 3D Renders
  { name: "3D Hero Core", path: "/img/3d/hero-core.jpg", category: "3d", format: "JPG" },
  { name: "3D Web Services", path: "/img/3d/service-web.jpg", category: "3d", format: "JPG" },
  { name: "3D Mobile Services", path: "/img/3d/service-mobile.jpg", category: "3d", format: "JPG" },
  { name: "3D UI/UX Services", path: "/img/3d/service-uiux.jpg", category: "3d", format: "JPG" },
  { name: "3D Innovation", path: "/img/3d/about-innovation.jpg", category: "3d", format: "JPG" },
  { name: "3D Academy Stage", path: "/img/3d/internships-academy.jpg", category: "3d", format: "JPG" },
  { name: "3D Collaboration Network", path: "/img/3d/collaboration-network.jpg", category: "3d", format: "JPG" },
  { name: "3D Contact Connect", path: "/img/3d/contact-connect.jpg", category: "3d", format: "JPG" },
  { name: "3D Workshops Stage", path: "/img/3d/workshops-stage.jpg", category: "3d", format: "JPG" },

  // Team
  { name: "Sanjay Kumar (CDO)", path: "/img/sanjay.jpg", category: "team", format: "JPG" },
  { name: "Vinod Kumar (CTO)", path: "/img/vinod.jpg", category: "team", format: "JPG" },
  { name: "Devaraj", path: "/img/devaraj.jpg", category: "team", format: "JPG" },
  { name: "Ramamoorthy", path: "/img/ramamoorthy.jpg", category: "team", format: "JPG" },

  // Graphic Design Assets
  { name: "Smartwatch Render", path: "/img/graphic design/watch.png", category: "graphic_design", format: "PNG" },
  { name: "Wireless Earbuds", path: "/img/graphic design/buds.png", category: "graphic_design", format: "PNG" },
  { name: "Burger Packaging", path: "/img/graphic design/burger.png", category: "graphic_design", format: "PNG" },
  { name: "Fresh Juice Bottle", path: "/img/graphic design/juice.png", category: "graphic_design", format: "PNG" },
  { name: "Bluetooth Speaker", path: "/img/graphic design/speaker.png", category: "graphic_design", format: "PNG" },
  { name: "Cosmetic Suncream", path: "/img/graphic design/suncream.jpg", category: "graphic_design", format: "JPG" },
  { name: "Milkshake Beverage", path: "/img/graphic design/milkshake.png", category: "graphic_design", format: "PNG" },
  { name: "Nailpolish Cosmetics", path: "/img/graphic design/nailpolish.png", category: "graphic_design", format: "PNG" },
  { name: "Man with Laptop", path: "/img/graphic design/manlap.png", category: "graphic_design", format: "PNG" },

  // Banners & Academy Culture
  { name: "Culture Workshop", path: "/img/culture_workshop.png", category: "banners", format: "PNG" },
  { name: "Culture Internship", path: "/img/culture_internship.png", category: "banners", format: "PNG" },
  { name: "Culture Collaboration", path: "/img/culture_collaboration.png", category: "banners", format: "PNG" },
  { name: "Custom Software Bento", path: "/img/custom_software_bento.png", category: "banners", format: "PNG" },
  { name: "Web Dev Bento", path: "/img/web_dev_bento.png", category: "banners", format: "PNG" },
  { name: "Placement Assistance", path: "/img/placement_assist.png", category: "banners", format: "PNG" },
  { name: "Career Guide", path: "/img/career_guide.png", category: "banners", format: "PNG" },
  { name: "Industry Academia", path: "/img/industry_academia.png", category: "banners", format: "PNG" },
  { name: "Empowerment Hero", path: "/img/empowerment_hero.png", category: "banners", format: "PNG" },
  { name: "Webinar Poster", path: "/img/webinar-poster2.jpg", category: "banners", format: "JPG" },
  { name: "Web Development Hero", path: "/img/web-dev.jpg", category: "banners", format: "JPG" },
  { name: "Mobile App Dev", path: "/img/app-dev.png", category: "banners", format: "PNG" },
  { name: "UI/UX Graphic Design", path: "/img/UIUX.jpg", category: "banners", format: "JPG" },
  { name: "Workshops & Webinars", path: "/img/workshp-webinars.jpg", category: "banners", format: "JPG" },
  { name: "Internships Hero", path: "/img/internships.jpg", category: "banners", format: "JPG" },
  { name: "Contact Us Banner", path: "/img/contact us.jpg", category: "banners", format: "JPG" },
  { name: "DriveLogs App", path: "/img/drive-logs.png", category: "banners", format: "PNG" },
  { name: "M-Tracker Software", path: "/img/m-tracker.png", category: "banners", format: "PNG" },
];

export default function MediaLibraryPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [copiedPath, setCopiedPath] = useState<string | null>(null);
  const [previewAsset, setPreviewAsset] = useState<MediaAsset | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedAssets, setUploadedAssets] = useState<MediaAsset[]>([]);
  const [cropModalData, setCropModalData] = useState<{
    rawSrc: string;
    targetAssetIndex?: number;
    fileName?: string;
    category?: MediaAsset["category"];
  } | null>(null);

  const allAssets = useMemo(() => {
    return [...uploadedAssets, ...BUILT_IN_ASSETS];
  }, [uploadedAssets]);

  const filteredAssets = useMemo(() => {
    return allAssets.filter((asset) => {
      const matchesSearch =
        !searchTerm ||
        asset.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        asset.path.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesCategory =
        categoryFilter === "all" || asset.category === categoryFilter;

      return matchesSearch && matchesCategory;
    });
  }, [allAssets, searchTerm, categoryFilter]);

  const handleCopy = (path: string) => {
    navigator.clipboard.writeText(path);
    setCopiedPath(path);
    setTimeout(() => setCopiedPath(null), 2000);
  };

  const handleFileForCrop = (file: File, targetIndex?: number, targetCategory?: MediaAsset["category"]) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      setCropModalData({
        rawSrc: reader.result as string,
        targetAssetIndex: targetIndex,
        fileName: file.name,
        category: targetCategory || "general",
      });
    };
    reader.readAsDataURL(file);
  };

  const handleCropComplete = async (croppedUrl: string) => {
    if (!cropModalData) return;
    const { targetAssetIndex, fileName, category } = cropModalData;

    // If replacing an existing card asset
    if (targetAssetIndex !== undefined && targetAssetIndex >= 0) {
      setUploadedAssets((prev) => {
        const copy = [...prev];
        if (copy[targetAssetIndex]) {
          copy[targetAssetIndex] = {
            ...copy[targetAssetIndex],
            path: croppedUrl,
          };
        }
        return copy;
      });
    } else {
      // Add as brand new asset
      const cleanName = fileName ? fileName.replace(/\.[^/.]+$/, "") : "Custom Cropped Image";
      const newAsset: MediaAsset = {
        name: cleanName,
        path: croppedUrl,
        category: category || "general",
        format: "JPG",
      };
      setUploadedAssets((prev) => [newAsset, ...prev]);
    }

    handleCopy(croppedUrl);
    setCropModalData(null);

    // Background upload to Supabase storage if reachable
    try {
      const res = await fetch(croppedUrl);
      const blob = await res.blob();
      const storageName = `media/${Date.now()}_${Math.random().toString(36).substring(2, 6)}.jpg`;
      const { data } = await supabase.storage.from("storage_images").upload(storageName, blob, { contentType: "image/jpeg" });
      if (data) {
        const { data: publicUrlData } = supabase.storage.from("storage_images").getPublicUrl(storageName);
        if (publicUrlData?.publicUrl) {
          const finalUrl = publicUrlData.publicUrl;
          if (targetAssetIndex !== undefined && targetAssetIndex >= 0) {
            setUploadedAssets((prev) => {
              const copy = [...prev];
              if (copy[targetAssetIndex]) copy[targetAssetIndex].path = finalUrl;
              return copy;
            });
          }
        }
      }
    } catch {
      // Keep local cropped data URL
    }
  };

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    handleFileForCrop(file, undefined, categoryFilter !== "all" ? (categoryFilter as MediaAsset["category"]) : "general");
    e.target.value = "";
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-12 font-sans">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-[#0c194b] via-[#10246a] to-[#162e87] p-6 sm:p-8 rounded-3xl border border-blue-900/40 shadow-2xl relative overflow-hidden">
        <div className="absolute right-0 top-0 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs font-semibold mb-3 border border-blue-500/30">
            <FolderOpen className="w-3.5 h-3.5" />
            <span>Digital Assets & Media Hub</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-heading font-black text-white">
            Media & Asset Gallery
          </h1>
          <p className="text-sm text-slate-300 mt-1 max-w-2xl">
            Browse all public logos, 3D renderings, and course graphics. Click any asset to copy its exact path for use in Services, Products, or Brand sections.
          </p>
        </div>

        <div className="relative z-10 shrink-0">
          <label className="cursor-pointer px-5 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold text-xs transition-all shadow-lg shadow-blue-600/30 flex items-center gap-2">
            <Upload className="w-4 h-4" />
            <span>{isUploading ? "Uploading..." : "Upload New Image"}</span>
            <input
              type="file"
              accept="image/*"
              className="hidden"
              disabled={isUploading}
              onChange={handleUpload}
            />
          </label>
        </div>
      </div>

      {/* Category Pills & Search */}
      <div className="bg-[#0f172a] border border-slate-800 p-4 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-4 shadow-lg">
        <div className="relative w-full md:w-96">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search image name, category, or path..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#09133a] border border-slate-700 focus:border-blue-500 focus:outline-none text-xs text-white"
          />
        </div>

        <div className="flex flex-wrap items-center gap-1.5 w-full md:w-auto">
          {[
            { id: "all", label: "All Assets" },
            { id: "logos", label: "Brand Logos" },
            { id: "3d", label: "3D Renders" },
            { id: "graphic_design", label: "Design Work" },
            { id: "team", label: "Team Photos" },
            { id: "banners", label: "Banners & Bento" },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setCategoryFilter(cat.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                categoryFilter === cat.id
                  ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20"
                  : "bg-[#09133a] text-slate-400 hover:text-white border border-slate-800"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Media Grid with 3D Tilt */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {filteredAssets.map((asset, idx) => {
          const isCopied = copiedPath === asset.path;
          return (
            <TiltCard3D key={idx} intensity={6} className="rounded-2xl">
              <div
                className="h-full bg-[#0f172a] border border-slate-800 hover:border-blue-500/50 rounded-2xl p-3 flex flex-col justify-between group shadow-lg relative overflow-hidden"
              >
                {/* Image Preview Box */}
                <div
                  onClick={() => setPreviewAsset(asset)}
                  className="relative aspect-video w-full rounded-xl bg-[#09133a] overflow-hidden cursor-pointer flex items-center justify-center border border-slate-800 group-hover:border-blue-500/40"
                >
                  <Image
                    src={asset.path}
                    alt={asset.name}
                    fill
                    unoptimized
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                    onError={(e) => {
                      (e.target as HTMLElement).style.display = "none";
                    }}
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    <span className="p-2 rounded-xl bg-slate-900/80 text-white text-xs font-semibold backdrop-blur flex items-center gap-1">
                      <Eye className="w-3.5 h-3.5" /> Preview
                    </span>
                  </div>
                  <span className="absolute top-2 right-2 px-1.5 py-0.5 rounded text-[9px] font-mono font-bold uppercase bg-black/60 text-slate-300 backdrop-blur">
                    {asset.format}
                  </span>
                </div>

                {/* Title & Path */}
                <div className="mt-3">
                  <h4 className="text-xs font-bold text-white truncate" title={asset.name}>
                    {asset.name}
                  </h4>
                  <p className="text-[10px] text-slate-400 font-mono truncate mt-0.5" title={asset.path}>
                    {asset.path}
                  </p>
                </div>

                {/* Card Actions: Crop, Replace & Copy Path */}
                <div className="mt-3 pt-2.5 border-t border-slate-800/80 flex items-center justify-between gap-1.5">
                  <div className="flex items-center gap-1">
                    {/* Re-crop / Edit Crop for this card */}
                    <button
                      type="button"
                      onClick={() =>
                        setCropModalData({
                          rawSrc: asset.path,
                          targetAssetIndex: idx < uploadedAssets.length ? idx : undefined,
                          fileName: asset.name,
                          category: asset.category,
                        })
                      }
                      title="Crop or resize this image"
                      className="p-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
                    >
                      <Crop className="w-3 h-3 text-cyan-400" />
                    </button>

                    {/* Upload new image specifically for this card */}
                    <label
                      title="Upload & replace image for this card"
                      className="p-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white cursor-pointer transition-colors"
                    >
                      <Upload className="w-3 h-3 text-blue-400" />
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            handleFileForCrop(file, idx < uploadedAssets.length ? idx : undefined, asset.category);
                            e.target.value = "";
                          }
                        }}
                      />
                    </label>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleCopy(asset.path)}
                    className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition-all flex items-center gap-1.5 ${
                      isCopied
                        ? "bg-emerald-500 text-white"
                        : "bg-blue-600/20 text-blue-300 hover:bg-blue-600/40"
                    }`}
                  >
                    {isCopied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                    <span>{isCopied ? "Copied!" : "Copy Path"}</span>
                  </button>
                </div>
              </div>
            </TiltCard3D>
          );
        })}
      </div>

      {/* Asset Preview Modal */}
      {previewAsset && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md"
          onClick={() => setPreviewAsset(null)}
        >
          <div
            className="bg-[#0c194b] border border-blue-900/60 rounded-3xl max-w-xl w-full p-6 shadow-2xl space-y-4 text-slate-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-blue-900/40 pb-3">
              <div>
                <h3 className="text-base font-bold text-white">{previewAsset.name}</h3>
                <p className="text-xs text-blue-300 font-mono">{previewAsset.path}</p>
              </div>
              <button
                onClick={() => setPreviewAsset(null)}
                className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="relative aspect-video w-full rounded-2xl overflow-hidden bg-[#070d22] border border-blue-900/40 flex items-center justify-center">
              <Image
                src={previewAsset.path}
                alt={previewAsset.name}
                fill
                unoptimized
                className="object-contain"
              />
            </div>

            <div className="flex items-center justify-between pt-2">
              <span className="text-xs text-slate-400">
                Format: <strong className="text-white">{previewAsset.format}</strong>
              </span>
              <button
                type="button"
                onClick={() => handleCopy(previewAsset.path)}
                className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-all shadow-lg shadow-blue-600/30 flex items-center gap-2"
              >
                <Copy className="w-3.5 h-3.5" />
                <span>Copy Image Path</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Image Crop Modal for Media Assets */}
      {cropModalData && (
        <ImageCropModal
          isOpen={true}
          imageSrc={cropModalData.rawSrc}
          title={cropModalData.targetAssetIndex !== undefined ? `Crop & Replace Image for ${cropModalData.fileName || "Asset"}` : "Crop & Upload Image to Media Gallery"}
          initialAspectRatio="free"
          onCropComplete={handleCropComplete}
          onCancel={() => setCropModalData(null)}
        />
      )}
    </div>
  );
}
