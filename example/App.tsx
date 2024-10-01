import React, { useState, useRef } from 'react';
import { StyleSheet, View, Button } from 'react-native';
import ApkUpdate, { type UpdatePromptMethods } from 'rn-apk-update';

const App = () => {
  const [downloadProgress, setDownloadProgress] = useState<number>(0);
  const { checkForUpdate, UpdatePrompt, downloadAndInstallApk } = ApkUpdate();
  const updatePromptRef = useRef<UpdatePromptMethods>(null);

  const handleCheckForUpdates = async () => {
    const isUpdateAvailable = await checkForUpdate('https://example.com/version.json');

    if (isUpdateAvailable) {
      updatePromptRef?.current?.prompt(
        'Update Available', 'A new version of the app is available.\nDo you want to update?', [
        {
          title: 'Update',
          onPress: () => downloadAndInstallApk('https://example.com/app.apk', {
            onProgress(progress: number) {
              setDownloadProgress(progress);
            },
            onProgressComplete() {
              updatePromptRef?.current?.close();
            },
          }),
        },
        { title: 'Cancel', onPress: () => updatePromptRef?.current?.close() },
      ]);
    }
  };

  return (
    <View style={styles.container}>
      <UpdatePrompt ref={updatePromptRef} progress={downloadProgress} />

      <Button
        title="Check for Updates"
        onPress={handleCheckForUpdates}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default App;
