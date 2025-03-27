"use client";

import { Button } from "@/components/ui/button";
import { Share } from "lucide-react";
import { useEffect } from "react";

export default function ShareButton() {
  useEffect(() => {
    // This component will be detected by the share-modal.js script
    // No need to do anything here as the script will attach the event listener
  }, []);

  return (
    <Button className="share-button" variant="outline" size="sm">
      <Share className="h-4 w-4 mr-2" />
      Share
    </Button>
  );
}