"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import { Crop, ZoomIn, ZoomOut, RotateCw, Check, X, Sparkles, Move } from "lucide-react";

export type AspectRatioOption = "free" | "1:1" | "16:9" | "4:3" | "3:4";

interface ImageCropModalProps {
  isOpen: boolean;
  imageSrc: string;
  title?: string;
  initialAspectRatio?: AspectRatioOption;
  onCropComplete: (croppedDataUrl: string) => void;
  onCancel: () => void;
}

export default function ImageCropModal({
  isOpen,
  imageSrc,
  title = "Crop & Adjust Image",
  initialAspectRatio = "free",
  onCropComplete,
  onCancel,
}: ImageCropModalProps) {
  const [zoom, setZoom] = useState<number>(1);
  const [rotation, setRotation] = useState<number>(0);
  const [aspect, setAspect] = useState<AspectRatioOption>(initialAspectRatio);
  const [isDragging, setIsDragging] = useState(false);
  const [pan, setPan] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [dragStart, setDragStart] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  const containerRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);

  // Reset adjustments whenever a new image source is opened
  useEffect(() => {
    if (isOpen) {
      setZoom(1);
      setRotation(0);
      setPan({ x: 0, y: 0 });
      setAspect(initialAspectRatio);
    }
  }, [isOpen, imageSrc, initialAspectRatio]);

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
    setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
  };

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isDragging) return;
    setPan({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y,
    });
  }, [isDragging, dragStart]);

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

  // Touch support for mobile / tablet devices
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

  const getTargetDimensions = (): { width: number; height: number } => {
    switch (aspect) {
      case "1:1":
        return { width: 500, height: 500 };
      case "16:9":
        return { width: 640, height: 360 };
      case "4:3":
        return { width: 600, height: 450 };
      case "3:4":
        return { width: 450, height: 600 };
      case "free":
      default:
        return { width: 600, height: 400 };
    }
  };

  const applyCrop = () => {
    if (!imageRef.current) return;
    const img = imageRef.current;
    const { width: targetW, height: targetH } = getTargetDimensions();

    const canvas = document.createElement("canvas");
    canvas.width = targetW;
    canvas.height = targetH;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Fill background with high-quality dark or transparent
    ctx.imageSmoothingQuality = "high";
    ctx.imageSmoothingEnabled = true;

    // Move to center of canvas
    ctx.save();
    ctx.translate(targetW / 2, targetH / 2);
    ctx.rotate((rotation * Math.PI) / 180);
    ctx.scale(zoom, zoom);

    // Apply pan offset proportional to render container
    const containerW = containerRef.current?.clientWidth || targetW;
    const scaleRatio = targetW / containerW;
    ctx.translate(pan.x * scaleRatio, pan.y * scaleRatio);

    // Draw image centered
    const imgAspect = img.naturalWidth / img.naturalHeight;
    let drawW = targetW;
    let drawH = targetW / imgAspect;
    if (drawH < targetH) {
      drawH = targetH;
      drawW = targetH * imgAspect;
    }

    ctx.drawImage(img, -drawW / 2, -drawH / 2, drawW, drawH);
    ctx.restore();

    const croppedUrl = canvas.toDataURL("image/jpeg", 0.92);
    onCropComplete(croppedUrl);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
      <div className="bg-[#0c194b] border border-blue-900/60 rounded-3xl max-w-2xl w-full p-6 shadow-2xl space-y-5 text-slate-200 relative overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between border-b border-blue-900/40 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-blue-600/20 text-blue-400 border border-blue-500/30">
              <Crop className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">{title}</h3>
              <p className="text-xs text-slate-400">Crop, zoom, pan, and rotate your image before saving.</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onCancel}
            className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Aspect Ratio Selector */}
        <div className="flex items-center justify-between flex-wrap gap-2 text-xs">
          <span className="text-slate-400 font-medium">Aspect Ratio:</span>
          <div className="flex items-center gap-1.5 bg-slate-900/90 p-1 rounded-xl border border-slate-800">
            {(["1:1", "16:9", "4:3", "3:4", "free"] as AspectRatioOption[]).map((opt) => (
              <button
                key={opt}
                type="button"
                onClick={() => setAspect(opt)}
                className={`px-3 py-1 rounded-lg font-semibold transition-all ${
                  aspect === opt
                    ? "bg-blue-600 text-white shadow-md shadow-blue-500/20"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                {opt.toUpperCase()}
              </button>
            ))}
          </div>
        </div>

        {/* Crop Viewport Box */}
        <div
          ref={containerRef}
          onMouseDown={handleMouseDown}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          className={`relative w-full h-80 bg-slate-950 rounded-2xl overflow-hidden border-2 border-dashed border-blue-500/40 flex items-center justify-center select-none cursor-${
            isDragging ? "grabbing" : "grab"
          }`}
        >
          {/* Guide Overlay Grid */}
          <div className="absolute inset-0 pointer-events-none grid grid-cols-3 grid-rows-3 border border-blue-500/20">
            <div className="border-r border-b border-white/10" />
            <div className="border-r border-b border-white/10" />
            <div className="border-b border-white/10" />
            <div className="border-r border-b border-white/10" />
            <div className="border-r border-b border-white/10" />
            <div className="border-b border-white/10" />
            <div className="border-r border-white/10" />
            <div className="border-r border-white/10" />
            <div />
          </div>

          {/* Interactive Transformable Image */}
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
              alt="Source for Crop"
              className="max-h-full max-w-full object-contain pointer-events-none"
              draggable={false}
            />
          </div>

          <div className="absolute bottom-3 left-3 bg-slate-900/80 backdrop-blur px-2.5 py-1 rounded-lg text-[11px] text-slate-300 flex items-center gap-1.5 pointer-events-none border border-slate-800">
            <Move className="w-3.5 h-3.5 text-blue-400" /> Drag image to position
          </div>
        </div>

        {/* Zoom & Rotation Controls */}
        <div className="flex items-center justify-between gap-4 bg-slate-900/60 p-3 rounded-2xl border border-blue-900/30 text-xs">
          <div className="flex items-center gap-3 flex-1">
            <ZoomOut className="w-4 h-4 text-slate-400 shrink-0" />
            <input
              type="range"
              min="0.5"
              max="3"
              step="0.05"
              value={zoom}
              onChange={(e) => setZoom(parseFloat(e.target.value))}
              className="w-full accent-blue-500 cursor-pointer"
            />
            <ZoomIn className="w-4 h-4 text-slate-400 shrink-0" />
            <span className="font-mono text-slate-300 w-12 text-right">{Math.round(zoom * 100)}%</span>
          </div>

          <button
            type="button"
            onClick={() => setRotation((prev) => (prev + 90) % 360)}
            className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center gap-1.5 font-medium transition-colors shrink-0"
          >
            <RotateCw className="w-3.5 h-3.5" /> Rotate 90°
          </button>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={onCancel}
            className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={applyCrop}
            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-bold transition-all shadow-lg shadow-blue-500/25 flex items-center gap-2"
          >
            <Check className="w-4 h-4" /> Apply & Use Cropped Image
          </button>
        </div>
      </div>
    </div>
  );
}
