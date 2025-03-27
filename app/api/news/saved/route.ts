import { NextRequest, NextResponse } from "next/server";
import { getNewsCollection } from "@/lib/mongodb";

export async function GET(req: NextRequest) {
  try {
    const newsCollection = await getNewsCollection();

    // Fetch all saved news articles
    const savedArticles = await newsCollection.find({}).toArray();

    return NextResponse.json({ savedArticles }, { status: 200 });
  } catch (error) {
    console.error("Error fetching saved news:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
