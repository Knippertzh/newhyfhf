"use client";

import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Newspaper, Search, Database } from "lucide-react"; // Added Search, Database icons
import { NewsCard3D } from "./news-card-3d";
import { useToast } from "./ui/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"; // Added Tabs
import { Progress } from "@/components/ui/progress"; // Added Progress component

interface Article {
  title: string;
  description: string;
  url: string;
  image?: string;
  urlToImage?: string; // NewsAPI uses this property
  savedAt?: Date | string; // Added for saved articles
}

interface ExpertNewsPopupProps {
  expertId: string;
  expertName: string;
  companyName?: string;
}

export function ExpertNewsPopup({ expertId, expertName, companyName }: ExpertNewsPopupProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [savedArticles, setSavedArticles] = useState<Article[]>([]);
  const [geminiSearchResults, setGeminiSearchResults] = useState<Article[]>([]); // State for Gemini results
  const [loadingSaved, setLoadingSaved] = useState(false); // Separate loading states
  const [loadingGemini, setLoadingGemini] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("saved"); // Control which tab is shown
  const { toast } = useToast();
  // New state for enhanced loading indicator
  const [geminiProgress, setGeminiProgress] = useState(0);
  const [geminiSearchQuery, setGeminiSearchQuery] = useState("");
  const [geminiElapsedTime, setGeminiElapsedTime] = useState<number | null>(null);

  // Fetch only saved news initially or when tab is switched
  const fetchSavedNews = async () => {
    if (!expertId) return;
    setLoadingSaved(true);
    setError(null);
    try {
      // Assuming the endpoint can return just saved news, or we filter client-side
      // Let's modify the API call later if needed. For now, assume it returns saved news.
      const response = await fetch(`/api/news/expert/${expertId}?source=saved`); // Added query param

      if (!response.ok) {
        let errorMsg = 'Failed to fetch saved news';
        try {
          const errorData = await response.json();
          errorMsg = errorData.error || `Failed to fetch saved news (status: ${response.status})`;
        } catch (parseError) {
          errorMsg = `Failed to fetch saved news (status: ${response.status})`;
        }
        throw new Error(errorMsg);
      }
      
      const data = await response.json(); // Expect { saved: [] } or just []
      setSavedArticles(data.saved || data || []); // Adjust based on actual API response
      setError(null);

    } catch (err: any) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred fetching saved news';
      console.error('Error fetching saved news:', errorMessage, err);
      setError(errorMessage);
      setSavedArticles([]);
    } finally {
      setLoadingSaved(false);
    }
  };

  // Function to search news with Gemini
  const searchWithGemini = async () => {
    if (!expertName) return;
    
    const queryText = `news about ${expertName} (last 360 days)`;
    setGeminiSearchQuery(queryText); // Store the query text
    setLoadingGemini(true);
    setError(null);
    setGeminiSearchResults([]);
    setGeminiProgress(0); // Reset progress
    setGeminiElapsedTime(null); // Reset timer
    const startTime = Date.now(); // Start timer

    // Simulate progress
    const progressInterval = setInterval(() => {
      setGeminiProgress(prev => {
        const next = prev + Math.random() * 10; // Simulate variable progress
        return Math.min(next, 95); // Don't let simulation reach 100% prematurely
      });
      // Update elapsed time during progress
      setGeminiElapsedTime((Date.now() - startTime) / 1000);
    }, 500);

    try {
      const response = await fetch(`/api/news/gemini-search`, { // New endpoint
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ expertName, days: 360 }) // Send name and days
      });

      if (!response.ok) {
        let errorMsg = 'Failed to search news with Gemini';
        try {
          const errorData = await response.json();
          errorMsg = errorData.error || `Gemini search failed (status: ${response.status})`;
        } catch (parseError) {
          errorMsg = `Gemini search failed (status: ${response.status})`;
        }
        throw new Error(errorMsg);
      }

      const data = await response.json(); // Expect { articles: [] }
      setGeminiSearchResults(data.articles || []);
      setError(null);
      // If successful, set progress to 100%
      setGeminiProgress(100);

    } catch (err: any) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred during Gemini search';
      console.error('Error searching with Gemini:', errorMessage, err);
      setError(errorMessage);
      setGeminiSearchResults([]);
      toast({
        title: "Gemini Search Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      clearInterval(progressInterval); // Stop simulating progress
      setLoadingGemini(false);
      const endTime = Date.now();
      setGeminiElapsedTime((endTime - startTime) / 1000); // Store final elapsed time in seconds
      // Ensure progress shows 100% if successful, or stays where it was if error
      if (!error) setGeminiProgress(100); 
    }
  };

  // Fetch saved news when the dialog opens or tab is switched to 'saved'
  // Also reset Gemini state when dialog opens or tab changes
  useEffect(() => {
    if (isOpen) {
      if (activeTab === "saved") {
        fetchSavedNews();
      }
      // Reset Gemini state when dialog opens initially or tab changes
      setGeminiSearchResults([]);
      setError(null);
      setGeminiProgress(0);
      setGeminiSearchQuery("");
      setGeminiElapsedTime(null);
    }
  }, [isOpen, expertId, activeTab]);


  const handleSaveArticle = async (article: Article) => {
    // This function now likely saves articles found via Gemini
    try {
      const response = await fetch("/api/news", { // Use the existing save endpoint
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: article.title,
          description: article.description,
          url: article.url,
          image: article.image || article.urlToImage,
          linkedEntity: expertName,
          entityType: "expert",
          expertId: expertId,
        }),
      });

      if (response.ok) {
        // Optionally refetch saved news or update state optimistically
        fetchSavedNews(); // Refetch saved news after saving
        toast({
          title: "Success",
          description: "Article saved successfully",
        });
      } else {
        const errorData = await response.json().catch(() => ({})); // Try to get error details
        toast({
          title: "Error",
          description: errorData.error || "Failed to save article",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error saving article:", error);
      const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    }
  };

  return (
    <>
      <Button 
        onClick={() => setIsOpen(true)} 
        variant="dark-solid" 
        size="sm"
      >
        <Newspaper className="h-4 w-4 mr-2" />
        NEWS
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        {/* Increased width slightly */}
        <DialogContent className="bg-gray-900 border-gray-700 text-white max-w-5xl max-h-[85vh] overflow-y-auto"> 
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-white">
              News Articles for {expertName}
              {companyName && ` - ${companyName}`}
            </DialogTitle>
            {/* Added DialogDescription for accessibility */}
            <DialogDescription className="text-gray-400 sr-only"> 
              View saved news articles or search for recent news about {expertName} using Gemini.
            </DialogDescription>
          </DialogHeader>

          {/* Tabs for switching between Saved and Gemini Search */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2 bg-gray-800">
              <TabsTrigger value="saved" className="data-[state=active]:bg-purple-600 data-[state=active]:text-white">
                <Database className="h-4 w-4 mr-2" /> Saved News
              </TabsTrigger>
              <TabsTrigger value="gemini" className="data-[state=active]:bg-purple-600 data-[state=active]:text-white">
                <Search className="h-4 w-4 mr-2" /> Search with Gemini
              </TabsTrigger>
            </TabsList>

            {/* Saved News Content */}
            <TabsContent value="saved">
              <div className="py-4 min-h-[300px]"> {/* Added min-height */}
                {loadingSaved ? (
                  <div className="flex justify-center items-center py-10">
                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-purple-500"></div>
                  </div>
                ) : error ? (
                  <div className="text-center py-10">
                    <p className="text-red-400">{error}</p>
                    <Button onClick={fetchSavedNews} variant="outline" className="mt-4">Try Again</Button>
                  </div>
                ) : savedArticles.length === 0 ? (
                  <p className="text-center py-10 text-gray-400">No saved news articles found for this expert.</p>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {savedArticles.map((article, index) => (
                      <NewsCard3D
                        key={`saved-${article.url}-${index}`}
                        article={article}
                        isSaved={true}
                      />
                    ))}
                  </div>
                )}
              </div>
            </TabsContent>

            {/* Gemini Search Content */}
            <TabsContent value="gemini">
              <div className="py-4 min-h-[300px]"> {/* Added min-height */}
                <div className="flex justify-center mb-4">
                   <Button onClick={searchWithGemini} disabled={loadingGemini}>
                     {loadingGemini ? "Searching..." : `Search News for ${expertName} (Last 360 Days)`}
                   </Button>
                </div>
                {loadingGemini ? (
                  // Enhanced Loading Indicator
                  <div className="flex flex-col items-center justify-center py-10 space-y-3">
                     <p className="text-sm text-purple-300">Searching: {geminiSearchQuery}</p>
                     <Progress value={geminiProgress} className="w-[60%]" />
                     <p className="text-xs text-gray-400">{Math.round(geminiProgress)}%</p>
                     {geminiElapsedTime !== null && (
                       <p className="text-xs text-gray-500">Elapsed time: {geminiElapsedTime.toFixed(1)}s</p>
                     )}
                  </div>
                ) : error ? ( // Display Gemini-specific errors here
                  <div className="text-center py-10">
                    <p className="text-red-400">{error}</p>
                    {/* Optionally add a retry button here too */}
                    <Button onClick={searchWithGemini} variant="outline" className="mt-4">Retry Search</Button>
                  </div>
                ) : geminiSearchResults.length === 0 ? (
                   <p className="text-center py-10 text-gray-400">Click the button above to search for recent news using Gemini.</p>
                ) : (
                  <>
                    {geminiElapsedTime !== null && (
                       <p className="text-xs text-gray-500 text-center mb-4">Search completed in {geminiElapsedTime.toFixed(1)}s</p>
                     )}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {geminiSearchResults.map((article, index) => (
                        <NewsCard3D
                          key={`gemini-${article.url}-${index}`}
                          article={article}
                          onSave={handleSaveArticle} // Allow saving Gemini results
                          isSaved={savedArticles.some(saved => saved.url === article.url)} // Check if already saved
                        />
                      ))}
                    </div>
                  </>
                )}
              </div>
            </TabsContent>
          </Tabs>

          <DialogFooter className="mt-4"> {/* Moved footer outside Tabs */}
            <Button 
              onClick={() => setIsOpen(false)} 
              variant="outline"
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
