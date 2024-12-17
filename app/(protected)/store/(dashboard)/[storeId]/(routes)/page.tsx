import { getSalesCount } from "@/actions/Dashboard/get-sales-count";
import { getStockCount } from "@/actions/Store/get-stock-count";
import { getTotalRevenue } from "@/actions/Dashboard/get-total-revenue";
import { getGraphRevenue } from "@/actions/Dashboard/get-graph-revenue";
import { getStore } from "@/actions/Dashboard/get-store";
import { Overview } from "@/components/Store/overview";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { formatter } from "@/lib/utils";
import { CreditCard, DollarSign, Package, AlarmClock } from "lucide-react";
import { getStoreCreationHours } from "@/actions/Dashboard/getstorecreationhours";
interface DashboardPageProps {
    params: {
        storeId: string;
    }
};

const DashboardPage: React.FC<DashboardPageProps> = async ({
    params
}) => {
    const totalRevenue = await getTotalRevenue(params.storeId);
    const salesCount = await getSalesCount(params.storeId);
    const stockCount = await getStockCount(params.storeId);
    const graphRevenue = await getGraphRevenue(params.storeId);
    const hoursSinceCreation = await getStoreCreationHours(params.storeId);
    const Store = await getStore(params.storeId);

    return (
        <div className="flex-col">
            <div className="flex-1 space-y-4 p-8 pt-6">
                <div className="flex justify-between">
                    <Heading title="仪表盘" description={`${Store}商店的概述`} />
                </div>
                <Separator />

                <div className="grid gap-4 grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pd-2">
                            <CardTitle className="text-sm font-medium">
                                总营收
                            </CardTitle>
                            <DollarSign className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {formatter.format(totalRevenue)}
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pd-2">
                            <CardTitle className="text-sm font-medium">
                                销售数量
                            </CardTitle>
                            <CreditCard className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                +{salesCount}
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pd-2">
                            <CardTitle className="text-sm font-medium">
                                库存产品
                            </CardTitle>
                            <Package className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {stockCount}
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pd-2">
                            <CardTitle className="text-sm font-medium">
                                商店已经运行
                            </CardTitle>
                            <AlarmClock className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {hoursSinceCreation}小时
                            </div>
                        </CardContent>
                    </Card>

                </div>
                <Card className="col-span-4">
                    <CardHeader>
                        <CardTitle>
                            统计
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="pl-2">
                        <Overview data={graphRevenue} />
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

export default DashboardPage;