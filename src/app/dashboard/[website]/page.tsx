// "use client";
// import axios from 'axios';
// import { useSearchParams } from 'next/navigation'
// import { useAuth } from '@clerk/nextjs';
// import React, { useEffect, useState } from 'react'

// interface websiteTick{
//     location: string,
//     status: "Good" | "Bad",
//     id: string,
//     timestamp: string,
//     latency: number,
//     validatorId: string,
//     websiteId: string
// }

// const page = () => {
//     const {getToken} = useAuth();
//     const searchParams = useSearchParams();
//     const [websiteTicks, setwebsiteTicks] = useState<websiteTick[]>([])

//     useEffect(()=>{
//         const id = searchParams.get("id");
//         if(!id){
//             alert("No id found");
//             (
//                 <div>
//                     Error 404
//                 </div>
//             )
//             return;
//         }
//         // console.log(id);
//         (async function(){
//             const id = searchParams.get("id");
//             console.log(id);
//             const token = await getToken();
//             const res = await axios.get(`https://uptimechecker-be.onrender.com/api/v1/getone`,{
//                 params:{
//                     websiteId: id
//                 },
//                 headers: {
//                     Authorization: `Bearer ${token}`,
//                 }
//             });
//             setwebsiteTicks(res.data.data[0].websiteTicks);
//             // console.log(res.data.data[0].websiteTicks);
//         })()
//     },[])

//   return (
//     <div>
//       {websiteTicks.length===0 ? "Loading..." : websiteTicks[0].status}
//     </div>
//   )
// }

// export default page




"use client";

import axios from 'axios';
import { useSearchParams } from 'next/navigation';
import { useAuth } from '@clerk/nextjs';
import React, { useEffect, useState } from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell 
} from 'recharts';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  CheckCircle, 
  XCircle, 
  AlertTriangle, 
  Clock, 
  Globe, 
  Map 
} from "lucide-react";

interface WebsiteTick {
  location: string,
  status: "Good" | "Bad",
  id: string,
  timestamp: string,
  latency: number,
  validatorId: string,
  websiteId: string
}

interface LocationStats {
  location: string;
  goodCount: number;
  badCount: number;
  totalChecks: number;
  uptimePercentage: number;
  avgLatency: number;
  recentStatus: "Good" | "Bad";
}

