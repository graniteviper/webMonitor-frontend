// "use client";

// import * as React from "react";
// import { useTheme } from "next-themes";
// import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card";
// import {
//   ChartConfig,
//   ChartContainer,
//   ChartLegend,
//   ChartLegendContent,
//   ChartTooltip,
//   ChartTooltipContent,
// } from "@/components/ui/chart";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";

// export function Component(rawData: any) {
//   const { theme } = useTheme();
//   const [timeRange, setTimeRange] = React.useState("1h");

//   const calculateStartDate = () => {
//     const now = new Date();
//     let msToSubtract = 3600000; // 1 hour in milliseconds
//     if (timeRange === "1d") msToSubtract = 86400000; // 1 day in milliseconds
//     else if (timeRange === "3d") msToSubtract = 259200000; // 3 days in milliseconds

//     const startDate = new Date(now);
//     startDate.setTime(startDate.getTime() - msToSubtract);
//     return startDate;
//   };

//   const filteredData = rawData.rawData.filter((item: any) => {
//     const date = new Date(item.timestamp);
//     return date >= calculateStartDate();
//   });

//   const locations: string[] = Array.from(
//     new Set(filteredData.map((item: any) => item.location))
//   );

//   const dataMap: Record<string, any> = {};
//   filteredData.forEach((item: any) => {
//     if (!dataMap[item.timestamp]) {
//       dataMap[item.timestamp] = { timestamp: item.timestamp };
//     }
//     dataMap[item.timestamp][item.location] = item.latency;
//   });

//   const chartData = Object.values(dataMap).sort(
//     (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
//   );

//   // Dark/light colors
//   const gridColor = theme === "dark" ? "#444" : "#e5e7eb";
//   const tickColor = theme === "dark" ? "#ddd" : "#333";
//   const colors = [
//     "#4ade80",
//     "#60a5fa",
//     "#facc15",
//     "#f472b6",
//     "#34d399",
//   ];

//   const chartConfig: ChartConfig = locations.reduce((acc, location) => {
//     acc[location] = { label: location };
//     return acc;
//   }, {} as ChartConfig);

//   return (
//     <>
//       <Select value={timeRange} onValueChange={setTimeRange}>
//         <SelectTrigger className="w-[160px] rounded-lg sm:ml-auto">
//           <SelectValue placeholder="Select Time Range" />
//         </SelectTrigger>
//         <SelectContent className="rounded-xl">
//           <SelectItem value="1h">Last Hour</SelectItem>
//           <SelectItem value="1d">Last Day</SelectItem>
//           <SelectItem value="3d">Last 3 Days</SelectItem>
//         </SelectContent>
//       </Select>

//       <Card className="mt-6 dark:bg-gray-900 bg-gray-900 border-none text-white">
//         <CardHeader>
//           <CardTitle>Latency by Location</CardTitle>
//           <CardDescription>
//             All locations shown in one chart (filtered by {timeRange})
//           </CardDescription>
//         </CardHeader>
//         <CardContent>
//           <ChartContainer
//             config={chartConfig}
//             className="aspect-auto h-[300px] w-full"
//           >
//             <AreaChart data={chartData}>
//               <CartesianGrid stroke={gridColor} strokeOpacity={0.2} />
//               <XAxis
//                 dataKey="timestamp"
//                 tickLine={false}
//                 axisLine={false}
//                 tickMargin={8}
//                 minTickGap={32}
//                 tick={{ fill: tickColor, fontSize: 12 }}
//                 tickFormatter={(value) => {
//                   const date = new Date(value);
//                   return date.toLocaleDateString("en-US", {
//                     month: "short",
//                     day: "numeric",
//                   });
//                 }}
//               />
//               <YAxis
//                 tickLine={false}
//                 axisLine={false}
//                 tick={{ fill: tickColor, fontSize: 12 }}
//               />
//               <ChartTooltip
//                 cursor={false}
//                 content={
//                   <ChartTooltipContent
//                     labelFormatter={(value) => {
//                       return new Date(value).toLocaleDateString("en-US", {
//                         month: "short",
//                         day: "numeric",
//                       });
//                     }}
//                     indicator="dot"
//                   />
//                 }
//               />
//               {locations.map((location, index) => (
//                 <Area
//                   key={location}
//                   dataKey={location}
//                   type="monotone"
//                   stroke={colors[index % colors.length]}
//                   fill={colors[index % colors.length]}
//                   fillOpacity={0.2}
//                   name={location}
//                 />
//               ))}
//               <ChartLegend content={<ChartLegendContent />} />
//             </AreaChart>
//           </ChartContainer>
//         </CardContent>
//       </Card>
//     </>
//   );
// }

