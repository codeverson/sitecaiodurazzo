import { auth } from "./firebase";

export type UploadFolder = "hero" | "discography";

type UploadResponse = {
  url: string;
};

export async function uploadImageToHostinger(folder: UploadFolder, file: File): Promise<string> {
  const user = auth.currentUser;
  if (!user) {
    throw new Error("Usuario nao autenticado.");
  }

  const idToken = await user.getIdToken();
  const formData = new FormData();
  formData.append("folder", folder);
  formData.append("image", file);

  const response = await fetch("/upload-image.php", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${idToken}`,
    },
    body: formData,
  });

  const payload = (await response.json().catch(() => ({}))) as Partial<UploadResponse> & {
    error?: string;
  };

  if (!response.ok || !payload.url) {
    throw new Error(payload.error || "Falha no upload.");
  }

  return payload.url;
}
