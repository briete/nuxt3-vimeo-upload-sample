<script setup lang="ts">
import { Upload } from 'tus-js-client';

const percentageState = useState('percentage', () => '0');
const uploadingState = useState<'none' | 'uploading' | 'transcoding' | 'uploaded'>('uploading', () => 'none');
const embedUrlState = useState('embedUrl', () => '');

const percentage = computed(() => {
  return percentageState.value + '%';
});
const uploading = computed(() => {
  return uploadingState.value;
})
const embedUrl = computed(() => {
  return embedUrlState.value;
})

/**
 * 動画データをVimeoにアップロードする
 */
async function videoUpload(event: Event) {
  if (event.target instanceof HTMLInputElement && event.target.files && event.target.files.length > 0) {
    const file = event.target.files[0];
    
    uploadingState.value = 'uploading';

    // アップロード用のリンクを取得する
    const { data } = await useFetch('/api/createVideoAndGetUploadUrl', {
      method: 'POST',
      body: {
        size: file.size.toString(),
      },
    });

    const { uploadLink } = data.value;

    // tusクライアントでアップロード
    const upload = new Upload(file, {
      uploadUrl: uploadLink,
      onError: (e) => {
        throw e;
      },
      onProgress: (bytesUploaded: number, bytesTotal: number) => {
        // 動画のアップロードの進捗状況を％で取得してStateに反映させます。
        const _percentage = ((bytesUploaded / bytesTotal) * 100).toFixed(2);
        console.log('percentage', _percentage);
        percentageState.value = _percentage;
      },
      onSuccess: async () => {
        uploadingState.value = 'transcoding';
        // Vimeo側でトランスコーディングがあるので、簡易的に40秒ほどまってから動画の埋め込みURLを取得します。
        // 本当はVimeoに定期的にリクエストすることで動画のステータスを取得できますが、今回は割愛しています。
        await new Promise((resolve) => setTimeout(resolve, 40000));
        
        uploadingState.value = 'uploaded';
        // 埋め込みURLを取得
        embedUrlState.value = data.value.embedUrl;
      },
    });

    upload.start();
  }
}
</script>

<template>
  <div class="container mx-auto w-3/5">
    <label v-if="uploading === 'none'"
        class="flex justify-center w-full h-32 px-4 mt-12 transition bg-white border-2 border-gray-300 border-dashed rounded-md appearance-none cursor-pointer hover:border-gray-400 focus:outline-none">
        <span class="flex items-center space-x-2">
            <span class="font-medium text-gray-600">
                <span class="text-blue-600 underline">ファイルを選択</span>
            </span>
        </span>
        <input @change="videoUpload" type="file" name="file_upload" class="hidden">
    </label>
    
    <div v-if="uploading === 'uploading' || uploading === 'transcoding'" class="relative pt-1 mt-12">
      <div class="flex mb-2 items-center justify-between">
        <div>
          <span class="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-pink-600 bg-pink-200">
            {{ uploading === 'uploading' ? 'アップロード中' : 'トランスコーディング中' }}
          </span>
        </div>
        <div class="text-right">
          <span class="text-xs font-semibold inline-block text-pink-600">
            {{ percentage }}
          </span>
        </div>
      </div>
      <div class="overflow-hidden h-2 mb-4 text-xs flex rounded bg-pink-200">
      <div :style="{ width: percentage }" class="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-pink-500"></div>
      </div>
    </div>

    <div style="padding:56.25% 0 0 0;position:relative;">
      <iframe :src="embedUrl" frameborder="0" allow="autoplay; fullscreen; picture-in-picture" allowfullscreen style="position:absolute;top:0;left:0;width:100%;height:100%;" title="テスト動画" />
    </div>
  </div>
</template>