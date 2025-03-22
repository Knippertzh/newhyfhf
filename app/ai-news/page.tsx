"use client";

import React, { useState, useEffect } from "react";
import Navbar from "@/components/navbar";

interface Article {
  title: string;
  description: string;
  url: string;
  image?: string;
}

const AiNewsPage = () => {
  const [articles, setArticles] = useState<Article[]>([]);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await fetch(
          "https://gnews.io/api/v4/top-headlines?category=ai&lang=en&country=us&max=6&q=AI&apikey=e050e098c2b318a7625b9bec0a069914"
        );
        const data = await response.json();
        if (data.articles) {
          setArticles(data.articles);
        }
      } catch (error) {
        console.error("Error fetching news:", error);
      }
    };

    fetchNews();
  }, []);

  return (
    <div>
      <Navbar />
      <div className="container mx-auto py-10">
        <h1 className="text-2xl font-bold mb-4">AI News Management</h1>
        {/* Newspaper Management System */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {articles.map((article) => (
            <div
              key={article.url}
              className="bg-white rounded-lg shadow-md p-4 hover:shadow-xl transition duration-300"
            >
              <a href={article.url} target="_blank" rel="noopener noreferrer">
                <h2 className="text-xl font-bold mb-2 text-blue-600 hover:text-blue-800 transition duration-200">
                  {article.title}
                </h2>
              </a>
              {article.image && (
                <img
                  src={article.image}
                  alt={article.title}
                  className="w-full h-48 object-cover mb-4 rounded-md"
                />
              )}
              <p className="text-gray-700 leading-relaxed">{article.description}</p>
              <div className="mt-4">
                <span className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">
                  #ai
                </span>
                <span className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">
                  #news
                </span>
              </div>
            </div>
          ))}
        </div>
        <div className="container mx-auto py-10">
          <h2 className="text-2xl font-bold mb-4">Working Section</h2>
          <p>This is the working section.</p>
        </div>
      </div>
    </div>
  );
};

export default AiNewsPage;
