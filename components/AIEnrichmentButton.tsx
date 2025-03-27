          console.log(`AIEnrichmentButton: Fetching expert data for ID: ${id}`);
          const expertResponse = await fetch(`/api/experts/${id}`);
import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";

interface AIResult {
  id: number;
  info: string;
  approved: boolean | null;
  category?: string;
}

const simulatedSearches = [
  "Analyzing publications...",
  "Scanning academic databases...",
  "Reviewing professional experience...",
  "Gathering educational background...",
  "Checking industry contributions...",
  "Compiling expert insights...",
  "Cross-referencing AI research...",
  "Extracting relevant achievements...",
  "Searching for awards and recognitions...",
  "Finding work history and collaborations...",
];

// Sample results for testing UI - will be replaced with actual API results
const sampleResults: AIResult[] = [
  { id: 1, info: "Published 15 peer-reviewed papers on AI ethics.", approved: null, category: "Publications" },
  { id: 2, info: "PhD in Computer Science from Stanford University.", approved: null, category: "Education" },
  { id: 3, info: "10+ years experience in AI-driven healthcare solutions.", approved: null, category: "Experience" },
  { id: 4, info: "Keynote speaker at NeurIPS and ICML conferences.", approved: null, category: "Speaking" },
  { id: 5, info: "Recipient of the ACM AI Research Award 2023.", approved: null, category: "Awards" },
  { id: 6, info: "Developed a machine learning model for predicting patient outcomes.", approved: null, category: "Projects" },
  { id: 7, info: "Collaborated with Google AI on natural language processing projects.", approved: null, category: "Collaborations" },
  { id: 8, info: "Authored a book on the future of AI in society.", approved: null, category: "Publications" },
  { id: 9, info: "Led a team of 20 researchers at a top AI lab.", approved: null, category: "Leadership" },
  { id: 10, info: "Holds multiple patents in AI technology.", approved: null, category: "Patents" },
];

