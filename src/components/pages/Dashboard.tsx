import { Card, CardContent, CardHeader } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { ProgressBar } from '../ui/ProgressBar';
import { TrendingUp, Target, CheckCircle2, Clock } from 'lucide-react';
import type { Objective, Accomplishment, Tag } from '../../App';

type Page = 'dashboard' | 'objectives-all' | 'objectives-daily' | 'objectives-weekly' | 'objectives-monthly' | 'objectives-yearly' | 'reports' | 'tags' | 'profile' | 'settings';

interface DashboardProps {
  objectives: Objective[];
  accomplishments: Accomplishment[];
  tags: Tag[];
  onNavigate: (page: Page) => void;
}

export function Dashboard({ objectives, accomplishments, tags, onNavigate }: DashboardProps) {
  const totalObjectives = objectives.length;
  const completedObjectives = objectives.filter(obj => {
    const objAccomplishments = accomplishments.filter(a => a.objectiveId === obj.id && a.done);
    return objAccomplishments.length >= obj.targetAmount;
  }).length;
  const completionRate = totalObjectives > 0 ? Math.round((completedObjectives / totalObjectives) * 100) : 0;
  const totalAccomplishments = accomplishments.filter(a => a.done).length;

  const getObjectiveProgress = (objective: Objective) => {
    const objAccomplishments = accomplishments.filter(
      a => a.objectiveId === objective.id && a.done
    ).length;
    return objAccomplishments;
  };

  const getTagById = (tagId: string) => tags.find(t => t.id === tagId);

  const groupedObjectives = {
    daily: objectives.filter(o => o.type === 'daily'),
    weekly: objectives.filter(o => o.type === 'weekly'),
    monthly: objectives.filter(o => o.type === 'monthly'),
    yearly: objectives.filter(o => o.type === 'yearly'),
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl text-neutral-900 mb-2">Dashboard</h1>
        <p className="text-neutral-600">Track your progress and stay motivated</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="py-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-neutral-600 mb-1">Total Objectives</p>
                <p className="text-2xl text-neutral-900">{totalObjectives}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Target className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="py-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-neutral-600 mb-1">Completed</p>
                <p className="text-2xl text-neutral-900">{completedObjectives}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <CheckCircle2 className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="py-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-neutral-600 mb-1">Completion Rate</p>
                <p className="text-2xl text-neutral-900">{completionRate}%</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="py-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-neutral-600 mb-1">Accomplishments</p>
                <p className="text-2xl text-neutral-900">{totalAccomplishments}</p>
              </div>
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <Clock className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Objectives by Type */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Daily Objectives */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl text-neutral-900">Daily Objectives</h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onNavigate('objectives-daily')}
            >
              View all
            </Button>
          </div>
          <div className="space-y-3">
            {groupedObjectives.daily.length === 0 ? (
              <Card>
                <CardContent className="py-8 text-center text-neutral-500">
                  No daily objectives yet
                </CardContent>
              </Card>
            ) : (
              groupedObjectives.daily.slice(0, 3).map((objective) => (
                <Card key={objective.id} hover>
                  <CardContent className="py-4">
                    <div className="space-y-3">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="text-neutral-900 mb-1">{objective.name}</h3>
                          <p className="text-sm text-neutral-600">{objective.description}</p>
                        </div>
                      </div>
                      
                      <ProgressBar
                        value={getObjectiveProgress(objective)}
                        max={objective.targetAmount}
                      />
                      
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
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </div>

        {/* Weekly Objectives */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl text-neutral-900">Weekly Objectives</h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onNavigate('objectives-weekly')}
            >
              View all
            </Button>
          </div>
          <div className="space-y-3">
            {groupedObjectives.weekly.length === 0 ? (
              <Card>
                <CardContent className="py-8 text-center text-neutral-500">
                  No weekly objectives yet
                </CardContent>
              </Card>
            ) : (
              groupedObjectives.weekly.slice(0, 3).map((objective) => (
                <Card key={objective.id} hover>
                  <CardContent className="py-4">
                    <div className="space-y-3">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="text-neutral-900 mb-1">{objective.name}</h3>
                          <p className="text-sm text-neutral-600">{objective.description}</p>
                        </div>
                      </div>
                      
                      <ProgressBar
                        value={getObjectiveProgress(objective)}
                        max={objective.targetAmount}
                      />
                      
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
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Monthly & Yearly */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Objectives */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl text-neutral-900">Monthly Objectives</h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onNavigate('objectives-monthly')}
            >
              View all
            </Button>
          </div>
          <div className="space-y-3">
            {groupedObjectives.monthly.length === 0 ? (
              <Card>
                <CardContent className="py-8 text-center text-neutral-500">
                  No monthly objectives yet
                </CardContent>
              </Card>
            ) : (
              groupedObjectives.monthly.slice(0, 2).map((objective) => (
                <Card key={objective.id} hover>
                  <CardContent className="py-4">
                    <div className="space-y-3">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="text-neutral-900 mb-1">{objective.name}</h3>
                          <p className="text-sm text-neutral-600">{objective.description}</p>
                        </div>
                      </div>
                      
                      <ProgressBar
                        value={getObjectiveProgress(objective)}
                        max={objective.targetAmount}
                      />
                      
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
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </div>

        {/* Yearly Objectives */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl text-neutral-900">Yearly Objectives</h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onNavigate('objectives-yearly')}
            >
              View all
            </Button>
          </div>
          <div className="space-y-3">
            {groupedObjectives.yearly.length === 0 ? (
              <Card>
                <CardContent className="py-8 text-center text-neutral-500">
                  No yearly objectives yet
                </CardContent>
              </Card>
            ) : (
              groupedObjectives.yearly.slice(0, 2).map((objective) => (
                <Card key={objective.id} hover>
                  <CardContent className="py-4">
                    <div className="space-y-3">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="text-neutral-900 mb-1">{objective.name}</h3>
                          <p className="text-sm text-neutral-600">{objective.description}</p>
                        </div>
                      </div>
                      
                      <ProgressBar
                        value={getObjectiveProgress(objective)}
                        max={objective.targetAmount}
                      />
                      
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
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
