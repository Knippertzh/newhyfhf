import { NextRequest, NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

export async function POST(req: NextRequest) {
  const { title, description, url, image, linkedEntity } = await req.json();

  if (!title || !url) {
    return NextResponse.json({ error: "Title and URL are required." }, { status: 400 });
  }

  try {
    const client = await clientPromise;
    const db = client.db(); // Use default database from connection string
    const newsCollection = db.collection("news");

    const newsItem = {
      title,
      description,
      url,
      image,
      linkedEntity,
      createdAt: new Date(),
    };

    await newsCollection.insertOne(newsItem);

    return NextResponse.json({ message: "News article saved successfully." }, { status: 200 });
  } catch (error) {
    console.error("Error saving news article:", error);
    return NextResponse.json({ error: "Internal server error." }, { status: 500 });
  }
}
