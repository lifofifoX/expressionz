import { useRouter } from "next/router";

import { GALLERY } from "@/data/gallery";
import GeneratedWizards from "@/components/gallery/wizards/GeneratedWizards";
import Seo from "@/components/shared/Seo";
import Link from "next/link";
import BaseLayout from "@/components/shared/BaseLayout";

function Generated() {
  const router = useRouter();
  const { wizardId } = router.query;
  const wizard = GALLERY.find((w) => w.id === wizardId);

  return (
    <>
      <Seo title="Emojis" />
      <img
        src="/images/background.png"
        className="fixed z-[1] h-screen w-screen object-cover"
      />

      <BaseLayout
        hideFooter
        variant="logo"
        wrapperClass="relative z-[10]"
        transparentBackground
        childrenClass="h-[calc(100vh-64px)] flex  w-full items-center justify-center overflow-hidden font-pixelify-r"
        logo={
          <Link
            href={`/collections/wizards/${wizardId}`}
            className="flex items-center gap-2 text-base font-semibold"
          >
            <img
              src="/images/logos/twoo-logo.png"
              className="h-12 w-12 rounded-full "
              alt="moon bird logo"
            />
            The Wizards of Ord
          </Link>
        }
      >
        {wizard && (
          <GeneratedWizards
            wizard={wizard}
            index={Number(wizard?.meta?.name?.split("#")[1])}
          />
        )}
      </BaseLayout>
    </>
  );
}

export default Generated;