const AIEnrichmentButton: React.FC = () => {
  const params = useParams();
  const expertId = params?.id as string;
  
  const [results, setResults] = useState<AIResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [currentSearch, setCurrentSearch] = useState("");
  const [searchIndex, setSearchIndex] = useState(0);
  
  // New state for enrichment options
  const [enrichmentType, setEnrichmentType] = useState("standard");
  const [customKeywords, setCustomKeywords] = useState("");
  const [showOptions, setShowOptions] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (loading) {
      interval = setInterval(() => {
        setCurrentSearch(simulatedSearches[searchIndex % simulatedSearches.length]);
        setSearchIndex((prev) => prev + 1);
      }, 2000);
    }
    return () => clearInterval(interval);
  }, [loading, searchIndex]);
  
  // Reset the form when dialog is closed
  useEffect(() => {
    if (!open) {
      setShowOptions(true);
      setEnrichmentType("standard");
      setCustomKeywords("");
      setError(null);
    }
  }, [open]);

  const handleAISearch = () => {
    setOpen(true);
  };
  
  const startEnrichment = async () => {
    if (enrichmentType === "custom" && !customKeywords.trim()) {
      setError("Please enter keywords for custom enrichment");
      return;
    }
    
    setError(null);
    setShowOptions(false);
    setLoading(true);
    setCurrentSearch(simulatedSearches[0]);
    setSearchIndex(1);
    
    try {
      // Fetch expert data first
      const expertResponse = await fetch(`/api/experts/${expertId}`);
      if (!expertResponse.ok) {
        throw new Error("Failed to fetch expert data");
      }
      
      const expertData = await expertResponse.json();
      
      // Call the Gemini API with the expert data
      const geminiResponse = await fetch("/api/gemini", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          expertData,
          customKeywords: enrichmentType === "custom" ? customKeywords : ""
        }),
      });
      
      if (!geminiResponse.ok) {
        const errorData = await geminiResponse.json();
        throw new Error(errorData.error || "Failed to process with Gemini API");
      }
      
      const geminiData = await geminiResponse.json();
      
      if (!geminiData.success) {
        throw new Error(geminiData.error || "Failed to get valid response from Gemini");
      }
      
      // Transform the data to match our AIResult interface
      const enrichmentResults = geminiData.enrichmentData.map((item: any) => ({
        id: item.id,
        info: item.info,
        category: item.category,
        approved: null
      }));
      
      setResults(enrichmentResults);
      setLoading(false);
    } catch (err) {
      console.error("Error during AI enrichment:", err);
      setError("An error occurred during AI enrichment");
      setLoading(false);
    }
  };

  const handleApproval = (id: number, approved: boolean) => {
    setResults((prevResults: AIResult[]) =>
      prevResults.map((result: AIResult) =>
        result.id === id ? { ...result, approved } : result
      )
    );
  };

  const handleSave = async () => {
    const approvedData = results.filter((result: AIResult) => result.approved);
    
    try {
      const response = await fetch("/api/save-ai-data", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          expertId,
          enrichmentData: approvedData
        }),
      });
      
      if (!response.ok) {
        throw new Error("Failed to save data");
      }
      
      const result = await response.json();
      toast({
        title: "Success",
        description: "AI enrichment data saved successfully!",
        variant: "default",
      });
      setOpen(false);
      
      // Refresh the page to show updated expert data
      window.location.reload();
    } catch (err) {
      console.error("Error saving AI enrichment data:", err);
      setError("Failed to save data. Please try again.");
    }
  };

  return (
    <>
      <Button variant="dark-solid" size="sm" onClick={handleAISearch} disabled={loading}>
        {loading ? currentSearch : "AI-Enrichment"}
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-md md:max-w-2xl">
          <DialogHeader>
            <DialogTitle>AI Enrichment</DialogTitle>
          </DialogHeader>
          
          {showOptions ? (
            <div className="py-4">
              <RadioGroup value={enrichmentType} onValueChange={setEnrichmentType} className="space-y-4">
                <div className="flex items-start space-x-2">
                  <RadioGroupItem value="standard" id="standard" />
                  <div className="grid gap-1.5">
                    <Label htmlFor="standard" className="font-medium">Standard AI Enrichment</Label>
                    <p className="text-sm text-muted-foreground">
                      Automatically enrich expert data with comprehensive information from various sources.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-2">
                  <RadioGroupItem value="custom" id="custom" />
                  <div className="grid gap-1.5 w-full">
                    <Label htmlFor="custom" className="font-medium">Custom Enrichment</Label>
                    <p className="text-sm text-muted-foreground mb-2">
                      Focus on specific areas of interest (e.g., work history, awards, publications).
                    </p>
                    <Textarea 
                      placeholder="Enter keywords to focus on (e.g., awards, publications, work history)"
                      value={customKeywords}
                      onChange={(e) => setCustomKeywords(e.target.value)}
                      className={enrichmentType === "custom" ? "" : "opacity-50"}
                      disabled={enrichmentType !== "custom"}
                    />
                  </div>
                </div>
              </RadioGroup>
              
              {error && <p className="text-red-500 mt-2 text-sm">{error}</p>}
              
              <DialogFooter className="mt-6">
                <Button onClick={startEnrichment}>Start Enrichment</Button>
              </DialogFooter>
            </div>
          ) : loading ? (
            <div className="py-8 text-center">
              <div className="animate-pulse mb-4">{currentSearch}</div>
              <div className="h-2 bg-gray-200 rounded-full max-w-md mx-auto mb-2.5"></div>
              <div className="h-2 bg-gray-200 rounded-full max-w-sm mx-auto"></div>
            </div>
          ) : (
            <>
              <div className="max-h-[60vh] overflow-y-auto py-2">
                {results.length > 0 ? (
                  results.map((result) => (
                    <div key={result.id} className="flex items-start justify-between py-3 border-b border-gray-100 last:border-0">
                      <div className="pr-4">
                        {result.category && (
                          <span className="inline-block px-2 py-1 text-xs rounded-full bg-purple-100 text-purple-800 mb-1">
                            {result.category}
                          </span>
                        )}
                        <p>{result.info}</p>
                      </div>
                      <div className="flex gap-2 shrink-0">
                        <Button
                          size="sm"
                          style={{ backgroundColor: result.approved === true ? "green" : undefined }}
                          variant={result.approved === true ? "default" : "outline"}
                          onClick={() => handleApproval(result.id, true)}
                        >
                          Approve
                        </Button>
                        <Button
                          size="sm"
                          style={{ backgroundColor: result.approved === false ? "red" : undefined }}
                          variant={result.approved === false ? "destructive" : "outline"}
                          onClick={() => handleApproval(result.id, false)}
                        >
                          Deny
                        </Button>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-center py-4 text-gray-500">No enrichment results found</p>
                )}
              </div>
              
              {error && <p className="text-red-500 mt-2 text-sm">{error}</p>}
              
              <DialogFooter className="mt-4">
                <Button onClick={handleSave} disabled={!results.some((result) => result.approved)}>
                  Save to MongoDB
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default AIEnrichmentButton;
