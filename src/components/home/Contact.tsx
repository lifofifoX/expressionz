import React from "react";

function Contact() {
  return (
    <section className="font-presstart w-full space-y-10 py-12 lg:space-y-7 lg:py-32">
      <p className="text-center text-2xl uppercase text-white lg:text-3xl">
        Get in touch
      </p>

      <div className="flex flex-col items-center justify-center space-y-5 lg:flex-row lg:space-x-8 lg:space-y-0">
        <button>
          <img src="/images/buttons/twitter.webp" className="w-32 lg:w-40" />
        </button>
        <button>
          <img src="/images/buttons/email.webp" className="w-80 lg:w-96" />
        </button>
      </div>
    </section>
  );
}

export default Contact;