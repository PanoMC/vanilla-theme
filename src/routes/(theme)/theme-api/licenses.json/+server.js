import fs from "fs";
import path from "path";

/** @type {import("@sveltejs/kit").RequestHandler} */
export async function GET() {
  // First read from build folder
  let filePath = path.resolve(process.cwd(), "build", "licenses.json");

  // If not found in build folder, read from root directory (for development)
  if (!fs.existsSync(filePath)) {
    filePath = path.resolve(process.cwd(), "licenses.json");
  }

  if (fs.existsSync(filePath)) {
    const fileContent = fs.readFileSync(filePath, "utf-8");
    return new Response(fileContent, {
      headers: {
        "Content-Type": "application/json"
      }
    });
  } else {
    // Return empty object if file not found
    return new Response(JSON.stringify({}), {
      headers: {
        "Content-Type": "application/json"
      }
    });
  }
}

