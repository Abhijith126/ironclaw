import { useState, useEffect, useMemo, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Dumbbell } from 'lucide-react';
import { equipmentAPI } from '../../services/api';
import { PageHeader, Card, SearchInput, Loader, EmptyState } from '../../components/ui';
import { EQUIPMENT_CATEGORIES } from '../../constants';
import { groupBy } from '../../utils';
import EquipmentCard from './components/EquipmentCard';
import VideoModal from './components/VideoModal';
import type { Equipment } from './types';

const CATEGORY_ORDER = EQUIPMENT_CATEGORIES;

export default function EquipmentTracker() {
  const { t } = useTranslation();
  const [equipment, setEquipment] = useState<Equipment[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedEquipment, setSelectedEquipment] = useState<Equipment | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const debounceRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      const params: Record<string, string> = {};
      if (search) params.search = search;
      if (selectedCategory) params.category = selectedCategory;

      equipmentAPI.getAll(params)
        .then((res) => setEquipment(res.data?.equipment || []))
        .catch((err) => {
          console.error('Failed to fetch equipment:', err);
          setEquipment([]);
        })
        .finally(() => setLoading(false));
    }, 300);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [search, selectedCategory]);

  const fetchCategories = async () => {
    try {
      const res = await equipmentAPI.getCategories();
      const sorted = (res.data?.categories || []).sort((a: string, b: string) => {
        return CATEGORY_ORDER.indexOf(a) - CATEGORY_ORDER.indexOf(b);
      });
      setCategories(sorted);
    } catch (err) {
      console.error('Failed to fetch categories:', err);
      setCategories([]);
    }
  };

  const groupedEquipment = useMemo(() => groupBy(equipment, 'category'), [equipment]);

  const sortedCategories = useMemo(
    () =>
      Object.keys(groupedEquipment).sort(
        (a, b) => CATEGORY_ORDER.indexOf(a) - CATEGORY_ORDER.indexOf(b)
      ),
    [groupedEquipment]
  );

  return (
    <div className="flex flex-col gap-4">
      <PageHeader title={t('equipment.title')} subtitle={t('equipment.learnEquipment')} />

      <div className="flex flex-col gap-3">
        <SearchInput value={search} onChange={setSearch} placeholder={t('equipment.searchEquipment')} />

        <div className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1 scrollbar-hide">
          <button
            onClick={() => setSelectedCategory('')}
            className={`shrink-0 px-3 py-2 rounded-lg text-xs font-semibold transition-colors ${
              !selectedCategory ? 'bg-lime text-obsidian' : 'bg-steel text-silver hover:text-white'
            }`}
          >
            {t('equipment.all')}
          </button>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`shrink-0 px-3 py-2 rounded-lg text-xs font-semibold transition-colors ${
                selectedCategory === cat
                  ? 'bg-lime text-obsidian'
                  : 'bg-steel text-silver hover:text-white'
              }`}
            >
              {cat.replace(' Machine', '').replace(' Zone', '')}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader size="lg" />
        </div>
      ) : equipment.length === 0 ? (
        <EmptyState icon={Dumbbell} title={t('equipment.noEquipment')} message={t('equipment.noEquipmentMessage')} />
      ) : (
        <div className="flex flex-col gap-4">
          {sortedCategories.map((category) => (
            <Card key={category} variant="secondary" className="overflow-hidden p-0">
              <button
                onClick={() => setExpandedId(expandedId === category ? null : category)}
                className="w-full px-4 py-3 flex items-center justify-between bg-muted/50"
              >
                <span className="font-display font-bold text-white text-sm">{category}</span>
                <span className="text-silver text-xs">
                  {t('equipment.itemCount', { count: groupedEquipment[category].length })}
                </span>
              </button>

              {(expandedId === category || !expandedId) && (
                <div className="divide-y divide-steel/50">
                  {groupedEquipment[category].map((item: Equipment) => (
                    <EquipmentCard
                      key={item.id}
                      item={item}
                      onVideoClick={() => setSelectedEquipment(item)}
                    />
                  ))}
                </div>
              )}
            </Card>
          ))}
        </div>
      )}

      <VideoModal equipment={selectedEquipment} onClose={() => setSelectedEquipment(null)} />
    </div>
  );
}
