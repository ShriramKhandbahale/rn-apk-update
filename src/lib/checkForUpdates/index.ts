import DeviceInfo from "react-native-device-info";
import type { CheckForUpdateParams } from "./types";

const checkForUpdate = async (endpoint: string, params?: CheckForUpdateParams): Promise<boolean> => {
    try {
        const currentVersion = DeviceInfo.getVersion();
        const { versionKey = "version" } = params || {};

        const response = await fetch(endpoint);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const updateInfo = await response.json();

        if (!updateInfo || !updateInfo[versionKey]) {
            throw new Error(`Invalid update information or missing key: ${versionKey}`);
        }

        const isUpdateAvailable = currentVersion !== updateInfo[versionKey];

        return isUpdateAvailable;
    } catch (error) {
        console.error('Error checking for updates:', error);
        throw error;
    }
};

export default checkForUpdate