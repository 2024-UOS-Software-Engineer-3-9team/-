import React, { useState } from 'react';
import { View, TextInput, Button, Text, StyleSheet, Alert } from 'react-native';

const App: React.FC = () => {
  const [input, setInput] = useState<string>('');
  const [responseMessage, setResponseMessage] = useState<string>('');

  const sendMessage = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/message', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: input }),
      });

      if (!response.ok) {
        throw new Error('Failed to communicate with the server');
      }

      const data = await response.json();
      setResponseMessage(data.message);
    } catch (error) {
      Alert.alert('Error', error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>React Native - Node.js Communication</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter your message"
        value={input}
        onChangeText={setInput}
      />
      <Button title="Send to Server" onPress={sendMessage} />
      {responseMessage ? (
        <Text style={styles.response}>Server Response: {responseMessage}</Text>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    width: '100%',
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  response: {
    marginTop: 20,
    fontSize: 16,
    color: 'green',
  },
});

export default App;
