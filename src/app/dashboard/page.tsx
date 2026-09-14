import { AppShell } from "@/components/dashboard/AppShell";
import { DashboardOverview } from "@/components/dashboard/DashboardOverview";
import { getWooCommerceDashboard } from "@/lib/woocommerce";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const dashboard = await getWooCommerceDashboard();
  return (
    <AppShell>
      <DashboardOverview dashboard={dashboard} />
    </AppShell>
  );
}
