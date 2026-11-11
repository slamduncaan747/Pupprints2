"use client";

import { useId, useRef, useState } from "react";
import { X } from "lucide-react";
import { track } from "@/lib/analytics";
import { cn } from "@/lib/utils";
import { ApiError, uploadPhoto } from "./api";
import { prepareImage, PrepareError } from "./prepare-image";
import { MAX_EXTRA_PHOTOS, updateFlow, type UploadInfo } from "./store";

type Pending = { key: string; url: string };

/**
 * Optional extra photos of the same dog (up to three). The pose always comes from the style's
 * example portrait; the server sends every photo to the image model for identity only: coat
 * colours, markings on the far side, eye colour and ears.
 */
export function ExtraPhotos({ photos, disabled }: { photos: UploadInfo[]; disabled?: boolean }) {
  const inputId = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const [pending, setPending] = useState<Pending[]>([]);
  const [error, setError] = useState<string | null>(null);

  const free = MAX_EXTRA_PHOTOS - photos.length - pending.length;
  const busy = pending.length > 0;

  async function handleFiles(list: FileList | null) {
    const files = Array.from(list ?? []).slice(0, Math.max(0, free));
    if (inputRef.current) inputRef.current.value = "";
    if (!files.length) return;
    setError(null);
    for (const file of files) {
      const key = `${Date.now()}-${Math.random()}`;
      let url = "";
      try {
        const prepared = await prepareImage(file);
        url = URL.createObjectURL(prepared.blob);
        setPending((p) => [...p, { key, url }]);
        const upload = await uploadPhoto(prepared.blob, () => {});
        updateFlow((s) =>
          s.extraUploads.length >= MAX_EXTRA_PHOTOS ? s : { ...s, extraUploads: [...s.extraUploads, upload] },
        );
        track("UploadPhoto", { width: upload.width, height: upload.height, extra: true });
      } catch (err) {
        setError(
          err instanceof PrepareError || err instanceof ApiError
            ? err.message
            : "Something went wrong with that photo. Please try another.",
        );
      } finally {
        setPending((p) => p.filter((x) => x.key !== key));
        if (url) URL.revokeObjectURL(url);
      }
    }
  }

  function remove(uploadId: string) {
    updateFlow((s) => ({ ...s, extraUploads: s.extraUploads.filter((u) => u.uploadId !== uploadId) }));
  }

  const slots = Array.from({ length: MAX_EXTRA_PHOTOS }, (_, i) => i);

  return (
    <div className="mt-10 w-full">
      <div className="flex items-baseline justify-between gap-4">
        <p className="label text-ink">More photos</p>
        <span className="label text-ink-3">Optional</span>
      </div>
      <p className="mt-2 text-[13px] leading-snug text-ink-3">
        Two or three more from other angles make the likeness closer.
      </p>

      <input
        ref={inputRef}
        id={inputId}
        type="file"
        accept="image/*,.heic,.heif"
        multiple
        className="sr-only"
        onChange={(e) => void handleFiles(e.target.files)}
        disabled={disabled || free <= 0}
      />

      <ul className="mt-4 grid grid-cols-3 gap-3">
        {slots.map((i) => {
          const photo = photos[i];
          const wait = !photo ? pending[i - photos.length] : undefined;
          return (
            <li key={photo?.uploadId ?? wait?.key ?? `empty-${i}`} className="relative">
              {photo || wait ? (
                <div className="relative aspect-[4/5] w-full overflow-hidden bg-paper-2">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={photo?.url ?? wait?.url}
                    alt={`Extra photo ${i + 1}`}
                    className={cn("h-full w-full object-cover", wait && "opacity-40")}
                  />
                  {photo && (
                    <button
                      type="button"
                      onClick={() => remove(photo.uploadId)}
                      aria-label={`Remove extra photo ${i + 1}`}
                      className="absolute right-0 top-0 flex h-11 w-11 items-start justify-end p-1.5"
                    >
                      <span className="flex h-6 w-6 items-center justify-center bg-paper/90 text-ink">
                        <X className="h-3.5 w-3.5" strokeWidth={1.75} aria-hidden="true" />
                      </span>
                    </button>
                  )}
                  {wait && (
                    <span className="label absolute inset-x-0 bottom-2 text-center text-ink-2" role="status">
                      Uploading…
                    </span>
                  )}
                </div>
              ) : (
                <label
                  htmlFor={inputId}
                  className={cn(
                    "flex aspect-[4/5] w-full cursor-pointer items-center justify-center border border-dashed border-line text-ink-3 transition-colors hover:border-ink-3",
                    (disabled || busy) && "pointer-events-none opacity-50",
                  )}
                >
                  <span className="label">Add</span>
                </label>
              )}
            </li>
          );
        })}
      </ul>

      {error && (
        <p role="alert" className="mt-3 text-[13px] leading-snug text-ink">
          {error}
        </p>
      )}
    </div>
  );
}
