import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { randomUUID } from "crypto";
import dayjs from "dayjs";
import { db } from "@/lib/prismadb"; 

const saveFile = async (blob: File) => {
    const dirname = "/bgimage/" + dayjs().format("YYYY-MM-DD");
    const uploadDir = path.join(process.cwd(), "public" + dirname);
    fs.mkdirSync(uploadDir, {
        recursive: true,
    });
    const fileName = randomUUID() + ".png";
    const arratBuffer = await blob.arrayBuffer();
    fs.writeFileSync(uploadDir + "/" + fileName, new DataView(arratBuffer));
    return dirname + "/" + fileName;
};

export const POST = async (req: NextRequest) => {
    const data = await req.formData();
    const userId = data.get("userId") as string;
    const file = data.get("file") as File;

    if (!userId || !file) {
        return NextResponse.json({
            success: false,
            errorMessage: "Missing user ID or file",
        });
    }

    try {
        const filePath = await saveFile(file);

        const updatedUser = await db.user.update({
            where: { id: userId },
            data: {
                bgimage: filePath, 
            },
        });

        return NextResponse.json({
            success: true,
            errorMessage: "文件上传成功",
            data: filePath,
        });
    } catch (error) {
        console.error("Error uploading file or updating user:", error);
        return NextResponse.json({
            success: false,
            errorMessage: "Error uploading file or updating user",
        });
    }
};
