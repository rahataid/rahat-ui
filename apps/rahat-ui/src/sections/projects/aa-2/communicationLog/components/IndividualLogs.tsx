import { Tabs, TabsList, TabsTrigger, TabsContent } from "@rahat-ui/shadcn/src/components/ui/tabs";
import VoiceLogsTable from "../table/VoiceLogsTable";
import SmsLogsTable from "../table/SmsLogsTable";
import EmailLogsTable from "../table/EmailLogsTable";
import { useSearchParams, useRouter } from "next/navigation"; // Import useSearchParams and useRouter
import { useEffect } from "react";

export function IndividualLogTab() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const tab = searchParams.get("tab") || "individualLog"; 
  const subTab = searchParams.get("subTab") || "voice"; 

  useEffect(() => {
   
    if (tab === "individualLog" && !searchParams.get("subTab")) {
      router.replace(`?tab=individualLog&subTab=voice`);
    }
  }, [tab, searchParams, router]);

  const handleSubTabChange = (value: string) => {
    router.push(`?tab=individualLog&subTab=${value}`);
  };

  return (
    <div className="bg-white rounded-lg">
      <Tabs className="p-6" defaultValue={subTab} onValueChange={handleSubTabChange}>
        <TabsList className="grid w-fit grid-cols-3 mb-4">
          <TabsTrigger
            value="voice"
            className={`font-inter font-medium text-[14px] leading-[24px] tracking-[0%] ${
              subTab === "voice" ? "underline decoration-[2px] decoration-[#297AD6]" : ""
            }`}
          >
            Voice
          </TabsTrigger>
          <TabsTrigger
            value="sms"
            className={`font-inter font-medium text-[14px] leading-[24px] tracking-[0%] ${
              subTab === "sms" ? "underline decoration-[2px] decoration-[#297AD6]" : ""
            }`}
          >
            SMS
          </TabsTrigger>
          <TabsTrigger
            value="email"
            className={`font-inter font-medium text-[14px] leading-[24px] tracking-[0%] ${
              subTab === "email" ? "underline decoration-[2px] decoration-[#297AD6]" : ""
            }`}
          >
            Email
          </TabsTrigger>
        </TabsList>
        <TabsContent value="voice">
          <VoiceLogsTable />
        </TabsContent>
        <TabsContent value="sms">
          <SmsLogsTable />
        </TabsContent>
        <TabsContent value="email">
          <EmailLogsTable />
        </TabsContent>
      </Tabs>
    </div>
  );
}