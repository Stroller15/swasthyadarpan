"use client";

import { useState, useCallback } from "react";
import { Activity, FileText, Upload, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";

interface UploadCardProps {
  isAnalyzing: boolean;
  setIsAnalyzing: (isAnalyzing: boolean) => void;
  onAnalyze: () => void;
  analysisMethod: "url" | "upload";
  setAnalysisMethod: (method: "url" | "upload") => void;
}

export default function UploadCard({
  isAnalyzing,
  // setIsAnalyzing,
  onAnalyze,
  analysisMethod,
  setAnalysisMethod,
}: UploadCardProps) {
  const [fileUrl, setFileUrl] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const { toast } = useToast();

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) {
      setFile(droppedFile);
    }
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  }, []);

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const selectedFile = e.target.files?.[0];
      if (selectedFile) {
        setFile(selectedFile);
      }
    },
    []
  );

  const removeFile = useCallback(() => {
    setFile(null);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (analysisMethod === "upload" && file) {
      // setIsAnalyzing(true);
      const formData = new FormData();
      formData.append("file", file);

      try {
        const response = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });

        if (!response.ok) {
          throw new Error("File upload failed");
        }

        const result = await response.json();
        console.log("File processed:", result);
        toast({
          title: "File processed successfully",
          description: "Your medical report has been analyzed.",
        });
        onAnalyze();
      } catch (error) {
        console.error("Error:", error);
        toast({
          title: "Error",
          description: "There was a problem processing your file.",
          variant: "destructive",
        });
      } finally {
        // setIsAnalyzing(false);
      }
    } else if (analysisMethod === "url" && fileUrl) {
      // Handle URL analysis here
      onAnalyze();
    }
  };

  return (
    <Card className="max-w-2xl mx-auto mb-8 bg-white shadow-lg">
      <CardHeader>
        <CardTitle className="text-green-700">
          Upload Your Medical Report
        </CardTitle>
        <CardDescription>
          Upload your medical report file or provide a URL for analysis
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit}>
          <Tabs
            value={analysisMethod}
            onValueChange={(value) =>
              setAnalysisMethod(value as "url" | "upload")
            }
            className="w-full"
          >
            <TabsList className="grid w-full grid-cols-2 bg-green-100">
              <TabsTrigger
                value="url"
                className="data-[state=active]:bg-white data-[state=active]:text-green-700"
              >
                URL
              </TabsTrigger>
              <TabsTrigger
                value="upload"
                className="data-[state=active]:bg-white data-[state=active]:text-green-700"
              >
                Upload
              </TabsTrigger>
            </TabsList>
            <TabsContent value="url">
              <div className="flex space-x-2">
                <Input
                  placeholder="Enter report URL"
                  type="url"
                  value={fileUrl}
                  onChange={(e) => setFileUrl(e.target.value)}
                  className="flex-1 border-green-200 focus:ring-green-500"
                />
              </div>
            </TabsContent>
            <TabsContent value="upload">
              <div
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onClick={() => document.getElementById("file-upload")?.click()}
                className="border-2 border-dashed border-green-200 rounded-lg p-8 text-center cursor-pointer transition-colors hover:bg-green-50"
              >
                {file ? (
                  <div className="flex items-center justify-center space-x-2">
                    <FileText className="w-8 h-8 text-green-600" />
                    <span className="text-green-700 font-medium">
                      {file.name}
                    </span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="rounded-full"
                      onClick={(e) => {
                        e.stopPropagation();
                        removeFile();
                      }}
                    >
                      <X className="w-4 h-4 text-green-700" />
                    </Button>
                  </div>
                ) : (
                  <>
                    <Upload className="w-8 h-8 mx-auto mb-4 text-green-400" />
                    <p className="text-sm text-gray-600">
                      Drag and drop your file here, or click to select
                    </p>
                  </>
                )}
                <input
                  type="file"
                  className="hidden"
                  accept=".pdf,.jpg,.png,.jpeg"
                  id="file-upload"
                  onChange={handleFileChange}
                />
              </div>
            </TabsContent>
          </Tabs>
          <Button
            className="w-full mt-4 bg-green-600 hover:bg-green-700 text-white"
            disabled={
              isAnalyzing || (analysisMethod === "url" ? !fileUrl : !file)
            }
          >
            {isAnalyzing ? (
              <>
                <Activity className="mr-2 h-4 w-4 animate-spin" />
                Analyzing...
              </>
            ) : (
              <>
                <FileText className="mr-2 h-4 w-4" />
                Analyze Report
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
