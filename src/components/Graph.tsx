"use client";

import * as React from "react";
import { useTheme } from "next-themes";
import { Area, AreaChart, XAxis, YAxis } from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function Component(rawData: any) {
  const { theme } = useTheme();
  const [timeRange, setTimeRange] = React.useState("1h");
  const [selectedLocation, setSelectedLocation] = React.useState<string>("");

  const calculateStartDate = () => {
    const now = new Date();
    let msToSubtract = 3600000; // 1 hour
    if (timeRange === "1d") msToSubtract = 86400000;
    else if (timeRange === "3d") msToSubtract = 259200000;

    const startDate = new Date(now);
    startDate.setTime(startDate.getTime() - msToSubtract);
    return startDate;
  };

  const roundTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    date.setSeconds(0, 0); // round to nearest minute
    return date.toISOString();
  };

  const filteredData = rawData.rawData.filter((item: any) => {
    const date = new Date(item.timestamp);
    return date >= calculateStartDate();
  });

  const allLocations: string[] = Array.from(
    new Set(filteredData.map((item: any) => item.location))
  );

  React.useEffect(() => {
    if (!selectedLocation && allLocations.length > 0) {
      setSelectedLocation(allLocations[0]);
    }
  }, [allLocations]);

  // Build chart data with separate Good/Bad latency
  const dataMap: Record<string, any> = {};
  filteredData
    .filter((item: any) => item.location === selectedLocation)
    .forEach((item: any) => {
      const ts = roundTimestamp(item.timestamp);
      if (!dataMap[ts]) {
        dataMap[ts] = { timestamp: ts, Good: null, Bad: null };
      }

      if (item.status === "Good") {
        dataMap[ts].Good = item.latency;
      } else if (item.status === "Bad") {
        dataMap[ts].Bad = item.latency;
      }
    });

  const chartData = Object.values(dataMap).sort(
    (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
  );

  const gridColor = theme === "dark" ? "#444" : "#e5e7eb";
  const tickColor = theme === "dark" ? "#ddd" : "#333";

  const chartConfig: ChartConfig = {
    Good: { label: "Good" },
    Bad: { label: "Bad" },
  };

  return (
    <>
      {/* Selectors */}
      <div className="flex flex-wrap gap-4 mb-4">
        {/* Time Range Selector */}
        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger className="w-[160px] rounded-lg border-[#2A2A2A]">
            <SelectValue placeholder="Select Time Range" />
          </SelectTrigger>
          <SelectContent className="rounded-xl">
            <SelectItem value="1h">Last Hour</SelectItem>
            <SelectItem value="1d">Last Day</SelectItem>
            <SelectItem value="3d">Last 3 Days</SelectItem>
          </SelectContent>
        </Select>

        {/* Location Selector */}
        <Select value={selectedLocation} onValueChange={setSelectedLocation}>
          <SelectTrigger className="w-[160px] rounded-lg border-[#2A2A2A]">
            <SelectValue placeholder="Select Location" />
          </SelectTrigger>
          <SelectContent className="rounded-xl">
            {allLocations.map((loc) => (
              <SelectItem key={loc} value={loc}>
                {loc}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Chart */}
      <Card className="mt-2 bg-[#1A1A1A] border border-[#2A2A2A] text-white">
        <CardHeader>
          <CardTitle>Latency - {selectedLocation || "Select a Location"}</CardTitle>
          <CardDescription>
            Showing latency for the selected location over the selected time range.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer
            config={chartConfig}
            className="w-full lg:h-[50vh] mx-auto overflow-hidden"
          >
            <AreaChart data={chartData}>
              <XAxis
                dataKey="timestamp"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                minTickGap={32}
                tick={{ fill: tickColor, fontSize: 12 }}
                tickFormatter={(value) => {
                  const date = new Date(value);
                  return timeRange === "1h"
                    ? date.toLocaleTimeString("en-US", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })
                    : date.toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                      });
                }}
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                tick={{ fill: tickColor, fontSize: 12 }}
              />
              <ChartTooltip
                cursor={false}
                content={
                  <ChartTooltipContent
                    labelFormatter={(value) => {
                      const date = new Date(value);
                      return timeRange === "1h"
                        ? date.toLocaleTimeString("en-US", {
                            hour: "2-digit",
                            minute: "2-digit",
                          })
                        : date.toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                          });
                    }}
                    indicator="dot"
                  />
                }
              />
              {/* Good status area (Blue) */}
              <Area
                type="monotone"
                dataKey="Good"
                stroke="#60a5fa"
                fill="#60a5fa"
                fillOpacity={0.2}
                name="Good"
              />
              {/* Bad status area (Red) */}
              <Area
                type="monotone"
                dataKey="Bad"
                stroke="#ef4444"
                fill="#ef4444"
                fillOpacity={0.3}
                name="Bad"
              />
              <ChartLegend content={<ChartLegendContent />} />
            </AreaChart>
          </ChartContainer>
        </CardContent>
      </Card>
    </>
  );
}
