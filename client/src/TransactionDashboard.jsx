import { useState, useEffect } from 'react'
import axios from 'axios'
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card"
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table"
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  Legend, 
  PieChart, 
  Pie, 
  Cell 
} from 'recharts'

// Constants
const MONTHS = [
  { value: '1', label: 'January' },
  { value: '2', label: 'February' },
  { value: '3', label: 'March' },
  { value: '4', label: 'April' },
  { value: '5', label: 'May' },
  { value: '6', label: 'June' },
  { value: '7', label: 'July' },
  { value: '8', label: 'August' },
  { value: '9', label: 'September' },
  { value: '10', label: 'October' },
  { value: '11', label: 'November' },
  { value: '12', label: 'December' }
]

const COLORS = [
  '#0088FE', '#00C49F', '#FFBB28', '#FF8042', 
  '#8884D8', '#84D8A4', '#D884A4', '#D8D484'
]

function TransactionDashboard() {
  const [selectedMonth, setSelectedMonth] = useState('3')
  const [searchTerm, setSearchTerm] = useState('')
  const [combinedData, setCombinedData] = useState(null)
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const fetchCombinedData = async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await axios.get('/combined-data', {
        params: { 
          month: selectedMonth, 
          page, 
          search: searchTerm 
        }
      })
      console.log('Combined data:', response);
      
      setCombinedData(response.data)
    } catch (error) {
      console.error('Error fetching data:', error)
      setError('Failed to fetch data. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCombinedData()
  }, [selectedMonth, page, searchTerm])

  const renderTransactionsTable = () => (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Transactions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex mb-4 space-x-2">
          <Select 
            value={selectedMonth} 
            onValueChange={setSelectedMonth}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select Month" />
            </SelectTrigger>
            <SelectContent>
              {MONTHS.map(month => (
                <SelectItem key={month.value} value={month.value}>
                  {month.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Input 
            placeholder="Search transactions" 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-[250px]"
          />
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
                {combinedData?.transactions?.map(transaction => (
                  <TableRow key={transaction._id}>
                    <TableCell>{transaction.title}</TableCell>
                    <TableCell>{transaction.description}</TableCell>
                    <TableCell>${transaction.price.toFixed(2)}</TableCell>
                    <TableCell>{transaction.category}</TableCell>
                    <TableCell>{transaction.sold ? 'Yes' : 'No'}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <div className="flex justify-between mt-4">
              <Button 
                disabled={page === 1} 
                onClick={() => setPage(p => p - 1)}
              >
                Previous
              </Button>
              <span>Page {page} of {combinedData?.totalPages}</span>
              <Button 
                disabled={page === combinedData?.totalPages} 
                onClick={() => setPage(p => p + 1)}
              >
                Next
              </Button>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  )

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
          <div className="grid grid-cols-3 gap-4">
            <div>
              <h3 className="font-semibold">Total Sale Amount</h3>
              <p>${combinedData.statistics.totalSaleAmount.toFixed(2)}</p>
            </div>
            <div>
              <h3 className="font-semibold">Total Sold Items</h3>
              <p>{combinedData.statistics.totalSoldItems}</p>
            </div>
            <div>
              <h3 className="font-semibold">Total Not Sold Items</h3>
              <p>{combinedData.statistics.totalNotSoldItems}</p>
            </div>
          </div>
        ) : null}
      </CardContent>
    </Card>
  )

  const renderBarChart = () => (
    <Card>
      <CardHeader>
        <CardTitle>Price Range Distribution</CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="text-center py-4">Loading...</div>
        ) : error ? (
          <div className="text-red-500 text-center py-4">{error}</div>
        ) : (
          <BarChart width={600} height={300} data={combinedData?.barChart}>
            <XAxis dataKey="range" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="count" fill="#8884d8" />
          </BarChart>
        )}
      </CardContent>
    </Card>
  )

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
          <PieChart width={400} height={300}>
            <Pie
              data={combinedData?.pieChart}
              cx="50%"
              cy="50%"
              labelLine={false}
              outerRadius={80}
              fill="#8884d8"
              dataKey="count"
            >
              {combinedData?.pieChart.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={COLORS[index % COLORS.length]} 
                />
              ))}
            </Pie>
            <Tooltip />
            <Legend 
              payload={
                combinedData?.pieChart.map((entry, index) => ({
                  value: `${entry.category} (${entry.count})`,
                  color: COLORS[index % COLORS.length]
                }))
              }
            />
          </PieChart>
        )}
      </CardContent>
    </Card>
  )

  return (
    <div className="container mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-bold mb-6">
        Transaction Dashboard
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="md:col-span-2">
          {renderTransactionsTable()}
        </div>
        <div>
          {renderStatistics()}
        </div>
        <div>
          {renderBarChart()}
        </div>
        <div>
          {renderPieChart()}
        </div>
      </div>
    </div>
  )
}

export default TransactionDashboard