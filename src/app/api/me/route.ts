import { NextResponse } from "next/server";

export const GET = async () => {
  return NextResponse.json({
    ok: true,
    fullName: "Panita Donmuang",
    studentId: "660610772",
  });
};
