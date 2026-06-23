import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthenticatedUser } from "@/lib/auth";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const lang = searchParams.get("lang") || "en";
  const authUser = getAuthenticatedUser(request);
  if (!authUser) {
    return NextResponse.json({ error: lang === "ar" ? "غير مصرح" : "Unauthorized" }, { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { id: authUser.userId },
    select: { id: true, name: true, email: true, role: true },
  });

  if (!user) {
    return NextResponse.json({ error: lang === "ar" ? "المستخدم غير موجود" : "User not found" }, { status: 404 });
  }

  return NextResponse.json({ user });
}
