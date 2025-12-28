import React, { useState, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Camera, Info, X, PlusCircle, ImagePlus } from "lucide-react";
import { toast } from "sonner";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getMedicineInfo, MedicineInfo } from "@/services/healthAIService";
import LoadingAnimation from "./LoadingAnimation";

const MedicineScanner = () => {
  const [activeTab, setActiveTab] = useState("text");
  const [isCapturing, setIsCapturing] = useState(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [showResults, setShowResults] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [medicineText, setMedicineText] = useState("");
  const [medicineInfo, setMedicineInfo] = useState<MedicineInfo | null>(null);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" }
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      
      setIsCapturing(true);
      toast.info("Camera activated. Position medicine packaging in frame.");
    } catch (error) {
      console.error("Error accessing camera:", error);
      toast.error("Could not access camera. Please check permissions or use text search instead.");
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      const tracks = stream.getTracks();
      
      tracks.forEach(track => track.stop());
      videoRef.current.srcObject = null;
      setIsCapturing(false);
    }
  };

  const handleCapture = () => {
    if (!videoRef.current || !canvasRef.current) return;
    
    const video = videoRef.current;
    const canvas = canvasRef.current;
    
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    
    const ctx = canvas.getContext("2d");
    if (ctx) {
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      const imageDataUrl = canvas.toDataURL("image/jpeg");
      setCapturedImage(imageDataUrl);
      stopCamera();
      toast.success("Image captured. Please enter the medicine name to search.");
      setActiveTab("text");
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      setCapturedImage(result);
      toast.success("Image uploaded. Please enter the medicine name to search.");
      setActiveTab("text");
    };
    
    reader.readAsDataURL(file);
  };

  const resetCapture = () => {
    setCapturedImage(null);
    setShowResults(false);
    setMedicineInfo(null);
    setMedicineText("");
  };

  const analyzeMedicine = async () => {
    if (!medicineText.trim()) {
      toast.error("Please enter a medicine name to search");
      return;
    }

    setIsLoading(true);
    setShowResults(false);

    try {
      const data = await getMedicineInfo(medicineText.trim());
      setMedicineInfo(data);
      setShowResults(true);
      toast.success("Medicine information retrieved successfully");
    } catch (error) {
      console.error("Error analyzing medicine:", error);
      toast.error(error instanceof Error ? error.message : "Failed to get medicine information");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="bg-gradient-to-r from-primary to-primary/80 text-primary-foreground">
          <CardTitle className="flex items-center gap-2">
            <Camera className="h-6 w-6" />
            <span>Medicine Scanner</span>
          </CardTitle>
          <CardDescription className="text-primary-foreground/80">
            Search for detailed medicine information
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          {!showResults ? (
            <div className="space-y-6">
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="text">Text Search</TabsTrigger>
                  <TabsTrigger value="camera">Camera Scan</TabsTrigger>
                </TabsList>
                
                <TabsContent value="text" className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">Enter Medicine Name</label>
                    <div className="flex gap-2">
                      <Input
                        placeholder="Type medicine name (e.g., Paracetamol, Ibuprofen)..."
                        value={medicineText}
                        onChange={(e) => setMedicineText(e.target.value)}
                        className="flex-1"
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            analyzeMedicine();
                          }
                        }}
                      />
                      <Button
                        onClick={analyzeMedicine}
                        disabled={!medicineText.trim() || isLoading}
                      >
                        Search
                      </Button>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Enter the medicine name from the packaging for best results
                    </p>
                  </div>
                  
                  {capturedImage && (
                    <div className="border rounded-lg overflow-hidden">
                      <div className="aspect-video relative">
                        <img 
                          src={capturedImage} 
                          alt="Captured medicine" 
                          className="w-full h-full object-contain bg-muted"
                        />
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={resetCapture}
                          className="absolute top-2 right-2 rounded-full w-8 h-8 p-0"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  )}
                </TabsContent>
                
                <TabsContent value="camera" className="space-y-4">
                  {!capturedImage ? (
                    <div className="relative border-2 border-dashed border-border rounded-lg p-3">
                      {isCapturing ? (
                        <div className="aspect-video bg-muted rounded-lg overflow-hidden relative">
                          <video
                            ref={videoRef}
                            autoPlay
                            playsInline
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute top-4 right-4">
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={stopCamera}
                              className="rounded-full w-8 h-8 p-0"
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
                            <Button onClick={handleCapture}>
                              Capture Image
                            </Button>
                          </div>
                          <div className="absolute inset-0 pointer-events-none border-4 border-primary/40 rounded-md"></div>
                        </div>
                      ) : (
                        <div className="min-h-[200px] flex flex-col items-center justify-center gap-4">
                          <div className="p-4 rounded-full bg-primary/10">
                            <Camera className="h-8 w-8 text-primary" />
                          </div>
                          <div className="text-center">
                            <h3 className="font-medium mb-1 text-foreground">Scan Medicine Package</h3>
                            <p className="text-sm text-muted-foreground mb-4">
                              Take a photo of your medicine for reference
                            </p>
                          </div>
                          <div className="flex gap-3">
                            <Button onClick={startCamera}>
                              Start Camera
                            </Button>
                            <Button 
                              variant="outline" 
                              onClick={() => fileInputRef.current?.click()}
                            >
                              <ImagePlus className="h-4 w-4 mr-2" />
                              Upload Image
                            </Button>
                            <input
                              ref={fileInputRef}
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={handleFileUpload}
                            />
                          </div>
                        </div>
                      )}
                      <canvas ref={canvasRef} className="hidden" />
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="border rounded-lg overflow-hidden">
                        <div className="aspect-video relative">
                          <img 
                            src={capturedImage} 
                            alt="Captured medicine" 
                            className="w-full h-full object-contain bg-muted"
                          />
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={resetCapture}
                            className="absolute top-2 right-2 rounded-full w-8 h-8 p-0"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground text-center">
                        Switch to Text Search tab to enter the medicine name
                      </p>
                    </div>
                  )}
                </TabsContent>
              </Tabs>
              
              {isLoading && (
                <div className="flex flex-col items-center justify-center py-8">
                  <LoadingAnimation />
                  <p className="mt-4 text-sm text-muted-foreground">Getting medicine information...</p>
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-6">
              {medicineInfo && (
                <div>
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h2 className="text-2xl font-semibold text-primary">{medicineInfo.name}</h2>
                      <p className="text-muted-foreground mt-1">{medicineInfo.description}</p>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={resetCapture}
                    >
                      New Search
                    </Button>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg text-foreground">What It's Used For</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ul className="list-disc pl-5 space-y-1 text-foreground">
                          {medicineInfo.usedFor.map((use, index) => (
                            <li key={index}>{use}</li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg text-foreground">Ingredients</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ul className="list-disc pl-5 space-y-1 text-foreground">
                          {medicineInfo.ingredients.map((ingredient, index) => (
                            <li key={index}>{ingredient}</li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg text-foreground">Dosage Information</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-foreground">{medicineInfo.dosage}</p>
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg text-foreground">Side Effects</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ul className="list-disc pl-5 space-y-1 text-foreground">
                          {medicineInfo.sideEffects.map((effect, index) => (
                            <li key={index}>{effect}</li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg text-foreground">Warnings</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ul className="list-disc pl-5 space-y-1 text-destructive">
                          {medicineInfo.warnings.map((warning, index) => (
                            <li key={index}>{warning}</li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg text-foreground">Drug Interactions</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ul className="list-disc pl-5 space-y-1 text-foreground">
                          {medicineInfo.interactions.map((interaction, index) => (
                            <li key={index}>{interaction}</li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>
                  </div>
                  
                  <Alert className="mt-6 bg-primary/5 border-primary/20">
                    <Info className="h-4 w-4 text-primary" />
                    <AlertDescription className="text-muted-foreground">
                      This information is for reference only. Always follow your doctor's advice and read the package insert.
                    </AlertDescription>
                  </Alert>
                  
                  <div className="mt-6 flex justify-center">
                    <Button variant="outline">
                      <PlusCircle className="h-4 w-4 mr-2" />
                      Add to My Medications
                    </Button>
                  </div>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default MedicineScanner;
