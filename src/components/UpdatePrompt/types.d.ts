export type ActionButton = {
  title: string;
  onPress: () => void;
};

export interface UpdatePromptMethods {
  prompt: (title: string, description: string, actions: ActionButton[]) => void;
  close: () => void;
}

export interface UpdatePromptProps {
  modalContainerStyle?: object;
  titleStyle?: object;
  descriptionStyle?: object;
  buttonStyle?: object;
  buttonTextStyle?: object;
  progressbarStyle?: object;
  progressTextStyle?: object;
  progress?: number;
}
