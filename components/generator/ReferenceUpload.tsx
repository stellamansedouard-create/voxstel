"use client";

import { useGeneratorStore } from "@/store/useGeneratorStore";
import ImageReferenceUpload from "./ImageReferenceUpload";
import TextReferenceUpload from "./TextReferenceUpload";

/**
 * Routes to the correct reference upload component based on category.
 * Video and Music have no reference upload (Claude can't analyze video/audio).
 */
export default function ReferenceUpload() {
  const { category } = useGeneratorStore();

  if (category === "image") return <ImageReferenceUpload />;
  if (category === "text") return <TextReferenceUpload />;
  return null;
}
