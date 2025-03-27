"use client";

import React, { useState, useEffect } from "react";
import Navbar from "@/components/navbar";
import PageBackground from "@/components/page-background";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { Bookmark, Search } from "lucide-react";
import { useDebounce } from "@/hooks/use-debounce";

type Article = {
  title: string;
  description: string;
  url: string;
  image?: string;
  expertName?: string; // Added for saved articles
  source?: { name: string }; // Added source property to Article type
};

const AiNewsPage = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [saveDialogOpen, setSaveDialogOpen] = useState(false);
  const [currentArticle, setCurrentArticle] = useState<Article | null>(null);
  const [linkedEntity, setLinkedEntity] = useState("");
  const { toast } = useToast();
const [suggestions, setSuggestions] = useState([]);
const [savedArticles, setSavedArticles] = useState<Article[]>([]);
const [showSavedNews, setShowSavedNews] = useState(false);
  const debouncedLinkedEntity = useDebounce(linkedEntity, 300);

interface NewsResponse {
  articles: Article[];
}

const fetchNews = async (query = "AI"): Promise<void> => {
  try {
    const response = await fetch(
      `/api/news/fetch?q=${encodeURIComponent(query)}&max=20`
    );
    const data: NewsResponse = await response.json();
    if (data.articles) {
      setArticles(
        data.articles.map((article: Article) => ({
          ...article,
          // Ensure compatibility with existing UI components
          url: article.url,
          title: article.title,
          description: article.description,
          image: article.image, // Ensure compatibility with existing UI components
        }))
      );
    }
  } catch (error) {
    console.error("Error fetching news:", error);
    toast({
      title: "Search Error",
      description: "Failed to fetch news articles. Please try again later.",
      variant: "destructive",
    });
  }
};

  useEffect(() => {
    fetchNews();
  }, []);

const fetchSavedNews = async () => {
  try {
    const response = await fetch("/api/news/saved");
    const data = await response.json();
    if (data.savedArticles) {
      setSavedArticles(data.savedArticles);
      setShowSavedNews(true);
    }
  } catch (error) {
    console.error("Error fetching saved news:", error);
    toast({
      title: "Error",
      description: "Failed to fetch saved news articles.",
      variant: "destructive",
    });
  }
};

const handleSearch = () => {
  setShowSavedNews(false);
    fetchNews(searchQuery);
  };

