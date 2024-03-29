import { useEffect, useState } from "react";
import Image from "next/image";
import { Switch } from "@headlessui/react";
import { toast } from "sonner";
import { useRouter } from "next/router";
import { METADATA } from "@/data/metadata";
import { ArrowDownIcon, Cross1Icon } from "@radix-ui/react-icons";
import { downloadPfp } from "@/lib/utils/download";
import GeneratedItem from "@/components/shared/generatedItem";
import MoonbirdsVideoLoader from "@/components/MoonbirdsLoader";

const shareIcons = [
  {
    name: "Telegram",
    active: "/images/share/telegram-active.webp",
    inactive: "/images/share/telegram-inactive.webp",
    platform: "telegram",
  },
  {
    name: "Discord",
    active: "/images/share/discord-active.webp",
    inactive: "/images/share/discord-inactive.webp",
    platform: "discord",
  },
];

export default function MoonbirdGenerated({
  moonbird,
  index,
}: {
  moonbird: (typeof METADATA)[0];
  index: number;
}) {
  const router = useRouter();

  const [loading, setLoading] = useState(true);

  const [generatedEmojis, setGeneratedEmojis] = useState<any[]>([]);
  const [generatedEmojisTransparent, setGeneratedEmojisTransparent] = useState<
    any[]
  >([]);

  const [selectedEmojis, setSelectedEmojis] = useState<number[]>([]);

  const [progress, setProgress] = useState(0);

  const [platform, setPlatform] = useState("");

  const [hasBg, setHasBg] = useState(true);

  //On click escape, go to homescreen
  useEffect(() => {
    function handleEscape(e: KeyboardEvent) {
      if (e.key === "Escape") {
        router.replace("/");
      }
    }
    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, []);

  const onSelectEmojis = (index: number) => {
    if (selectedEmojis.includes(index)) {
      setSelectedEmojis(selectedEmojis.filter((i) => i !== index));
    } else {
      setSelectedEmojis([...selectedEmojis, index]);
    }
  };

  return (
    <div className="z-[2] flex h-screen w-screen items-center justify-center">
      {/* Desktop */}
      <div className="fixed inset-0 hidden scale-90 items-center justify-center overflow-y-auto md:flex">
        <div className=" hidden h-screen w-[80rem] transform flex-col-reverse items-center justify-center gap-3 overflow-hidden rounded p-3 text-left align-middle transition-all md:flex">
          <Image
            src="/images/book.webp"
            className="absolute h-[40vw] w-[40vw] rounded-t-md md:h-full md:w-full"
            height={2000}
            width={2000}
            alt="Background"
            priority
            loading="eager"
          />
          <div className="z-[2] -mt-10 flex h-[70%] w-[80%] md:-mt-20">
            <div className="mr-16 h-full w-full flex-1">
              <div className="z-[2] mr-5 flex flex-col gap-5 md:flex-row">
                <div className="flex w-full flex-col items-center justify-center gap-5">
                  <div className="flex w-full flex-col items-center justify-center gap-5 pt-5">
                    <div className="font-semibold text-black md:text-xl xl:text-3xl">
                      Moonbird #{index + 1}
                    </div>
                    <div className="relative flex h-[21vw] w-[21vw] items-center justify-center">
                      <img
                        src={`/images/moonbirds/tokens/${index}.png`}
                        className=" h-[18vw] w-[18vw] rounded"
                      />
                      <img
                        src="/images/frame.webp"
                        className="absolute top-0 rounded"
                      />
                    </div>
                    <div className="mb-5 mt-2 flex flex-col items-center gap-5 md:flex md:gap-4">
                      <div
                        onClick={() => {
                          downloadPfp(
                            `/images/moonbirds/tokens/${index}.png`,
                            index,
                          );
                        }}
                        className="w-fit cursor-pointer"
                      >
                        <img
                          src="/images/buttons/download_pfp.webp"
                          className="w-40"
                        />
                      </div>
                      <div
                        className="w-fit cursor-pointer"
                        onClick={() => {
                          router.push(`${moonbird.id}/generated`);
                        }}
                      >
                        <img
                          src="/images/buttons/generate-pressed-btn.webp"
                          className="w-48"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="h-full w-1/2 flex-1">
              <div className="-mt-4 flex h-full flex-col gap-2 pl-0 pr-3 lg:gap-1">
                <div className="z-[2] mb-2 mt-8 flex h-fit items-center justify-between">
                  <div className="flex items-center gap-4">
                    {shareIcons.map((messenger, i) => (
                      <div
                        key={i}
                        className="h-9 w-9 cursor-pointer"
                        onClick={async () => {
                          setSelectedEmojis([]);

                          if (platform === messenger.platform)
                            return setPlatform("");

                          setPlatform(messenger.platform);
                        }}
                      >
                        <img
                          src={
                            platform == messenger.platform
                              ? messenger.active
                              : messenger.inactive
                          }
                          className="h-full w-full"
                          alt={`${messenger.platform} icon`}
                        />
                      </div>
                    ))}
                  </div>

                  <div className="flex items-center gap-3">
                    <div
                      //   onClick={downloadEmojis}
                      className="ml-1 flex h-8 w-8 cursor-pointer items-center justify-center rounded border-2 border-orange-700 bg-orange-200 text-orange-700"
                    >
                      <ArrowDownIcon className="h-5 w-5" />
                    </div>
                    <div
                      onClick={() => {
                        router.back();
                      }}
                      className="ml-1 flex  h-8 w-8 cursor-pointer items-center justify-center rounded border-2 border-orange-700 bg-orange-200 text-orange-700"
                    >
                      <Cross1Icon className="h-5 w-5" />
                    </div>
                  </div>
                </div>

                {/* Background */}
                <div className="flex flex-row gap-3">
                  <Switch
                    checked={hasBg}
                    onChange={(checked) => {
                      setHasBg(checked);
                    }}
                    className={`${
                      hasBg ? "bg-[#C1410B]" : "bg-[#FED7AA]"
                    } relative inline-flex h-6 w-11 items-center rounded-full border-2 border-[#C1410B] transition-colors`}
                  >
                    <span
                      className={`${
                        hasBg
                          ? "translate-x-6 bg-[#FED7AA]"
                          : "translate-x-1 bg-[#C1410B]"
                      } inline-block h-4 w-4 transform rounded-full transition-transform`}
                    />
                  </Switch>
                  <div className="text-base font-semibold text-black">
                    Background
                  </div>
                </div>

                <div className="">
                  <div className="grid pt-4 md:grid-cols-3 lg:grid-cols-4 lg:gap-1">
                    {hasBg
                      ? generatedEmojis.map((emoji, i) => (
                          <GeneratedItem
                            key={i}
                            item={emoji}
                            selectedType="png"
                            platform={platform}
                            selected={selectedEmojis.includes(i)}
                            onSelect={() => onSelectEmojis(i)}
                            selectEnabled={platform ? true : false}
                          />
                        ))
                      : generatedEmojisTransparent.map((emoji, i) => (
                          <GeneratedItem
                            key={i}
                            item={emoji}
                            platform={platform}
                            selectedType="png"
                            selected={selectedEmojis.includes(i)}
                            onSelect={() => onSelectEmojis(i)}
                            selectEnabled={platform ? true : false}
                          />
                        ))}
                  </div>
                  <div
                    className={`${
                      platform ? "flex " : "hidden "
                    } justify-center`}
                  >
                    <img
                      src={`/images/share/export-${
                        selectedEmojis.length == 0
                          ? "active.webp"
                          : "active.webp"
                      }`}
                      alt="Export button"
                      className={`h-auto w-40 ${
                        selectedEmojis.length == 0
                          ? "cursor-not-allowed"
                          : "cursor-pointer"
                      }`}
                      onClick={async () => {
                        if (selectedEmojis.length === 0) {
                          toast.warning("Select at least one emoji to export!");
                          return;
                        }

                        // await exportStickers(platform)
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile */}
      <div className="fixed inset-0 block scale-95 overflow-y-hidden md:hidden">
        <div className="relative flex h-[100vh] w-full transform flex-col items-center justify-center gap-3 overflow-auto rounded p-3 text-left align-middle transition-all md:hidden">
          <Image
            src="/images/scroll.webp"
            className="absolute h-full w-full rounded-t-md md:h-full md:w-full"
            height={1000}
            width={1000}
            alt="moonbird Background"
            onLoad={() => {
              console.log("loaded");
              // toast.success('loaded')
            }}
            loading="eager"
            priority
          />

          <div className="z-2 absolute top-6 flex w-4/5 items-center justify-between px-3">
            <div className="mt-0 text-xl font-semibold text-[#3E1600]">
              Moonbird #{index}
            </div>
            <div className="flex items-center gap-5">
              <div
                onClick={() => {
                  navigator.clipboard.writeText(
                    `${router.basePath}/moonbirds/${moonbird.id}`,
                  );
                  toast.success("Copied link to clipboard");
                }}
                className="ml-1 flex  h-5 w-5 scale-150 cursor-pointer items-center justify-center  rounded border border-orange-700 bg-orange-200 text-orange-700"
              >
                <ion-icon name="share-social"></ion-icon>
              </div>
              <div
                onClick={() => {
                  router.back();
                }}
                className="ml-1 flex  h-5 w-5 scale-150 cursor-pointer items-center justify-center  rounded border border-orange-700 bg-orange-200 text-orange-700"
              >
                <ion-icon name="close"></ion-icon>
              </div>
            </div>
          </div>

          <div className="absolute z-[2] h-[70vh] w-[75vw] overflow-auto">
            {/* moonbird */}
            <div className="flex flex-col items-center">
              <div className="relative flex h-[50vw] w-[50vw] items-center justify-center">
                <img
                  src={`/images/moonbirds/tokens/${index}.png`}
                  className="h-[45vw] w-[45vw] rounded"
                />
                <img
                  src="/images/frame.webp"
                  className="absolute top-0 rounded"
                />
              </div>
              <div className="mb-5 mt-10 flex flex-col items-center gap-5 md:flex md:gap-4">
                <div
                  onClick={() => {
                    downloadPfp(`/images/moonbirds/tokens/${index}.png`, index);
                  }}
                  className="w-fit cursor-pointer"
                >
                  <img
                    src="/images/buttons/download_pfp.webp"
                    className="w-36"
                  />
                </div>
                <div
                  className="w-fit cursor-pointer"
                  onClick={() => {
                    router.push(`${moonbird.id}/generated`);
                  }}
                >
                  <img
                    src="/images/buttons/generate-pressed-btn.webp"
                    className="w-44"
                  />
                </div>
              </div>
            </div>

            {/* Share and download icons */}
            <div className="mt-1 flex w-full items-center justify-between px-2">
              <div className="flex items-center justify-between gap-3">
                {shareIcons.map((messenger, i) => (
                  <div
                    key={i}
                    className="h-9 w-9 cursor-pointer"
                    onClick={async () => {
                      setSelectedEmojis([]);

                      if (platform === messenger.platform)
                        return setPlatform("");

                      setPlatform(messenger.platform);
                    }}
                  >
                    <img
                      src={
                        platform == messenger.platform
                          ? messenger.active
                          : messenger.inactive
                      }
                      className="h-full w-full"
                      alt={`${messenger.platform} icon`}
                    />
                  </div>
                ))}
              </div>
              <div
                // onClick={downloadEmojis}
                className="ml-1 flex h-8 w-8 cursor-pointer items-center justify-center rounded border-2 border-orange-700 bg-orange-200 text-orange-700"
              >
                <ArrowDownIcon className="h-5 w-5" />
              </div>
            </div>

            {/* Background */}
            <div className="mx-2 mt-4 flex flex-row gap-3">
              <Switch
                checked={hasBg}
                onChange={(checked) => {
                  setHasBg(checked);
                }}
                className={`${
                  hasBg ? "bg-[#C1410B]" : "bg-[#FED7AA]"
                } relative inline-flex h-6 w-11 items-center rounded-full border-2 border-[#C1410B] transition-colors`}
              >
                <span
                  className={`${
                    hasBg
                      ? "translate-x-6 bg-[#FED7AA]"
                      : "translate-x-1 bg-[#C1410B]"
                  } inline-block h-4 w-4 transform rounded-full transition-transform`}
                />
              </Switch>
              <div className="text-base font-semibold text-black">
                Background
              </div>
            </div>

            {/* Generated Emojis */}
            <div className="pb-10">
              <div className="grid grid-cols-2 place-items-center gap-3 px-2">
                {hasBg
                  ? generatedEmojis.map((emoji, i) => (
                      <GeneratedItem
                        key={i}
                        item={emoji}
                        platform={platform}
                        selectedType="png"
                        selected={selectedEmojis.includes(i)}
                        onSelect={() => onSelectEmojis(i)}
                        selectEnabled={platform ? true : false}
                      />
                    ))
                  : generatedEmojisTransparent.map((emoji, i) => (
                      <GeneratedItem
                        key={i}
                        item={emoji}
                        platform={platform}
                        selectedType="png"
                        selected={selectedEmojis.includes(i)}
                        onSelect={() => onSelectEmojis(i)}
                        selectEnabled={platform ? true : false}
                      />
                    ))}
              </div>

              <div
                className={`
                  ${platform ? "flex" : "hidden"}
                  mt-5 justify-center
                  `}
              >
                <img
                  src={`/images/share/export-${
                    selectedEmojis.length == 0 ? "active.webp" : "active.webp"
                  }`}
                  alt="Export button"
                  className={`h-auto w-32 ${
                    selectedEmojis.length == 0
                      ? "cursor-not-allowed"
                      : "cursor-pointer"
                  }`}
                  onClick={async () => {
                    if (selectedEmojis.length === 0) {
                      toast.warning("Select at least one emoji to export!");
                      return;
                    }

                    //  await exportStickers(platform);
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Loading */}
      <MoonbirdsVideoLoader show={loading} progress={progress} total={1} />
    </div>
  );
}