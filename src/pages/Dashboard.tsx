import { useState, useEffect, useMemo } from 'react';
import { format, parseISO, subDays, startOfDay, isAfter, isSameDay } from 'date-fns';
import { de } from 'date-fns/locale';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { Flame, Check, Plus, Lock, BookOpen } from 'lucide-react';

import type {
  Aufgaben,
  XpEvents,
  Tagebucheintraege,
  AufgabenDefinitionen,
  AufgabenKategorien,
} from '@/types/app';
import { LivingAppsService, extractRecordId } from '@/services/livingAppsService';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';

// ============================================================================
// Types
// ============================================================================

interface DashboardData {
  aufgaben: Aufgaben[];
  xpEvents: XpEvents[];
  tagebucheintraege: Tagebucheintraege[];
  aufgabenDefinitionen: AufgabenDefinitionen[];
  aufgabenKategorien: AufgabenKategorien[];
}

interface EnrichedTask extends Aufgaben {
  definition?: AufgabenDefinitionen;
  category?: AufgabenKategorien;
  xpReward: number;
}

interface WeeklyXpData {
  day: string;
  date: string;
  xp: number;
}

// ============================================================================
// Helper Functions
// ============================================================================

function getTodayString(): string {
  return format(new Date(), 'yyyy-MM-dd');
}

function calculateStreak(entries: Tagebucheintraege[]): number {
  if (entries.length === 0) return 0;

  // Sort entries by date descending
  const sortedEntries = [...entries]
    .filter(e => e.fields.occurred_at && !e.fields.deleted_at)
    .sort((a, b) => {
      const dateA = a.fields.occurred_at || '';
      const dateB = b.fields.occurred_at || '';
      return dateB.localeCompare(dateA);
    });

  if (sortedEntries.length === 0) return 0;

  // Get unique dates
  const uniqueDates = new Set<string>();
  sortedEntries.forEach(entry => {
    const date = entry.fields.occurred_at?.split('T')[0];
    if (date) uniqueDates.add(date);
  });

  const sortedDates = Array.from(uniqueDates).sort((a, b) => b.localeCompare(a));

  // Check if the most recent entry is today or yesterday
  const today = getTodayString();
  const yesterday = format(subDays(new Date(), 1), 'yyyy-MM-dd');

  if (sortedDates[0] !== today && sortedDates[0] !== yesterday) {
    return 0; // Streak broken
  }

  let streak = 1;
  for (let i = 1; i < sortedDates.length; i++) {
    const currentDate = parseISO(sortedDates[i - 1]);
    const prevDate = parseISO(sortedDates[i]);
    const expectedPrevDate = subDays(currentDate, 1);

    if (isSameDay(prevDate, expectedPrevDate)) {
      streak++;
    } else {
      break;
    }
  }

  return streak;
}

function calculateWeeklyXp(xpEvents: XpEvents[]): WeeklyXpData[] {
  const today = startOfDay(new Date());
  const weekData: WeeklyXpData[] = [];

  for (let i = 6; i >= 0; i--) {
    const date = subDays(today, i);
    const dateStr = format(date, 'yyyy-MM-dd');
    const dayName = format(date, 'EEEEEE', { locale: de });

    const dayXp = xpEvents
      .filter(event => event.fields.date === dateStr)
      .reduce((sum, event) => sum + (event.fields.final_xp || 0), 0);

    weekData.push({
      day: dayName,
      date: dateStr,
      xp: dayXp,
    });
  }

  return weekData;
}

// ============================================================================
// Loading State Component
// ============================================================================

