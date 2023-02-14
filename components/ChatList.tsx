import {
  collection,
  doc,
  limit,
  orderBy,
  query,
  serverTimestamp,
  Timestamp,
} from "firebase/firestore";
import {
  useCollectionData,
  useDocumentData,
} from "react-firebase-hooks/firestore";
import { IChannelData, IMessageData } from "@/types/utils/firebaseOperations";
import { selectedChannelIdAtom } from "@/stores/selectedChannelIdAtom";
import React, { FormEvent, useEffect, useRef, useState } from "react";
import { IFirebaseAuth } from "@/types/components/firebase-hooks";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import { createNewMessage } from "@/utils/firebaseOperations";
import { converter } from "@/utils/firestoreDataConverter";
import ChatBubble from "./dashboard/chatList/ChatBubble";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import { uuidv4 } from "@firebase/util";
import { db } from "@/lib/firebase";
import { useAtom } from "jotai";
import Button from "./Button";
import Input from "./Input";

const channelConverter = converter<IChannelData>();
const messagesConverter = converter<IMessageData>();

const ChatList = ({ user }: IFirebaseAuth) => {
  const [input, setInput] = useState("");
  const [selectedChannelId] = useAtom(selectedChannelIdAtom);

  const editorRef = useRef<any>();
  const [editorLoaded, setEditorLoaded] = useState(false);
  const { CKEditor, ClassicEditor } = editorRef.current || {};

  useEffect(() => {
    editorRef.current = {
      CKEditor: require("@ckeditor/ckeditor5-react").CKEditor, // v3+
      ClassicEditor: require("@ckeditor/ckeditor5-build-classic"),
    };
    setEditorLoaded(true);
  }, []);

  const [channel] = useDocumentData(
    selectedChannelId && user
      ? doc(db, "users", user.uid, "channels", selectedChannelId)
          .withConverter(channelConverter)
          .withConverter(channelConverter)
      : null,
    {
      snapshotListenOptions: { includeMetadataChanges: true },
    }
  );

  const [messages] = useCollectionData(
    user && selectedChannelId
      ? query(
          collection(
            db,
            "users",
            user.uid,
            "channels",
            selectedChannelId,
            "messages"
          ),
          orderBy("createdAt"),
          limit(10)
        ).withConverter(messagesConverter)
      : null,
    {
      initialValue: [],
      snapshotListenOptions: { includeMetadataChanges: true },
    }
  );

  const messageSubmitHandler = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!user || !selectedChannelId) return;

    createNewMessage(selectedChannelId, user?.uid, {
      id: uuidv4(),
      text: input,
      type: "message",
      createdAt: serverTimestamp() as Timestamp,
      channelId: selectedChannelId,
    });
    setInput("");
  };

  return (
    <div className="flex h-full w-full flex-col justify-between p-5">
      <div className="m-5 flex flex-col gap-y-1">
        {messages?.map((message) => {
          return (
            <ChatBubble
              key={message.id}
              messageData={message}
              channelData={channel}
            />
          );
        })}
      </div>

      {/* BOTTOM BAR */}
      <form className="flex flex-row gap-2" onSubmit={messageSubmitHandler}>
        {editorLoaded && (
          <CKEditor
            editor={ClassicEditor}
            onChange={(event: any, editor: any) => {
              const data = editor.getData();
              setInput(data);

              console.log({ event, editor, data });
            }}
          />
        )}
        {/* <Input
          id="message-input"
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
        /> */}
        <Button variant="solid-black">Submit</Button>
      </form>
    </div>
  );
};

export default ChatList;
