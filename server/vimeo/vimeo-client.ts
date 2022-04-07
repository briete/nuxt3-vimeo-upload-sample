import config from "#config";
import { Vimeo, RequestOptions } from "vimeo";

/**
 * @see: https://developer.vimeo.com/api/reference/responses/video
 */
export type CreateVideoVimeoResponse = {
  upload: {
    approach: string;
    complete_uri: string;
    form: string;
    link: string;
    redirect_url: string;
    size: string;
    status: "complete" | "error" | "in_progress";
    upload_link: string;
  };
  player_embed_url: string;
};

const vimeo = new Vimeo(
  config.VIMEO_CLIENT_ID,
  config.VIMEO_CLIENT_SECRET,
  config.VIMEO_ACCESS_TOKEN
);

/**
 * Vimeo APIにリクエストする。vimeo クライアントはそのままだとPromiseに対応していないのでラップします。
 */
export function vimeoRequest<T extends any = any>(
  options: RequestOptions
): Promise<T> {
  return new Promise<T>((resolve, reject) => {
    vimeo.request(options, (err, result, statusCode, headers) => {
      if (err) {
        reject(err);
      }
      resolve(result);
    });
  });
}
