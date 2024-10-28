import React, { useEffect, useMemo, useState } from "react";
import Select from "react-select";
import UserController from "../../controllers/UserController";
import { useLoading } from "../../hooks/useLoading";
import { User } from "../../@types/user";
import ModalBase from "./ModalBase";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (groupName: string, members: User[]) => void;
}

interface GroupSelectOption {
  value: User;
  label: string;
}

const CreateGroupModal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  onCreate,
}) => {
  // Component States
  const [groupName, setGroupName] = useState("");
  const [selectedMembers, setSelectedMembers] = useState<User[]>([]);
  const [users, setUsers] = useState<User[]>([]);

  // Memo
  const userOptions = useMemo<GroupSelectOption[]>(
    () => users.map((user) => ({ label: user.username, value: user })),
    [users],
  );

  // Global Contexts
  const { setIsLoading } = useLoading();

  // Event Handlers
  const handleCreateGroup = () => {
    // TODO: Create Group Logic
    onClose();
  };

  // Fetch All Users
  const getUsers = async () => {
    setIsLoading(true);
    try {
      const result = await UserController.getAll({ name: "" });
      setUsers([...result]);
      setIsLoading(false);
    } catch (error) {
      console.error(error);
    }
  };

  // Get users when component did mount
  useEffect(() => {
    getUsers();
  }, []);

  return (
    <ModalBase
      isOpen={isOpen}
      title="Create New Group"
      onClose={onClose}
      primaryLabel="Create"
      isPrimaryDisabled={!groupName || selectedMembers.length === 0}
      onPrimaryClick={handleCreateGroup}
      secondaryLabel="Cancel"
      onSecondaryClick={onClose}
    >
      <>
        <input
          type="text"
          placeholder="Group Name"
          value={groupName}
          onChange={(e) => setGroupName(e.target.value)}
          className="w-full border border-gray-300 rounded-lg p-2 mb-2"
        />

        <Select
          isMulti
          options={userOptions}
          className="mb-2"
          placeholder="Add members"
          onChange={(selected) =>
            setSelectedMembers(selected.map((s) => s.value))
          }
        />
      </>
    </ModalBase>
  );
};

export default CreateGroupModal;
