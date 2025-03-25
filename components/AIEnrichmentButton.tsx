import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";

interface AIResult {
  id: number;
  info: string;
  approved: boolean | null;
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
];

const detailedResults: AIResult[] = [
  { id: 1, info: "Published 15 peer-reviewed papers on AI ethics.", approved: null },
  { id: 2, info: "PhD in Computer Science from Stanford University.", approved: null },
  { id: 3, info: "10+ years experience in AI-driven healthcare solutions.", approved: null },
  { id: 4, info: "Keynote speaker at NeurIPS and ICML conferences.", approved: null },
  { id: 5, info: "Recipient of the ACM AI Research Award 2023.", approved: null },
  { id: 6, info: "Developed a machine learning model for predicting patient outcomes.", approved: null },
  { id: 7, info: "Collaborated with Google AI on natural language processing projects.", approved: null },
  { id: 8, info: "Authored a book on the future of AI in society.", approved: null },
  { id: 9, info: "Led a team of 20 researchers at a top AI lab.", approved: null },
  { id: 10, info: "Holds multiple patents in AI technology.", approved: null },
  { id: 11, info: "Featured in Forbes 30 Under 30 in Technology.", approved: null },
  { id: 12, info: "Consultant for AI policy development at the UN.", approved: null },
  { id: 13, info: "Developed AI algorithms for autonomous vehicles.", approved: null },
  { id: 14, info: "Research focuses on AI fairness and bias mitigation.", approved: null },
  { id: 15, info: "Speaker at TEDx on AI and ethics.", approved: null },
  { id: 16, info: "Published a paper on AI-driven climate change solutions.", approved: null },
  { id: 17, info: "Advisor to startups in the AI healthcare sector.", approved: null },
  { id: 18, info: "Developed a chatbot for mental health support.", approved: null },
  { id: 19, info: "Research on AI's impact on job markets.", approved: null },
  { id: 20, info: "Collaborated with MIT on AI education initiatives.", approved: null },
];

const AIEnrichmentButton: React.FC = () => {
  const [results, setResults] = useState<AIResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [currentSearch, setCurrentSearch] = useState("");
  const [searchIndex, setSearchIndex] = useState(0);

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

  const handleAISearch = () => {
    setLoading(true);
    setOpen(true);
    setCurrentSearch(simulatedSearches[0]);
    setSearchIndex(1);

    setTimeout(() => {
      setResults(detailedResults);
      setLoading(false);
    }, 20000); // Simulate a 20-second search
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
    await fetch("/api/save-ai-data", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(approvedData),
    });
    alert("Data saved successfully!");
    setOpen(false);
  };

  return (
    <>
      <Button variant="dark-solid" size="sm" onClick={handleAISearch} disabled={loading}>
        {loading ? currentSearch : "AI-Enrichment"}
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>AI Enrichment Detailed Results</DialogTitle>
          </DialogHeader>

          {loading ? (
            <div className="py-4 text-center">{currentSearch}</div>
          ) : (
            results.map((result) => (
              <div key={result.id} className="flex items-center justify-between py-2">
                <p>{result.info}</p>
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
            ))
          )}

          {!loading && (
            <DialogFooter>
              <Button onClick={handleSave} disabled={!results.some((result) => result.approved)}>
                Save to MongoDB
              </Button>
            </DialogFooter>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default AIEnrichmentButton;
