/* eslint-disable no-console */
/* eslint-disable @next/next/no-img-element */
import { Switch } from "@headlessui/react";
import { motion } from "framer-motion";
import {
  ArrowDownIcon,
  ArrowLeftIcon,
  Cross1Icon,
} from "@radix-ui/react-icons";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

import { emojis, shareIcons } from "@/lib/data";
import { download, downloadImagesAsZip } from "@/lib/download.lib";

import { GALLERY } from "@/data/gallery";
import GeneratedItem from "@/components/shared/GeneratedItem";
import DoneModal from "@/components/shared/DoneModal";
import { WizardsLoader } from "@/components/WizardsLoader";
import { createDiscordEmojiPack } from "@/http/discord.http";
import { createTelegramStickerPack } from "@/http/telegram.http";
import { cn } from "@/lib/misc.lib";
import { TWizardGeneratorAPIPayload } from "@/types/wizard.type";
import { EPlatform } from "@/types/misc.type";

import ThemedIconButton from "@/components/shared/ThemedIconButton";
import { generateWizardEmojis } from "@/http/wizard.http";
import ScrollTokenFrame from "@/components/shared/ScrollTokenFrame";
import useElementHeightMonitor from "@/hooks/useElementHeightMonitor";

type GeneratedWizardsProps = {
  wizard: (typeof GALLERY)[0];
  index: number;
};

