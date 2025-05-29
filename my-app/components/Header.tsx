import Link from "next/link";
import Image from 'next/image';

export default function Header() {
    return (
        <header className="p-4 bg-white border-b border-gray-200 shadow-sm">
        <div className ="mx-auto px-4 flex justify-between items-center"> 
                <a className="flex items-center gap-2 text-2xl font-bold text-gray-700 hover:text-gray-900" href="/">
                    <Image
                    src="/Project Pal.svg"
                    alt="Project Pal Logo"
                    width={50}
                    height={50}
                    className="rounded"
                    />
                    Project Pal
                </a>

        </div>
        </header>
    );
    }