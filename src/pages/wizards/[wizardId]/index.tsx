import { useRouter } from "next/router";

import { GALLERY } from "@/data/gallery";
import GalleryImage from "@/components/gallery/wizards/WizardGalleryImage";
import Seo from "@/components/shared/Seo";
import BaseLayout from "@/components/shared/BaseLayout";
import Link from "next/link";

export default function WizardPage() {
  const router = useRouter();
  const { wizardId } = router.query;
  const wizard = GALLERY.find((w) => w.id === wizardId);

  return (
    <>
      <Seo title={`${wizard?.meta.name}`} />
      <img
        src="/images/background.png"
        className="fixed z-[1] h-screen w-screen object-cover"
      />
      <BaseLayout
        hideFooter
        variant="logo"
        transparentBackground
        childrenClass="h-[calc(100vh-64px)] flex  w-full flex-1 items-center justify-center overflow-hidden font-pixelify-r"
        logo={
          <Link
            href="/collections/wizards"
            className="flex items-center gap-2 text-base font-semibold"
          >
            <img
              src="/images/logos/twoo-logo.png"
              className="h-12 w-12 rounded-full "
              alt="The Wizards of Ord"
            />
            The Wizards of Ord
          </Link>
        }
      >
        {wizard && (
          <GalleryImage
            wizard={wizard}
            index={Number(wizard?.meta?.name?.split("#")[1])}
          />
        )}
      </BaseLayout>
    </>
  );
}
