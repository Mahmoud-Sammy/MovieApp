"use client";

import { useEffect } from "react";

type TrailerModalProps = {
    onClose: () => void;
    trailerUrl: string;
    isOpen: boolean;
    title: string;
};

export default function TrailerModal({
    onClose,
    trailerUrl,
    isOpen,
    title,
}: TrailerModalProps) {

    useEffect(() => {
        const handleESC = (event: KeyboardEvent) => {
            if (event.key === "Escape") {
                onClose();
            }
        };

        if (isOpen) {
            document.addEventListener("keydown", handleESC);
        }

        return () => {
            document.removeEventListener("keydown", handleESC);
        };
    }, [isOpen, onClose]);

    if (!isOpen || !trailerUrl) {
        return null;
    }

    return (
        <div
            className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50"
            onClick={onClose}
            role="dialog"
            aria-label="Trailer Modal"
        >
            <div
                className="bg-[#18181b] p-4 rounded-lg max-w-3xl w-full"
                onClick={(e) => e.stopPropagation()}
            >
                <div
                    className="relative w-full"
                    style={{ paddingTop: "56.25%" }}
                >
                    <iframe
                        src={trailerUrl}
                        title={`${title} Trailer`}
                        allow="autoplay; encrypted-media"
                        className="absolute top-0 left-0 w-full h-full rounded-lg"
                    />
                </div>
            </div>
        </div>
    );
}