import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import { Button, StyleSheet, Text, TextInput, View } from 'react-native';
import CryptoJS from 'react-native-crypto-js';
import * as FileSystem from 'expo-file-system';

const iv = 'happyDayz';

export default function App() {
  const [readContent, setReadContent] = useState('');
  const [text, setText] = useState('');
  const [fileName, setFileName] = useState('');

  const handleSubmit = async () => {
    const encryptedFile = CryptoJS.AES.encrypt(text, process.env.EXPO_PUBLIC_SecretKey, {iv});
    const data = encryptedFile.toString();
    const fileUri = FileSystem.documentDirectory + fileName;

    await FileSystem.writeAsStringAsync(fileUri, data);

    console.log(fileName, text, data, fileUri);
  };

  const readFile = async() => {
    const fileUri = FileSystem.documentDirectory + fileName;
    const data = await FileSystem.readAsStringAsync(fileUri);

    const decryptedFile = CryptoJS.AES.decrypt(data, process.env.EXPO_PUBLIC_SecretKey, {iv}).toString(CryptoJS.enc.Utf8);
    setReadContent(decryptedFile);
    console.log(decryptedFile);
  };

  return (
    <View style={styles.container}>
      <TextInput
        placeholder='text here'
        onChangeText={(inputText)=>{setText(inputText)}}
        value={text}
      />
      <TextInput
        placeholder='file name here'
        onChangeText={(inputFileName)=>{setFileName(inputFileName)}}
        value={fileName}
      />
      <Button title="Submit" onPress={handleSubmit} />
      <Button title='Read' onPress={readFile} />
      <Text>
        {readContent}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
