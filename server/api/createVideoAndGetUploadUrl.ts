import type { IncomingMessage, ServerResponse } from "http";
import { useBody } from "h3";
import {
  vimeoRequest,
  type CreateVideoVimeoResponse,
} from "../vimeo/vimeo-client";

type CreateVideoAndGetUploadUrlBody = {
  size: string;
};

export default async function (req: IncomingMessage, res: ServerResponse) {
  const body = await useBody<CreateVideoAndGetUploadUrlBody>(req);

  console.log("body", body);

  // Vimeoに動画枠を作成する。この動画枠に対してあとからアップロードする。
  const _res = await vimeoRequest<CreateVideoVimeoResponse>({
    path: "/me/videos",
    method: "POST",
    query: {
      upload: {
        approach: "tus",
        size: body.size,
      },
    },
    headers: {
      "Content-Type": "application/json",
      Accept: "application/vnd.vimeo.*+json;version=3.4",
    },
  });

  console.log(_res);

  return {
    uploadLink: _res.upload.upload_link,
    status: _res.upload.status,
    embedUrl: _res.player_embed_url,
  };
}
