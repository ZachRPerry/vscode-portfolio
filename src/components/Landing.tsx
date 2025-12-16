export default function Landing({ onOpenContact }: { onOpenContact?: () => void }) {
  return (
    <div className="flex-1 flex flex-col items-center justify-center text-center p-4 md:p-6">
      <img src="/zLogoVS.png" alt="Logo" className="w-16 md:w-24 mb-3 md:mb-4" />
      <h1 className="text-xl md:text-2xl font-semibold mb-2">Zach Perry</h1>
      <p className="max-w-xl text-sm md:text-base text-gray-300 mb-4 px-4">
        Senior Software Engineer & Product-minded builder. I design and build delightful user
        experiences and scalable systems. I enjoy working on full-stack products, developer tools,
        and performance optimizations.
      </p>
      <div className="flex flex-col md:flex-row gap-3 md:gap-4 w-full md:w-auto px-4">
        <a href="#" className="px-4 py-2 bg-[#007acc] text-white rounded text-sm md:text-base">
          View Resume
        </a>
        <button
          type="button"
          onClick={() => onOpenContact?.()}
          className="px-4 py-2 border border-gray-600 rounded text-gray-200 disabled:opacity-50 text-sm md:text-base"
          disabled={!onOpenContact}
          aria-disabled={!onOpenContact}
        >
          Contact
        </button>
      </div>
    </div>
  );
}