const handleSaveClick = (article: Article): void => { // Ensure article is typed with explicit return type
    setCurrentArticle(article);
    setSaveDialogOpen(true);
  };

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (debouncedLinkedEntity) {
        try {
          const response = await fetch(`/api/experts?name=${encodeURIComponent(debouncedLinkedEntity)}`);
          const data = await response.json();
          setSuggestions(data.map((expert: any) => expert.name));
        } catch (error) {
          console.error("Error fetching suggestions:", error);
        }
      } else {
        setSuggestions([]);
      }
    };

    fetchSuggestions();
  }, [debouncedLinkedEntity]);

  const handleSaveArticle = async () => {
    if (!currentArticle) return;

    try {
      const response = await fetch("/api/news", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: currentArticle.title,
          description: currentArticle.description,
          url: currentArticle.url,
          image: currentArticle.image,
          linkedEntity: linkedEntity,
        }),
      });

      if (response.ok) {
        toast({
          title: "Success",
          description: "Article saved successfully",
        });
        setSaveDialogOpen(false);
        setCurrentArticle(null);
        setLinkedEntity("");
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to save article");
      }
    } catch (error) {
      console.error("Error saving article:", error);
      toast({
        title: "Save Error",
        description: error instanceof Error ? error.message : "Failed to save article",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-black">
      <PageBackground intensity="low" color="#5d00ff" />
      <Navbar />
      <div className="container mx-auto py-10 relative">
        <h1 className="text-2xl font-bold mb-4 text-white">Top AI News</h1>
        <p className="text-gray-300 mb-6">Browse the latest AI news from around the world. Search for specific topics or save articles to your collection.</p>

<div className="flex items-center gap-2 mb-6">
  <Button onClick={fetchSavedNews} variant="outline">
    View Saved News
  </Button>
              <div className="relative">
                <Input
            placeholder="Search news articles"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-gray-900/70 border-gray-700 text-white"
                />
                {suggestions.length > 0 && (
                  <ul className="absolute z-10 bg-gray-800 border border-gray-700 mt-1 w-full max-h-40 overflow-y-auto">
                    {suggestions.map((suggestion, index) => (
                      <li
                        key={index}
                        className="px-4 py-2 hover:bg-gray-700 cursor-pointer"
                        onClick={() => setLinkedEntity(suggestion)}
                      >
                        {suggestion}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
          <Button onClick={handleSearch}>
            <Search className="h-4 w-4" />
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
{showSavedNews ? (
  savedArticles.length > 0 ? (
    savedArticles.map((article) => (
      <div
        key={article.url || Math.random().toString()}
        className="bg-gray-900/70 border-gray-700 rounded-lg shadow-md p-4 hover:shadow-xl transition duration-300 relative"
      >
        <a href={article.url} target="_blank" rel="noopener noreferrer">
          <h2 className="text-xl font-bold mb-2 text-blue-600 hover:text-blue-800 transition duration-200">
            {article.title || 'No Title'}
          </h2>
        </a>
        {article.image && (
          <img
            src={article.image}
            alt={article.title || 'News image'}
            className="w-full h-48 object-cover mb-4 rounded-md"
          />
        )}
        <p className="text-gray-300 leading-relaxed mb-3">{article.description || 'No description available'}</p>
        <div className="text-xs text-gray-400 truncate">
          Expert: {article.expertName || 'Unknown Expert'}
        </div>
      </div>
    ))
  ) : (
    <div className="col-span-3 text-center py-10">
      <h3 className="text-xl text-gray-400">No saved news articles found.</h3>
    </div>
  )
) : articles.length > 0 ? (
            articles.map((article) => (
              <div
                key={article.url || Math.random().toString()}
                className="bg-gray-900/70 border-gray-700 rounded-lg shadow-md p-4 hover:shadow-xl transition duration-300 relative"
              >
                <div className="absolute top-2 right-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleSaveClick(article)}
                    className="text-blue-600 hover:text-blue-800 hover:bg-blue-100"
                  >
                    <Bookmark className="h-5 w-5" />
                  </Button>
                </div>
                {article.url && (
                  <a href={article.url} target="_blank" rel="noopener noreferrer">
                    <h2 className="text-xl font-bold mb-2 text-blue-600 hover:text-blue-800 transition duration-200">
                      {article.title || 'No Title'}
                    </h2>
                  </a>
                )}
                {article.image && (
                  <img
                    src={article.image}
                    alt={article.title || 'News image'}
                    className="w-full h-48 object-cover mb-4 rounded-md"
                  />
                )}
                <p className="text-gray-300 leading-relaxed mb-3">{article.description || 'No description available'}</p>
                <div className="flex flex-wrap gap-2 mb-3">
                  <span className="bg-blue-600/30 text-blue-200 text-xs px-2 py-1 rounded">#ai</span>
                  <span className="bg-purple-600/30 text-purple-200 text-xs px-2 py-1 rounded">#news</span>
                  {article.source && (
                    <span className="bg-green-600/30 text-green-200 text-xs px-2 py-1 rounded">#{article.source.name.toLowerCase().replace(/\s+/g, '')}</span>
                  )}
                </div>
                {article.url && (
                  <div className="text-xs text-gray-400 truncate">
                    URL: <a href={article.url} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">{new URL(article.url).hostname}</a>
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className="col-span-3 text-center py-10">
              <h3 className="text-xl text-gray-400">No news articles found. Try a different search term.</h3>
            </div>
          )}
        </div>

        <Dialog open={saveDialogOpen} onOpenChange={setSaveDialogOpen}>
          <DialogContent className="sm:max-w-md bg-gray-900 border-gray-700 text-white">
            <DialogHeader>
              <DialogTitle>Save Article</DialogTitle>
            </DialogHeader>
            <div className="py-4">
              <h3 className="font-medium">Article: {currentArticle?.title}</h3>
<div className="relative">
  <Input
    placeholder="Link to Expert or Company"
    value={linkedEntity}
    onChange={(e) => setLinkedEntity(e.target.value)}
    className="mt-4 bg-gray-800 border-gray-700 text-white"
  />
  {suggestions.length > 0 && (
    <ul className="absolute z-10 bg-gray-800 border border-gray-700 mt-1 w-full max-h-40 overflow-y-auto">
      {suggestions.map((suggestion, index) => (
        <li
          key={index}
          className="px-4 py-2 hover:bg-gray-700 cursor-pointer"
          onClick={() => setLinkedEntity(suggestion)}
        >
          {suggestion}
        </li>
      ))}
    </ul>
  )}
</div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setSaveDialogOpen(false)}>Cancel</Button>
              <Button onClick={handleSaveArticle}>Save</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default AiNewsPage;
