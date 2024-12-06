import { useState, useEffect } from "react";
import axios from "axios";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
} from "@/components/ui/chart";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
import { PieChart, Pie, Cell } from "recharts";

// Constants
const MONTHS = [
  { value: "1", label: "January" },
  { value: "2", label: "February" },
  { value: "3", label: "March" },
  { value: "4", label: "April" },
  { value: "5", label: "May" },
  { value: "6", label: "June" },
  { value: "7", label: "July" },
  { value: "8", label: "August" },
  { value: "9", label: "September" },
  { value: "10", label: "October" },
  { value: "11", label: "November" },
  { value: "12", label: "December" },
];

const COLORS = [
  "#0088FE",
  "#00C49F",
  "#FFBB28",
  "#FF8042",
  "#8884D8",
  "#84D8A4",
  "#D884A4",
  "#D8D484",
];

function TransactionDashboard() {
  const [selectedMonth, setSelectedMonth] = useState("3");
  const [searchTerm, setSearchTerm] = useState("");
  const [combinedData, setCombinedData] = useState(null);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchCombinedData = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get("/api/combined-data", {
        params: {
          month: selectedMonth,
          page,
          search: searchTerm,
        },
      });
      setCombinedData(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
      setError("Failed to fetch data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCombinedData();
  }, [selectedMonth, page, searchTerm]);

  // Bar Chart Configuration
  const barChartConfig = {
    color: [
      "hsl(var(--chart-1))",
      "hsl(var(--chart-2))",
      "hsl(var(--chart-3))",
    ],
  };

  const pieChartConfig = {
    color: COLORS,
  };

  const renderTransactionsTable = () => (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Transactions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex mb-4  justify-between space-x-2">
          <Input
            placeholder="Search transactions"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-[250px]"
          />
          <Select value={selectedMonth} onValueChange={setSelectedMonth}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select Month" />
            </SelectTrigger>
            <SelectContent>
              {MONTHS.map((month) => (
                <SelectItem key={month.value} value={month.value}>
                  {month.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        {loading ? (
          <div className="text-center py-4">Loading...</div>
        ) : error ? (
          <div className="text-red-500 text-center py-4">{error}</div>
        ) : (
          <>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Sold</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {combinedData?.transactions?.transactions?.map(
                  (transaction) => (
                    <TableRow key={transaction._id}>
                      <TableCell>{transaction.title}</TableCell>
                      <TableCell>{transaction.description}</TableCell>
                      <TableCell>${transaction.price.toFixed(2)}</TableCell>
                      <TableCell>{transaction.category}</TableCell>
                      <TableCell>{transaction.sold ? "Yes" : "No"}</TableCell>
                    </TableRow>
                  )
                )}
              </TableBody>
            </Table>
            <div className="flex justify-between mt-4">
              <Button
                disabled={page === 1}
                onClick={() => setPage((p) => p - 1)}
              >
                Previous
              </Button>

              <span>
                Page {page} of {combinedData?.transactions?.totalPages}
              </span>
              <Button
                disabled={page === combinedData?.transactions?.totalPages}
                onClick={() => setPage((p) => p + 1)}
              >
                Next
              </Button>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );

  const renderStatistics = () => (
    <Card>
      <CardHeader>
        <CardTitle>Monthly Statistics</CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="text-center py-4">Loading...</div>
        ) : error ? (
          <div className="text-red-500 text-center py-4">{error}</div>
        ) : combinedData?.statistics ? (
          <div className="grid grid-rows-3 gap-4">
            <div className="flex justify-between ">
              <h2 className="font-medium">Total Sale Amount:</h2>
              <p>${combinedData.statistics.totalSaleAmount.toFixed(2)}</p>
            </div>
            <div className="flex justify-between">
              <h2 className="font-medium">Total Sold Items:</h2>
              <p>{combinedData.statistics.totalSoldItems}</p>
            </div>
            <div className="flex justify-between">
              <h2 className="font-medium">Total Not Sold Items:</h2>
              <p>{combinedData.statistics.totalNotSoldItems}</p>
            </div>
          </div>
        ) : null}
      </CardContent>
    </Card>
  );

  const renderBarChart = () => (
    <Card className="h-full md:col-span-2">
      <CardHeader>
        <CardTitle>Price Range Distribution</CardTitle>
      </CardHeader>
      <CardContent className="overflow-x-auto">
        {loading ? (
          <div className="text-center py-4">Loading...</div>
        ) : error ? (
          <div className="text-red-500 text-center py-4">{error}</div>
        ) : (
          <ChartContainer
            config={barChartConfig}
            className="h-[400px] w-full"
          >
            <BarChart
              accessibilityLayer
              data={combinedData?.barChart || []}
              width={800}
              height={350}
            >
              <CartesianGrid vertical={false} strokeDasharray="3 3" />
              <XAxis
                dataKey="range"
                tickLine={false}
                axisLine={true}
                tickMargin={8}
                type="category"
                tickFormatter={(value) => {
                  const [min, max] = value.split("-");
                  if (max === "above") return "901 and above";
                  return `${min}-${max}`;
                }}
              />
              <YAxis tickLine={false} axisLine={true} tickMargin={8} />
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent indicator="item" />}
              />
              <Bar
                dataKey="count"
                fill="var(--chart-1)"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  );


  const renderPieChart = () => (
    <Card>
      <CardHeader>
        <CardTitle>Category Distribution</CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="text-center py-4">Loading...</div>
        ) : error ? (
          <div className="text-red-500 text-center py-4">{error}</div>
        ) : (
          <ChartContainer config={pieChartConfig} className="h-[200px] w-full">
            <PieChart>
              <Pie
                data={combinedData?.pieChart || []}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={80}
                fill="#8884d8"
                dataKey="count"
                nameKey="category"
              >
                {(combinedData?.pieChart || []).map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <ChartTooltip
                content={<ChartTooltipContent nameKey="category" />}
              />
              <ChartLegend
                content={({ payload }) => (
                  <div className="flex flex-wrap justify-center gap-2">
                    {payload?.map((entry, index) => (
                      <div
                        key={`item-${index}`}
                        className="flex items-center gap-2"
                      >
                        <div
                          className="h-2 w-2 rounded-full"
                          style={{
                            backgroundColor: entry.color,
                          }}
                        />
                        <span className="text-xs">{entry.value}</span>
                      </div>
                    ))}
                  </div>
                )}
              />
            </PieChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  );

  return (
    <div className="container mx-auto p-4 lg:p-6 space-y-6">
      <h1 className="text-2xl lg:text-3xl font-bold mb-4 lg:mb-6">Transaction Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
        <div className="md:col-span-2 lg:col-span-3">{renderTransactionsTable()}</div>
        <div className="md:col-span-2 lg:col-span-2">{renderBarChart()}</div>
        
        <div className="lg:col-span-1 flex flex-col gap-4">
        <div className="">{renderStatistics()}</div>
        <div className="">{renderPieChart()}</div>
        </div>
      </div>
    </div>
  );
}

export default TransactionDashboard;