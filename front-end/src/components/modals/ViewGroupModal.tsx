import React, { useEffect, useRef, useState } from "react";
import { useLoading } from "../../hooks/useLoading";
import ModalBase from "./ModalBase";
import { Group } from "../../@types/group";
import GroupController from "../../controllers/GroupController";
import { useCurrentChat } from "../../hooks/useCurrentChat";
import UserCard from "../cards/UserCard";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ViewGroupModal: React.FC<ModalProps> = ({ isOpen, onClose }) => {
  // Component States
  const [group, setGroup] = useState<Group>();
  const { currentChat } = useCurrentChat();

  // Component Refs
  const currentChatRef = useRef(currentChat);

  // Global Contexts
  const { setIsLoading } = useLoading();

  // Update Current Chat Ref
  useEffect(() => {
    currentChatRef.current = currentChat;
  }, [currentChat]);

  // Fetch Group
  const getGroup = async () => {
    setIsLoading(true);
    try {
      const group_id = currentChatRef.current!.recipient_id;
      const result = await GroupController.get({ group_id });
      setGroup({ ...result });
      setIsLoading(false);
    } catch (error) {
      console.error(error);
    }
  };

  // Get users when component did mount
  useEffect(() => {
    getGroup();
  }, []);

  if (!group) return null;
  return (
    <ModalBase
      isOpen={isOpen}
      title={group.name}
      onClose={onClose}
      primaryLabel="Close"
      onPrimaryClick={onClose}
    >
      <div className="w-96 flex flex-col h-96 items-center border border-solid rounded-2xl border-gray-500 p-5 gap-4">
        <img
          className="w-28 h-28 rounded-full"
          src={group.profile_image}
          alt="Profile"
        />
        <div className="w-full border-b border-solid border-b-gray-500">
          <h3 className="text-sm font-semibold"> Group Members: </h3>
        </div>
        <div className="w-full h-full flex flex-col overflow-y-auto">
          {group.users.map((user, i) => (
            <UserCard user={user} onClick={() => {}} key={i} />
          ))}
        </div>
      </div>
    </ModalBase>
  );
};

export default ViewGroupModal;
