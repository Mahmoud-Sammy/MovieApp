import { Suspense } from "react";
import DetailsContent from "./DetailsContent";

export default function DetailsPage() {
    return (
        <Suspense
            fallback={
                <div className="min-h-screen bg-black text-white flex items-center justify-center">
                    Loading...
                </div>
            }
        >
            <DetailsContent />
        </Suspense>
    );
}