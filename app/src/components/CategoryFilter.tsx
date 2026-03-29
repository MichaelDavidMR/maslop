import { Button } from '@/components/ui/button';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { CATEGORIES } from '@/types';
import { cn } from '@/lib/utils';
import { 
  Shield, 
  Zap, 
  Wrench, 
  Droplets, 
  Sparkles, 
  FileText, 
  Building2, 
  Car, 
  Cpu, 
  Home 
} from 'lucide-react';

const categoryIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  seguridad: Shield,
  electricidad: Zap,
  herramientas: Wrench,
  plomeria: Droplets,
  limpieza: Sparkles,
  papeleria: FileText,
  construccion: Building2,
  automotriz: Car,
  tecnologia: Cpu,
  hogar: Home,
};

interface CategoryFilterProps {
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
}

export function CategoryFilter({ selectedCategory, onCategoryChange }: CategoryFilterProps) {

  return (
    <div className="space-y-3">
      <ScrollArea className="w-full whitespace-nowrap">
        <div className="flex gap-2 pb-2">
          <Button
            variant={selectedCategory === 'all' ? 'default' : 'outline'}
            size="sm"
            onClick={() => onCategoryChange('all')}
            className={cn(
              'flex-shrink-0 transition-all',
              selectedCategory === 'all'
                ? 'bg-blue-600 hover:bg-blue-700 text-white'
                : 'border-slate-700 text-slate-300 hover:text-white hover:bg-slate-800'
            )}
          >
            Todos
          </Button>
          
          {CATEGORIES.map((category) => {
            const Icon = categoryIcons[category.slug] || Home;
            return (
              <Button
                key={category.id}
                variant={selectedCategory === category.slug ? 'default' : 'outline'}
                size="sm"
                onClick={() => onCategoryChange(category.slug)}
                className={cn(
                  'flex-shrink-0 transition-all gap-1.5',
                  selectedCategory === category.slug
                    ? 'bg-blue-600 hover:bg-blue-700 text-white'
                    : 'border-slate-700 text-slate-300 hover:text-white hover:bg-slate-800'
                )}
              >
                <Icon className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">{category.name}</span>
                <span className="sm:hidden">{category.name.split(' ')[0]}</span>
              </Button>
            );
          })}
        </div>
        <ScrollBar orientation="horizontal" className="invisible" />
      </ScrollArea>
    </div>
  );
}
