import { db } from "@/lib/prismadb"; 

const getBillboard = async () => {
  try {
    const billboards = await db.billboard.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });
    
    return billboards;
  } catch (error) {
    console.error("Error fetching billboards:", error);
    return [];
  }
};

export default getBillboard;
