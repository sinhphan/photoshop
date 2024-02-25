"use client"
import PhotoShop from "@/components/Photoshop";
import DesignProvider from "@/providers/DesignProvider";

export default function Home() {
  return <DesignProvider>
    <PhotoShop />
  </DesignProvider>
}
