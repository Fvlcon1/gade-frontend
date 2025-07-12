import React, { useRef, useState, DragEvent, ChangeEvent } from "react";
import { useTheme } from "@styles/theme-context";
import { FaCloudUploadAlt } from "react-icons/fa";
import Text from "@styles/components/text";
import Button from "@components/ui/button/button";
import { MdFileUpload } from "react-icons/md";

const MAX_FILE_SIZE_MB = 10;
const ACCEPTED_TYPES = ["image/jpeg", "image/png"];

const Upload = ({
    selectedFile,
    setSelectedFile,
    handleNext,
}) => {
    const { theme } = useTheme();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [error, setError] = useState<string>("");

    const handleFile = (file: File) => {
        if (!ACCEPTED_TYPES.includes(file.type)) {
            setError("Only JPG and PNG files are supported.");
            setSelectedFile(null);
            return;
        }
        if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
            setError("File size must be less than 10MB.");
            setSelectedFile(null);
            return;
        }
        setError("");
        setSelectedFile(file);
        handleNext()
        // Here you can add upload logic, e.g., call a prop or API
    };

    const onDrop = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            handleFile(e.dataTransfer.files[0]);
        }
    };

    const onBrowseClick = () => {
        fileInputRef.current?.click();
    };

    const onFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            handleFile(e.target.files[0]);
        }
    };

    const onDragOver = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
    };

    return (
        <div
            className={`w-[90%] h-[300px] flex flex-col gap-4 items-center justify-center rounded-2xl border-dashed border-[1px] border-border-tetiary`}
            onDrop={onDrop}
            onDragOver={onDragOver}
            onClick={onBrowseClick}
            style={{ cursor: "pointer" }}
        >
            <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png"
                style={{ display: "none" }}
                onChange={onFileChange}
            />
            <div className="flex items-center rounded-xl p-2 bg-main-primary/10 border-[1px] border-main-primary/50 shadow-xl shadow-main-primary/10 border-dashed">
                <div className="flex p-3 w-full h-full items-center justify-center rounded-lg bg-main-primary/10">
                    <FaCloudUploadAlt size={30} color={theme.colors.main.primary} />
                </div>
            </div>
            <div className="flex flex-col gap-1.5 items-center">
                <Text
                    size={theme.text.size.HM}
                    bold={theme.text.bold.md}
                >
                    Drag & drop your photo
                </Text>
                <Text textColor={theme.colors.text.tetiary}>
                    or click anywhere to browse
                </Text>
            </div>
            <Button
                text="Browse files"
                icon={<MdFileUpload />}
                onClick={e => {
                    e.stopPropagation();
                    onBrowseClick();
                }}
            />
            <Text textColor={theme.colors.text.tetiary}>
                Supports: JPG and PNG up to 10MB
            </Text>
            {selectedFile && (
                <Text textColor={theme.colors.text.secondary}>
                    Selected: {selectedFile.name}
                </Text>
            )}
            {error && (
                <Text textColor={theme.colors.text?.danger || 'red'}>
                    {error}
                </Text>
            )} 
        </div>
    );
}
export default Upload