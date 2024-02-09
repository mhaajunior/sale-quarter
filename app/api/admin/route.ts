import { NextRequest, NextResponse } from "next/server";

// เช็คสถานะ server
export const POST = async (req: NextRequest) => {
  return NextResponse.json("ระบบทำงานปกติ");
};
