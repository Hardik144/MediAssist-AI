
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity, Calendar, Plus, Edit, Trash2, ArrowDown, ArrowUp, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "sonner";
import { format } from "date-fns";
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface HealthMetric {
  id: string;
  date: string;
  metricType: string;
  value: number;
  unit: string;
  notes?: string;
}

const metricTypes = [
  { id: "bloodPressure", name: "Blood Pressure", unit: "mmHg", normal: "120/80" },
  { id: "heartRate", name: "Heart Rate", unit: "bpm", normal: "60-100" },
  { id: "temperature", name: "Body Temperature", unit: "°F", normal: "97-99" },
  { id: "bloodSugar", name: "Blood Sugar", unit: "mg/dL", normal: "70-100" },
  { id: "weight", name: "Weight", unit: "kg", normal: "varies" },
  { id: "pain", name: "Pain Level", unit: "scale 1-10", normal: "0" },
];

const HealthProgressTracker = () => {
  const [metrics, setMetrics] = useState<HealthMetric[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingMetric, setEditingMetric] = useState<HealthMetric | null>(null);
  const [currentMetricType, setCurrentMetricType] = useState(metricTypes[0].id);
  const [metricValue, setMetricValue] = useState("");
  const [metricNotes, setMetricNotes] = useState("");
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
    localStorage.setItem('healthMetrics', JSON.stringify(metrics));
    console.log("Saving metrics to localStorage:", metrics);
  }, [metrics]);

  const handleAddMetric = () => {
    setDialogOpen(true);
    setEditingMetric(null);
    setMetricValue("");
    setMetricNotes("");
    setCurrentMetricType(metricTypes[0].id);
  };

  const handleEditMetric = (metric: HealthMetric) => {
    setDialogOpen(true);
    setEditingMetric(metric);
    setCurrentMetricType(metric.metricType);
    setMetricValue(metric.value.toString());
    setMetricNotes(metric.notes || "");
  };

  const handleDeleteMetric = (id: string) => {
    setMetrics(metrics.filter(metric => metric.id !== id));
    toast.success("Health metric deleted");
  };

  const handleSaveMetric = () => {
    if (!metricValue.trim()) {
      toast.error("Please enter a value");
      return;
    }

    const value = parseFloat(metricValue);
    if (isNaN(value)) {
      toast.error("Please enter a valid number");
      return;
    }

    const metricType = metricTypes.find(m => m.id === currentMetricType);
    if (!metricType) return;

    if (editingMetric) {
      // Update existing metric
      const updatedMetrics = metrics.map(m => 
        m.id === editingMetric.id 
          ? { 
              ...m, 
              metricType: currentMetricType, 
              value, 
              unit: metricType.unit, 
              notes: metricNotes 
            } 
          : m
      );
      setMetrics(updatedMetrics);
      toast.success("Health metric updated");
    } else {
      // Add new metric
      const newMetric: HealthMetric = {
        id: crypto.randomUUID(),
        date: new Date().toISOString(),
        metricType: currentMetricType,
        value,
        unit: metricType.unit,
        notes: metricNotes || undefined
      };
      
      setMetrics(prevMetrics => [...prevMetrics, newMetric]);
      toast.success("Health metric added");
    }

    setDialogOpen(false);
  };

  // Filter metrics by selected type for chart - explicitly compute this when rendering
  const filteredMetrics = metrics
    .filter(metric => metric.metricType === currentMetricType)
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  console.log("Current metric type:", currentMetricType);
  console.log("Filtered metrics:", filteredMetrics);
  console.log("All metrics:", metrics);

  // Prepare data for chart - explicitly compute when rendering
  const chartData = filteredMetrics.map(metric => ({
    date: format(new Date(metric.date), "MMM dd"),
    value: metric.value
  }));

  // Get trend information
  const getTrend = () => {
    if (filteredMetrics.length < 2) return { icon: <ArrowRight />, text: "Not enough data", color: "text-gray-500" };
    
    const latest = filteredMetrics[filteredMetrics.length - 1];
    const previous = filteredMetrics[filteredMetrics.length - 2];
    
    if (latest.value > previous.value) {
      return { icon: <ArrowUp />, text: "Increasing", color: "text-red-500" };
    } else if (latest.value < previous.value) {
      return { icon: <ArrowDown />, text: "Decreasing", color: "text-green-500" };
    } else {
      return { icon: <ArrowRight />, text: "Stable", color: "text-blue-500" };
    }
  };

  const trend = getTrend();
  
  // Get current metric type info
  const currentMetricInfo = metricTypes.find(m => m.id === currentMetricType) || metricTypes[0];

  return (
    <div className="space-y-6">
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
            
            <TabsContent value="chart" className="m-0">
              <Card>
                <CardContent className="p-4">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                    <Card className="p-3">
                      <p className="text-sm text-gray-500">Metric</p>
                      <p className="text-lg font-medium">{currentMetricInfo.name}</p>
                    </Card>
                    <Card className="p-3">
                      <p className="text-sm text-gray-500">Unit</p>
                      <p className="text-lg font-medium">{currentMetricInfo.unit}</p>
                    </Card>
                    <Card className="p-3">
                      <p className="text-sm text-gray-500">Normal Range</p>
                      <p className="text-lg font-medium">{currentMetricInfo.normal}</p>
                    </Card>
                    <Card className="p-3">
                      <p className="text-sm text-gray-500">Trend</p>
                      <p className={`text-lg font-medium flex items-center gap-1 ${trend.color}`}>
                        {trend.icon} {trend.text}
                      </p>
                    </Card>
                  </div>
                  
                  {chartData.length > 0 ? (
                    <div className="h-[300px] mt-6">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart
                          data={chartData}
                          margin={{ top: 5, right: 20, left: 0, bottom: 5 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="date" />
                          <YAxis />
                          <Tooltip />
                          <Legend />
                          <Line 
                            type="monotone" 
                            dataKey="value" 
                            name={currentMetricInfo.name} 
                            stroke="#10b981" 
                            activeDot={{ r: 8 }} 
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  ) : (
                    <div className="h-[300px] flex items-center justify-center">
                      <p className="text-gray-500">No data available for this metric. Add a measurement to see the chart.</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="list" className="m-0">
              <Card>
                <CardContent className="p-4">
                  {filteredMetrics.length > 0 ? (
                    <div className="space-y-4">
                      {filteredMetrics.map(metric => (
                        <Card key={metric.id} className="p-4">
                          <div className="flex items-start justify-between">
                            <div>
                              <div className="flex items-center gap-2">
                                <Calendar className="h-4 w-4 text-gray-500" />
                                <p className="text-sm text-gray-500">
                                  {format(new Date(metric.date), "MMM dd, yyyy • h:mm a")}
                                </p>
                              </div>
                              <div className="mt-1">
                                <span className="text-lg font-medium">{metric.value} </span>
                                <span className="text-gray-500">{metric.unit}</span>
                              </div>
                              {metric.notes && (
                                <p className="mt-1 text-sm">{metric.notes}</p>
                              )}
                            </div>
                            <div className="flex items-center gap-1">
                              <Button 
                                size="sm" 
                                variant="ghost" 
                                onClick={() => handleEditMetric(metric)}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button 
                                size="sm" 
                                variant="ghost" 
                                onClick={() => handleDeleteMetric(metric.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </Card>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-10">
                      <p className="text-gray-500">No measurements found for this metric.</p>
                      <Button 
                        variant="link" 
                        onClick={handleAddMetric}
                        className="mt-2"
                      >
                        Add your first measurement
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            
            <Alert className="bg-emerald-50 border-emerald-200">
              <Activity className="h-4 w-4 text-emerald-600" />
              <AlertDescription>
                Tracking your health metrics regularly can help identify trends and share accurate information with your healthcare provider.
              </AlertDescription>
            </Alert>
          </div>
        </CardContent>
      </Card>
      
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingMetric ? "Edit Health Measurement" : "Add Health Measurement"}
            </DialogTitle>
            <DialogDescription>
              Record your health metrics to track changes over time.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-2">
            <div className="grid gap-2">
              <label className="text-sm font-medium">Metric Type</label>
              <Select 
                value={currentMetricType} 
                onValueChange={setCurrentMetricType}
                disabled={!!editingMetric}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {metricTypes.map(metric => (
                    <SelectItem key={metric.id} value={metric.id}>
                      {metric.name} ({metric.unit})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid gap-2">
              <label className="text-sm font-medium">Value</label>
              <Input
                type="number"
                placeholder="Enter value"
                value={metricValue}
                onChange={(e) => setMetricValue(e.target.value)}
              />
              <p className="text-xs text-gray-500">
                Unit: {metricTypes.find(m => m.id === currentMetricType)?.unit}
              </p>
            </div>
            
            <div className="grid gap-2">
              <label className="text-sm font-medium">Notes (Optional)</label>
              <Input
                placeholder="Add any additional notes"
                value={metricNotes}
                onChange={(e) => setMetricNotes(e.target.value)}
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveMetric} className="bg-emerald-600 hover:bg-emerald-700">
              {editingMetric ? "Update" : "Save"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default HealthProgressTracker;
