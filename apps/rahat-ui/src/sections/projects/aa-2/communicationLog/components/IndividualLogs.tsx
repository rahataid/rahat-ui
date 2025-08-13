import { Tabs, TabsContent, TabsList, TabsTrigger } from "@rahat-ui/shadcn/src/components/ui/tabs";
import VoiceLogsTable from "../table/VoiceLogsTable";
import SmsLogsTable from "../table/SmsLogsTable";
import EmailLogsTable from "../table/EmailLogsTable";


export function IndividualLogTab() {
  const mockVoiceLogs = [
    {
      id: 1,
      title: "Inform the Banks and Namaste Pay about the upcoming flood in Ruhsani Ban GC",
      groupName: "Ruhsani Ban GC",
      groupType: "Beneficiary",
      message: "2023",
      timestamp: "21 July, 2025, 06:12:35 PM",
      status: "Completed",
    },
    {
      id: 2,
      title: "Inform the Banks and Namaste Pay about the upcoming flood in Ruhsani Stak GC",
      groupName: "Ruhsani Stak GC",
      groupType: "Stakeholder",
      message: "2023",
      timestamp: "21 July, 2025, 06:12:35 PM",
      status: "Completed",
    },
    // ... existing voice logs
  ]
  
  const mockSmsLogs = [
    {
      id: 1,
      title: "Inform the Banks and Namaste Pay about the upcoming flood in Ruhsani Ban GC",
      groupName: "Ruhsani Ban GC",
      groupType: "Beneficiary",
      message: "This message has been sent successfully to all beneficiaries...",
      timestamp: "21 July, 2025, 06:12:35 PM",
      status: "Completed",
    },
    {
      id: 2,
      title: "Inform the Banks and Namaste Pay about the upcoming flood in Ruhsani Stak GC",
      groupName: "Ruhsani Stak GC",
      groupType: "Stakeholder",
      message: "This message has been sent successfully to all stakeholders...",
      timestamp: "21 July, 2025, 06:12:35 PM",
      status: "Completed",
    },
    {
      id: 3,
      title: "Inform the Banks and Namaste Pay about the upcoming flood in Ruhsani Stak GC",
      groupName: "Ruhsani Stak GC",
      groupType: "Stakeholder",
      message: "This message has been sent successfully to all stakeholders...",
      timestamp: "21 July, 2025, 06:12:35 PM",
      status: "Completed",
    },
    {
      id: 4,
      title: "Inform the Banks and Namaste Pay about the upcoming flood in Ruhsani Stak GC",
      groupName: "Ruhsani Stak GC",
      groupType: "Stakeholder",
      message: "This message has been sent successfully to all stakeholders...",
      timestamp: "21 July, 2025, 06:12:35 PM",
      status: "Completed",
    },
    {
      id: 5,
      title: "Inform the Banks and Namaste Pay about the upcoming flood in Ruhsani Ban GC",
      groupName: "Ruhsani Ban GC",
      groupType: "Beneficiary",
      message: "This message has been sent successfully to all beneficiaries...",
      timestamp: "21 July, 2025, 06:12:35 PM",
      status: "Work in Progress",
    },
    {
      id: 6,
      title: "Inform the Banks and Namaste Pay about the upcoming flood in Ruhsani Stak GC",
      groupName: "Ruhsani Stak GC",
      groupType: "Stakeholder",
      message: "This message has been sent successfully to all stakeholders...",
      timestamp: "21 July, 2025, 06:12:35 PM",
      status: "Completed",
    },
    {
      id: 7,
      title: "Inform the Banks and Namaste Pay about the upcoming flood in Ruhsani Ban GC",
      groupName: "Ruhsani Ban GC",
      groupType: "Beneficiary",
      message: "This message has been sent successfully to all beneficiaries...",
      timestamp: "21 July, 2025, 06:12:35 PM",
      status: "Failed",
    },
    {
      id: 8,
      title: "Inform the Banks and Namaste Pay about the upcoming flood in Ruhsani Ban GC",
      groupName: "Ruhsani Ban GC",
      groupType: "Beneficiary",
      message: "This message has been sent successfully to all beneficiaries...",
      timestamp: "21 July, 2025, 06:12:35 PM",
      status: "Completed",
    },
    {
      id: 9,
      title: "Inform the Banks and Namaste Pay about the upcoming flood in Ruhsani Stak GC",
      groupName: "Ruhsani Stak GC",
      groupType: "Stakeholder",
      message: "This message has been sent successfully to all stakeholders...",
      timestamp: "21 July, 2025, 06:12:35 PM",
      status: "Completed",
    },
    {
      id: 10,
      title: "Inform the Banks and Namaste Pay about the upcoming flood in Ruhsani Ban GC",
      groupName: "Ruhsani Ban GC",
      groupType: "Beneficiary",
      message: "This message has been sent successfully to all beneficiaries...",
      timestamp: "21 July, 2025, 06:12:35 PM",
      status: "Completed",
    },
  ]
  
  const mockEmailLogs = [
    {
      id: 1,
      title: "Inform the Banks and Namaste Pay about the upcoming flood in Ruhsani Ban GC",
      groupName: "Ruhsani Ban GC",
      groupType: "Beneficiary",
      subject: "Test Message",
      message: "This message has been sent successfully to all beneficiaries...",
      timestamp: "21 July, 2025, 06:12:35 PM",
      status: "Completed",
    },
    {
      id: 2,
      title: "Inform the Banks and Namaste Pay about the upcoming flood in Ruhsani Stak GC",
      groupName: "Ruhsani Stak GC",
      groupType: "Stakeholder",
      subject: "Test Message",
      message: "This message has been sent successfully to all stakeholders...",
      timestamp: "21 July, 2025, 06:12:35 PM",
      status: "Completed",
    },
    {
      id: 3,
      title: "Inform the Banks and Namaste Pay about the upcoming flood in Ruhsani Stak GC",
      groupName: "Ruhsani Stak GC",
      groupType: "Stakeholder",
      subject: "Test Message",
      message: "This message has been sent successfully to all stakeholders...",
      timestamp: "21 July, 2025, 06:12:35 PM",
      status: "Completed",
    },
    {
      id: 4,
      title: "Inform the Banks and Namaste Pay about the upcoming flood in Ruhsani Stak GC",
      groupName: "Ruhsani Stak GC",
      groupType: "Stakeholder",
      subject: "Test Message",
      message: "This message has been sent successfully to all stakeholders...",
      timestamp: "21 July, 2025, 06:12:35 PM",
      status: "Completed",
    },
    {
      id: 5,
      title: "Inform the Banks and Namaste Pay about the upcoming flood in Ruhsani Ban GC",
      groupName: "Ruhsani Ban GC",
      groupType: "Beneficiary",
      subject: "Test Message",
      message: "This message has been sent successfully to all beneficiaries...",
      timestamp: "21 July, 2025, 06:12:35 PM",
      status: "Work in Progress",
    },
    {
      id: 6,
      title: "Inform the Banks and Namaste Pay about the upcoming flood in Ruhsani Stak GC",
      groupName: "Ruhsani Stak GC",
      groupType: "Stakeholder",
      subject: "Test Message",
      message: "This message has been sent successfully to all stakeholders...",
      timestamp: "21 July, 2025, 06:12:35 PM",
      status: "Completed",
    },
    {
      id: 7,
      title: "Inform the Banks and Namaste Pay about the upcoming flood in Ruhsani Ban GC",
      groupName: "Ruhsani Ban GC",
      groupType: "Beneficiary",
      subject: "Test Message",
      message: "This message has been sent successfully to all beneficiaries...",
      timestamp: "21 July, 2025, 06:12:35 PM",
      status: "Failed",
    },
    {
      id: 8,
      title: "Inform the Banks and Namaste Pay about the upcoming flood in Ruhsani Ban GC",
      groupName: "Ruhsani Ban GC",
      groupType: "Beneficiary",
      subject: "Test Message",
      message: "This message has been sent successfully to all beneficiaries...",
      timestamp: "21 July, 2025, 06:12:35 PM",
      status: "Completed",
    },
    {
      id: 9,
      title: "Inform the Banks and Namaste Pay about the upcoming flood in Ruhsani Stak GC",
      groupName: "Ruhsani Stak GC",
      groupType: "Stakeholder",
      subject: "Test Message",
      message: "This message has been sent successfully to all stakeholders...",
      timestamp: "21 July, 2025, 06:12:35 PM",
      status: "Completed",
    },
    {
      id: 10,
      title: "Inform the Banks and Namaste Pay about the upcoming flood in Ruhsani Ban GC",
      groupName: "Ruhsani Ban GC",
      groupType: "Beneficiary",
      subject: "Test Message",
      message: "This message has been sent successfully to all beneficiaries...",
      timestamp: "21 July, 2025, 06:12:35 PM",
      status: "Completed",
    },
  ]

  return (
    <div className="bg-white rounded-lg border">
      <Tabs defaultValue="voice" className="p-6">
        <TabsList className="grid w-fit grid-cols-3 mb-4">
          <TabsTrigger value="voice">Voice</TabsTrigger>
          <TabsTrigger value="sms">SMS</TabsTrigger>
          <TabsTrigger value="email">Email</TabsTrigger>
        </TabsList>
        
        <TabsContent value="voice">
       
          <VoiceLogsTable data={mockVoiceLogs} />
        </TabsContent>
        <TabsContent value="sms">
          <SmsLogsTable data={mockSmsLogs} />
        </TabsContent>
        <TabsContent value="email">
          <EmailLogsTable data={mockEmailLogs} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
