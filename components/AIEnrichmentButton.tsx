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
  items?: Array<{
    key: string;
    value: string;
    approved: boolean | null;
  }>;
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

// Dummy functions to satisfy missing references
const parseTextIntoSections = (text: string): string[] => {
  return [];  // Dummy: return empty array or implement parsing logic if needed
};

const parseItemsFromSection = (
  section: string
): Array<{ key: string; value: string; approved: boolean | null }> => {
  return []; // Dummy: return empty array or implement parsing logic if needed
};

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
      console.log(`Starting enrichment for expert ID: ${expertId}`);
      setError(null);
    }
  }, [open, expertId]);

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
      console.log(`AIEnrichmentButton: Fetching expert data for ID: ${expertId}`);
      let expertData: any;
      const expertResponse = await fetch(`/api/experts/${expertId}`);
      if (!expertResponse.ok) {
        console.warn(`Failed to fetch expert data for ID: ${expertId}. Using fallback expert data.`);
        expertData = {
          id: expertId,
          name: "Fallback Expert",
          description: "No expert data available from API",
        };
      } else {
        expertData = await expertResponse.json();
      }
      
      // Call the Gemini API with the expert data
      const { GoogleGenerativeAI } = require("@google/generative-ai");
      const fs = require("fs");
      const mime = require("mime-types");

      const apiKey = "AIzaSyCDZtEfXhyxpnFEbGH7C6eCImgjKTfj1ns";
      const genAI = new GoogleGenerativeAI(apiKey);

      const model = genAI.getGenerativeModel({
        model: "gemini-2.0-flash",
      });

      const generationConfig = {
        temperature: 1,
        topP: 0.95,
        topK: 40,
        maxOutputTokens: 8192,
        responseModalities: [],
        responseMimeType: "text/plain",
      };

      const chatSession = model.startChat({
        generationConfig,
        history: [],
      });

      const inputMessage = `Enrich the following expert data: ${JSON.stringify(expertData)}. Please provide detailed insights and categorize the information appropriately. For each piece of information, ensure it is provided in a clear, separate format so that each individual data point can be approved or denied.`;
      const result = await chatSession.sendMessage(inputMessage);
      const candidates = result.response.candidates;
      const enrichmentResults = [];

      for (let candidate_index = 0; candidate_index < candidates.length; candidate_index++) {
        for (let part_index = 0; part_index < candidates[candidate_index].content.parts.length; part_index++) {
          const part = candidates[candidate_index].content.parts[part_index];
          if (part.inlineData) {
            try {
              const filename = `output_${candidate_index}_${part_index}.${mime.extension(part.inlineData.mimeType)}`;
              fs.writeFileSync(filename, Buffer.from(part.inlineData.data, 'base64'));
              console.log(`Output written to: ${filename}`);
            } catch (err) {
              console.error(err);
            }
          }
          // Process the text from the part; you can later expand this logic to split into sections or items if needed.
          enrichmentResults.push({
            id: candidate_index,
            info: part.text || "No text available",
            category: "Generated",
            approved: null,
            items: part.items || []
          });
        }
      }
      
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

  const handleItemApproval = (resultId: number, itemIndex: number, approved: boolean) => {
    setResults((prevResults: AIResult[]) =>
      prevResults.map((result: AIResult) => {
        if (result.id === resultId && result.items) {
          const newItems = result.items.map((item, index) =>
            index === itemIndex ? { ...item, approved } : item
          );
          return { ...result, items: newItems };
        }
        return result;
      })
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
                    <div key={result.id} className="border-b border-gray-100 last:border-0 py-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="font-semibold">{result.category || "Info"}:</span> {result.info}
                        </div>
                        <div className="flex gap-2">
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
                      {result.items && result.items.length > 0 && (
                        <ul className="ml-4 mt-2 space-y-2">
                          {result.items.map((item, index) => (
                            <li key={index} className="flex items-center justify-between">
                              <div>
                                <span className="font-semibold">{item.key}:</span> {item.value}
                              </div>
                              <div className="flex gap-2">
                                <Button
                                  size="sm"
                                  style={{ backgroundColor: item.approved === true ? "green" : undefined }}
                                  variant={item.approved === true ? "default" : "outline"}
                                  onClick={() => handleItemApproval(result.id, index, true)}
                                >
                                  Approve
                                </Button>
                                <Button
                                  size="sm"
                                  style={{ backgroundColor: item.approved === false ? "red" : undefined }}
                                  variant={item.approved === false ? "destructive" : "outline"}
                                  onClick={() => handleItemApproval(result.id, index, false)}
                                >
                                  Deny
                                </Button>
                              </div>
                            </li>
                          ))}
                        </ul>
                      )}
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
