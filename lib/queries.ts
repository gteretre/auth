import { ObjectId } from "mongodb";
import { getDb } from "./mongodb";

type RawAuthor = {
  _id: string | ObjectId;
  id?: string;
  name?: string;
  username?: string;
  email?: string;
  createdAt?: Date | string;
  image?: string;
  bio?: string;
  role?: string;
  provider: string;
};

function mapAuthor(raw: RawAuthor): import("./models").Author {
  return {
    _id: raw._id?.toString() || "",
    id: raw.id || "",
    name: raw.name || "",
    username: raw.username || "",
    email: raw.email || "",
    createdAt:
      raw.createdAt instanceof Date
        ? raw.createdAt
        : new Date(raw.createdAt ?? Date.now()),
    image: raw.image || "",
    bio: raw.bio || "",
    role: raw.role || "",
    provider: raw.provider
  };
}

export async function getAuthorById(
  id: string
): Promise<import("./models").Author | null> {
  const db = await getDb();
  try {
    // Try to find by 'id' (OAuth provider ID)
    let author = await db.collection("authors").findOne({ id });
    // If not found, try by MongoDB _id
    if (!author && ObjectId.isValid(id)) {
      author = await db
        .collection("authors")
        .findOne({ _id: new ObjectId(id) });
    }
    // Use mapAuthor to ensure correct type
    return author ? mapAuthor(author as RawAuthor) : null;
  } catch (error) {
    console.error("Error in getAuthorById:", error);
    throw new Error(
      `Error in getAuthorById: ${error instanceof Error ? error.message : String(error)}`
    );
  }
}

export async function getAuthorByEmail(
  email: string
): Promise<import("./models").Author | null> {
  const db = await getDb();
  try {
    const author = await db.collection("authors").findOne({ email });
    // Use mapAuthor to ensure correct type
    return author ? mapAuthor(author as RawAuthor) : null;
  } catch (error) {
    console.error("Error in getAuthorByEmail:", error);
    throw new Error(
      `Error in getAuthorByEmail: ${error instanceof Error ? error.message : String(error)}`
    );
  }
}

export async function getAuthorByUsername(
  username: string
): Promise<import("./models").Author | null> {
  const db = await getDb();
  try {
    const author = await db.collection("authors").findOne({ username });
    // Use mapAuthor to ensure correct type
    return author ? mapAuthor(author as RawAuthor) : null;
  } catch (error) {
    console.error("Error in getAuthorByUsername:", error);
    throw new Error(
      `Error in getAuthorByUsername: ${error instanceof Error ? error.message : String(error)}`
    );
  }
}