function LoadingState() {
  return (
    <div className="min-h-screen bg-background p-4 md:p-6">
      <div className="mx-auto max-w-[1400px]">
        {/* Header Skeleton */}
        <div className="mb-6 flex items-center justify-between">
          <div>
            <Skeleton className="h-8 w-48 mb-2" />
            <Skeleton className="h-4 w-32" />
          </div>
          <Skeleton className="h-10 w-40 hidden md:block" />
        </div>

        {/* Hero Skeleton */}
        <div className="mb-6">
          <Skeleton className="h-48 w-full rounded-lg" />
        </div>

        {/* Content Skeleton */}
        <div className="grid gap-6 md:grid-cols-[1fr_400px]">
          <Skeleton className="h-64 rounded-lg" />
          <div className="space-y-4">
            <Skeleton className="h-32 rounded-lg" />
            <Skeleton className="h-32 rounded-lg" />
            <Skeleton className="h-32 rounded-lg" />
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// Error State Component
// ============================================================================

function ErrorState({ error, onRetry }: { error: Error; onRetry: () => void }) {
  return (
    <div className="min-h-screen bg-background p-4 flex items-center justify-center">
      <Alert variant="destructive" className="max-w-md">
        <AlertTitle>Fehler beim Laden</AlertTitle>
        <AlertDescription className="mt-2">
          <p className="mb-4">{error.message}</p>
          <Button variant="outline" onClick={onRetry}>
            Erneut versuchen
          </Button>
        </AlertDescription>
      </Alert>
    </div>
  );
}

// ============================================================================
// Empty State Component
// ============================================================================

function EmptyState({ onAddEntry }: { onAddEntry: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
      <BookOpen className="h-16 w-16 text-muted-foreground mb-4" />
      <h3 className="text-lg font-semibold mb-2">Noch keine Einträge</h3>
      <p className="text-muted-foreground mb-6 max-w-sm">
        Beginne deine stoische Reise mit deinem ersten Tagebucheintrag.
      </p>
      <Button onClick={onAddEntry}>
        <Plus className="mr-2 h-4 w-4" />
        Ersten Eintrag schreiben
      </Button>
    </div>
  );
}

// ============================================================================
// Hero KPI Component
// ============================================================================

interface HeroKpiProps {
  todayXp: number;
  tasksCompleted: number;
  totalTasks: number;
  streak: number;
}

function HeroKpi({ todayXp, tasksCompleted, totalTasks, streak }: HeroKpiProps) {
  return (
    <Card className="bg-card shadow-sm">
      <CardContent className="pt-8 pb-6 md:pt-12 md:pb-8">
        <div className="text-center">
          {/* Hero XP Number */}
          <div className="mb-2">
            <span
              className="text-[64px] md:text-[80px] font-bold leading-none"
              style={{
                color: 'hsl(30 65% 45%)',
                fontVariantNumeric: 'tabular-nums',
              }}
            >
              {todayXp}
            </span>
          </div>
          <p className="text-muted-foreground text-sm mb-6">XP heute</p>

          {/* Secondary Stats */}
          <div className="flex items-center justify-center gap-6 text-sm">
            <div className="flex items-center gap-2">
              <Check className="h-4 w-4 text-muted-foreground" />
              <span className="text-foreground font-medium">
                {tasksCompleted}/{totalTasks} Aufgaben
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Flame className="h-4 w-4" style={{ color: 'hsl(30 65% 45%)' }} />
              <span className="text-foreground font-medium">
                {streak} {streak === 1 ? 'Tag' : 'Tage'}
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// ============================================================================
// Weekly Chart Component
// ============================================================================

interface WeeklyChartProps {
  data: WeeklyXpData[];
}

function WeeklyChart({ data }: WeeklyChartProps) {
  return (
    <Card className="shadow-sm hidden md:block">
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-medium">XP diese Woche</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[200px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="xpGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(30 65% 45%)" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="hsl(30 65% 45%)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis
                dataKey="day"
                tick={{ fontSize: 12 }}
                stroke="hsl(25 10% 45%)"
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                tick={{ fontSize: 12 }}
                stroke="hsl(25 10% 45%)"
                tickLine={false}
                axisLine={false}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'hsl(0 0% 100%)',
                  border: '1px solid hsl(35 20% 88%)',
                  borderRadius: '8px',
                  fontSize: '12px',
                }}
                labelFormatter={(label, payload) => {
                  if (payload?.[0]?.payload?.date) {
                    return format(parseISO(payload[0].payload.date), 'EEEE, d. MMMM', { locale: de });
                  }
                  return label;
                }}
                formatter={(value: number) => [`${value} XP`, 'Erfahrung']}
              />
              <Area
                type="monotone"
                dataKey="xp"
                stroke="hsl(30 65% 45%)"
                strokeWidth={2}
                fill="url(#xpGradient)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}

// ============================================================================
// Task Card Component
// ============================================================================

interface TaskCardProps {
  task: EnrichedTask;
  onComplete: (task: EnrichedTask) => void;
  onClick: (task: EnrichedTask) => void;
}

function TaskCard({ task, onComplete, onClick }: TaskCardProps) {
  const [completing, setCompleting] = useState(false);

  const handleComplete = async (e: React.MouseEvent) => {
    e.stopPropagation();
    setCompleting(true);
    await onComplete(task);
    setCompleting(false);
  };

  return (
    <div
      className="p-4 rounded-lg bg-card border border-border hover:bg-accent/50 cursor-pointer transition-colors"
      onClick={() => onClick(task)}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <h4 className="font-medium text-foreground truncate">
            {task.fields.title || task.definition?.fields.title || 'Unbenannte Aufgabe'}
          </h4>
          {task.category && (
            <Badge variant="secondary" className="mt-1 text-xs">
              {task.category.fields.name}
            </Badge>
          )}
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <span
            className="text-sm font-semibold"
            style={{ color: 'hsl(30 65% 45%)' }}
          >
            +{task.xpReward} XP
          </span>
          <Button
            size="sm"
            variant="ghost"
            className="h-8 w-8 p-0"
            onClick={handleComplete}
            disabled={completing}
          >
            <Check className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// Task Detail Sheet Component
// ============================================================================

interface TaskDetailSheetProps {
  task: EnrichedTask | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onComplete: (task: EnrichedTask) => void;
}

function TaskDetailSheet({ task, open, onOpenChange, onComplete }: TaskDetailSheetProps) {
  const [completing, setCompleting] = useState(false);

  if (!task) return null;

  const handleComplete = async () => {
    setCompleting(true);
    await onComplete(task);
    setCompleting(false);
    onOpenChange(false);
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="h-auto max-h-[80vh]">
        <SheetHeader className="text-left">
          <SheetTitle>
            {task.fields.title || task.definition?.fields.title || 'Aufgabe'}
          </SheetTitle>
        </SheetHeader>
        <div className="mt-4 space-y-4">
          {task.category && (
            <div>
              <span className="text-sm text-muted-foreground">Kategorie</span>
              <p className="font-medium">{task.category.fields.name}</p>
            </div>
          )}
          {task.definition?.fields.description && (
            <div>
              <span className="text-sm text-muted-foreground">Beschreibung</span>
              <p className="text-foreground">{task.definition.fields.description}</p>
            </div>
          )}
          <div>
            <span className="text-sm text-muted-foreground">Belohnung</span>
            <p className="font-semibold" style={{ color: 'hsl(30 65% 45%)' }}>
              +{task.xpReward} XP
            </p>
          </div>
          {task.fields.due_date && (
            <div>
              <span className="text-sm text-muted-foreground">Fällig am</span>
              <p className="font-medium">
                {format(parseISO(task.fields.due_date), 'PPP', { locale: de })}
              </p>
            </div>
          )}
          <Button
            className="w-full mt-6"
            onClick={handleComplete}
            disabled={completing}
          >
            {completing ? 'Wird gespeichert...' : 'Als erledigt markieren'}
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}

// ============================================================================
// Entry Card Component
// ============================================================================

interface EntryCardProps {
  entry: Tagebucheintraege;
}

function EntryCard({ entry }: EntryCardProps) {
  const dateStr = entry.fields.occurred_at
    ? format(parseISO(entry.fields.occurred_at), 'd. MMM', { locale: de })
    : 'Kein Datum';

  return (
    <div className="py-3 border-b border-border last:border-0">
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <h4 className="font-medium text-foreground truncate">
            {entry.fields.title || 'Ohne Titel'}
          </h4>
          <p className="text-sm text-muted-foreground mt-0.5">{dateStr}</p>
        </div>
        {entry.fields.is_private && (
          <Lock className="h-4 w-4 text-muted-foreground shrink-0" />
        )}
      </div>
      {/* Desktop: Show preview */}
      {entry.fields.text && (
        <p className="hidden md:block text-sm text-muted-foreground mt-2 line-clamp-2">
          {entry.fields.text}
        </p>
      )}
    </div>
  );
}

// ============================================================================
// Add Entry Dialog Component
// ============================================================================

interface AddEntryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

function AddEntryDialog({ open, onOpenChange, onSuccess }: AddEntryDialogProps) {
  const [title, setTitle] = useState('');
  const [text, setText] = useState('');
  const [isPrivate, setIsPrivate] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim() || !text.trim()) {
      setError('Bitte fülle Titel und Text aus.');
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      const now = new Date();
      // Format: YYYY-MM-DDTHH:MM (no seconds!)
      const occurredAt = format(now, "yyyy-MM-dd'T'HH:mm");

      await LivingAppsService.createTagebucheintraegeEntry({
        title: title.trim(),
        text: text.trim(),
        occurred_at: occurredAt,
        is_private: isPrivate,
        source_type: 'dashboard',
      });

      // Reset form
      setTitle('');
      setText('');
      setIsPrivate(false);
      onOpenChange(false);
      onSuccess();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ein Fehler ist aufgetreten.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Neuer Tagebucheintrag</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          <div className="space-y-2">
            <Label htmlFor="title">Titel</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Was beschäftigt dich heute?"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="text">Eintrag</Label>
            <Textarea
              id="text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Deine Gedanken, Reflexionen, Erkenntnisse..."
              rows={6}
              required
            />
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="private"
              checked={isPrivate}
              onCheckedChange={(checked) => setIsPrivate(checked === true)}
            />
            <Label htmlFor="private" className="text-sm font-normal cursor-pointer">
              Privater Eintrag
            </Label>
          </div>
          <Button type="submit" className="w-full" disabled={submitting}>
            {submitting ? 'Wird gespeichert...' : 'Eintrag speichern'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}

// ============================================================================
// Main Dashboard Component
// ============================================================================

export default function Dashboard() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [addEntryOpen, setAddEntryOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<EnrichedTask | null>(null);
  const [taskSheetOpen, setTaskSheetOpen] = useState(false);

  // Fetch all data
  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [
        aufgaben,
        xpEvents,
        tagebucheintraege,
        aufgabenDefinitionen,
        aufgabenKategorien,
      ] = await Promise.all([
        LivingAppsService.getAufgaben(),
        LivingAppsService.getXpEvents(),
        LivingAppsService.getTagebucheintraege(),
        LivingAppsService.getAufgabenDefinitionen(),
        LivingAppsService.getAufgabenKategorien(),
      ]);

      setData({
        aufgaben,
        xpEvents,
        tagebucheintraege,
        aufgabenDefinitionen,
        aufgabenKategorien,
      });
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Unbekannter Fehler'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Computed values
  const computedData = useMemo(() => {
    if (!data) return null;

    const today = getTodayString();

    // Create lookup maps
    const definitionMap = new Map<string, AufgabenDefinitionen>();
    data.aufgabenDefinitionen.forEach(def => {
      definitionMap.set(def.record_id, def);
    });

    const categoryMap = new Map<string, AufgabenKategorien>();
    data.aufgabenKategorien.forEach(cat => {
      categoryMap.set(cat.record_id, cat);
    });

    // Enrich tasks with definitions and categories
    const enrichedTasks: EnrichedTask[] = data.aufgaben.map(task => {
      const definitionId = extractRecordId(task.fields.task_definition_id);
      const definition = definitionId ? definitionMap.get(definitionId) : undefined;

      const categoryId = definition ? extractRecordId(definition.fields.category_id) : null;
      const category = categoryId ? categoryMap.get(categoryId) : undefined;

      // Calculate XP reward
      let xpReward = 10; // Default
      if (definition?.fields.xp_override) {
        xpReward = definition.fields.xp_override;
      } else if (category?.fields.base_xp) {
        xpReward = category.fields.base_xp;
      }

      return {
        ...task,
        definition,
        category,
        xpReward,
      };
    });

    // Filter open tasks
    const openTasks = enrichedTasks.filter(task => task.fields.status === 'open');

    // Today's completed tasks
    const todayCompletedTasks = enrichedTasks.filter(
      task =>
        task.fields.status === 'done' &&
        task.fields.completed_at?.startsWith(today)
    );

    // Today's XP
    const todayXp = data.xpEvents
      .filter(event => event.fields.date === today)
      .reduce((sum, event) => sum + (event.fields.final_xp || 0), 0);

    // Weekly XP data for chart
    const weeklyXp = calculateWeeklyXp(data.xpEvents);

    // Journal streak
    const streak = calculateStreak(data.tagebucheintraege);

    // Recent entries (non-deleted, sorted by date)
    const recentEntries = [...data.tagebucheintraege]
      .filter(e => !e.fields.deleted_at)
      .sort((a, b) => {
        const dateA = a.fields.occurred_at || '';
        const dateB = b.fields.occurred_at || '';
        return dateB.localeCompare(dateA);
      })
      .slice(0, 5);

    return {
      openTasks,
      todayXp,
      tasksCompleted: todayCompletedTasks.length,
      totalTasks: openTasks.length + todayCompletedTasks.length,
      streak,
      weeklyXp,
      recentEntries,
    };
  }, [data]);

  // Handle task completion
  const handleCompleteTask = async (task: EnrichedTask) => {
    try {
      const now = new Date();
      const completedAt = format(now, "yyyy-MM-dd'T'HH:mm");

      await LivingAppsService.updateAufgabenEntry(task.record_id, {
        status: 'done',
        completed_at: completedAt,
      });

      // Refresh data
      await fetchData();
    } catch (err) {
      console.error('Failed to complete task:', err);
    }
  };

  // Handle task click (mobile)
  const handleTaskClick = (task: EnrichedTask) => {
    setSelectedTask(task);
    setTaskSheetOpen(true);
  };

  // Render states
  if (loading) return <LoadingState />;
  if (error) return <ErrorState error={error} onRetry={fetchData} />;
  if (!data || !computedData) return <LoadingState />;

  const { openTasks, todayXp, tasksCompleted, totalTasks, streak, weeklyXp, recentEntries } = computedData;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border">
        <div className="mx-auto max-w-[1400px] px-4 py-4 md:px-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl md:text-2xl font-semibold text-foreground">
                Mein Tagebuch
              </h1>
              <p className="text-sm text-muted-foreground">
                Heute, {format(new Date(), 'd. MMMM', { locale: de })}
              </p>
            </div>
            {/* Desktop: Header Button */}
            <Button
              className="hidden md:flex"
              onClick={() => setAddEntryOpen(true)}
            >
              <Plus className="mr-2 h-4 w-4" />
              Eintrag schreiben
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-[1400px] px-4 py-6 md:px-6 pb-24 md:pb-6">
        {recentEntries.length === 0 && openTasks.length === 0 ? (
          <EmptyState onAddEntry={() => setAddEntryOpen(true)} />
        ) : (
          <>
            {/* Hero Section */}
            <section className="mb-6">
              <HeroKpi
                todayXp={todayXp}
                tasksCompleted={tasksCompleted}
                totalTasks={totalTasks}
                streak={streak}
              />
            </section>

            {/* Desktop: Two Column Layout */}
            <div className="grid gap-6 md:grid-cols-[1fr_400px]">
              {/* Left Column: Chart */}
              <div className="space-y-6">
                <WeeklyChart data={weeklyXp} />
              </div>

              {/* Right Column: Tasks and Entries */}
              <div className="space-y-6">
                {/* Open Tasks */}
                <Card className="shadow-sm">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-base font-medium">
                        Offene Aufgaben
                      </CardTitle>
                      <Badge variant="secondary">{openTasks.length}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    {openTasks.length === 0 ? (
                      <p className="text-sm text-muted-foreground text-center py-4">
                        Keine offenen Aufgaben
                      </p>
                    ) : (
                      openTasks.slice(0, 5).map(task => (
                        <TaskCard
                          key={task.record_id}
                          task={task}
                          onComplete={handleCompleteTask}
                          onClick={handleTaskClick}
                        />
                      ))
                    )}
                  </CardContent>
                </Card>

                {/* Recent Entries */}
                <Card className="shadow-sm">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base font-medium">
                      Letzte Einträge
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {recentEntries.length === 0 ? (
                      <p className="text-sm text-muted-foreground text-center py-4">
                        Noch keine Einträge
                      </p>
                    ) : (
                      recentEntries.map(entry => (
                        <EntryCard key={entry.record_id} entry={entry} />
                      ))
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>
          </>
        )}
      </main>

      {/* Mobile: Fixed Bottom Button */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-t border-border md:hidden safe-area-inset-bottom">
        <Button
          className="w-full h-14 text-base"
          onClick={() => setAddEntryOpen(true)}
        >
          <Plus className="mr-2 h-5 w-5" />
          Eintrag schreiben
        </Button>
      </div>

      {/* Add Entry Dialog */}
      <AddEntryDialog
        open={addEntryOpen}
        onOpenChange={setAddEntryOpen}
        onSuccess={fetchData}
      />

      {/* Task Detail Sheet (Mobile) */}
      <TaskDetailSheet
        task={selectedTask}
        open={taskSheetOpen}
        onOpenChange={setTaskSheetOpen}
        onComplete={handleCompleteTask}
      />
    </div>
  );
}