const WebsiteAnalyticsPage = () => {
  const { getToken } = useAuth();
  const searchParams = useSearchParams();
  const [websiteTicks, setWebsiteTicks] = useState<WebsiteTick[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [websiteUrl, setWebsiteUrl] = useState<string>("");
  
  // Derived stats
  const [uptimePercentage, setUptimePercentage] = useState<number>(0);
  const [avgLatency, setAvgLatency] = useState<number>(0);
  const [locationStats, setLocationStats] = useState<LocationStats[]>([]);
  const [anomalies, setAnomalies] = useState<WebsiteTick[]>([]);
  const [timelineData, setTimelineData] = useState<any[]>([]);
  const [globalStatus, setGlobalStatus] = useState<"Good" | "Bad" | "Mixed">("Good");

  useEffect(() => {
    const id = searchParams.get("id");
    
    if (!id) {
      setError("No website ID found in URL parameters");
      setIsLoading(false);
      return;
    }
    
    const fetchData = async () => {
      try {
        const token = await getToken();
        const res = await axios.get(`https://uptimechecker-be.onrender.com/api/v1/getone`, {
          params: {
            websiteId: id
          },
          headers: {
            Authorization: `Bearer ${token}`,
          }
        });
        
        const websiteData = res.data.data[0];
        setWebsiteTicks(websiteData.websiteTicks);
        setWebsiteUrl(websiteData.url || "Website");
        processData(websiteData.websiteTicks);
        setIsLoading(false);
      } catch (err) {
        console.error("Error fetching website data:", err);
        setError("Failed to load website monitoring data");
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, []);
  
  const processData = (ticks: WebsiteTick[]) => {
    if (!ticks || ticks.length === 0) {
      return;
    }
    
    // Sort by timestamp
    const sortedTicks = [...ticks].sort((a, b) => 
      new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
    
    // Calculate global stats
    const goodTicks = ticks.filter(tick => tick.status === "Good");
    const calculatedUptimePercentage = (goodTicks.length / ticks.length) * 100;
    setUptimePercentage(calculatedUptimePercentage);
    
    const totalLatency = ticks.reduce((sum, tick) => sum + tick.latency, 0);
    setAvgLatency(totalLatency / ticks.length);
    
    // Find anomalies (Bad status)
    const badTicks = ticks.filter(tick => tick.status === "Bad");
    setAnomalies(badTicks);
    
    if (badTicks.length === 0) {
      setGlobalStatus("Good");
    } else if (badTicks.length === ticks.length) {
      setGlobalStatus("Bad");
    } else {
      setGlobalStatus("Mixed");
    }
    
    // Process location-specific stats
    // Use a plain object instead of Map
    interface LocationData {
      goodCount: number;
      badCount: number;
      latencySum: number;
      recentStatus: "Good" | "Bad";
      recentTimestamp: Date;
    }
    
    const locationData: Record<string, LocationData> = {};
    
    ticks.forEach(tick => {
      const location = tick.location;
      
      // Initialize location data if it doesn't exist
      if (!locationData[location]) {
        locationData[location] = {
          goodCount: 0,
          badCount: 0,
          latencySum: 0,
          recentStatus: tick.status,
          recentTimestamp: new Date(tick.timestamp)
        };
      }
      
      const existing = locationData[location];
      
      if (tick.status === "Good") {
        existing.goodCount += 1;
      } else {
        existing.badCount += 1;
      }
      
      existing.latencySum += tick.latency;
      
      // Update if this is more recent
      const tickTime = new Date(tick.timestamp);
      if (tickTime > existing.recentTimestamp) {
        existing.recentStatus = tick.status;
        existing.recentTimestamp = tickTime;
      }
    });
    
    const locationStatsArray: LocationStats[] = [];
    
    // Convert the object to array
    Object.keys(locationData).forEach(location => {
      const stats = locationData[location];
      const totalChecks = stats.goodCount + stats.badCount;
      
      locationStatsArray.push({
        location,
        goodCount: stats.goodCount,
        badCount: stats.badCount,
        totalChecks,
        uptimePercentage: (stats.goodCount / totalChecks) * 100,
        avgLatency: stats.latencySum / totalChecks,
        recentStatus: stats.recentStatus
      });
    });
    
    setLocationStats(locationStatsArray);
    
    // Create timeline data for charts
    interface TimeDataPoint {
      time: string;
      status: number;
      latency: number;
      count: number;
    }
    
    const timeData: Record<string, TimeDataPoint> = {};
    
    // Group by hourly intervals for better visualization
    sortedTicks.forEach(tick => {
      const date = new Date(tick.timestamp);
      const hourKey = date.toISOString().substring(0, 13); // YYYY-MM-DDTHH format
      
      if (!timeData[hourKey]) {
        timeData[hourKey] = {
          time: date.toLocaleString('en-US', { 
            month: 'short', 
            day: 'numeric', 
            hour: 'numeric' 
          }),
          status: 0,
          latency: 0,
          count: 0
        };
      }
      
      timeData[hourKey].status += tick.status === "Good" ? 100 : 0;
      timeData[hourKey].latency += tick.latency;
      timeData[hourKey].count += 1;
    });
    
    const processedTimeData = Object.keys(timeData)
      .sort((a, b) => a.localeCompare(b)) // Ensure chronological order
      .map(key => {
        const data = timeData[key];
        return {
          time: data.time,
          status: Math.round(data.status / data.count),
          latency: Math.round(data.latency / data.count)
        };
      });
    
    // Ensure we have data for charts
    setTimelineData(processedTimeData.length > 0 ? processedTimeData : [
      { time: "No Data", status: 0, latency: 0 }
    ]);
  };

  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <div className="text-lg text-gray-100">Loading analytics data...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    );
  }
  
  if (websiteTicks.length === 0) {
    return (
      <div className="p-6">
        <Alert>
          <AlertTitle>No data available</AlertTitle>
          <AlertDescription>
            No monitoring data has been collected for this website yet.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-900 text-gray-100 min-h-screen">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold">{websiteUrl} Analytics</h1>
        <p className="text-gray-400">
          Monitoring data and performance metrics
        </p>
      </div>
      
      {/* Status Overview */}
      <div className="grid gap-6 md:grid-cols-4 mb-6">
        <Card className="bg-gray-700 border-gray-700">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">Global Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              {globalStatus === "Good" && <CheckCircle className="h-6 w-6 text-green-500 mr-2" />}
              {globalStatus === "Bad" && <XCircle className="h-6 w-6 text-red-500 mr-2" />}
              {globalStatus === "Mixed" && <AlertTriangle className="h-6 w-6 text-yellow-500 mr-2" />}
              <span className="text-2xl font-bold">
                {globalStatus === "Good" && "All Good"}
                {globalStatus === "Bad" && "Down"}
                {globalStatus === "Mixed" && "Partial Issues"}
              </span>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gray-700 border-gray-700">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">Uptime</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <CheckCircle className="h-6 w-6 text-green-500 mr-2" />
              <span className="text-2xl font-bold">{uptimePercentage.toFixed(2)}%</span>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gray-700 border-gray-700">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">Average Latency</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <Clock className="h-6 w-6 text-blue-500 mr-2" />
              <span className="text-2xl font-bold">{avgLatency.toFixed(2)} ms</span>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gray-700 border-gray-700">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">Monitoring Locations</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <Globe className="h-6 w-6 text-purple-500 mr-2" />
              <span className="text-2xl font-bold">{locationStats.length}</span>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Timeline Charts */}
      <Card className="bg-gray-700 border-gray-700 mb-6">
        <CardHeader>
          <CardTitle>Performance Timeline</CardTitle>
          <CardDescription className="text-gray-400">
            Uptime and latency over time
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="uptime">
            <TabsList className="bg-gray-800">
              <TabsTrigger value="uptime">Uptime</TabsTrigger>
              <TabsTrigger value="latency">Latency</TabsTrigger>
            </TabsList>
            <TabsContent value="uptime" className="h-64 mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={timelineData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis 
                    dataKey="time" 
                    stroke="#9CA3AF"
                    tick={{ fill: '#9CA3AF' }}
                  />
                  <YAxis 
                    stroke="#9CA3AF"
                    tick={{ fill: '#9CA3AF' }}
                    domain={[0, 100]}
                    tickFormatter={(value) => `${value}%`}
                  />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#1F2937', borderColor: '#4B5563', color: '#F3F4F6' }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="status" 
                    stroke="#10B981" 
                    strokeWidth={2}
                    dot={false}
                    name="Uptime %"
                  />
                </LineChart>
              </ResponsiveContainer>
            </TabsContent>
            <TabsContent value="latency" className="h-64 mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={timelineData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis 
                    dataKey="time" 
                    stroke="#9CA3AF"
                    tick={{ fill: '#9CA3AF' }}
                  />
                  <YAxis 
                    stroke="#9CA3AF"
                    tick={{ fill: '#9CA3AF' }}
                    tickFormatter={(value) => `${value}ms`}
                  />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#1F2937', borderColor: '#4B5563', color: '#F3F4F6' }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="latency" 
                    stroke="#3B82F6" 
                    strokeWidth={2}
                    dot={false}
                    name="Latency (ms)"
                  />
                </LineChart>
              </ResponsiveContainer>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
      
      {/* Location Performance */}
      <Card className="bg-gray-700 border-gray-700 mb-6">
        <CardHeader>
          <div className="flex items-center">
            <Map className="h-5 w-5 mr-2 text-purple-500" />
            <CardTitle>Location Performance</CardTitle>
          </div>
          <CardDescription className="text-gray-400">
            Website performance across different monitoring locations
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {locationStats.map((location) => (
              <Card key={location.location} className="bg-gray-800 border-gray-700">
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-center">
                    <CardTitle className="text-md font-medium">{location.location}</CardTitle>
                    {location.recentStatus === "Good" ? (
                      <Badge className="bg-green-600 text-white">Good</Badge>
                    ) : (
                      <Badge className="bg-red-600 text-white">Down</Badge>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="flex flex-col">
                      <span className="text-gray-400">Uptime</span>
                      <span className="font-medium">{location.uptimePercentage.toFixed(2)}%</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-gray-400">Latency</span>
                      <span className="font-medium">{location.avgLatency.toFixed(2)} ms</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-gray-400">Success</span>
                      <span className="font-medium">{location.goodCount} checks</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-gray-400">Failures</span>
                      <span className="font-medium">{location.badCount} checks</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
      
      {/* Anomalies Section */}
      {anomalies.length > 0 && (
        <Card className="bg-gray-700 border-gray-700">
          <CardHeader>
            <div className="flex items-center">
              <AlertTriangle className="h-5 w-5 mr-2 text-red-500" />
              <CardTitle>Detected Issues</CardTitle>
            </div>
            <CardDescription className="text-gray-400">
              Recent monitoring failures and anomalies
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {anomalies.slice(0, 5).map((anomaly) => (
                <div 
                  key={anomaly.id}
                  className="flex items-start p-3 bg-red-900/20 border border-red-700/50 rounded-md"
                >
                  <XCircle className="h-5 w-5 text-red-500 mr-3 mt-1" />
                  <div>
                    <div className="font-medium">Issue detected from {anomaly.location}</div>
                    <div className="text-sm text-gray-400">
                      {new Date(anomaly.timestamp).toLocaleString()} • 
                      Latency: {anomaly.latency} ms
                    </div>
                  </div>
                </div>
              ))}
              
              {anomalies.length > 5 && (
                <div className="text-center text-gray-400 text-sm">
                  + {anomalies.length - 5} more issues
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default WebsiteAnalyticsPage;