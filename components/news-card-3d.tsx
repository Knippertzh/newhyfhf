"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Article {
  title: string;
  description: string;
  url: string;
  image?: string;
}

interface NewsCard3DProps {
  article: Article;
  onSave?: (article: Article) => void;
}

export function NewsCard3D({ article, onSave }: NewsCard3DProps) {
  const [rotation, setRotation] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    // Calculate rotation based on mouse position
    // We want subtle rotation, so we divide by a larger number
    const rotateY = ((x / rect.width) - 0.5) * 10; // -5 to 5 degrees
    const rotateX = ((y / rect.height) - 0.5) * -10; // 5 to -5 degrees (inverted)
    
    setRotation({ x: rotateX, y: rotateY });
  };

  const handleMouseLeave = () => {
    // Reset rotation when mouse leaves
    setRotation({ x: 0, y: 0 });
  };

  return (
    <div 
      className="perspective-1000 mb-4 transition-transform hover:scale-105"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <Card 
        className="bg-gray-900/70 border-gray-700 transform-style-preserve-3d transition-transform duration-200 ease-out shadow-lg hover:shadow-xl"
        style={{
          transform: `rotateX(${rotation.x}deg) rotateY(${rotation.y}deg)`,
          transformStyle: "preserve-3d",
        }}
      >
        {article.image && (
          <img
            src={article.image}
            alt={article.title}
            className="w-full h-32 object-cover rounded-t-md"
          />
        )}
        <CardHeader className="p-3">
          <CardTitle className="text-white text-base">{article.title}</CardTitle>
        </CardHeader>
        <CardContent className="p-3 pt-0">
          <p className="text-xs text-gray-400 mb-2">#ai #news</p>
          <div className="flex justify-between items-center">
            <button
              onClick={() => onSave?.(article)}
              className="px-3 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700 transition-colors"
            >
              Save
            </button>
            <a 
              href={article.url} 
              target="_blank" 
              rel="noopener noreferrer"
              className="px-3 py-1 bg-purple-600 text-white text-xs rounded hover:bg-purple-700 transition-colors"
            >
              Read
            </a>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
