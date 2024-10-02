import DeviceInfo from "react-native-device-info";
import ReactNativeBlobUtil from "react-native-blob-util";
import type { DownloadAndInstallApkParams } from "./types";

export const downloadAndInstallApk = async (apkUrl: string, params?: DownloadAndInstallApkParams) => {
    try {
        const { onProgress, onProgressComplete } = params || {}

        const { dirs } = ReactNativeBlobUtil.fs;
        const apkPath = `${dirs.DownloadDir}/${DeviceInfo.getApplicationName()}.apk`;

        ReactNativeBlobUtil.config({
            fileCache: true,
            path: apkPath,
        })
            .fetch('GET', apkUrl)
            .progress((received: string, total: string) => {
                const progress = parseFloat(received) / parseFloat(total);
                if (onProgress) onProgress(progress)
            })
            .then(async (res) => {
                if (onProgressComplete) onProgressComplete();
                installApk(res.path())
            })
            .catch((error) => {
                console.error('Download error: ', error);
            });
    } catch (error) {
        console.log('Error requesting storage permission: ', error);
    }
};

export const installApk = (apkPath: string) => {
    ReactNativeBlobUtil.android.actionViewIntent(apkPath, 'application/vnd.android.package-archive');
}

export default downloadAndInstallApk;