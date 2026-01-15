import { useState } from 'react';
import { Modal } from '../ui/Modal';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { ProgressBar } from '../ui/ProgressBar';
import { Calendar, Plus, Check, Trash2 } from 'lucide-react';
import type { Objective, Accomplishment, Tag } from '../../App';
import { toast } from 'sonner@2.0.3';

interface ObjectiveDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  objective: Objective;
  accomplishments: Accomplishment[];
  tags: Tag[];
  onAccomplishmentsUpdate: (accomplishments: Accomplishment[]) => void;
  allAccomplishments: Accomplishment[];
}

export function ObjectiveDetailModal({
  isOpen,
  onClose,
  objective,
  accomplishments,
  tags,
  onAccomplishmentsUpdate,
  allAccomplishments,
}: ObjectiveDetailModalProps) {
  const [showAddAccomplishment, setShowAddAccomplishment] = useState(false);
  const [newAccomplishmentDesc, setNewAccomplishmentDesc] = useState('');
  const [newAccomplishmentDate, setNewAccomplishmentDate] = useState(
    new Date().toISOString().split('T')[0]
  );
  const [isDone, setIsDone] = useState(true);

  const getTagById = (tagId: string) => tags.find(t => t.id === tagId);
  const completedCount = accomplishments.filter(a => a.done).length;
  const isCompleted = completedCount >= objective.targetAmount;

  const handleAddAccomplishment = () => {
    if (!newAccomplishmentDesc.trim()) {
      toast.error('Please enter a description');
      return;
    }

    const newAccomplishment: Accomplishment = {
      id: Date.now().toString(),
      objectiveId: objective.id,
      description: newAccomplishmentDesc.trim(),
      done: isDone,
      doneDate: newAccomplishmentDate,
    };

    onAccomplishmentsUpdate([...allAccomplishments, newAccomplishment]);
    setNewAccomplishmentDesc('');
    setNewAccomplishmentDate(new Date().toISOString().split('T')[0]);
    setIsDone(true);
    setShowAddAccomplishment(false);
    toast.success('Accomplishment added!');
  };

  const handleToggleAccomplishment = (id: string) => {
    onAccomplishmentsUpdate(
      allAccomplishments.map(acc =>
        acc.id === id ? { ...acc, done: !acc.done } : acc
      )
    );
  };

  const handleDeleteAccomplishment = (id: string) => {
    onAccomplishmentsUpdate(
      allAccomplishments.filter(acc => acc.id !== id)
    );
    toast.success('Accomplishment deleted');
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={objective.name}
      size="lg"
    >
      <div className="space-y-6">
        {/* Objective Info */}
        <div>
          {objective.description && (
            <p className="text-neutral-700 mb-4">{objective.description}</p>
          )}
          
          <div className="flex flex-wrap gap-3 mb-4">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-neutral-100 rounded-lg">
              <span className="text-sm text-neutral-600">Type:</span>
              <span className="text-sm text-neutral-900 capitalize">{objective.type}</span>
            </div>
            
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-neutral-100 rounded-lg">
              <Calendar className="w-4 h-4 text-neutral-600" />
              <span className="text-sm text-neutral-900">
                {new Date(objective.dueDate).toLocaleDateString()}
              </span>
            </div>
            
            {isCompleted && (
              <Badge color="#10b981">Completed</Badge>
            )}
          </div>

          {objective.tagIds.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {objective.tagIds.map((tagId) => {
                const tag = getTagById(tagId);
                return tag ? (
                  <Badge key={tagId} color={tag.color}>
                    {tag.name}
                  </Badge>
                ) : null;
              })}
            </div>
          )}

          <ProgressBar
            value={completedCount}
            max={objective.targetAmount}
          />
        </div>

        {/* Accomplishments Section */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg text-neutral-900">Accomplishments</h3>
            <Button
              size="sm"
              onClick={() => setShowAddAccomplishment(!showAddAccomplishment)}
            >
              <Plus className="w-4 h-4 mr-1" />
              Add
            </Button>
          </div>

          {/* Add Accomplishment Form */}
          {showAddAccomplishment && (
            <div className="mb-4 p-4 bg-neutral-50 rounded-lg space-y-3">
              <Input
                label="Description"
                value={newAccomplishmentDesc}
                onChange={(e) => setNewAccomplishmentDesc(e.target.value)}
                placeholder="What did you accomplish?"
              />
              
              <div className="grid grid-cols-2 gap-3">
                <Input
                  label="Date"
                  type="date"
                  value={newAccomplishmentDate}
                  onChange={(e) => setNewAccomplishmentDate(e.target.value)}
                />
                
                <div>
                  <label className="block text-sm text-neutral-700 mb-1.5">
                    Status
                  </label>
                  <div className="flex items-center gap-3 h-10">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={isDone}
                        onChange={(e) => setIsDone(e.target.checked)}
                        className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                      />
                      <span className="text-sm text-neutral-700">Done</span>
                    </label>
                  </div>
                </div>
              </div>

              <div className="flex gap-2">
                <Button size="sm" onClick={handleAddAccomplishment}>
                  Save
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => {
                    setShowAddAccomplishment(false);
                    setNewAccomplishmentDesc('');
                  }}
                >
                  Cancel
                </Button>
              </div>
            </div>
          )}

          {/* Accomplishments List */}
          {accomplishments.length === 0 ? (
            <div className="text-center py-8 text-neutral-500">
              No accomplishments yet. Add your first one!
            </div>
          ) : (
            <div className="space-y-2">
              {accomplishments
                .sort((a, b) => new Date(b.doneDate).getTime() - new Date(a.doneDate).getTime())
                .map((accomplishment) => (
                  <div
                    key={accomplishment.id}
                    className="flex items-start gap-3 p-3 bg-neutral-50 rounded-lg hover:bg-neutral-100 transition-colors group"
                  >
                    <button
                      onClick={() => handleToggleAccomplishment(accomplishment.id)}
                      className={`mt-0.5 flex-shrink-0 w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${
                        accomplishment.done
                          ? 'bg-green-500 border-green-500'
                          : 'border-neutral-300 hover:border-green-500'
                      }`}
                    >
                      {accomplishment.done && <Check className="w-3 h-3 text-white" />}
                    </button>
                    
                    <div className="flex-1">
                      <p
                        className={`text-sm ${
                          accomplishment.done
                            ? 'text-neutral-700'
                            : 'text-neutral-600'
                        }`}
                      >
                        {accomplishment.description}
                      </p>
                      <p className="text-xs text-neutral-500 mt-1">
                        {new Date(accomplishment.doneDate).toLocaleDateString()}
                      </p>
                    </div>

                    <button
                      onClick={() => handleDeleteAccomplishment(accomplishment.id)}
                      className="opacity-0 group-hover:opacity-100 transition-opacity text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
}
