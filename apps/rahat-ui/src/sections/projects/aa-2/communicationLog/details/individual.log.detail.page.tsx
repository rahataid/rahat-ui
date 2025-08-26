

import { useState } from "react"
import { ArrowLeft, Download, RefreshCw, Search, Play, Pause, Volume2 } from "lucide-react"
import { Button } from "@rahat-ui/shadcn/src/components/ui/button"
import { Card, CardContent, CardHeader } from "@rahat-ui/shadcn/src/components/ui/card"
import { Slider } from "@rahat-ui/shadcn/src/components/ui/slider"
import { Input } from "@rahat-ui/shadcn/src/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@rahat-ui/shadcn/src/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@rahat-ui/shadcn/src/components/ui/table"
import { Badge } from "@rahat-ui/shadcn/src/components/ui/badge"
import { useParams } from "next/navigation"
import { UUID } from "crypto"
import { useGetCommunicationLogs } from "@rahat-ui/query"


// Mock data for the communication attempts
const communicationData = [
  {
    id: 1,
    audience: "+977-9877577473",
    attempts: 1,
    timestamp: "21 July, 2025, 00:12:35 PM",
    duration: 12,
    status: "Success",
  },
  {
    id: 2,
    audience: "+977-9877577473",
    attempts: 1,
    timestamp: "21 July, 2025, 00:12:35 PM",
    duration: 12,
    status: "Failed",
  },
  {
    id: 3,
    audience: "+977-9877577473",
    attempts: 1,
    timestamp: "21 July, 2025, 00:12:35 PM",
    duration: 12,
    status: "Success",
  },
  {
    id: 4,
    audience: "+977-9877577473",
    attempts: 1,
    timestamp: "21 July, 2025, 00:12:35 PM",
    duration: 12,
    status: "Success",
  },
  {
    id: 5,
    audience: "+977-9877577473",
    attempts: 1,
    timestamp: "21 July, 2025, 00:12:35 PM",
    duration: 12,
    status: "Success",
  },
  {
    id: 6,
    audience: "+977-9877577473",
    attempts: 1,
    timestamp: "21 July, 2025, 00:12:35 PM",
    duration: 12,
    status: "Success",
  },
  {
    id: 7,
    audience: "+977-9877577473",
    attempts: 1,
    timestamp: "21 July, 2025, 00:12:35 PM",
    duration: 12,
    status: "Success",
  },
  {
    id: 8,
    audience: "+977-9877577473",
    attempts: 1,
    timestamp: "21 July, 2025, 00:12:35 PM",
    duration: 12,
    status: "Success",
  },
  {
    id: 9,
    audience: "+977-9877577473",
    attempts: 1,
    timestamp: "21 July, 2025, 00:12:35 PM",
    duration: 12,
    status: "Success",
  },
  {
    id: 10,
    audience: "+977-9877577473",
    attempts: 1,
    timestamp: "21 July, 2025, 00:12:35 PM",
    duration: 12,
    status: "Success",
  },
]

