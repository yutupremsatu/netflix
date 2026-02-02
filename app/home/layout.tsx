import { ReactNode } from "react";
import Navbar from "../components/Navbar";
import BottomNav from "../components/BottomNav";

export default function HomeLayout({ children }: { children: ReactNode }) {
    return (
        <>
            <Navbar />
            <main className="w-full max-w-7xl mx-auto sm:px-6 lg:px-8 pb-24">
                {children}
            </main>
            <BottomNav />
        </>
    );
}