"use client";

import * as React from "react";
import { useTheme } from "next-themes";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";
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

  const calculateStartDate = () => {
    const now = new Date();
    let msToSubtract = 3600000; // 1 hour in milliseconds
    if (timeRange === "1d") msToSubtract = 86400000; // 1 day in milliseconds
    else if (timeRange === "3d") msToSubtract = 259200000; // 3 days in milliseconds

    const startDate = new Date(now);
    startDate.setTime(startDate.getTime() - msToSubtract);
    return startDate;
  };

  const filteredData = rawData.rawData.filter((item: any) => {
    const date = new Date(item.timestamp);
    return date >= calculateStartDate();
  });

  const locations: string[] = Array.from(
    new Set(filteredData.map((item: any) => item.location))
  );

  const dataMap: Record<string, any> = {};
  filteredData.forEach((item: any) => {
    if (!dataMap[item.timestamp]) {
      dataMap[item.timestamp] = { timestamp: item.timestamp };
    }
    dataMap[item.timestamp][item.location] = item.latency;
  });

  const chartData = Object.values(dataMap).sort(
    (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
  );

  // Dark/light colors
  const gridColor = theme === "dark" ? "#444" : "#e5e7eb";
  const tickColor = theme === "dark" ? "#ddd" : "#333";
  const colors = ["#4ade80", "#60a5fa", "#facc15", "#f472b6", "#34d399"];

  const chartConfig: ChartConfig = locations.reduce((acc, location) => {
    acc[location] = { label: location };
    return acc;
  }, {} as ChartConfig);

  return (
    <>
      <Select value={timeRange} onValueChange={setTimeRange}>
        <SelectTrigger className="w-[160px] rounded-lg sm:ml-auto">
          <SelectValue placeholder="Select Time Range" />
        </SelectTrigger>
        <SelectContent className="rounded-xl">
          <SelectItem value="1h">Last Hour</SelectItem>
          <SelectItem value="1d">Last Day</SelectItem>
          <SelectItem value="3d">Last 3 Days</SelectItem>
        </SelectContent>
      </Select>

      <Card className="mt-6 dark:bg-gray-900 bg-gray-900 border-none text-white">
        <CardHeader>
          <CardTitle>Latency by Location</CardTitle>
          <CardDescription>
            All locations shown in one chart (filtered by {timeRange})
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer
            config={chartConfig}
            className="w-full lg:h-[50vh] mx-auto overflow-hidden"
          >
            <AreaChart data={chartData}>
              <CartesianGrid stroke={gridColor} strokeOpacity={0.2} />
              <XAxis
                dataKey="timestamp"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                minTickGap={32}
                tick={{ fill: tickColor, fontSize: 12 }}
                tickFormatter={(value) => {
                  const date = new Date(value);
                  return date.toLocaleDateString("en-US", {
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
                      return new Date(value).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                      });
                    }}
                    indicator="dot"
                  />
                }
              />
              {locations.map((location, index) => (
                <Area
                  key={location}
                  dataKey={location}
                  type="monotone"
                  stroke={colors[index % colors.length]}
                  fill={colors[index % colors.length]}
                  fillOpacity={0.2}
                  name={location}
                />
              ))}
              <ChartLegend content={<ChartLegendContent />} />
            </AreaChart>
          </ChartContainer>
        </CardContent>
      </Card>
    </>
  );
}
