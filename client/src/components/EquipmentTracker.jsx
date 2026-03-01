import { useState, useEffect } from 'react';
import { Search, X, Play, ChevronDown, ChevronUp, Dumbbell } from 'lucide-react';
import { equipmentAPI } from '../services/api';
import { Modal } from './Modal';

const CATEGORY_ORDER = [
  'Cardio Machine',
  'Strength Machine', 
  'Core Machine',
  'Free Weights',
  'Functional Training',
  'Stretching/Mobility',
  'Virtual Training Station'
];

export default function EquipmentTracker() {
  const [equipment, setEquipment] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedEquipment, setSelectedEquipment] = useState(null);
  const [expandedId, setExpandedId] = useState(null);

  useEffect(() => {
    fetchEquipment();
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchEquipment();
  }, [search, selectedCategory]);

  const fetchEquipment = async () => {
    try {
      const params = {};
      if (search) params.search = search;
      if (selectedCategory) params.category = selectedCategory;
      
      const res = await equipmentAPI.getAll(params);
      setEquipment(res.data.equipment);
    } catch (err) {
      console.error('Failed to fetch equipment:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await equipmentAPI.getCategories();
      const sorted = (res.data.categories || []).sort((a, b) => {
        return CATEGORY_ORDER.indexOf(a) - CATEGORY_ORDER.indexOf(b);
      });
      setCategories(sorted);
    } catch (err) {
      console.error('Failed to fetch categories:', err);
    }
  };

  const groupedEquipment = equipment.reduce((acc, item) => {
    if (!acc[item.category]) acc[item.category] = [];
    acc[item.category].push(item);
    return acc;
  }, {});

  const sortedCategories = Object.keys(groupedEquipment).sort((a, b) => {
    return CATEGORY_ORDER.indexOf(a) - CATEGORY_ORDER.indexOf(b);
  });

  return (
    <div className="flex flex-col gap-4">
      <div>
        <h2 className="font-display text-2xl font-bold text-white">Equipment</h2>
        <p className="text-sm text-silver mt-1">Learn how to use gym equipment</p>
      </div>

      <div className="flex flex-col gap-3">
        <div className="relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-silver" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search equipment or muscles..."
            className="w-full pl-9 pr-3 py-3 bg-graphite border border-steel rounded-xl text-white placeholder-silver/50 text-sm focus:border-lime focus:outline-none"
          />
          {search && (
            <button
              onClick={() => setSearch('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-silver hover:text-white"
            >
              <X size={14} />
            </button>
          )}
        </div>

        <div className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1 scrollbar-hide">
          <button
            onClick={() => setSelectedCategory('')}
            className={`flex-shrink-0 px-3 py-2 rounded-lg text-xs font-semibold transition-colors ${
              !selectedCategory
                ? 'bg-lime text-obsidian'
                : 'bg-steel text-silver hover:text-white'
            }`}
          >
            All
          </button>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`flex-shrink-0 px-3 py-2 rounded-lg text-xs font-semibold transition-colors ${
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
          <div className="w-8 h-8 border-2 border-lime border-t-transparent rounded-full animate-spin" />
        </div>
      ) : equipment.length === 0 ? (
        <div className="text-center py-12">
          <Dumbbell size={48} className="mx-auto text-steel mb-3" />
          <p className="text-silver">No equipment found</p>
          <p className="text-xs text-silver/60 mt-1">Try adjusting your search</p>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {sortedCategories.map((category) => (
            <div key={category} className="bg-graphite border border-steel rounded-2xl overflow-hidden">
              <button
                onClick={() => setExpandedId(expandedId === category ? null : category)}
                className="w-full px-4 py-3 flex items-center justify-between bg-muted/50"
              >
                <span className="font-display font-bold text-white text-sm">{category}</span>
                <span className="text-silver text-xs">{groupedEquipment[category].length} items</span>
              </button>
              
              {(expandedId === category || !expandedId) && (
                <div className="divide-y divide-steel/50">
                  {groupedEquipment[category].map((item) => (
                    <EquipmentCard 
                      key={item._id} 
                      item={item} 
                      onVideoClick={() => setSelectedEquipment(item)}
                    />
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      <VideoModal 
        equipment={selectedEquipment} 
        onClose={() => setSelectedEquipment(null)} 
      />
    </div>
  );
}

function EquipmentCard({ item, onVideoClick }) {
  return (
    <div className="p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-white">{item.machineName}</h3>
          
          {item.difficultyLevel && (
            <span className={`inline-block mt-1 px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
              item.difficultyLevel.includes('Beginner') 
                ? 'bg-success/15 text-success'
                : item.difficultyLevel.includes('Intermediate')
                  ? 'bg-lime/15 text-lime'
                  : 'bg-danger/15 text-danger'
            }`}>
              {item.difficultyLevel}
            </span>
          )}

          {item.primaryMuscles?.length > 0 && (
            <div className="mt-2">
              <p className="text-[10px] text-silver uppercase tracking-wider mb-1">Primary</p>
              <div className="flex flex-wrap gap-1">
                {item.primaryMuscles.map((muscle) => (
                  <span key={muscle} className="px-2 py-1 bg-lime/10 text-lime text-xs rounded">
                    {muscle}
                  </span>
                ))}
              </div>
            </div>
          )}

          {item.secondaryMuscles?.length > 0 && (
            <div className="mt-2">
              <p className="text-[10px] text-silver uppercase tracking-wider mb-1">Secondary</p>
              <div className="flex flex-wrap gap-1">
                {item.secondaryMuscles.map((muscle) => (
                  <span key={muscle} className="px-2 py-1 bg-steel text-silver text-xs rounded">
                    {muscle}
                  </span>
                ))}
              </div>
            </div>
          )}

          {item.movementPattern && (
            <p className="mt-2 text-xs text-silver">
              <span className="text-silver/60">Movement: </span>
              {item.movementPattern}
            </p>
          )}

          {item.notes && (
            <p className="mt-2 text-xs text-silver/70 line-clamp-2">{item.notes}</p>
          )}
        </div>

        {item.videoUrl && (
          <button
            onClick={onVideoClick}
            className="flex-shrink-0 w-10 h-10 rounded-full bg-lime flex items-center justify-center hover:bg-lime-dim transition-colors"
          >
            <Play size={16} className="text-obsidian ml-0.5" fill="currentColor" />
          </button>
        )}
      </div>
    </div>
  );
}

function VideoModal({ equipment, onClose }) {
  if (!equipment) return null;

  const videoId = equipment.videoUrl?.includes('youtube.com') 
    ? equipment.videoUrl.split('v=')[1]?.split('&')[0]
    : null;

  return (
    <Modal isOpen={!!equipment} onClose={onClose}>
      <div className="flex flex-col">
        <div className="p-4 border-b border-steel">
          <h3 className="font-display text-lg font-bold text-white">{equipment.machineName}</h3>
          <p className="text-xs text-silver mt-1">{equipment.category}</p>
        </div>
        
        <div className="aspect-video bg-obsidian">
          {videoId ? (
            <iframe
              src={`https://www.youtube.com/embed/${videoId}`}
              title={equipment.machineName}
              className="w-full h-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-silver">
              <p>Video not available</p>
            </div>
          )}
        </div>

        <div className="p-4">
          {equipment.notes && (
            <p className="text-sm text-silver">{equipment.notes}</p>
          )}
        </div>

        <div className="p-4 pt-0">
          <button
            onClick={onClose}
            className="w-full py-3 bg-steel text-chalk font-semibold rounded-xl hover:bg-iron transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </Modal>
  );
}
