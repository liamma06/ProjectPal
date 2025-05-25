import Link from "next/link";
import Image from 'next/image';

export default function Header() {
    return (
        <header className="p-4 bg-white border-b border-gray-200 shadow-sm">
        <div className ="mx-auto px-4 flex justify-between items-center"> 
                <Link className="flex items-center gap-2 text-2xl font-bold text-gray-700 hover:text-gray-900" href="/">
                    <Image
                    src="/Project Pal.svg"
                    alt="Project Pal Logo"
                    width={50}
                    height={50}
                    className="rounded"
                    />
                    Project Pal
                </Link>
                
                <Link 
                    href="/contact" 
                    className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors font-bold"
                >
                    Ship
                    <svg 
                        xmlns="http://www.w3.org/2000/svg" 
                        width="16" 
                        height="16" 
                        viewBox="0 0 24 24" 
                        fill="none" 
                        stroke="currentColor" 
                        strokeWidth="2" 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        className="translate-y-[1px]"
                    >
                        <path d="M5 12h14"></path>
                        <path d="m12 5 7 7-7 7"></path>
                    </svg>
                </Link>
        </div>
        </header>
    );
    }