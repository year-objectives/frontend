import { useState } from 'react';
import { Card, CardContent } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { ProgressBar } from '../ui/ProgressBar';
import { Plus, Calendar, MoreVertical, Edit2, Trash2 } from 'lucide-react';
import type { Objective, Accomplishment, Tag, ObjectiveType } from '../../App';
import { CreateObjectiveModal } from '../objectives/CreateObjectiveModal';
import { ObjectiveDetailModal } from '../objectives/ObjectiveDetailModal';
import { toast } from 'sonner@2.0.3';

type Page = 'dashboard' | 'objectives-all' | 'objectives-daily' | 'objectives-weekly' | 'objectives-monthly' | 'objectives-yearly' | 'reports' | 'tags' | 'profile' | 'settings';

interface ObjectivesPageProps {
  currentPage: Page;
  objectives: Objective[];
  accomplishments: Accomplishment[];
  tags: Tag[];
  onObjectivesUpdate: (objectives: Objective[]) => void;
  onAccomplishmentsUpdate: (accomplishments: Accomplishment[]) => void;
  onTagsUpdate: (tags: Tag[]) => void;
}

export function ObjectivesPage({
  currentPage,
  objectives,
  accomplishments,
  tags,
  onObjectivesUpdate,
  onAccomplishmentsUpdate,
  onTagsUpdate,
}: ObjectivesPageProps) {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedObjective, setSelectedObjective] = useState<Objective | null>(null);
  const [editingObjective, setEditingObjective] = useState<Objective | null>(null);
  const [showActionMenu, setShowActionMenu] = useState<string | null>(null);

  const getPageTitle = () => {
    switch (currentPage) {
      case 'objectives-daily':
        return 'Daily Objectives';
      case 'objectives-weekly':
        return 'Weekly Objectives';
      case 'objectives-monthly':
        return 'Monthly Objectives';
      case 'objectives-yearly':
        return 'Yearly Objectives';
      default:
        return 'All Objectives';
    }
  };

  const getFilteredObjectives = () => {
    if (currentPage === 'objectives-all') return objectives;
    const type = currentPage.replace('objectives-', '') as ObjectiveType;
    return objectives.filter(o => o.type === type);
  };

  const filteredObjectives = getFilteredObjectives();

  const getObjectiveProgress = (objective: Objective) => {
    const objAccomplishments = accomplishments.filter(
      a => a.objectiveId === objective.id && a.done
    ).length;
    return objAccomplishments;
  };

  const getTagById = (tagId: string) => tags.find(t => t.id === tagId);

  const getAccomplishmentsForObjective = (objectiveId: string) => {
    return accomplishments.filter(a => a.objectiveId === objectiveId);
  };

  const handleCreateObjective = (objective: Omit<Objective, 'id' | 'createdAt'>) => {
    const newObjective: Objective = {
      ...objective,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    };
    onObjectivesUpdate([...objectives, newObjective]);
    setShowCreateModal(false);
    toast.success('Objective created successfully!');
  };

  const handleUpdateObjective = (id: string, updates: Partial<Objective>) => {
    onObjectivesUpdate(
      objectives.map(obj => obj.id === id ? { ...obj, ...updates } : obj)
    );
    setEditingObjective(null);
    setShowCreateModal(false);
    toast.success('Objective updated successfully!');
  };

  const handleDeleteObjective = (id: string) => {
    onObjectivesUpdate(objectives.filter(obj => obj.id !== id));
    onAccomplishmentsUpdate(accomplishments.filter(acc => acc.objectiveId !== id));
    setShowActionMenu(null);
    toast.success('Objective deleted successfully!');
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl text-neutral-900 mb-2">{getPageTitle()}</h1>
          <p className="text-neutral-600">
            {filteredObjectives.length} {filteredObjectives.length === 1 ? 'objective' : 'objectives'}
          </p>
        </div>
        <Button onClick={() => setShowCreateModal(true)}>
          <Plus className="w-4 h-4 mr-2" />
          New Objective
        </Button>
      </div>

      {/* Objectives Grid */}
      {filteredObjectives.length === 0 ? (
        <Card>
          <CardContent className="py-16 text-center">
            <div className="max-w-md mx-auto">
              <div className="w-16 h-16 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Plus className="w-8 h-8 text-neutral-400" />
              </div>
              <h3 className="text-lg text-neutral-900 mb-2">No objectives yet</h3>
              <p className="text-neutral-600 mb-6">
                Get started by creating your first objective
              </p>
              <Button onClick={() => setShowCreateModal(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Create Objective
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {filteredObjectives.map((objective) => {
            const progress = getObjectiveProgress(objective);
            const isCompleted = progress >= objective.targetAmount;
            const dueDate = new Date(objective.dueDate);
            const isOverdue = dueDate < new Date() && !isCompleted;
            const objAccomplishments = getAccomplishmentsForObjective(objective.id);

            return (
              <Card
                key={objective.id}
                hover
                className="relative group"
              >
                <CardContent className="py-5">
                  <div className="space-y-4">
                    <div className="flex items-start justify-between">
                      <div 
                        className="flex-1 cursor-pointer"
                        onClick={() => setSelectedObjective(objective)}
                      >
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="text-lg text-neutral-900">{objective.name}</h3>
                          {isCompleted && (
                            <Badge color="#10b981">Completed</Badge>
                          )}
                          {isOverdue && (
                            <Badge color="#ef4444">Overdue</Badge>
                          )}
                        </div>
                        {objective.description && (
                          <p className="text-sm text-neutral-600 mb-2">{objective.description}</p>
                        )}
                      </div>
                      
                      <div className="relative">
                        <button
                          onClick={() => setShowActionMenu(showActionMenu === objective.id ? null : objective.id)}
                          className="p-1 hover:bg-neutral-100 rounded transition-colors"
                        >
                          <MoreVertical className="w-4 h-4 text-neutral-600" />
                        </button>
                        
                        {showActionMenu === objective.id && (
                          <>
                            <div
                              className="fixed inset-0 z-10"
                              onClick={() => setShowActionMenu(null)}
                            />
                            <div className="absolute right-0 mt-1 w-40 bg-white rounded-lg shadow-lg border border-neutral-200 py-1 z-20">
                              <button
                                onClick={() => {
                                  setEditingObjective(objective);
                                  setShowCreateModal(true);
                                  setShowActionMenu(null);
                                }}
                                className="w-full flex items-center gap-2 px-3 py-2 text-sm text-neutral-700 hover:bg-neutral-100 transition-colors"
                              >
                                <Edit2 className="w-4 h-4" />
                                Edit
                              </button>
                              <button
                                onClick={() => handleDeleteObjective(objective.id)}
                                className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                              >
                                <Trash2 className="w-4 h-4" />
                                Delete
                              </button>
                            </div>
                          </>
                        )}
                      </div>
                    </div>

                    <ProgressBar
                      value={progress}
                      max={objective.targetAmount}
                    />

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {objective.tagIds.map((tagId) => {
                          const tag = getTagById(tagId);
                          return tag ? (
                            <Badge key={tagId} color={tag.color}>
                              {tag.name}
                            </Badge>
                          ) : null;
                        })}
                      </div>
                      
                      <div className="flex items-center gap-1 text-sm text-neutral-600">
                        <Calendar className="w-4 h-4" />
                        {dueDate.toLocaleDateString()}
                      </div>
                    </div>

                    {objAccomplishments.length > 0 && (
                      <div className="pt-3 border-t border-neutral-100">
                        <p className="text-xs text-neutral-500 mb-2">Recent accomplishments:</p>
                        <div className="space-y-1">
                          {objAccomplishments.slice(-2).map((acc) => (
                            <div key={acc.id} className="flex items-center gap-2 text-xs text-neutral-600">
                              <div className="w-1.5 h-1.5 bg-green-500 rounded-full" />
                              {acc.description}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Create/Edit Objective Modal */}
      {showCreateModal && (
        <CreateObjectiveModal
          isOpen={showCreateModal}
          onClose={() => {
            setShowCreateModal(false);
            setEditingObjective(null);
          }}
          onSave={editingObjective 
            ? (data) => handleUpdateObjective(editingObjective.id, data)
            : handleCreateObjective
          }
          tags={tags}
          onCreateTag={(tag) => onTagsUpdate([...tags, tag])}
          existingObjective={editingObjective}
        />
      )}

      {/* Objective Detail Modal */}
      {selectedObjective && (
        <ObjectiveDetailModal
          isOpen={!!selectedObjective}
          onClose={() => setSelectedObjective(null)}
          objective={selectedObjective}
          accomplishments={getAccomplishmentsForObjective(selectedObjective.id)}
          tags={tags}
          onAccomplishmentsUpdate={onAccomplishmentsUpdate}
          allAccomplishments={accomplishments}
        />
      )}
    </div>
  );
}
