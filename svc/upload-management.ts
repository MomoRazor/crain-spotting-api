import { DEV, FIREBASE_BUCKET } from "../env";
import { v4 } from "uuid";
import { Storage } from "firebase-admin/lib/storage/storage";

export const UploadManagement = (storage: Storage) => {
  const uploadBytesToBucket = async (
    filePath: string,
    fileContents: Buffer
  ): Promise<string> => {
    const uploader = new Promise((resolve, reject) => {
      const newFile = storage
        .bucket(FIREBASE_BUCKET)
        .file(`${DEV ? "staging/" : "production/"}${filePath}`);

      newFile
        .createWriteStream()
        .on("error", (err) => {
          return reject(err);
        })
        .on("finish", async () => {
          // TODO: make private

          await newFile.makePublic();
          const url = newFile.publicUrl();

          // const url = await newFile.getSignedUrl({
          //     action: 'read',
          //     expires: '03-09-2491',
          // })

          return resolve(`${url}`);
        })
        .end(fileContents);
    });
    return (await uploader) as string;
  };

  const uploadFileJsonFormat = async (
    files: {
      [filename: string]: string;
    },
    path = "images/"
  ) => {
    const urls: { fileName: string; link: string }[] = [];

    for (const file in files) {
      let fileName = file;

      const parts = fileName.split(".");
      if (parts.length > 1) {
        parts[parts.length - 2] += `-${v4()}`;
        fileName = parts.join(".");
      }
      const url = await uploadBytesToBucket(
        `${path}${fileName}`,
        Buffer.from(files[file], "base64")
      );

      urls.push({
        fileName,
        link: url,
      });
    }

    return urls;
  };

  return { uploadFileJsonFormat, uploadBytesToBucket };
};
