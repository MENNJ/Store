// 导入NextRequest和NextResponse，用于处理Next.js的请求和响应
import { NextRequest, NextResponse } from "next/server";

// 引入fs模块，用于文件操作
import fs from "fs";
// 引入path模块，用于路径操作
import path from "path";

// 引入crypto模块，用于生成随机UUID
import { randomUUID } from "crypto";

// 引入dayjs模块，用于日期操作
import dayjs from "dayjs";

// 定义异步函数，用于保存文件
const seveFile = async (blob: File) => {

  // 获取当前日期，格式为YYYY-MM-DD
  const dirname = "/product/" + dayjs().format("YYYY-MM-DD");

  // 获取上传目录的路径
  const uploadDir = path.join(process.cwd(), "public" + dirname);

  // 创建上传目录，如果目录不存在则创建
  fs.mkdirSync(uploadDir, {
    recursive: true,
  });

  // 生成随机UUID作为文件名
  const fileName = randomUUID() + ".png";

  // 将文件转换为ArrayBuffer
  const arratBuffer = await blob.arrayBuffer();

  // 将ArrayBuffer写入文件
  fs.writeFileSync(uploadDir + "/" + fileName, new DataView(arratBuffer));

  // 返回文件路径
  return dirname + "/" + fileName;
};

// 定义POST请求处理函数
export const POST = async (req: NextRequest) => {

  // 获取请求中的FormData
  const data = await req.formData();

  // 调用seveFile函数保存文件，并获取文件名
  const fileName = await seveFile(data.get("file") as File);

  // 返回JSON响应
  return NextResponse.json({
    success: true,
    errormassage: "文件上传成功",
    data: fileName,
  });
};
