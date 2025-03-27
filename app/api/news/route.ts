import { NextRequest, NextResponse } from "next/server";
import { ObjectId } from 'mongodb';
import { getExpertsCollection, getNewsCollection } from "@/lib/mongodb"; // Use helper functions

export async function POST(req: NextRequest) {
  // Add expertId to destructuring
  const { title, description, url, image, linkedEntity, expertId } = await req.json();

  if (!title || !url) {
    return NextResponse.json({ error: "Title and URL are required." }, { status: 400 });
  }

  const newsItem = {
    title,
    description,
    url,
    image,
    linkedEntity, // This might be redundant if always linked via expertId
    savedAt: new Date(), // Use savedAt instead of createdAt for clarity
  };

  try {
    if (expertId) {
      // --- Save to Expert Document ---
      if (!ObjectId.isValid(expertId)) {
        return NextResponse.json({ error: "Invalid Expert ID format." }, { status: 400 });
      }

      const expertsCollection = await getExpertsCollection();
      const updateResult = await expertsCollection.updateOne(
        { _id: new ObjectId(expertId) },
        {
          $push: {
            savedNews: {
              $each: [newsItem], // Array of items to add
              $position: 0      // Position to insert (0 for beginning)
            }
          },
          $set: { updatedAt: new Date() } // Also update the expert's updatedAt timestamp
        }
      );

      if (updateResult.matchedCount === 0) {
        return NextResponse.json({ error: "Expert not found." }, { status: 404 });
      }
      if (!updateResult.acknowledged || updateResult.modifiedCount === 0) {
         // It's possible the news item already exists if we add duplicate checks later
         console.warn(`News item might not have been added to expert ${expertId}. Acknowledged: ${updateResult.acknowledged}, ModifiedCount: ${updateResult.modifiedCount}`);
         // Decide if this should be an error or just a warning
      }

      return NextResponse.json({ message: "News article saved to expert successfully." }, { status: 200 });

    } else {
      // --- Fallback: Save to General News Collection (Original Behavior) ---
      // Consider if this fallback is still needed. If all saves should be linked
      // to an expert, you might want to return an error here instead.
      console.warn("Saving news article without linking to an expert.");
      const newsCollection = await getNewsCollection();
      await newsCollection.insertOne({ ...newsItem, createdAt: newsItem.savedAt }); // Use createdAt for consistency if this collection is kept

      return NextResponse.json({ message: "News article saved (unlinked)." }, { status: 200 });
    }
  } catch (error) {
    console.error("Error saving news article:", error);
    return NextResponse.json({ error: "Internal server error." }, { status: 500 });
  }
}
