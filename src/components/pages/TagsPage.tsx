import { useState } from 'react';
import { Card, CardContent } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Plus, Edit2, Trash2, X, Check } from 'lucide-react';
import type { Tag } from '../../App';
import { toast } from 'sonner@2.0.3';

interface TagsPageProps {
  tags: Tag[];
  onTagsUpdate: (tags: Tag[]) => void;
}

const PRESET_COLORS = [
  '#10b981', // green
  '#3b82f6', // blue
  '#8b5cf6', // purple
  '#f59e0b', // orange
  '#ec4899', // pink
  '#06b6d4', // cyan
  '#14b8a6', // teal
  '#f97316', // orange-dark
  '#6366f1', // indigo
  '#ef4444', // red
];

export function TagsPage({ tags, onTagsUpdate }: TagsPageProps) {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingTag, setEditingTag] = useState<Tag | null>(null);
  const [newTagName, setNewTagName] = useState('');
  const [selectedColor, setSelectedColor] = useState(PRESET_COLORS[0]);

  const handleCreateTag = () => {
    if (!newTagName.trim()) {
      toast.error('Please enter a tag name');
      return;
    }

    const newTag: Tag = {
      id: Date.now().toString(),
      name: newTagName.trim(),
      color: selectedColor,
    };

    onTagsUpdate([...tags, newTag]);
    setNewTagName('');
    setSelectedColor(PRESET_COLORS[0]);
    setShowCreateForm(false);
    toast.success('Tag created successfully!');
  };

  const handleUpdateTag = () => {
    if (!editingTag || !newTagName.trim()) {
      toast.error('Please enter a tag name');
      return;
    }

    onTagsUpdate(
      tags.map(tag =>
        tag.id === editingTag.id
          ? { ...tag, name: newTagName.trim(), color: selectedColor }
          : tag
      )
    );

    setEditingTag(null);
    setNewTagName('');
    setSelectedColor(PRESET_COLORS[0]);
    toast.success('Tag updated successfully!');
  };

  const handleDeleteTag = (id: string) => {
    if (confirm('Are you sure you want to delete this tag? It will be removed from all objectives.')) {
      onTagsUpdate(tags.filter(tag => tag.id !== id));
      toast.success('Tag deleted successfully!');
    }
  };

  const startEdit = (tag: Tag) => {
    setEditingTag(tag);
    setNewTagName(tag.name);
    setSelectedColor(tag.color);
    setShowCreateForm(false);
  };

  const cancelEdit = () => {
    setEditingTag(null);
    setNewTagName('');
    setSelectedColor(PRESET_COLORS[0]);
  };

  const cancelCreate = () => {
    setShowCreateForm(false);
    setNewTagName('');
    setSelectedColor(PRESET_COLORS[0]);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl text-neutral-900 mb-2">Tags</h1>
          <p className="text-neutral-600">
            Organize your objectives with custom tags
          </p>
        </div>
        {!showCreateForm && !editingTag && (
          <Button onClick={() => setShowCreateForm(true)}>
            <Plus className="w-4 h-4 mr-2" />
            New Tag
          </Button>
        )}
      </div>

      {/* Create/Edit Form */}
      {(showCreateForm || editingTag) && (
        <Card>
          <CardContent className="py-5">
            <h3 className="text-lg text-neutral-900 mb-4">
              {editingTag ? 'Edit Tag' : 'Create New Tag'}
            </h3>
            <div className="space-y-4">
              <Input
                label="Tag Name"
                value={newTagName}
                onChange={(e) => setNewTagName(e.target.value)}
                placeholder="e.g., Health, Career, Learning"
              />

              <div>
                <label className="block text-sm text-neutral-700 mb-2">
                  Color
                </label>
                <div className="flex flex-wrap gap-3">
                  {PRESET_COLORS.map((color) => (
                    <button
                      key={color}
                      type="button"
                      onClick={() => setSelectedColor(color)}
                      className={`w-10 h-10 rounded-lg transition-all ${
                        selectedColor === color
                          ? 'ring-2 ring-offset-2 ring-neutral-400 scale-110'
                          : 'hover:scale-105'
                      }`}
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm text-neutral-700 mb-2">
                  Preview
                </label>
                <Badge color={selectedColor}>{newTagName || 'Tag Name'}</Badge>
              </div>

              <div className="flex gap-2">
                <Button
                  onClick={editingTag ? handleUpdateTag : handleCreateTag}
                >
                  <Check className="w-4 h-4 mr-2" />
                  {editingTag ? 'Update Tag' : 'Create Tag'}
                </Button>
                <Button
                  variant="ghost"
                  onClick={editingTag ? cancelEdit : cancelCreate}
                >
                  <X className="w-4 h-4 mr-2" />
                  Cancel
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Tags List */}
      {tags.length === 0 ? (
        <Card>
          <CardContent className="py-16 text-center">
            <div className="max-w-md mx-auto">
              <div className="w-16 h-16 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Plus className="w-8 h-8 text-neutral-400" />
              </div>
              <h3 className="text-lg text-neutral-900 mb-2">No tags yet</h3>
              <p className="text-neutral-600 mb-6">
                Create tags to organize your objectives better
              </p>
              <Button onClick={() => setShowCreateForm(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Create First Tag
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {tags.map((tag) => (
            <Card key={tag.id} hover>
              <CardContent className="py-4">
                <div className="flex items-center justify-between mb-3">
                  <Badge color={tag.color}>{tag.name}</Badge>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => startEdit(tag)}
                      className="p-1.5 text-neutral-600 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
                      title="Edit tag"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteTag(tag.id)}
                      className="p-1.5 text-neutral-600 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                      title="Delete tag"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <div
                  className="h-2 rounded-full"
                  style={{ backgroundColor: tag.color }}
                />
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
