import { useCallback, useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";

import { SERVER_URI } from "../utils/constants";
import { useCookies } from "react-cookie";

import { useQuery } from "@tanstack/react-query";
import { fetchMessages } from "../api";

export interface IMessage {
  _id?: string;
  userId: string;
  text: string;
  fileUrl?: string;
  filename?: string;
}

export interface MessageInput extends Omit<IMessage, "id"> {}

let socket: Socket;
export const useChat = () => {
  const [cookies, setCookie] = useCookies(["userId"]);
  const { data: messages } = useQuery({
    queryKey: ["messages"],
    queryFn: fetchMessages,
    retry: 1,
  });
  const [localMessages, setLocalMessages] = useState<IMessage[]>([]);

  useEffect(() => {
    setLocalMessages(messages || []);
  }, [messages?.length]);

  useEffect;

  useEffect(() => {
    const initSocket = async () => {
      socket = await io(SERVER_URI);
      console.log("SERVER_URI ", SERVER_URI);

      socket.on("message", (message: IMessage) => {
        console.log(message);
        if (!cookies.userId) {
          setCookie("userId", message.userId);
        }
        setLocalMessages((prev) => [...prev, message]);
      });

      return () => {
        socket.close();
      };
    };

    try {
      initSocket();
    } catch (err) {
      console.log(err);
    }
  }, []);

  const sendMessage = useCallback(
    ({
      text,
      file,
    }: {
      text?: string;
      file?: { buffer: Uint8Array; filename: string };
    }) => {
      if (file?.filename) {
        socket.emit("message", {
          file,
          userId: cookies.userId,
        });
      } else if (text) {
        socket.emit("message", {
          text: text.trim(),
          userId: cookies.userId,
        });
      }
    },
    []
  );

  return {
    sendMessage,
    messages: localMessages,
    currentUserId: cookies.userId,
  };
};
