import React, { useState } from "react";
import classNames from "classNames";

import { IMessage, useChat } from "../../hooks/useChat";

import { BrowseFile } from "../../components/BrowseFile";

const Chat: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [messageText, setMessageText] = useState("");
  const { sendMessage, messages, currentUserId } = useChat();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (messageText) {
      sendMessage({ text: messageText });
      return;
    }

    if (file) {
      const reader = new FileReader();
      console.log(file.name);
      reader.onload = () => {
        const arrayBuffer = reader.result as ArrayBuffer;
        const buffer = new Uint8Array(arrayBuffer);
        console.log(buffer);
        sendMessage({ file: { buffer, filename: file.name } });

        setFile(null);
      };
      reader.readAsArrayBuffer(file);

      return;
    }
    setMessageText("");
  };

  const renderMessage = (message: IMessage) => {
    const isOwnMessage = message.userId == currentUserId;
    const customStyles = isOwnMessage
      ? "self-end bg-green-500"
      : "self-start bg-blue-500";
    const userName = `Anonymous ${message?.userId.slice(0, 5) || ""}: `;

    return (
      <div
        key={`message-${message._id}`}
        className={classNames(
          "my-2 p-2 rounded-md text-white flex-col items-start",
          customStyles
        )}
      >
        <div className="flex gap-2">
          <strong>{userName}</strong>
          {message.fileUrl && message.filename ? (
            <a href={message.fileUrl}>{message.filename}</a>
          ) : (
            message.text
          )}
        </div>
      </div>
    );
  };

  return (
    <div>
      <h3>Chat Messages:</h3>

      <div className="scrollbar-hide h-[600px] max-w-[100%] w-[600px] overflow-y-scroll mt-3 grid grid-rows-[1fr_min-content] relative">
        <div>{messages.map(renderMessage)}</div>
        <BrowseFile setFile={setFile} file={file} />
      </div>

      <div className="flex justify-between">
        <input
          className="w-4/5 px-3"
          type="text"
          value={messageText}
          onChange={(e) => setMessageText(e.target.value)}
          placeholder="Type your message"
        />
        <button className="w-1/5" onClick={handleSubmit}>
          Send
        </button>
      </div>
    </div>
  );
};

export default Chat;
