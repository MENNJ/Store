import { db } from '@/lib/prismadb';
import { NextResponse } from 'next/server';

export async function GET(req: Request, { params }: { params: { userId: string } }) {
    const { userId } = params;

    if (typeof userId !== 'string') {
        return NextResponse.json({ error: 'Invalid userId' }, { status: 400 });
    }

    try {
        const user = await db.user.findUnique({
            where: { id: userId },
            select: {
                id: true,
                name: true,
                email: true,
                image: true,
                createdAt: true,
                updatedAt: true,
            },
        });

        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        return NextResponse.json(user);
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

import { NextRequest } from "next/server";
import fs from "fs";
import path from "path";
import { randomUUID } from "crypto";
import dayjs from "dayjs";

const saveFile = async (blob: File): Promise<string> => {
    try {
        const dirname = `/bgimage/${dayjs().format("YYYY-MM-DD")}`;
        const uploadDir = path.join(process.cwd(), "public", dirname);

        fs.mkdirSync(uploadDir, { recursive: true });

        const fileName = `${randomUUID()}.png`;

        const arrayBuffer = await blob.arrayBuffer();
        fs.writeFileSync(path.join(uploadDir, fileName), new DataView(arrayBuffer));

        return `${dirname}/${fileName}`;
    } catch (error) {
        console.error("Error saving file:", error);
        throw new Error("File upload failed");
    }
};

export const PATCH = async (req: NextRequest) => {
    try {
        const body = await req.json();
        const { file } = body;
        console.log(file+"==============================");
        
        if (!file || !(file instanceof File)) {
            return NextResponse.json(
                { success: false, errorMessage: "No file provided or invalid file" },
                { status: 400 }
            );
        }

        const fileName = await saveFile(file);

        return NextResponse.json({
            success: true,
            errorMessage: "File uploaded successfully",
            data: fileName,
        });
    } catch (error) {
        console.error("Error processing request:", error);
        return NextResponse.json(
            { success: false, errorMessage: "File upload failed" },
            { status: 500 }
        );
    }
};
