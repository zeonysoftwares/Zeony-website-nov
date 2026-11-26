"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import { ZoomIn, ZoomOut, RotateCw, Check, X, Move, Circle, Square, Sparkles } from "lucide-react";

export type CropShape = "circle" | "square";

interface ImageCropModalProps {
  isOpen: boolean;
  imageSrc: string;
  title?: string;
  defaultShape?: CropShape;
  initialAspectRatio?: string; // backwards compatibility
  onCropComplete: (croppedDataUrl: string) => void;
  onCancel: () => void;
}

export default function ImageCropModal({
  isOpen,
  imageSrc,
  title = "Profile Photo Crop",
  defaultShape = "circle",
  onCropComplete,
  onCancel,
}: ImageCropModalProps) {
  const [zoom, setZoom] = useState<number>(1);
  const [rotation, setRotation] = useState<number>(0);
  const [shape, setShape] = useState<CropShape>(defaultShape);
  const [isDragging, setIsDragging] = useState(false);
  const [pan, setPan] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [dragStart, setDragStart] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  const containerRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);

  // Reset adjustments whenever modal opens with a new image
  useEffect(() => {
    if (isOpen) {
      setZoom(1);
      setRotation(0);
      setPan({ x: 0, y: 0 });
      setShape(defaultShape);
    }
  }, [isOpen, imageSrc, defaultShape]);

  // Mouse drag handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
    setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
  };

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!isDragging) return;
      setPan({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y,
      });
    },
    [isDragging, dragStart]
  );

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  useEffect(() => {
    if (isDragging) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
      return () => {
        window.removeEventListener("mousemove", handleMouseMove);
        window.removeEventListener("mouseup", handleMouseUp);
      };
    }
  }, [isDragging, handleMouseMove, handleMouseUp]);

  // Touch handlers for mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      setIsDragging(true);
      setDragStart({
        x: e.touches[0].clientX - pan.x,
        y: e.touches[0].clientY - pan.y,
      });
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging || e.touches.length !== 1) return;
    setPan({
      x: e.touches[0].clientX - dragStart.x,
      y: e.touches[0].clientY - dragStart.y,
    });
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
  };

  // Zoom via wheel
  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    setZoom((prev) => {
      const delta = e.deltaY < 0 ? 0.08 : -0.08;
      const next = prev + delta;
      return Math.min(Math.max(next, 0.6), 3.5);
    });
  };

  const applyCrop = () => {
    if (!imageRef.current) return;
    const img = imageRef.current;
    const size = 512; // Export high-resolution 512x512 profile picture

    const canvas = document.createElement("canvas");
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.imageSmoothingQuality = "high";
    ctx.imageSmoothingEnabled = true;

    // Move to center
    ctx.save();
    ctx.translate(size / 2, size / 2);
    ctx.rotate((rotation * Math.PI) / 180);
    ctx.scale(zoom, zoom);

    // Container scaling
    const containerW = containerRef.current?.clientWidth || size;
    const scaleFactor = size / (containerW * 0.72); // matched with the 72% WhatsApp circular crop boundary
    ctx.translate(pan.x * scaleFactor, pan.y * scaleFactor);

    // Draw image preserving native aspect
    const imgAspect = img.naturalWidth / img.naturalHeight;
    let drawW = size;
    let drawH = size / imgAspect;
    if (drawH < size) {
      drawH = size;
      drawW = size * imgAspect;
    }

    ctx.drawImage(img, -drawW / 2, -drawH / 2, drawW, drawH);
    ctx.restore();

    // Export as high-quality JPEG profile photo
    const croppedUrl = canvas.toDataURL("image/jpeg", 0.94);
    onCropComplete(croppedUrl);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/90 backdrop-blur-md">
      <div className="bg-[#0b141a] border border-[#202c33] rounded-3xl max-w-xl w-full p-5 sm:p-6 shadow-2xl text-slate-200 relative overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* WhatsApp Profile Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#202c33]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#00a884]/15 border border-[#00a884]/40 flex items-center justify-center text-[#00a884]">
              <Circle className="w-5 h-5 fill-current" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                {title}
              </h3>
              <p className="text-xs text-slate-400">
                Drag and pinch or zoom to fit your profile photo within the circle.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onCancel}
            className="p-2 rounded-xl bg-[#202c33] hover:bg-[#2a3942] text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Shape Switcher (WhatsApp Circle vs Standard Square) */}
        <div className="flex items-center justify-between py-3 text-xs">
          <span className="text-slate-400 font-medium">Framing Format:</span>
          <div className="flex items-center gap-1.5 bg-[#111b21] p-1 rounded-xl border border-[#202c33]">
            <button
              type="button"
              onClick={() => setShape("circle")}
              className={`px-3 py-1.5 rounded-lg font-semibold flex items-center gap-1.5 transition-all ${
                shape === "circle"
                  ? "bg-[#00a884] text-white shadow-md shadow-[#00a884]/25"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <Circle className="w-3.5 h-3.5" /> WhatsApp Circle
            </button>
            <button
              type="button"
              onClick={() => setShape("square")}
              className={`px-3 py-1.5 rounded-lg font-semibold flex items-center gap-1.5 transition-all ${
                shape === "square"
                  ? "bg-[#00a884] text-white shadow-md shadow-[#00a884]/25"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <Square className="w-3.5 h-3.5" /> Square Box
            </button>
          </div>
        </div>

        {/* WhatsApp Crop Viewport */}
        <div
          ref={containerRef}
          onMouseDown={handleMouseDown}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          onWheel={handleWheel}
          className={`relative w-full h-80 sm:h-96 bg-[#111b21] rounded-2xl overflow-hidden select-none cursor-${
            isDragging ? "grabbing" : "grab"
          } flex items-center justify-center`}
        >
          {/* Transformable Background Image */}
          <div
            style={{
              transform: `translate(${pan.x}px, ${pan.y}px) rotate(${rotation}deg) scale(${zoom})`,
              transition: isDragging ? "none" : "transform 0.1s ease-out",
            }}
            className="w-full h-full flex items-center justify-center shrink-0 pointer-events-none"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              ref={imageRef}
              src={imageSrc}
              alt="Profile Crop Source"
              className="max-h-full max-w-full object-contain pointer-events-none"
              draggable={false}
            />
          </div>

          {/* WhatsApp Darkened Mask Overlay with Clear Circular Viewport */}
          <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
            {shape === "circle" ? (
              <div
                className="w-64 h-64 sm:w-72 sm:h-72 rounded-full border-2 border-dashed border-[#00a884] relative"
                style={{
                  boxShadow: "0 0 0 9999px rgba(11, 20, 26, 0.78)",
                }}
              >
                {/* Crosshairs & Rule-of-Thirds Grid inside the circle */}
                <div className="absolute inset-0 rounded-full overflow-hidden grid grid-cols-3 grid-rows-3 opacity-30">
                  <div className="border-r border-b border-white" />
                  <div className="border-r border-b border-white" />
                  <div className="border-b border-white" />
                  <div className="border-r border-b border-white" />
                  <div className="border-r border-b border-white" />
                  <div className="border-b border-white" />
                  <div className="border-r border-white" />
                  <div className="border-r border-white" />
                  <div />
                </div>
              </div>
            ) : (
              <div
                className="w-64 h-64 sm:w-72 sm:h-72 rounded-2xl border-2 border-dashed border-[#00a884] relative"
                style={{
                  boxShadow: "0 0 0 9999px rgba(11, 20, 26, 0.78)",
                }}
              >
                <div className="absolute inset-0 grid grid-cols-3 grid-rows-3 opacity-30">
                  <div className="border-r border-b border-white" />
                  <div className="border-r border-b border-white" />
                  <div className="border-b border-white" />
                  <div className="border-r border-b border-white" />
                  <div className="border-r border-b border-white" />
                  <div className="border-b border-white" />
                  <div className="border-r border-white" />
                  <div className="border-r border-white" />
                  <div />
                </div>
              </div>
            )}
          </div>

          {/* Interactive Drag Pill Badge */}
          <div className="absolute bottom-3 left-3 bg-[#111b21]/90 backdrop-blur px-3 py-1.5 rounded-full text-[11px] text-slate-300 flex items-center gap-1.5 pointer-events-none border border-[#202c33]">
            <Move className="w-3.5 h-3.5 text-[#00a884]" /> Drag image to adjust position
          </div>
        </div>

        {/* WhatsApp Style Zoom & Rotation Bar */}
        <div className="flex items-center justify-between gap-4 bg-[#111b21] p-3 rounded-2xl border border-[#202c33] text-xs">
          <div className="flex items-center gap-3 flex-1">
            <ZoomOut className="w-4 h-4 text-slate-400 shrink-0" />
            <input
              type="range"
              min="0.6"
              max="3.2"
              step="0.05"
              value={zoom}
              onChange={(e) => setZoom(parseFloat(e.target.value))}
              className="w-full accent-[#00a884] cursor-pointer"
            />
            <ZoomIn className="w-4 h-4 text-slate-400 shrink-0" />
            <span className="font-mono text-slate-300 w-12 text-right">{Math.round(zoom * 100)}%</span>
          </div>

          <button
            type="button"
            onClick={() => setRotation((prev) => (prev + 90) % 360)}
            className="px-3 py-2 rounded-xl bg-[#202c33] hover:bg-[#2a3942] text-slate-200 flex items-center gap-1.5 font-semibold transition-colors shrink-0"
          >
            <RotateCw className="w-3.5 h-3.5 text-[#00a884]" /> Rotate
          </button>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-end gap-3 pt-3">
          <button
            type="button"
            onClick={onCancel}
            className="px-5 py-2.5 rounded-xl bg-[#202c33] hover:bg-[#2a3942] text-slate-300 text-xs font-semibold transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={applyCrop}
            className="px-6 py-2.5 rounded-xl bg-[#00a884] hover:bg-[#02906f] text-white text-xs font-bold transition-all shadow-lg shadow-[#00a884]/25 flex items-center gap-2"
          >
            <Check className="w-4 h-4" /> Done
          </button>
        </div>
      </div>
    </div>
  );
}
