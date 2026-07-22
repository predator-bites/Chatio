import React from 'react';
import { Button, Input } from '../../../components';

interface CreateRoomFormProps {
  newRoomTitle: string;
  isCreating: boolean;
  onNewRoomTitleChange: (value: string) => void;
  onCreateRoom: (e: React.FormEvent) => void;
}

export const CreateRoomForm: React.FC<CreateRoomFormProps> = ({
  newRoomTitle,
  isCreating,
  onNewRoomTitleChange,
  onCreateRoom,
}) => {
  return (
    <form onSubmit={onCreateRoom} className="mb-2 px-2 flex flex-col gap-2">
      <Input
        id="input-new-room"
        placeholder="Room name"
        value={newRoomTitle}
        onChange={(e) => onNewRoomTitleChange(e.target.value)}
        className="!mb-0"
        autoFocus
      />
      <Button
        type="submit"
        size="sm"
        isLoading={isCreating}
        disabled={!newRoomTitle.trim() || isCreating}
      >
        Create
      </Button>
    </form>
  );
};

export default CreateRoomForm;
