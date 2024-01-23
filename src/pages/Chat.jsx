import { Flex } from "@chakra-ui/react";
import React, { useState } from "react";
import Divider from "../components/Divider";
import Footer from "../components/Footer";
import Header from "../components/Header";
import Messages from "../components/Messages";
import Loader from "../components/Loader";

const Chat = () => {
  const [messages, setMessages] = useState([
    {
        from: 'bot',
        text: "Hi, How I can assist you today?"
    },
    {
        from: 'bot',
        text: 'You can ask anything from me coz "I AM IRON MAN!!"',
    }
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading,setIsLoading] = useState(false)

  const handleSendMessage = async () => {
    if (!inputMessage.trim().length) {
      return;
    }
    const newMessage = {
        from: "user",
        text: inputMessage
    }
    setInputMessage("");

    const updatedMessages = [...messages,newMessage];
    setMessages(updatedMessages);
    setIsLoading(true);
    await getResponseFromChatGPT(updatedMessages);
  };

  const getResponseFromChatGPT = async (ChatMessages) => {
    let apiMessages = ChatMessages.map((msg) => {
        let role = msg.from;
        if(msg.from === "bot")role = "assistant";

        return { role: role, content: msg.text }
    })

    const systemMessage = {
        role: "system",
        content: "Explain all concepts like you are Iron Man."
    }

    await fetch("https://api.openai.com/v1/chat/completions",{
        method: "POST",
        headers: {
            "Authorization": `Bearer ${process.env.REACT_APP_API_KEY}` ,
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            "model": "gpt-3.5-turbo",
            "messages": [
                systemMessage,
                ...apiMessages
            ]
        })
    }).then((data) => data.json())
    .then((data) => {
        console.log(data);
        setMessages([...ChatMessages, {
            from: "bot",
            text: data.choices[0].message.content
        }])
        setIsLoading(false);
    })
  }

  return (
    <Flex w="100%" h="100vh" justify="center" align="center">
      <Flex w={["100%", "100%", "90%"]} h="90%" flexDir="column">
        <Header />
        <Divider />
        <Messages messages={messages} />
        { isLoading && <Loader /> }
        <Divider />
        <Footer
          inputMessage={inputMessage}
          setInputMessage={setInputMessage}
          handleSendMessage={handleSendMessage}
        />
      </Flex>
    </Flex>
  );
};

export default Chat;
