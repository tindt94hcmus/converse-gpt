import { NextResponse } from "next/server";
import { ENDPOINTS } from "@/constants/endpoints";

export async function POST(req: Request) {
  const { text } = await req.json();
  try {
    const res = await fetch(`${ENDPOINTS.lookup}/${text}`);

    const json = await res.json();

    return NextResponse.json(json);
  } catch (error) {
    console.log(error);
  }
}
