import { NextRequest, NextResponse } from "next/server";
import { writeFile, unlink } from "fs/promises";
import { join } from "path";
import { LlamaParseReader } from "llamaindex";
// import formidable from "formidable";

export const config = {
  api: {
    bodyParser: false,
  },
};

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const file = formData.get("file") as File;

  if (!file) {
    return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const filename = file.name.replace(/\s/g, "-");
  const filepath = join("/tmp", filename);

  try {
    await writeFile(filepath, buffer);
    console.log("File saved to", filepath);

    // Process the file with LlamaParseReader
    const reader = new LlamaParseReader({ resultType: "markdown" });
    const documents = await reader.loadData(filepath);

    // Delete the file after processing
    await unlink(filepath);
    console.log("File deleted:", filepath);

    console.log({documents})

    return NextResponse.json({ success: true, documents });
  } catch (error) {
    console.error("Error processing file:", error);
    return NextResponse.json(
      { error: "Error processing file" },
      { status: 500 }
    );
  }
}
