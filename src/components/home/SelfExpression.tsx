import React, { useEffect, useState } from "react";

const emojis = [
  {
    img: "/images/samples/1.webp",
    emoji: "/images/emojis/unamused_face.webp",
  },
  {
    img: "/images/samples/2.webp",
    emoji: "/images/emojis/heart_eyes.webp",
  },
  {
    img: "/images/samples/3.webp",
    emoji: "/images/emojis/smiley_face.webp",
  },
  {
    img: "/images/samples/4.webp",
    emoji: "/images/emojis/face_with_sunglasses.webp",
  },
  {
    img: "/images/samples/5.webp",
    emoji: "/images/emojis/sleeping.webp",
  },
  {
    img: "/images/samples/6.webp",
    emoji: "/images/emojis/nerd_face.webp",
  },
  {
    img: "/images/samples/7.webp",
    emoji: "/images/emojis/lfg.webp",
  },
  {
    img: "/images/samples/8.webp",
    emoji: "/images/emojis/teary_face.webp",
  },
  {
    img: "/images/samples/9.webp",
    emoji: "/images/emojis/tears_of_joy.webp",
  },
  {
    img: "/images/samples/10.webp",
    emoji: "/images/emojis/hushed_face.webp",
  },
  {
    img: "/images/samples/11.webp",
    emoji: "/images/emojis/tea_cup.webp",
  },
];

function SelfExpression() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev === emojis.length - 1 ? 0 : prev + 1));
    }, 1000);

    return () => clearInterval(interval);
  }, [current]);

  return (
    <section className="my-20 h-[80vh] w-full bg-darkPurple bg-[url('/images/home/left-pixel-bg.webp')] bg-cover bg-left bg-no-repeat lg:mt-32 lg:h-[53vh] lg:bg-contain">
      <div className="font-presstart mx-auto flex w-4/5 flex-col-reverse lg:h-full lg:w-4/5 lg:flex-row lg:items-center lg:justify-between">
        <div className="w-full space-y-4 lg:w-1/2 mt-9 lg:mt-0">
          <h1 className="text-left text-3xl uppercase text-yellow">
            A NEW WORLD OF <br />
            SELF-EXPRESSION
          </h1>
          <p className="text-left text-xs text-white">
            Turn your PFPs into custom emotes to convey emotions, reactions, and
            sentiments in a way that's uniquely you
          </p>
        </div>
        <div className="-mt-10 self-end lg:mt-0 lg:self-center">
          <div className="flex flex-col items-center justify-center">
            <img src={emojis[current].emoji} className="h-12 w-12 lg:h-20 lg:w-20" />
            <img
              src={emojis[current].img}
              className="h-36 w-36 object-contain lg:h-60 lg:w-60"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

export default SelfExpression;