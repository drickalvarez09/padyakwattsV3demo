"use client";

export default function ContactForm() {
  return (
    <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <input className="enhanced-input" name="name" placeholder="John Doe" required type="text" />
        <input
          className="enhanced-input"
          name="email"
          placeholder="john@example.com"
          required
          type="email"
        />
      </div>
      <input
        className="enhanced-input"
        name="subject"
        placeholder="How can we help you?"
        required
        type="text"
      />
      <textarea
        className="enhanced-input"
        name="message"
        placeholder="Tell us about your project or inquiry..."
        required
        rows={5}
      />
      <button className="btn-energy w-full py-4 text-lg" type="submit">
        <i className="fas fa-paper-plane mr-3" />
        Send Message
      </button>
    </form>
  );
}