export default function CommunicationIndividualDetails() {
  const { id: projectID, commsIdXactivityIdXsessionId } = useParams();
  console.log('from individual detail page', commsIdXactivityIdXsessionId);
  const [communicationId, activityId, sessionId] = (
    commsIdXactivityIdXsessionId as string
  ).split('%40');

   const { data: logs, isLoading } = useGetCommunicationLogs(
      projectID as UUID,
      communicationId,
      activityId,
    );
     console.log('logs from the individual detail page', logs);
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(12)
  const [duration] = useState(60)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")

  const filteredData = communicationData.filter((item) => {
    const matchesSearch = item.audience.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || item.status.toLowerCase() === statusFilter.toLowerCase()
    return matchesSearch && matchesStatus
  })

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying)
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="w-[1336px] h-[104px] flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <Button     variant="ghost" size="sm" className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back
            </Button>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Communication Details</h1>
              <p className="text-sm text-gray-600">Here is the detailed view of the selected communication</p>
            </div>
            <div className="w-[492px] h-[40px] flex items-center gap-2">
              <Button variant="outline" className="gap-2 bg-transparent">
                <Download className="h-4 w-4" />
                Export Failed Attempts
              </Button>
              <Button className="gap-2" style={{ backgroundColor: "#297AD6" }}>
                <RefreshCw className="h-4 w-4" />
                Retry Failed Requests
              </Button>
            </div>
          </div>
        </div>

        {/* Activity Details */}
        <Card className="w-[1336px] h-[170px] flex flex-col gap-4">
          <CardContent className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600">Preparedness</span>
                  <Badge variant="secondary" className="bg-green-100 text-green-800">
                    Not Started
                  </Badge>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Activity Title:</p>
                  <h2 className="text-lg font-semibold text-gray-900">
                    Distribute educational materials about the anticipatory action plan to local communities
                  </h2>
                  <p className="text-sm text-gray-500 mt-1">
                    Korem ipsum dolor sit amet, consectetur adipiscing elit. Nunc vulputate libero
                  </p>
                </div>
              </div>
              <div className="flex gap-8">
                <div className="text-center">
                  <p className="text-sm text-gray-600">Successfully Delivered</p>
                  <p className="text-3xl font-bold text-blue-600">100</p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-gray-600">Failed Deliveries</p>
                  <p className="text-3xl font-bold text-red-600">20</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex gap-6">
          {/* Audio Player */}
          <Card className="w-[400px] h-[672px] rounded-xl border p-4 flex flex-col gap-4">
            <CardContent className="p-0 flex-1 flex flex-col gap-4">
              <div className="flex flex-col gap-1">
                <div
                  className="w-[119px] h-4 font-sans font-normal text-sm leading-4 text-center"
                  style={{ color: "#64748B" }}
                >
                  Beneficiary group
                </div>
                <div className="w-[178px] h-6 font-sans font-medium text-sm leading-6" style={{ color: "#3D3D51" }}>
                  Rumsan Beneficiary Group
                </div>
                <div
                  className="w-[99px] h-4 font-sans font-normal text-sm leading-4 text-center"
                  style={{ color: "#64748B" }}
                >
                  Triggered Date
                </div>
                <div className="w-[180px] h-6 font-sans font-medium text-sm leading-6" style={{ color: "#334155" }}>
                  21 July, 2025, 00:12:35 PM
                </div>
              </div>

              <div className="w-[492px] h-[40px] flex items-center gap-8">
                {/* Updated dimensions to width 492px, height 40px, and maintained 16px gap */}
                <div className="w-[384px] h-[40px] flex items-center gap-4">
                  <Volume2 className="h-5 w-5 text-gray-600" />
                  <span className="text-sm font-medium">Voice</span>
                  <Badge
                    variant="secondary"
                    className="w-[94px] h-[22px] bg-orange-100 text-orange-800 flex items-center justify-center"
                    style={{ mixBlendMode: "multiply" }}
                  >
                    Pending
                  </Badge>
                </div>
              </div>

              <div className="flex-1">
                <p className="text-sm text-gray-600 mb-2">Communication Title Demo</p>
                <div className="flex items-center gap-4">
                  <Button variant="ghost" size="sm" onClick={togglePlayPause} className="h-8 w-8 p-0">
                    {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                  </Button>
                  <div className="flex-1 flex items-center gap-3">
                    <span className="text-xs text-gray-500">{formatTime(currentTime)}</span>
                    <Slider
                      value={[currentTime]}
                      onValueChange={(value) => setCurrentTime(value[0])}
                      max={duration}
                      step={1}
                      className="flex-1"
                    />
                    <span className="text-xs text-gray-500">{formatTime(duration)}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Communication Table */}
          <Card className="rounded-lg border p-4 flex flex-col gap-4 w-[920px] h-[672px]">
            <CardHeader className="p-0">
              <div className="flex items-center w-[888px] h-[40px] gap-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <Input
                    placeholder="Search"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-14 pr-3 w-[588px] h-[40px] rounded-lg border py-2 px-3"
                  />
                </div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-[240px] h-[40px] rounded-lg border py-[10px] px-[14px] font-sans font-normal text-sm leading-4 text-[#667085] [&>svg]:w-5 [&>svg]:h-5">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="success">Success</SelectItem>
                    <SelectItem value="failed">Failed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>
            <CardContent className="p-0 flex-1 flex flex-col gap-4 overflow-hidden">
              <div className="flex-1 overflow-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Audience</TableHead>
                      <TableHead>Attempts</TableHead>
                      <TableHead>Timestamp</TableHead>
                      <TableHead>Duration</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredData.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell className="font-medium">{item.audience}</TableCell>
                        <TableCell>{item.attempts}</TableCell>
                        <TableCell>{item.timestamp}</TableCell>
                        <TableCell>{item.duration}</TableCell>
                        <TableCell>
                          <Badge
                            variant={item.status === "Success" ? "default" : "destructive"}
                            className={
                              item.status === "Success" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                            }
                          >
                            {item.status}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {/* Pagination */}
              <div className="flex items-center justify-between mt-4">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600">Rows per page</span>
                  <Select defaultValue="10">
                    <SelectTrigger className="w-16">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="10">10</SelectItem>
                      <SelectItem value="20">20</SelectItem>
                      <SelectItem value="50">50</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center gap-1">
                  <Button variant="outline" size="sm" disabled>
                    ‹‹
                  </Button>
                  <Button variant="outline" size="sm" disabled>
                    ‹
                  </Button>
                  <Button variant="outline" size="sm" disabled>
                    ›
                  </Button>
                  <Button variant="outline" size="sm" disabled>
                    ››
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
