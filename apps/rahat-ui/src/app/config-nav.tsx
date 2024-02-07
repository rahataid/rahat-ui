import { useMemo } from "react";
import {
  Newspaper,
  UsersRound,
  UserRound,
  LayoutDashboard,
  GanttChartSquare,
  BadgeDollarSign,
} from "lucide-react";
import { paths } from "@/routes/paths";

export function useNavData() {
  const data = useMemo(
    () => [
      {
        title: "Dashboard",
        icon: <LayoutDashboard />,
        path: paths.dashboard.root,
      },
      {
        title: "Projects",
        icon: <GanttChartSquare />,

        path: paths.dashboard.general.project,
      },
      {
        title: "Transaction",
        icon: <BadgeDollarSign />,

        path: paths.dashboard.general.transaction,
      },
      {
        title: "Reporting",
        icon: <Newspaper />,

        path: paths.dashboard.general.reporting,
      },
      {
        title: "Beneficiaries List",
        icon: <UsersRound />,
        path: paths.dashboard.general.beneficiary,
      },
      {
        title: "Users",
        icon: <UserRound />,
        path: paths.dashboard.general.user,
      },
    ],
    []
  );
  return data;
}
