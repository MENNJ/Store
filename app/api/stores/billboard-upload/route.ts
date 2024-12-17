import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { randomUUID } from "crypto";
import dayjs from "dayjs";

const getFileExtension = (mimeType: string) => {
  const mimeMap: Record<string, string> = {
    "image/jpeg": ".jpg",
    "image/png": ".png",
    "image/gif": ".gif",
    "video/mp4": ".mp4",
    "video/webm": ".webm",
    "audio/mpeg": ".mp3",
    "audio/wav": ".wav",
    // Add more MIME types as necessary
  };

  return mimeMap[mimeType] || ""; // Return an empty string if MIME type is not found
};

const saveFile = async (blob: File) => {
  const mimeType = blob.type; // Get the MIME type of the file
  const fileExtension = getFileExtension(mimeType); // Get the corresponding file extension
  if (!fileExtension) {
    throw new Error("Unsupported file type");
  }

  const dirname = "/billboard/" + dayjs().format("YYYY-MM-DD");
  const uploadDir = path.join(process.cwd(), "public" + dirname);
  fs.mkdirSync(uploadDir, { recursive: true });

  const fileName = randomUUID() + fileExtension; // Use the correct extension
  const arrayBuffer = await blob.arrayBuffer();
  fs.writeFileSync(uploadDir + "/" + fileName, new DataView(arrayBuffer));

  return dirname + "/" + fileName;
};

export const POST = async (req: NextRequest) => {
  const data = await req.formData();
  const file = data.get("file") as File;

  try {
    const fileName = await saveFile(file); // Save the file with the correct extension
    return NextResponse.json({
      success: true,
      message: "文件上传成功",
      data: fileName,
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      message: error instanceof Error || "文件上传失败",
    });
  }
};
