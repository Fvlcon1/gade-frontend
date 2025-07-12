import React, { useState, useCallback } from "react";
import Cropper from "react-easy-crop";
import Slider from "@mui/material/Slider";
import Button from "@components/ui/button/button";
import Text from "@styles/components/text";
import { useTheme } from "@styles/theme-context";

// Utility to get cropped image from canvas
async function getCroppedImg(imageSrc: string, crop: any, rotation = 0) {
    const createImage = (url: string) =>
        new Promise<HTMLImageElement>((resolve, reject) => {
            const image = new window.Image();
            image.addEventListener("load", () => resolve(image));
            image.addEventListener("error", error => reject(error));
            image.setAttribute("crossOrigin", "anonymous"); // Needed for CORS
            image.src = url;
        });

    const image = await createImage(imageSrc);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    const safeArea = Math.max(image.width, image.height) * 2;
    canvas.width = safeArea;
    canvas.height = safeArea;

    ctx!.translate(safeArea / 2, safeArea / 2);
    ctx!.rotate((rotation * Math.PI) / 180);
    ctx!.translate(-safeArea / 2, -safeArea / 2);
    ctx!.drawImage(image, (safeArea - image.width) / 2, (safeArea - image.height) / 2);

    const data = ctx!.getImageData(0, 0, safeArea, safeArea);
    canvas.width = crop.width;
    canvas.height = crop.height;
    ctx!.putImageData(
        data,
        Math.round(0 - safeArea / 2 + image.width / 2 - crop.x),
        Math.round(0 - safeArea / 2 + image.height / 2 - crop.y)
    );

    return new Promise<string>((resolve) => {
        canvas.toBlob((blob) => {
            resolve(blob ? URL.createObjectURL(blob) : "");
        }, 'image/jpeg');
    });
}

interface EditImageProps {
    imageSrc: string;
    onSave: (croppedImageUrl: string) => void;
    aspect?: number;
}

const EditImage: React.FC<EditImageProps> = ({ imageSrc, onSave, aspect = 1 }) => {
    const { theme } = useTheme();
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [rotation, setRotation] = useState(0);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");

    const onCropComplete = useCallback((_croppedArea, croppedAreaPixels) => {
        setCroppedAreaPixels(croppedAreaPixels);
    }, []);

    const handleSave = useCallback(async () => {
        setSaving(true);
        try {
            const croppedImage = await getCroppedImg(imageSrc, croppedAreaPixels, rotation);
            onSave(croppedImage);
        } catch (e) {
            setError("Failed to crop image.");
        }
        setSaving(false);
    }, [croppedAreaPixels, imageSrc, rotation, onSave]);

    return (
        <div className="flex flex-col gap-4 w-full items-center">
            <div className="relative border-[10px] border-border-secondary h-[300px] w-[300px] rounded-full" style={{ background: theme.colors.bg.primary, overflow: 'hidden' }}>
                <Cropper
                    image={imageSrc}
                    crop={crop}
                    zoom={zoom}
                    rotation={rotation}
                    aspect={aspect}
                    onCropChange={setCrop}
                    onZoomChange={setZoom}
                    onRotationChange={setRotation}
                    onCropComplete={onCropComplete}
                />
            </div>
            <div
                className="w-full flex flex-col items-center gap-6 p-4"
                style={{ background: theme.colors.bg.secondary, borderRadius: 16 }}
            >
                <div className="flex flex-col gap-3 w-full max-w-md">
                    <Text size={theme.text.size.SM} bold={theme.text.bold.sm}>Zoom</Text>
                    <Slider
                        value={zoom}
                        min={1}
                        max={3}
                        step={0.01}
                        onChange={(_, value) => setZoom(Number(value))}
                    />
                    <Text size={theme.text.size.SM} bold={theme.text.bold.sm}>Rotate</Text>
                    <Slider
                        value={rotation}
                        min={0}
                        max={360}
                        step={1}
                        onChange={(_, value) => setRotation(Number(value))}
                    />
                </div>
                {error && <Text textColor={theme.colors.text?.danger || 'red'}>{error}</Text>}
            </div>

            <Button
                text={saving ? "Saving..." : "Apply"}
                onClick={handleSave}
                loading={saving}
                disabled={saving}
                className="!w-[200px]"
            />
        </div>
    );
};

export default EditImage;
