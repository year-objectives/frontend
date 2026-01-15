import { useState, useEffect } from 'react';
import { Modal } from '../ui/Modal';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { X, Plus } from 'lucide-react';
import type { Objective, ObjectiveType, Tag } from '../../App';
import { toast } from 'sonner@2.0.3';

interface CreateObjectiveModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (objective: Omit<Objective, 'id' | 'createdAt'>) => void;
  tags: Tag[];
  onCreateTag: (tag: Tag) => void;
  existingObjective?: Objective | null;
}

export function CreateObjectiveModal({
  isOpen,
  onClose,
  onSave,
  tags,
  onCreateTag,
  existingObjective,
}: CreateObjectiveModalProps) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState<ObjectiveType>('daily');
  const [targetAmount, setTargetAmount] = useState('1');
  const [dueDate, setDueDate] = useState('');
  const [selectedTagIds, setSelectedTagIds] = useState<string[]>([]);
  const [showNewTagInput, setShowNewTagInput] = useState(false);
  const [newTagName, setNewTagName] = useState('');

  useEffect(() => {
    if (existingObjective) {
      setName(existingObjective.name);
      setDescription(existingObjective.description);
      setType(existingObjective.type);
      setTargetAmount(existingObjective.targetAmount.toString());
      setDueDate(existingObjective.dueDate);
      setSelectedTagIds(existingObjective.tagIds);
    } else {
      resetForm();
    }
  }, [existingObjective, isOpen]);

  const resetForm = () => {
    setName('');
    setDescription('');
    setType('daily');
    setTargetAmount('1');
    setDueDate('');
    setSelectedTagIds([]);
    setShowNewTagInput(false);
    setNewTagName('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim()) {
      toast.error('Please enter an objective name');
      return;
    }
    
    if (!dueDate) {
      toast.error('Please select a due date');
      return;
    }

    const target = parseInt(targetAmount);
    if (isNaN(target) || target < 1) {
      toast.error('Target amount must be at least 1');
      return;
    }

    onSave({
      name: name.trim(),
      description: description.trim(),
      type,
      targetAmount: target,
      dueDate,
      tagIds: selectedTagIds,
    });

    if (!existingObjective) {
      resetForm();
    }
  };

  const handleToggleTag = (tagId: string) => {
    if (selectedTagIds.includes(tagId)) {
      setSelectedTagIds(selectedTagIds.filter(id => id !== tagId));
    } else {
      setSelectedTagIds([...selectedTagIds, tagId]);
    }
  };

  const handleCreateTag = () => {
    if (!newTagName.trim()) {
      toast.error('Please enter a tag name');
      return;
    }

    const colors = ['#10b981', '#3b82f6', '#8b5cf6', '#f59e0b', '#ec4899', '#06b6d4', '#14b8a6'];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];

    const newTag: Tag = {
      id: Date.now().toString(),
      name: newTagName.trim(),
      color: randomColor,
    };

    onCreateTag(newTag);
    setSelectedTagIds([...selectedTagIds, newTag.id]);
    setNewTagName('');
    setShowNewTagInput(false);
    toast.success('Tag created successfully!');
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={existingObjective ? 'Edit Objective' : 'Create New Objective'}
      size="md"
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        <Input
          label="Objective Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g., Morning Workout"
          required
        />

        <div>
          <label className="block text-sm text-neutral-700 mb-1.5">
            Description (optional)
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Add more details about this objective"
            rows={3}
            className="w-full px-3 py-2 border border-neutral-300 rounded-lg bg-white text-neutral-900 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
          />
        </div>

        <Select
          label="Objective Type"
          value={type}
          onChange={(e) => setType(e.target.value as ObjectiveType)}
          options={[
            { value: 'daily', label: 'Daily' },
            { value: 'weekly', label: 'Weekly' },
            { value: 'monthly', label: 'Monthly' },
            { value: 'yearly', label: 'Yearly' },
          ]}
          required
        />

        <Input
          label="Target Amount"
          type="number"
          min="1"
          value={targetAmount}
          onChange={(e) => setTargetAmount(e.target.value)}
          placeholder="1"
          required
        />

        <Input
          label="Due Date"
          type="date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
          required
        />

        <div>
          <label className="block text-sm text-neutral-700 mb-2">
            Tags
          </label>
          <div className="flex flex-wrap gap-2 mb-3">
            {tags.map((tag) => (
              <button
                key={tag.id}
                type="button"
                onClick={() => handleToggleTag(tag.id)}
                className={`transition-all ${
                  selectedTagIds.includes(tag.id)
                    ? 'ring-2 ring-offset-2'
                    : 'opacity-60 hover:opacity-100'
                }`}
                style={{ 
                  ringColor: selectedTagIds.includes(tag.id) ? tag.color : undefined 
                }}
              >
                <Badge color={tag.color}>{tag.name}</Badge>
              </button>
            ))}
          </div>

          {!showNewTagInput ? (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setShowNewTagInput(true)}
            >
              <Plus className="w-4 h-4 mr-1" />
              Create new tag
            </Button>
          ) : (
            <div className="flex gap-2">
              <Input
                value={newTagName}
                onChange={(e) => setNewTagName(e.target.value)}
                placeholder="Tag name"
                className="flex-1"
              />
              <Button
                type="button"
                onClick={handleCreateTag}
                size="sm"
              >
                Add
              </Button>
              <Button
                type="button"
                variant="ghost"
                onClick={() => {
                  setShowNewTagInput(false);
                  setNewTagName('');
                }}
                size="sm"
              >
                Cancel
              </Button>
            </div>
          )}
        </div>

        <div className="flex gap-3 pt-4">
          <Button type="submit" className="flex-1">
            {existingObjective ? 'Update Objective' : 'Create Objective'}
          </Button>
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancel
          </Button>
        </div>
      </form>
    </Modal>
  );
}
