"use client";

import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Newspaper } from "lucide-react";
import { NewsCard3D } from "./news-card-3d";
import { useToast } from "./ui/use-toast";

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
  // Separate state for saved and external articles
  const [savedArticles, setSavedArticles] = useState<Article[]>([]);
  const [externalArticles, setExternalArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [externalApiError, setExternalApiError] = useState<string | null>(null); // State for external API specific errors
  const { toast } = useToast();

  const fetchExpertNews = async () => {
    if (!expertId) return;
    
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(`/api/news/expert/${expertId}`);

      if (!response.ok) {
        // Try to get more specific error from backend response
        let errorMsg = 'Failed to fetch news';
        try {
          const errorData = await response.json();
          errorMsg = errorData.error || `Failed to fetch news (status: ${response.status})`;
        } catch (parseError) {
          // Ignore if response body is not JSON or empty
          errorMsg = `Failed to fetch news (status: ${response.status})`;
        }
        throw new Error(errorMsg);
      }
      
      const data = await response.json(); // Expect { saved: [], external: [], externalApiError: null | string }
      
      // Set saved articles (assuming they already match the Article interface)
      setSavedArticles(data.saved || []);
      
      // Set external articles (already mapped in the API route)
      setExternalArticles(data.external || []);

      // Set external API error if present
      setExternalApiError(data.externalApiError || null);
      
      // Clear general error if fetch was ok, even if external API had issues
      setError(null); 

    } catch (err: any) { // Catches errors fetching from *our* API
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
      console.error('Error fetching expert news data:', errorMessage, err); // Log the full error object too
      setError(errorMessage); // Show the specific error message in the UI
      // Clear article states on general fetch error
      setSavedArticles([]); // Clear saved articles
      setExternalArticles([]); // Clear external articles
      setExternalApiError(null); // Clear external API error state
      toast({
        title: "Error",
        description: errorMessage, // Show the specific error in the toast
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchExpertNews();
    }
  }, [isOpen, expertId]);

  const handleSaveArticle = async (article: Article) => {
    try {
      const response = await fetch("/api/news", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: article.title,
          description: article.description,
          url: article.url,
          image: article.image || article.urlToImage,
          linkedEntity: expertName, // Keep for context, might be removable later
          entityType: "expert",
          expertId: expertId, // Add expertId to the payload
        }),
      });

      if (response.ok) {
        toast({
          title: "Success",
          description: "Article saved successfully",
        });
      } else {
        toast({
          title: "Error",
          description: "Failed to save article",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error saving article:", error);
      toast({
        title: "Error",
        description: "Failed to save article",
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
          </DialogHeader>

          <div className="py-4">
            {loading ? (
              <div className="flex justify-center items-center py-10">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
              </div>
            ) : error ? ( // General fetch error
              <div className="text-center py-10">
                <p className="text-red-400">{error}</p>
                <Button onClick={fetchExpertNews} variant="outline" className="mt-4">Try Again</Button>
              </div>
            ) : savedArticles.length === 0 && externalArticles.length === 0 ? ( // No articles at all
              <div className="text-center py-10">
                <p className="text-gray-400">No news articles found for this expert.</p>
                {externalApiError && <p className="text-yellow-500 text-sm mt-2">External API issue: {externalApiError}</p>}
              </div>
            ) : (
              // Display articles
              <div className="space-y-6">
                {/* Saved Articles Section */}
                {savedArticles.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold text-purple-300 mb-3 border-b border-gray-700 pb-1">Saved News</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {savedArticles.map((article, index) => (
                        <NewsCard3D 
                          key={`saved-${article.url}-${index}`} 
                          article={article} 
                          // No onSave prop for already saved articles
                          isSaved={true} // Add a prop to indicate it's saved
                        />
                      ))}
                    </div>
                  </div>
                )}

                {/* External Articles Section */}
                {externalArticles.length > 0 && (
                   <div>
                    <h3 className="text-lg font-semibold text-purple-300 mb-3 border-b border-gray-700 pb-1">Recent News</h3>
                     {externalApiError && <p className="text-yellow-500 text-sm mb-2">External API issue: {externalApiError}</p>}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {externalArticles.map((article, index) => (
                        <NewsCard3D 
                          key={`external-${article.url}-${index}`} 
                          article={article} 
                          onSave={handleSaveArticle} // Only external articles can be saved
                          isSaved={false}
                        />
                      ))}
                    </div>
                  </div>
                )}
                 {/* Show external API error even if there are saved articles */}
                 {savedArticles.length > 0 && externalArticles.length === 0 && externalApiError && (
                   <p className="text-yellow-500 text-sm mt-4 text-center">Could not fetch recent news: {externalApiError}</p>
                 )}
              </div>
            )}
          </div>

          <DialogFooter>
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
