import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthenticatedUser, requireAdmin } from "@/lib/auth";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const lang = searchParams.get("lang") || "en";
  const authUser = getAuthenticatedUser(request);
  if (!requireAdmin(authUser)) {
    return NextResponse.json({ error: lang === "ar" ? "غير مصرح" : "Unauthorized" }, { status: 403 });
  }

  try {
    const totalOrders = await prisma.order.count();
    const totalRevenue = await prisma.order.aggregate({
      _sum: { totalAmount: true },
      where: { status: { notIn: ["CANCELLED", "PENDING"] } },
    });
    const totalProducts = await prisma.product.count();

    return NextResponse.json({
      totalOrders,
      totalRevenue: totalRevenue._sum.totalAmount || 0,
      totalProducts,
    });
  } catch {
    return NextResponse.json({ error: lang === "ar" ? "فشل تحميل الملخص" : "Failed to fetch overview" }, { status: 500 });
  }
}
