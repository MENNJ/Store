"use client";
import React, { useState } from "react";
import { FileUpload } from "@/components/ui/file-upload";
import { Bar, BarChart, ResponsiveContainer } from "recharts"

import { Button } from "@/components/ui/button"
import {
    Drawer,
    DrawerClose,
    DrawerContent,
    DrawerDescription,
    DrawerFooter,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger,
} from "@/components/ui/drawer"


export function DrawerDemo() {
    const [files, setFiles] = useState<File[]>([]);
    const handleFileUpload = (files: File[]) => {
        setFiles(files);
    };


    return (
        <Drawer>
            <DrawerTrigger asChild>
                <Button variant="outline">Open Drawer</Button>
            </DrawerTrigger>
            <DrawerContent>
                <div className="mx-auto w-full max-w-sm">
                    <DrawerHeader>
                        <DrawerTitle>Move Goal</DrawerTitle>
                        <DrawerDescription>Set your daily activity goal.</DrawerDescription>
                    </DrawerHeader>
                    <div className="p-4 pb-0">
                        <div className="flex items-center justify-center space-x-2">
                            <FileUpload onChange={handleFileUpload} />
                        </div>
                        {/* <div className="mt-3 h-[120px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={data}>
                                    <Bar
                                        dataKey="goal"
                                        style={
                                            {
                                                fill: "hsl(var(--foreground))",
                                                opacity: 0.9,
                                            } as React.CSSProperties
                                        }
                                    />
                                </BarChart>
                            </ResponsiveContainer>
                        </div> */}
                    </div>
                    <DrawerFooter>
                        <Button>Submit</Button>
                        <DrawerClose asChild>
                            <Button variant="outline">Cancel</Button>
                        </DrawerClose>
                    </DrawerFooter>
                </div>
            </DrawerContent>
        </Drawer>
    )
}
