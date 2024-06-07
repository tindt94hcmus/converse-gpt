import { NextResponse } from "next/server";
import { ENDPOINTS } from "@/constants/endpoints";
import { getCompletions } from "@/api/getCompletions";

export async function POST(req: Request) {
  const { text } = await req.json();
  try {
    const res = await getCompletions(text);

    return NextResponse.json({ text: res });
  } catch (error) {
    console.log(error);
  }
}
