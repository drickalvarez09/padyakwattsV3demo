"use client";

export default function NewsletterForm() {
  return (
    <form className="flex" onSubmit={(e) => e.preventDefault()}>
      <input
        className="flex-1 px-4 py-3 rounded-l-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-green-500"
        placeholder="Your email"
        type="email"
      />
      <button
        className="bg-white text-green-600 px-4 py-3 rounded-r-lg font-semibold hover:bg-gray-100 transition-all duration-300"
        type="submit"
      >
        <i className="fas fa-paper-plane" />
      </button>
    </form>
  );
}
