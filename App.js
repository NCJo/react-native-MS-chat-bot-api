import React, { Component } from "react";
import { StyleSheet, Text, View } from "react-native";
import { GiftedChat } from "react-native-gifted-chat";
import { DirectLine } from "botframework-directlinejs";

const directLine = new DirectLine ({
  secret: "0sTl4Rzyh4M.IMyBcEs3d-uFr4po02elq-rWRRMmArTELDZCK1kVUgQ"
});

const botMessageToGiftedMessage = botMessage => ({
  ...botMessage,
  _id: botMessage.id,
  createdAt: botMessage.timestamp,
  user: {
    _id: 2,
    name: "React Native",
    // avatar
  }
});

function giftedMessageToBotMessage(message) {
  return {
    from: { id: 1, name: "John Doe" },
    type: "message",
    text: message.text
  };
}

export default class App extends Component {
  state = {
    messages: []
  };

  constructor(props) {
    super(props);
    directLine.activity$.subscribe(botMessage => {
      const newMessage = botMessageToGiftedMessage(botMessage);
      this.setState({ messages: [newMessage, ...this.state.messages] });
    });
  }

  onSend = messages => {
    this.setState({ messages: [...messages, ...this.state.messages] });

    messages.forEach(message => {
      directLine
        .postActivity(giftedMessageToBotMessage(message))
        .subscribe(() => console.log("success"), () => console.log("failed"));
    });
  };

  render() {
    return (
      <GiftedChat 
        user={{
          _id:1
        }}
        messages={this.state.messages}
        onSend={this.onSend}
      />
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  }
});


// 0sTl4Rzyh4M.IMyBcEs3d-uFr4po02elq-rWRRMmArTELDZCK1kVUgQ
// 0sTl4Rzyh4M.FWH5X7qu3o2QwW5oVn170OAd2Oqmgy88RjlreWrtJjw