"use client";

import axios from "axios";
import { useSearchParams } from "next/navigation";
import { useAuth } from "@clerk/nextjs";
import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import {
  CheckCircle,
  XCircle,
  AlertTriangle,
  Clock,
  Globe,
  Map,
} from "lucide-react";
import { Component } from "@/components/Graph";
import Chatbot from "@/components/Chatbot";

interface WebsiteTick {
  location: string;
  status: "Good" | "Bad";
  id: string;
  timestamp: string;
  latency: number;
  validatorId: string;
  websiteId: string;
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
  const [initialLoadComplete, setInitialLoadComplete] = useState(false);
  const [isActive, setisActive] = useState<boolean>(false);

  // Derived stats
  const [uptimePercentage, setUptimePercentage] = useState<number>(0);
  const [avgLatency, setAvgLatency] = useState<number>(0);
  const [locationStats, setLocationStats] = useState<LocationStats[]>([]);
  const [anomalies, setAnomalies] = useState<WebsiteTick[]>([]);
  const [timelineData, setTimelineData] = useState<any[]>([]);
  const [globalStatus, setGlobalStatus] = useState<"Good" | "Bad" | "Mixed">(
    "Good"
  );

  useEffect(() => {
    const id = searchParams.get("id");

    if (!id) {
      setError("No website ID found in URL parameters");
      setIsLoading(false);
      return;
    }

    const fetchData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const token = await getToken();
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_BASE_API_URL}/api/v1/getone`,
          {
            params: {
              websiteId: id,
            },
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        console.log(res);

        const websiteData = res.data.data;
        setWebsiteTicks(websiteData.websiteTicks);
        console.log(websiteData.websiteTicks);
        setWebsiteUrl(websiteData.url || "Website");
        processData(websiteData.websiteTicks);
        // console.log(timelineData);
        setIsLoading(false);
      } catch (err) {
        console.error("Error fetching website data:", err);
        setError("Failed to load website monitoring data");
        setIsLoading(false);
      } finally {
        setIsLoading(false);
        setInitialLoadComplete(true);
      }
    };

    fetchData();
  }, []);

  const processData = (ticks: WebsiteTick[]) => {
    if (!ticks || ticks.length === 0) {
      return;
    }

    // Sort by timestamp
    const sortedTicks = [...ticks].sort(
      (a, b) =>
        new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
    );

    // Calculate global stats
    const goodTicks = ticks.filter((tick) => tick.status === "Good");
    const calculatedUptimePercentage = (goodTicks.length / ticks.length) * 100;
    setUptimePercentage(calculatedUptimePercentage);

    const totalLatency = ticks.reduce((sum, tick) => sum + tick.latency, 0);
    setAvgLatency(totalLatency / ticks.length);

    // Find anomalies (Bad status)
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);

    const badTicks = ticks.filter((tick) => {
      const tickTime = new Date(tick.timestamp);
      return tick.status === "Bad" && tickTime > oneHourAgo;
    });

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

    ticks.forEach((tick) => {
      const location = tick.location;

      // Initialize location data if it doesn't exist
      if (!locationData[location]) {
        locationData[location] = {
          goodCount: 0,
          badCount: 0,
          latencySum: 0,
          recentStatus: tick.status,
          recentTimestamp: new Date(tick.timestamp),
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
    Object.keys(locationData).forEach((location) => {
      const stats = locationData[location];
      const totalChecks = stats.goodCount + stats.badCount;

      locationStatsArray.push({
        location,
        goodCount: stats.goodCount,
        badCount: stats.badCount,
        totalChecks,
        uptimePercentage: (stats.goodCount / totalChecks) * 100,
        avgLatency: stats.latencySum / totalChecks,
        recentStatus: stats.recentStatus,
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
    sortedTicks.forEach((tick) => {
      const date = new Date(tick.timestamp);
      const hourKey = date.toISOString().substring(0, 13); // YYYY-MM-DDTHH format

      if (!timeData[hourKey]) {
        timeData[hourKey] = {
          time: date.toLocaleString("en-US", {
            month: "short",
            day: "numeric",
            hour: "numeric",
          }),
          status: 0,
          latency: 0,
          count: 0,
        };
      }

      timeData[hourKey].status += tick.status === "Good" ? 100 : 0;
      timeData[hourKey].latency += tick.latency;
      timeData[hourKey].count += 1;
    });

    const processedTimeData = Object.keys(timeData)
      .sort((a, b) => a.localeCompare(b)) // Ensure chronological order
      .map((key) => {
        const data = timeData[key];
        return {
          time: data.time,
          status: Math.round(data.status / data.count),
          latency: Math.round(data.latency / data.count),
        };
      });

    // Ensure we have data for charts
    console.log(processedTimeData);
    setTimelineData(
      processedTimeData.length > 0
        ? processedTimeData
        : [{ time: "No Data", status: 0, latency: 0 }]
    );
  };

  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-black">
      <div className="flex flex-col items-center space-y-4">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-gray-600 border-t-white" />
        <div className="text-lg bg-[#1A1A1A] text-gray-200 px-6 py-3 rounded-xl shadow-md">
          Loading analytics data...
        </div>
      </div>
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
      <div className="w-screen h-screen flex items-center justify-center bg-black">
        <div className="p-6">
          <Alert>
            <AlertTitle>No data available</AlertTitle>
            <AlertDescription>
              No monitoring data has been collected for this website yet.
            </AlertDescription>
          </Alert>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-black text-gray-100 min-h-screen pt-24 overflow-x-hidden">
      <div>
        <div className="mb-6">
          <h1 className="text-xl sm:text-3xl font-bold text-white">
            {websiteUrl} Analytics
          </h1>
          <p className="text-gray-400 text-sm mt-1">
            Monitoring data and performance metrics
          </p>
        </div>

        {/* Status Overview */}

        <div className="grid gap-6 md:grid-cols-4 mb-6">
          {/* Global Status */}
          <Card className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-2xl shadow-lg">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-semibold text-gray-300">
                Global Status
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                {globalStatus === "Good" && (
                  <CheckCircle className="h-6 w-6 text-green-500 mr-2" />
                )}
                {globalStatus === "Bad" && (
                  <XCircle className="h-6 w-6 text-red-500 mr-2" />
                )}
                {globalStatus === "Mixed" && (
                  <AlertTriangle className="h-6 w-6 text-yellow-400 mr-2" />
                )}
                <span className="text-2xl font-bold text-white">
                  {globalStatus === "Good" && "All Good"}
                  {globalStatus === "Bad" && "Down"}
                  {globalStatus === "Mixed" && "Partial Issues"}
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Uptime */}
          <Card className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-2xl shadow-lg">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-semibold text-gray-300">
                Uptime
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <CheckCircle className="h-6 w-6 text-green-500 mr-2" />
                <span className="text-2xl font-bold text-white">
                  {uptimePercentage.toFixed(2)}%
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Average Latency */}
          <Card className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-2xl shadow-lg">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-semibold text-gray-300">
                Average Latency
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <Clock className="h-6 w-6 text-blue-500 mr-2" />
                <span className="text-2xl font-bold text-white">
                  {avgLatency.toFixed(2)} ms
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Monitoring Locations */}
          <Card className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-2xl shadow-lg">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-semibold text-gray-300">
                Monitoring Locations
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <Globe className="h-6 w-6 text-purple-500 mr-2" />
                <span className="text-2xl font-bold text-white">
                  {locationStats.length}
                </span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Timeline Charts */}

        <Component rawData={websiteTicks} />

        {/* Location Performance */}

        <Card className="bg-black border-none rounded-2xl mb-6 mt-12">
          <CardHeader>
            <div className="flex items-center">
              <Map className="h-5 w-5 mr-2 text-purple-500" />
              <CardTitle className="text-xl font-semibold text-white">
                Location Performance
              </CardTitle>
            </div>
            <CardDescription className="text-sm text-gray-400">
              Website performance across different monitoring locations
            </CardDescription>
          </CardHeader>

          <CardContent>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {locationStats.map((location) => (
                <Card
                  key={location.location}
                  className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-2xl shadow transition-transform hover:scale-[1.02] hover:shadow-xl"
                >
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-center">
                      <CardTitle className="text-base font-medium text-white">
                        {location.location}
                      </CardTitle>
                      {location.recentStatus === "Good" ? (
                        <Badge className="bg-green-600 text-white px-2 py-0.5 rounded-full text-xs">
                          Good
                        </Badge>
                      ) : (
                        <Badge className="bg-red-600 text-white px-2 py-0.5 rounded-full text-xs">
                          Down
                        </Badge>
                      )}
                    </div>
                  </CardHeader>

                  <CardContent>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="flex flex-col">
                        <span className="text-gray-400">Uptime</span>
                        <span className="text-white font-semibold">
                          {location.uptimePercentage.toFixed(2)}%
                        </span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-gray-400">Latency</span>
                        <span className="text-white font-semibold">
                          {location.avgLatency.toFixed(2)} ms
                        </span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-gray-400">Success</span>
                        <span className="text-white font-semibold">
                          {location.goodCount} checks
                        </span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-gray-400">Failures</span>
                        <span className="text-white font-semibold">
                          {location.badCount} checks
                        </span>
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
          <Card className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-2xl shadow-lg">
            <CardHeader>
              <div className="flex items-center">
                <AlertTriangle className="h-5 w-5 mr-2 text-red-500" />
                <CardTitle className="text-xl font-semibold text-white">
                  Detected Issues
                </CardTitle>
              </div>
              <CardDescription className="text-sm text-gray-400">
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
                      <div className="text-white font-medium">
                        Issue detected from {anomaly.location}
                      </div>
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

        <footer className="mt-12 text-center text-gray-500 text-xs border-t border-gray-700 pt-6">
          Powered by{" "}
          <span className="text-white font-medium">UptimeChecker</span> ©{" "}
          {new Date().getFullYear()}
        </footer>
      </div>
      <div className="l">
        <Chatbot />
      </div>
    </div>
  );
};

export default WebsiteAnalyticsPage;
