import { UpdatePrompt, type UpdatePromptMethods } from './components';
import { checkForUpdate, downloadAndInstallApk } from './lib';

const ApkUpdate = () => {
  return {
    checkForUpdate,
    downloadAndInstallApk,
    UpdatePrompt,
  };
};

export type { UpdatePromptMethods };

export default ApkUpdate;
