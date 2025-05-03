
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { HealthMetric, metricTypes } from "./health-tracker/healthTrackerTypes";
import MetricChart from "./health-tracker/MetricChart";
import MetricList from "./health-tracker/MetricList";
import MetricFormDialog from "./health-tracker/MetricFormDialog";

const HealthProgressTracker = () => {
  const [metrics, setMetrics] = useState<HealthMetric[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingMetric, setEditingMetric] = useState<HealthMetric | null>(null);
  const [currentMetricType, setCurrentMetricType] = useState(metricTypes[0].id);
  const [currentView, setCurrentView] = useState<"chart" | "list">("chart");
  
  // Load saved metrics from localStorage on component mount
  useEffect(() => {
    const loadSavedMetrics = () => {
      const savedMetrics = localStorage.getItem('healthMetrics');
      if (savedMetrics) {
        try {
          const parsedMetrics = JSON.parse(savedMetrics);
          setMetrics(parsedMetrics);
          console.log("Loaded metrics:", parsedMetrics);
        } catch (error) {
          console.error('Failed to parse saved health metrics:', error);
          setMetrics([]);
        }
      } else {
        console.log("No saved metrics found");
        setMetrics([]);
      }
    };
    
    loadSavedMetrics();
  }, []);
  
  // Save metrics to localStorage whenever they change
  useEffect(() => {
    if (metrics.length > 0) {
      localStorage.setItem('healthMetrics', JSON.stringify(metrics));
      console.log("Saving metrics to localStorage:", metrics);
    }
  }, [metrics]);

  const handleAddMetric = () => {
    setDialogOpen(true);
    setEditingMetric(null);
  };

  const handleEditMetric = (metric: HealthMetric) => {
    setEditingMetric(metric);
    setDialogOpen(true);
  };

  const handleDeleteMetric = (id: string) => {
    setMetrics(metrics.filter(metric => metric.id !== id));
    toast.success("Health metric deleted");
  };

  const handleSaveMetric = (metricData: {
    metricType: string;
    value: number;
    notes?: string;
  }) => {
    const metricType = metricTypes.find(m => m.id === metricData.metricType);
    if (!metricType) return;

    if (editingMetric) {
      // Update existing metric - ensure proper handling of notes
      const updatedMetrics = metrics.map(m => 
        m.id === editingMetric.id 
          ? { 
              ...m, 
              metricType: metricData.metricType, 
              value: metricData.value, 
              unit: metricType.unit,
              // Only include notes if they exist
              ...(metricData.notes ? { notes: metricData.notes } : {})
            } 
          : m
      );
      setMetrics(updatedMetrics);
      toast.success("Health metric updated");
    } else {
      // Add new metric with proper notes handling
      const newMetric: HealthMetric = {
        id: crypto.randomUUID(),
        date: new Date().toISOString(),
        metricType: metricData.metricType,
        value: metricData.value,
        unit: metricType.unit,
        // Only include notes if they exist
        ...(metricData.notes ? { notes: metricData.notes } : {})
      };
      
      // Ensure we're correctly adding to the state
      setMetrics(prevMetrics => {
        const updatedMetrics = [...prevMetrics, newMetric];
        console.log("Updated metrics after adding:", updatedMetrics);
        return updatedMetrics;
      });
      
      toast.success("Health metric added");
    }

    setDialogOpen(false);
  };

  // Get current metric type info
  const currentMetricInfo = metricTypes.find(m => m.id === currentMetricType) || metricTypes[0];

  console.log("Rendering HealthProgressTracker with metrics:", metrics);
  console.log("Current view:", currentView);
  console.log("Current metric type:", currentMetricType);

  return (
    <div className="space-y-6" data-testid="health-progress-tracker">
      <Card>
        <CardHeader className="bg-gradient-to-r from-green-500 to-emerald-600 text-white">
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-6 w-6" />
            <span>Health Progress Tracker</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h3 className="text-lg font-medium">Track Your Health Metrics</h3>
                <p className="text-sm text-gray-500">
                  Record and monitor your health data over time
                </p>
              </div>
              <Button onClick={handleAddMetric} className="bg-emerald-600 hover:bg-emerald-700">
                <Plus className="h-4 w-4 mr-1" /> Add Measurement
              </Button>
            </div>
            
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 justify-between">
              <Select value={currentMetricType} onValueChange={setCurrentMetricType}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select metric" />
                </SelectTrigger>
                <SelectContent>
                  {metricTypes.map(metric => (
                    <SelectItem key={metric.id} value={metric.id}>
                      {metric.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <Tabs value={currentView} onValueChange={(value) => setCurrentView(value as "chart" | "list")} className="w-auto">
                <TabsList className="h-9">
                  <TabsTrigger value="chart" className="px-3">Chart View</TabsTrigger>
                  <TabsTrigger value="list" className="px-3">List View</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
            
            {currentView === "chart" && (
              <div className="mt-4">
                <MetricChart 
                  metrics={metrics} 
                  currentMetricType={currentMetricType}
                  currentMetricInfo={currentMetricInfo}
                />
              </div>
            )}
            
            {currentView === "list" && (
              <div className="mt-4">
                <MetricList 
                  metrics={metrics}
                  currentMetricType={currentMetricType}
                  onAddClick={handleAddMetric}
                  onEditClick={handleEditMetric}
                  onDeleteClick={handleDeleteMetric}
                />
              </div>
            )}
            
            <Alert className="bg-emerald-50 border-emerald-200">
              <Activity className="h-4 w-4 text-emerald-600" />
              <AlertDescription>
                Tracking your health metrics regularly can help identify trends and share accurate information with your healthcare provider.
              </AlertDescription>
            </Alert>
          </div>
        </CardContent>
      </Card>
      
      <MetricFormDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onSave={handleSaveMetric}
        editingMetric={editingMetric}
      />
    </div>
  );
};

export default HealthProgressTracker;
