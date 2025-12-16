import React from "react";

export default function Landing() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center text-center p-6">
      <img src="/zLogoVS.png" alt="Logo" className="w-24 mb-4" />
      <h1 className="text-2xl font-semibold mb-2">Zach Perry</h1>
      <p className="max-w-xl text-gray-300 mb-4">
        Senior Software Engineer & Product-minded builder. I design and build
        delightful user experiences and scalable systems. I enjoy working on
        full-stack products, developer tools, and performance optimizations.
      </p>
      <div className="flex gap-4">
        <a href="#" className="px-4 py-2 bg-[#007acc] text-white rounded">
          View Resume
        </a>
        <a href="#" className="px-4 py-2 border border-gray-600 rounded text-gray-200">
          Contact
        </a>
      </div>
    </div>
  );
}
