// An example of what the ambiance produces. Renders nothing at all until the
// asset exists — a page with no render must still be publishable and correct,
// never a broken frame or a dangling "coming soon".
import type { RenderAsset } from "@/lib/library";

export default function RenderSlot({ asset }: { asset: RenderAsset | null }) {
  if (!asset) return null;

  return (
    <figure className="mb-8">
      <figcaption className="text-xs font-semibold text-foreground tracking-wide mb-2">
        LE RENDU
      </figcaption>
      {asset.kind === "audio" && (
        <audio controls preload="none" src={asset.src} className="w-full">
          Votre navigateur ne peut pas lire cet extrait.
        </audio>
      )}
      {asset.kind === "image" && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={asset.src}
          alt={asset.alt ?? ""}
          className="w-full rounded-2xl border border-border"
        />
      )}
      {asset.kind === "video" && (
        <video
          controls
          preload="none"
          src={asset.src}
          className="w-full rounded-2xl border border-border"
        >
          Votre navigateur ne peut pas lire cette vidéo.
        </video>
      )}
    </figure>
  );
}
