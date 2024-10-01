import { ProgressBar } from '@react-native-community/progress-bar-android';
import { useImperativeHandle, forwardRef, useState } from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { installApk } from '../../lib/downloadAndInstallApk';
import ReactNativeBlobUtil from 'react-native-blob-util';
import DeviceInfo from 'react-native-device-info';
import type { ActionButton, UpdatePromptProps } from './types';

const UpdatePrompt = forwardRef(
  (
    {
      modalContainerStyle,
      titleStyle,
      descriptionStyle,
      buttonStyle,
      buttonTextStyle,
      progressbarStyle,
      progressTextStyle,
      progress = 0,
    }: UpdatePromptProps,
    ref
  ) => {
    const [visible, setVisible] = useState(false);
    const [modalData, setModalData] = useState({
      title: '',
      description: '',
      actions: [] as ActionButton[],
    });
    const { dirs } = ReactNativeBlobUtil.fs;
    const apkPath = `${dirs.DownloadDir}/${DeviceInfo.getApplicationName()}.apk`;

    const prompt = (
      title: string,
      description: string,
      actions: { title: string; onPress: () => void }[]
    ) => {
      setModalData({ title, description, actions });
      setVisible(true);
    };

    const close = () => {
      setVisible(false);
    };

    useImperativeHandle(ref, () => ({
      prompt,
      close,
    }));

    return (
      <Modal animationType="slide" visible={visible} onRequestClose={close}>
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContainer, modalContainerStyle]}>
            <Text style={[styles.title, titleStyle]}>{modalData.title}</Text>
            <Text style={[styles.description, descriptionStyle]}>
              {modalData.description}
            </Text>

            {progress > 0 && progress < 1 ? (
              <View style={styles.progressContainer}>
                <ProgressBar
                  styleAttr="Horizontal"
                  indeterminate={false}
                  progress={progress}
                  style={progressbarStyle}
                />
                <Text style={[styles.progressText, progressTextStyle]}>
                  {Math.round(progress * 100)}% Downloading...
                </Text>
                {progress > 0.99 && (
                  <TouchableOpacity
                    style={[styles.button, buttonStyle]}
                    onPress={() => {
                      installApk(apkPath);
                    }}
                  >
                    <Text style={[styles.buttonText, buttonTextStyle]}>
                      Install Update
                    </Text>
                  </TouchableOpacity>
                )}
              </View>
            ) : (
              <View style={styles.buttonContainer}>
                {modalData.actions.map((button, index) => (
                  <TouchableOpacity
                    key={index}
                    style={[styles.button, buttonStyle]}
                    onPress={() => {
                      button.onPress();
                    }}
                  >
                    <Text style={[styles.buttonText, buttonTextStyle]}>
                      {button.title}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>
        </View>
      </Modal>
    );
  }
);

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContainer: {
    width: '80%',
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
    color: '#232323',
  },
  description: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: 'center',
    color: '#232323',
  },
  buttonContainer: {
    width: '100%',
    alignItems: 'center',
  },
  button: {
    backgroundColor: '#d3e3fd',
    borderRadius: 10,
    padding: 20,
    margin: 5,
    alignItems: 'center',
    width: '100%',
  },
  buttonText: {
    fontWeight: '500',
    color: '#232323',
  },
  progressContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
    width: '100%',
  },
  progressText: {
    marginVertical: 10,
    fontSize: 16,
    fontWeight: '500',
    color: '#232323',
  },
});

export default UpdatePrompt;
