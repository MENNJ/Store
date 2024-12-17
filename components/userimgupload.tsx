"use client";

import React, { useState } from 'react';
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons';
import { message, Upload } from 'antd';
import type { GetProp, UploadProps } from 'antd';
import { Button } from "@/components/ui/button";
import {
    Drawer,
    DrawerContent,
    DrawerDescription,
    DrawerFooter,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger,
} from "@/components/ui/drawer";

type FileType = Parameters<GetProp<UploadProps, 'beforeUpload'>>[0];

const beforeUpload = (file: FileType) => {
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
    if (!isJpgOrPng) {
        message.error('你只能上传jpg和png文件!');
    }
    const isLt2M = file.size / 1024 / 1024 < 4;
    if (!isLt2M) {
        message.error('图像必须小于4MB!');
    }
    return isJpgOrPng && isLt2M;
};


const MyUpload: React.FC<{ onChange: (url: string) => void }> = ({ onChange }) => {
    const [loading, setLoading] = useState(false);
    const [imageUrl, setImageUrl] = useState<string>();
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [fileName, setFileName] = useState<string | null>(null);
    const [fileSize, setFileSize] = useState<number | null>(null);
    const [fileType, setFileType] = useState<string | null>(null);
    const [uploadTime, setUploadTime] = useState<string | null>(null);


    const handleChange: UploadProps['onChange'] = (info) => {
        if (info.file.status === 'uploading') {
            setLoading(true);
            return;
        }
        if (info.file.status === 'done') {
            const uploadedUrl = info.file.response.data;
            setImageUrl(uploadedUrl);
            onChange(uploadedUrl);
            setFileName(info.file.name);
            setFileSize(info.file.size ? info.file.size / 1024 : 0);
            setFileType(info.file.type ? info.file.type : null);
            setUploadTime(new Date().toLocaleString());
            setLoading(false);
        }
    };

    const uploadButton = (
        <button style={{ border: 0, background: 'none' }} type="button">
            {loading ? <LoadingOutlined /> : <PlusOutlined />}
            <div style={{ marginTop: 8 }}>Upload</div>
        </button>
    );

    return (
        <Drawer open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
            <DrawerTrigger asChild>
                {imageUrl ? (
                    <img
                        src={imageUrl}
                        alt="avatar"
                        style={{ borderRadius: "10px", width: '50px', height: '50px', objectFit: 'cover' }}
                        onClick={() => setIsDrawerOpen(true)}
                    />
                ) : (
                    <Button variant="outline" onClick={() => setIsDrawerOpen(true)}>Open Drawer</Button>
                )}
            </DrawerTrigger>
            <DrawerContent>
                <div className="mx-auto w-full max-w-sm">
                    <DrawerHeader>
                        <DrawerTitle>上传图片</DrawerTitle>
                        <DrawerDescription>拖入或点击上传图片</DrawerDescription>
                    </DrawerHeader>
                    <div className="p-4 pd-6">
                        <div className="flex items-center justify-center space-x-2">
                            <Upload
                                maxCount={1}
                                name="file"
                                listType="picture-card"
                                className="avatar-uploader"
                                showUploadList={false}
                                action="/api/uploadthing"
                                beforeUpload={beforeUpload}
                                onChange={handleChange}
                            >
                                {imageUrl ? (
                                    <>
                                        <img src={imageUrl} alt="avatar" style={{ borderRadius: "10px", width: '100px', height: '100px', objectFit: 'cover' }} />
                                    </>
                                ) : (
                                    uploadButton
                                )}
                            </Upload>
                        </div>
                        {fileName && fileSize && (
                            <div className="relative overflow-hidden z-40 bg-white dark:bg-neutral-900 flex flex-col items-start justify-start md:h-24 p-4 mt-4 w-full mx-auto rounded-md shadow-sm" >
                                <div className="flex justify-between w-full items-center gap-4">
                                    <p className="text-base text-neutral-700 dark:text-neutral-300 truncate max-w-xs" >
                                        文件名: {fileName}
                                    </p>
                                    <p className="rounded-lg px-2 py-1 w-fit flex-shrink-0 text-sm text-neutral-600 dark:bg-neutral-800 dark:text-white shadow-input">
                                        大小: {fileSize.toFixed(2)} KB
                                    </p>
                                </div>
                                <div className="flex text-sm md:flex-row flex-col items-start md:items-center w-full mt-2 justify-between text-neutral-600 dark:text-neutral-400">
                                    <p className="px-1 py-0.5 rounded-md bg-gray-100 dark:bg-neutral-800 ">
                                        类型: {fileType}</p>
                                    <p >上传时间: {uploadTime}</p>
                                </div>
                            </div>
                        )}
                    </div>
                    <DrawerFooter>
                        <Button onClick={() => setIsDrawerOpen(false)}>完成</Button>
                    </DrawerFooter>
                </div>
            </DrawerContent>
        </Drawer>
    );
};

export default MyUpload;