export default function GeneratedWizards({
  wizard,
  index,
}: Readonly<GeneratedWizardsProps>) {
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [isExportingStickers, setIsExportingStickers] = useState(false);

  const [generatedEmojis, setGeneratedEmojis] = useState<any[]>([]);
  const [generatedEmojisTransparent, setGeneratedEmojisTransparent] = useState<
    any[]
  >([]);

  const [selectedEmojis, setSelectedEmojis] = useState<number[]>([]);

  const [selectedType, setSelectedType] = useState<"png" | "gif" | "">("");

  const [hasBg, setHasBg] = useState(true);

  const [platform, setPlatform] = useState<EPlatform>(EPlatform.NONE);

  const [packId, setPackId] = useState<string>("ABCDEFGHIJKL");

  const [showDoneModal, setShowDoneModal] = useState(false);

  const wrapperElement = useRef<HTMLDivElement>(null);
  const gridWrapperHeight = useElementHeightMonitor(wrapperElement.current);

  useEffect(() => {
    generateWizardsCollection();
  }, []);

  /**
   * Go to home page with Escape key press
   *
   */
  useEffect(() => {
    function handleEscape(e: KeyboardEvent) {
      if (e.key === "Escape") {
        router.replace(`/collections/wizards/${wizard.id}`);
      }
    }
    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, []);

  async function generateWizardsCollection() {
    // if (selectedType == '') {
    //   console.error("select a type");
    //   return;
    // }

    const payload: TWizardGeneratorAPIPayload = {
      tokenId: index - 1,
      platform,
      emojis: [],
    };

    for (const emoji of emojis) {
      payload.emojis.push({
        name: emoji.emoji_type,
        type: emoji.type as "gif" | "png",
      });
    }

    try {
      let images = await generateWizardEmojis(
        payload,
        (progress: number, total: number) => {
          // setProgress(progress);
          // setTotalSizeOfGeneratedImages(total);
        },
      );
      setGeneratedEmojis(images.colored);
      setGeneratedEmojisTransparent(images.transparent);
    } catch (error) {
      console.error(error);
      setLoading(false);

      toast.dismiss();
      toast.error("Error generating emojis", {
        position: "bottom-right",
      });
    } finally {
      setLoading(false);
    }
  }

  const isGenerating =
    loading &&
    generatedEmojis.length == 0 &&
    generatedEmojisTransparent.length == 0;

  async function downloadEmojis() {
    // if (selectedEmojis.length === 0) {
    //   toast.error('Select at least one emoji to export!');
    //   return;
    // }

    const selected = hasBg
      ? generatedEmojis.filter((_, i) => selectedEmojis.includes(i))
      : generatedEmojisTransparent.filter((_, i) => selectedEmojis.includes(i));

    // If none are selected, download all
    if (selected.length === 0) {
      downloadImagesAsZip(
        "wizard",
        hasBg ? generatedEmojis : generatedEmojisTransparent,
        index,
      );
      return;
    }

    downloadImagesAsZip("wizard", selected, index);
  }

  async function exportStickers(platform: EPlatform) {
    setIsExportingStickers(true);
    const loadingToastID = toast.loading("Preparing emojis...", {
      unstyled: true,
      classNames: {
        toast: "bg-white rounded-md shadow flex items-center gap-2 px-4 py-2",
        title: "font-pixelify-r text-black",
      },
    });

    const generatedCollection = hasBg
      ? generatedEmojis
      : generatedEmojisTransparent;

    const _selectedEmojis: any[] = generatedCollection.filter((_, index) =>
      selectedEmojis.includes(index),
    );

    console.log({ _selectedEmojis });

    try {
      if (platform === EPlatform.DISCORD) {
        const id = await createDiscordEmojiPack({
          collection: "wizards",
          hasBackground: hasBg,
          tokenId: index - 1,
          selected: _selectedEmojis,
        });

        if (id.length <= 2) throw new Error("Error creating discord pack");

        setPackId(id);
        toast.dismiss(loadingToastID);
        setShowDoneModal(true);
        return;
      }

      /**
       * Generates telegram sticker packs
       */
      const id = await createTelegramStickerPack({
        collection: "wizards",
        hasBackground: hasBg,
        tokenId: index - 1,
        selected: _selectedEmojis,
      });

      if (id.length <= 2) throw new Error("Error creating telegram pack");

      setPackId(id);
      toast.dismiss(loadingToastID);
      setShowDoneModal(true);
    } catch (error: any) {
      console.error("Error exporting stickers", error);
      toast.dismiss();
      toast.error(error.message);
    } finally {
      toast.dismiss(loadingToastID);
      setIsExportingStickers(false);
    }
  }

  function onSelectEmojis(emoji: any, i: number) {
    setSelectedType(emoji.type);

    if (platform == EPlatform.TELEGRAM) {
      if (selectedType === emoji.type) {
        if (selectedEmojis.includes(i)) {
          const _selectedEmojis = selectedEmojis.filter((j) => j !== i);
          setSelectedEmojis(_selectedEmojis);

          if (_selectedEmojis.length === 0) setSelectedType("");
        } else {
          setSelectedEmojis([...selectedEmojis, i]);
        }
      } else {
        setSelectedEmojis([i]);
      }
    } else {
      if (selectedEmojis.includes(i)) {
        setSelectedEmojis(selectedEmojis.filter((j) => j !== i));
      } else {
        setSelectedEmojis([...selectedEmojis, i]);
      }
    }
  }

  async function exportEmojis() {
    if (selectedEmojis.length === 0) {
      toast.warning("Select at least one emoji to export!");
      return;
    }

    if (platform == EPlatform.TELEGRAM) {
      // Check if included stickers are animated or static
      const selected = generatedEmojis.filter((_, i) =>
        selectedEmojis.includes(i),
      );

      if (selected.some((emoji) => emoji.type !== selectedType)) {
        toast.error(
          "Telegram sticker pack cannot include both animated and static stickers!",
        );
        return;
      }

      await exportStickers(platform);
    } else {
      await exportStickers(platform);
    }
  }

  function getInstruction() {
    switch (platform) {
      case EPlatform.TELEGRAM:
        return <p>Select either animated or static stickers to export.</p>;
      case EPlatform.DISCORD:
        return (
          <p>You can choose both animated and static stickers to export.</p>
        );

      default:
        return <p>Choose a platform to export your stickers to</p>;
    }
  }

  const gridClasses = (() => {
    const GRID_GAP = 16; /**16 pixels == gap-4 */
    const availableHeight = gridWrapperHeight - 16; /** 16 pixels */
    const GRID_GAPS_INCLUDED = 2;
    const EXPECTED_NUMBER_OF_ROWS = 3;
    /**
     * 3x3 grid rows height - 140px
     * 4x3 grid rows height - 110px
     */
    const is3ColumnGrid =
      availableHeight >=
      160 * EXPECTED_NUMBER_OF_ROWS + GRID_GAP * GRID_GAPS_INCLUDED;

    const is4ColumnGrid =
      availableHeight >=
      120 * EXPECTED_NUMBER_OF_ROWS + GRID_GAP * GRID_GAPS_INCLUDED;

    return cn("grid grid-cols-5 gap-4 pt-4 ", {
      "grid-cols-4": is4ColumnGrid,
      "grid-cols-3 ": is3ColumnGrid,
      "max-w-[360px]": is3ColumnGrid && availableHeight < 500,
    });
  })();

  return (
    <div className=" flex h-[calc(100vh-64px)]  w-screen items-start justify-center font-pixelify-r text-black md:items-center">
      {/* Desktop */}
      <div className="inset-0 hidden h-full scale-90 items-start justify-center overflow-y-auto lg:flex">
        <div className=" flex h-[calc(100vh-64px)] w-[80rem] transform flex-col-reverse items-center justify-center gap-3 overflow-hidden rounded p-3 text-left align-middle transition-all">
          <img
            src="/images/desktop_wizard_background.webp"
            className="absolute h-[40vw] w-[40vw] rounded-t-md md:h-full md:w-full"
            alt="Wizard Background Image"
          />
          <div className=" z-[2] -mt-10 flex h-[75%] w-[80%] md:-mt-20">
            <div className="relative mr-10 mt-8 flex h-full w-1/2 flex-1 items-start  justify-center">
              <div className="z-[2] mr-5 flex w-full flex-1 flex-col gap-5  md:flex-row">
                <div className="flex w-full flex-col items-center justify-center gap-5 ">
                  <div className="relative flex w-full flex-col items-center justify-center gap-5">
                    <div className="relative flex w-full items-center justify-center">
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 1 }}
                        className="absolute left-8 flex h-8 w-8 cursor-pointer items-center justify-center rounded border-2 border-[#C1410B] text-[#C1410B]"
                        onClick={() => {
                          router.push(`/collections/wizards/${wizard.id}`);
                        }}
                      >
                        <ArrowLeftIcon className="h-6 w-6 rounded" />
                      </motion.button>
                      <div className=" text-center font-pixelify-b   md:text-xl xl:text-3xl">
                        Wizard #{index}
                      </div>
                    </div>
                    <div className="relative mt-8 flex h-[30vw] max-h-[350px] w-[30vw] max-w-[350px] items-center justify-center">
                      <img
                        src={`/images/gallery/${index}.webp`}
                        className="h-[25.71vw] max-h-[300px] w-[25.71vw] max-w-[300px] rounded"
                        alt={`Wizard ${index} image`}
                      />
                      <img
                        src="/images/frame.webp"
                        className="absolute top-0 rounded"
                        alt="Wizard frame"
                      />
                    </div>
                    <div className="mb-5 mt-4 flex flex-col items-center gap-5 md:flex md:gap-4">
                      <button
                        onClick={() => {
                          download(`/images/gallery/${index}.webp`, index);
                        }}
                        className="h-fit w-fit cursor-pointer"
                      >
                        <img
                          src="/images/download_pfp.webp"
                          className="w-40"
                          alt="Download pfp button"
                        />
                      </button>
                      {/* <button className="w-fit cursor-not-allowed">
                        <img
                          // src='/images/expressionz-btn-disabled.webp'
                          src="/images/generate-pressed-btn.webp"
                          className="w-48"
                          alt="Generate button"
                        />
                      </button> */}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="h-full w-1/2 flex-1">
              <div className=" flex h-full flex-col gap-2 pl-0 pr-3 lg:gap-1">
                <div className="z-[2] mb-3 mt-8 flex h-fit items-center justify-between gap-4 2xl:gap-10">
                  <div className="flex items-center gap-2">
                  </div>

                  <div className=" flex-1">{getInstruction()}</div>

                  <div className="flex items-center gap-2">
                    <ThemedIconButton
                      onClick={downloadEmojis}
                      variant="gold"
                      icon={<ArrowDownIcon className="h-5 w-5" />}
                    />
                    <ThemedIconButton
                      variant="gold"
                      onClick={() =>
                        router.replace(`/collections/wizards/${wizard.id}`)
                      }
                      icon={<Cross1Icon className="h-5 w-5" />}
                    />
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
                  <div className="text-base font-semibold">Background</div>
                </div>

                <div className="flex-1 overflow-clip" ref={wrapperElement}>
                  <div
                    className={"mx-auto grid grid-cols-3 gap-4"}
                    style={{
                      maxWidth: gridWrapperHeight - 66,
                    }}
                  >
                    {hasBg
                      ? generatedEmojis.map((emoji, i) => (
                          <GeneratedItem
                            key={i}
                            item={emoji}
                            selectedType={selectedType}
                            platform={platform}
                            selected={selectedEmojis.includes(i)}
                            onSelect={() => onSelectEmojis(emoji, i)}
                            selectEnabled={!!platform}
                          />
                        ))
                      : generatedEmojisTransparent.map((emoji, i) => (
                          <GeneratedItem
                            key={i}
                            item={emoji}
                            platform={platform}
                            selectedType={selectedType}
                            selected={selectedEmojis.includes(i)}
                            onSelect={() => onSelectEmojis(emoji, i)}
                            selectEnabled={!!platform}
                          />
                        ))}
                  </div>
                </div>

                <div
                  className={cn(
                    "mt-4 justify-center",
                    platform ? "flex " : "invisible ",
                  )}
                >
                  <button
                    className="h-fit w-fit disabled:cursor-not-allowed disabled:opacity-80"
                    onClick={() => exportEmojis()}
                    disabled={isExportingStickers}
                  >
                    <img
                      src={`/images/share/export-${
                        selectedEmojis.length == 0 || isExportingStickers
                          ? "pressed.webp"
                          : "active.webp"
                      }`}
                      alt="Export button"
                      className={`h-auto w-40 ${
                        selectedEmojis.length == 0 || isExportingStickers
                          ? "cursor-not-allowed"
                          : "cursor-pointer"
                      }`}
                    />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <ScrollTokenFrame
        renderHeaderContent={() => (
          <div className="flex items-center justify-between px-2">
            <div className="flex items-center space-x-3">
              <button
                className="flex h-7 w-7 cursor-pointer items-center justify-center rounded border border-[#C1410B] bg-[#FED7AA] text-[#C1410B]"
                onClick={() => {
                  router.push(`/collections/wizards/${wizard.id}`);
                }}
              >
                <ArrowLeftIcon className="h-5 w-5 rounded" />
              </button>
              <div className="mt-0 text-xl font-semibold">Wizard #{index}</div>
            </div>

            <div className="flex items-center gap-5">
              <button
                onClick={() => {
                  navigator.clipboard.writeText(
                    window.location.origin +
                      `/collections/wizards/${wizard.id}`,
                  );
                  toast.success("Copied link to clipboard");
                }}
                className="ml-1 flex  h-5 w-5 scale-150 cursor-pointer items-center justify-center  rounded border border-orange-700 bg-orange-200 text-orange-700"
              >
                <ion-icon name="share-social"></ion-icon>
              </button>
              {/* <button
                onClick={() => {
                  router.push("/");
                }}
                className="ml-1 flex  h-5 w-5 scale-150 cursor-pointer items-center justify-center  rounded border border-orange-700 bg-orange-200 text-orange-700"
              >
                <ion-icon name="close"></ion-icon>
              </button> */}
            </div>
          </div>
        )}
        wrapperClass="!h-[calc(100vh-64px)] w-screen lg:hidden"
      >
        <div className="box-border overflow-y-auto">
          {/* Wizard */}
          <div className="flex flex-col items-center">
            <div className="relative flex h-[50vw] w-[50vw] items-center justify-center">
              <img
                src={`/images/gallery/${index}.webp`}
                className="h-[45vw] w-[45vw] rounded"
                alt={`Wizard ${index} image`}
              />
              <img
                src="/images/frame.webp"
                className="absolute top-0 rounded"
                alt="Wizard frame"
              />
            </div>
            <div className="mb-5 mt-5 flex flex-col items-center gap-4 md:flex md:gap-4">
              <button
                onClick={() => download(`/images/gallery/${index}.webp`, index)}
                className="w-fit cursor-pointer"
              >
                <img
                  src="/images/download_pfp.webp"
                  className="w-36"
                  alt="Download button"
                />
              </button>
              {/* <div
                  className="w-fit cursor-pointer"
                  onClick={() => {
                    router.push(`${wizard.id}/generated`);
                  }}
                >
                  <img
                    src="/images/generate-pressed-btn.webp"
                    className="w-48"
                    alt="Generate button disabled"
                  />
                </div> */}
            </div>
          </div>

          {/* Share and download icons */}
          <div className="mt-5 flex w-full items-center justify-between">
            <div className="flex items-center justify-between gap-3">
            </div>
            <button
              onClick={downloadEmojis}
              className="ml-1 flex h-8 w-8 cursor-pointer items-center justify-center rounded border-2 border-orange-700 bg-orange-200 text-orange-700"
            >
              <ArrowDownIcon className="h-5 w-5" />
            </button>
          </div>

          {/* Background */}
          <div className=" mt-4 flex flex-row gap-3">
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
            <div className="text-sm font-semibold">Background</div>
          </div>

          <div className="mt-2 text-left">{getInstruction()}</div>

          {/* Generated Emojis */}
          <div className="pb-5">
            <div className="mt-4 grid grid-cols-3 place-items-center gap-4">
              {hasBg
                ? generatedEmojis.map((emoji, i) => (
                    <GeneratedItem
                      key={i}
                      item={emoji}
                      platform={platform}
                      selectedType={selectedType}
                      selected={selectedEmojis.includes(i)}
                      onSelect={() => onSelectEmojis(emoji, i)}
                      selectEnabled={!!platform}
                    />
                  ))
                : generatedEmojisTransparent.map((emoji, i) => (
                    <GeneratedItem
                      key={i}
                      item={emoji}
                      platform={platform}
                      selectedType={selectedType}
                      selected={selectedEmojis.includes(i)}
                      onSelect={() => onSelectEmojis(emoji, i)}
                      selectEnabled={!!platform}
                    />
                  ))}
            </div>

            <div
              className={`
                  ${platform ? "flex" : "hidden"}
                  mt-5 justify-center
                  `}
            >
              <button
                className="relative h-fit w-fit disabled:cursor-not-allowed disabled:opacity-80"
                onClick={() => exportEmojis()}
                disabled={isExportingStickers}
              >
                <img
                  src={`/images/share/export-${
                    selectedEmojis.length == 0 || isExportingStickers
                      ? "pressed.webp"
                      : "active.webp"
                  }`}
                  alt="Export button"
                  className={`h-auto w-32 ${
                    selectedEmojis.length == 0 || isExportingStickers
                      ? "cursor-not-allowed"
                      : "cursor-pointer"
                  }`}
                />
                {/* {isExportingStickers && (
                    <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
                      <LiaSpinnerSolid className="h-5 w-5 animate-spin" />
                    </div>
                  )} */}
              </button>
            </div>
          </div>
        </div>
      </ScrollTokenFrame>

      {/* Done Modal */}
      <DoneModal
        packId={packId}
        setShow={setShowDoneModal}
        show={showDoneModal}
        platform={platform}
      />

      {/* Loading */}
      <WizardsLoader show={isGenerating} />
    </div>
  );
}
