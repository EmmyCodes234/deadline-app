import { useState, useEffect, useCallback } from 'react';
import { supabase, getUserId } from '../lib/supabase';

export type CryptItemType = 'tombstone' | 'mausoleum';

export interface AltarNotes {
  synopsis: string;
  characters: Array<{ id: string; name: string; description: string }>;
  research: Array<{ id: string; title: string; url: string }>;
}

export interface Snapshot {
  id: string;
  content: string;
  timestamp: number;
  wordCount: number;
}

export interface CryptItem {
  id: string;
  type: CryptItemType;
  title: string;
  content: string; // Only used for tombstones
  lastModified: number;
  wordCount: number; // Only used for tombstones
  parentId: string | null;
  isExpanded?: boolean; // Only used for mausoleums
  children?: string[]; // IDs of child items
  notes?: AltarNotes; // Altar of Whispers notes
  order?: number; // For corkboard view ordering
  wordGoal?: number; // Word count goal for this item
  snapshots?: Snapshot[]; // Temporal Tombs (version history)
}

// Legacy Document interface for backward compatibility
export interface Document {
  id: string;
  title: string;
  content: string;
  lastModified: number;
  wordCount: number;
}

const CRYPT_KEY = 'deadline_crypt';

function generateId(): string {
  return `doc_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

// Helper function to calculate progress percentage
export function calculateProgress(item: CryptItem, allItems: CryptItem[]): number {
  if (!item.wordGoal || item.wordGoal === 0) return 0;
  
  let totalWords = item.wordCount;
  
  // For mausoleums, sum up children's word counts
  if (item.type === 'mausoleum' && item.children) {
    totalWords = item.children.reduce((sum, childId) => {
      const child = allItems.find(i => i.id === childId);
      if (child?.type === 'tombstone') {
        return sum + child.wordCount;
      } else if (child?.type === 'mausoleum') {
        // Recursively calculate for nested mausoleums
        return sum + calculateTotalWords(child, allItems);
      }
      return sum;
    }, 0);
  }
  
  return Math.min((totalWords / item.wordGoal) * 100, 100);
}

// Helper to calculate total words for a mausoleum and its descendants
function calculateTotalWords(item: CryptItem, allItems: CryptItem[]): number {
  if (item.type === 'tombstone') {
    return item.wordCount;
  }
  
  if (item.type === 'mausoleum' && item.children) {
    return item.children.reduce((sum, childId) => {
      const child = allItems.find(i => i.id === childId);
      if (child) {
        return sum + calculateTotalWords(child, allItems);
      }
      return sum;
    }, 0);
  }
  
  return 0;
}

export function useCrypt() {
  const [items, setItems] = useState<CryptItem[]>([]);
  const [currentDocId, setCurrentDocId] = useState<string | null>(null);

  // Initialize from Supabase/localStorage
  useEffect(() => {
    const loadItems = async () => {
      const userId = getUserId();
      
      try {
        // Try loading from Supabase first
        const { data, error } = await supabase
          .from('crypt_documents')
          .select('*')
          .eq('user_id', userId)
          .order('created_at', { ascending: true });

        if (data && data.length > 0 && !error) {
          // Convert Supabase format to CryptItem format
          const items: CryptItem[] = data.map(doc => ({
            id: doc.doc_id,
            type: 'tombstone' as CryptItemType,
            title: doc.title,
            content: doc.content,
            lastModified: new Date(doc.updated_at).getTime(),
            wordCount: doc.word_count,
            parentId: null,
            children: [],
          }));
          
          setItems(items);
          setCurrentDocId(items[0].id);
          // Backup to localStorage
          localStorage.setItem(CRYPT_KEY, JSON.stringify(items));
          return;
        }
      } catch (error) {
        // Error loading from Supabase
      }

      // Fallback to localStorage
      const saved = localStorage.getItem(CRYPT_KEY);
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          // Migrate old documents to new structure
          if (parsed.length > 0 && !parsed[0].type) {
            const migrated: CryptItem[] = parsed.map((doc: Document) => ({
              id: doc.id,
              type: 'tombstone' as CryptItemType,
              title: doc.title,
              content: doc.content,
              lastModified: doc.lastModified,
              wordCount: doc.wordCount,
              parentId: null,
              children: [],
            }));
            setItems(migrated);
            setCurrentDocId(migrated[0].id);
          } else {
            setItems(parsed);
            const firstTombstone = parsed.find((item: CryptItem) => item.type === 'tombstone');
            if (firstTombstone) {
              setCurrentDocId(firstTombstone.id);
            }
          }
        } catch (error) {
          // Failed to load documents
        }
      } else {
        // Create initial document
        const initialDoc: CryptItem = {
          id: generateId(),
          type: 'tombstone',
          title: 'Untitled Haunting',
          content: '',
          lastModified: Date.now(),
          wordCount: 0,
          parentId: null,
          children: [],
        };
        setItems([initialDoc]);
        setCurrentDocId(initialDoc.id);
      }
    };

    loadItems();
  }, []);

  // Save to localStorage and Supabase whenever items change
  useEffect(() => {
    if (items.length > 0) {
      // Save to localStorage immediately
      localStorage.setItem(CRYPT_KEY, JSON.stringify(items));
      
      // Save to Supabase asynchronously (only tombstones with content)
      const userId = getUserId();
      const tombstones = items.filter(item => item.type === 'tombstone');
      
      tombstones.forEach(item => {
        void supabase
          .from('crypt_documents')
          .upsert({
            user_id: userId,
            doc_id: item.id,
            title: item.title,
            content: item.content,
            word_count: item.wordCount,
            updated_at: new Date(item.lastModified).toISOString(),
          }, {
            onConflict: 'user_id,doc_id'
          });
      });
    }
  }, [items]);

  const createDoc = useCallback((parentId: string | null = null) => {
    const newDoc: CryptItem = {
      id: generateId(),
      type: 'tombstone',
      title: 'Untitled Haunting',
      content: '',
      lastModified: Date.now(),
      wordCount: 0,
      parentId,
      children: [],
      order: Date.now(),
    };
    
    setItems((prev) => {
      // If has parent, update parent's children and ensure parent is expanded
      if (parentId) {
        const updatedItems = prev.map((item) =>
          item.id === parentId && item.children
            ? { ...item, children: [...item.children, newDoc.id], isExpanded: true }
            : item
        );
        return [newDoc, ...updatedItems];
      }
      return [newDoc, ...prev];
    });
    
    setCurrentDocId(newDoc.id);
    return newDoc.id;
  }, []);

  const createMausoleum = useCallback((title: string = 'Untitled Mausoleum', parentId: string | null = null) => {
    const newMausoleum: CryptItem = {
      id: generateId(),
      type: 'mausoleum',
      title,
      content: '',
      lastModified: Date.now(),
      wordCount: 0,
      parentId,
      isExpanded: true,
      children: [],
      order: Date.now(),
    };
    
    setItems((prev) => {
      const updated = [newMausoleum, ...prev];
      // If has parent, add to parent's children
      if (parentId) {
        return updated.map((item) =>
          item.id === parentId && item.children
            ? { ...item, children: [...item.children, newMausoleum.id] }
            : item
        );
      }
      return updated;
    });
    
    return newMausoleum.id;
  }, []);

  const deleteDoc = useCallback((id: string) => {
    setItems((prev) => {
      const itemToDelete = prev.find((item) => item.id === id);
      if (!itemToDelete) return prev;
      
      // Collect all IDs to delete (item + all descendants)
      const idsToDelete = new Set<string>([id]);
      const collectDescendants = (itemId: string) => {
        const item = prev.find((i) => i.id === itemId);
        if (item?.children) {
          item.children.forEach((childId) => {
            idsToDelete.add(childId);
            collectDescendants(childId);
          });
        }
      };
      collectDescendants(id);
      
      // Remove from parent's children if has parent
      let filtered = prev.map((item) => {
        if (item.children?.includes(id)) {
          return { ...item, children: item.children.filter((childId) => childId !== id) };
        }
        return item;
      });
      
      // Filter out all items to delete
      filtered = filtered.filter((item) => !idsToDelete.has(item.id));
      
      // If deleting current doc, switch to first available tombstone
      if (id === currentDocId && filtered.length > 0) {
        const firstTombstone = filtered.find((item) => item.type === 'tombstone');
        setCurrentDocId(firstTombstone?.id || null);
      }
      
      return filtered;
    });
  }, [currentDocId]);

  const selectDoc = useCallback((id: string) => {
    setCurrentDocId(id);
  }, []);

  const updateTitle = useCallback((id: string, newTitle: string) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id
          ? { ...item, title: newTitle, lastModified: Date.now() }
          : item
      )
    );
  }, []);

  const updateContent = useCallback((id: string, content: string) => {
    const wordCount = content.trim().split(/\s+/).filter((w) => w.length > 0).length;
    setItems((prev) =>
      prev.map((item) =>
        item.id === id
          ? { ...item, content, wordCount, lastModified: Date.now() }
          : item
      )
    );
  }, []);

  const toggleExpand = useCallback((id: string) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id && item.type === 'mausoleum'
          ? { ...item, isExpanded: !item.isExpanded }
          : item
      )
    );
  }, []);

  const updateNotes = useCallback((id: string, notes: Partial<AltarNotes>) => {
    setItems((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const currentNotes = item.notes || { synopsis: '', characters: [], research: [] };
          return {
            ...item,
            notes: { ...currentNotes, ...notes },
            lastModified: Date.now(),
          };
        }
        return item;
      })
    );
  }, []);

  const addCharacter = useCallback((docId: string, name: string, description: string) => {
    setItems((prev) =>
      prev.map((item) => {
        if (item.id === docId) {
          const currentNotes = item.notes || { synopsis: '', characters: [], research: [] };
          const newCharacter = {
            id: `char_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            name,
            description,
          };
          return {
            ...item,
            notes: {
              ...currentNotes,
              characters: [...currentNotes.characters, newCharacter],
            },
            lastModified: Date.now(),
          };
        }
        return item;
      })
    );
  }, []);

  const updateCharacter = useCallback((docId: string, charId: string, name: string, description: string) => {
    setItems((prev) =>
      prev.map((item) => {
        if (item.id === docId && item.notes) {
          return {
            ...item,
            notes: {
              ...item.notes,
              characters: item.notes.characters.map((char) =>
                char.id === charId ? { ...char, name, description } : char
              ),
            },
            lastModified: Date.now(),
          };
        }
        return item;
      })
    );
  }, []);

  const deleteCharacter = useCallback((docId: string, charId: string) => {
    setItems((prev) =>
      prev.map((item) => {
        if (item.id === docId && item.notes) {
          return {
            ...item,
            notes: {
              ...item.notes,
              characters: item.notes.characters.filter((char) => char.id !== charId),
            },
            lastModified: Date.now(),
          };
        }
        return item;
      })
    );
  }, []);

  const addResearch = useCallback((docId: string, title: string, url: string) => {
    setItems((prev) =>
      prev.map((item) => {
        if (item.id === docId) {
          const currentNotes = item.notes || { synopsis: '', characters: [], research: [] };
          const newResearch = {
            id: `research_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            title,
            url,
          };
          return {
            ...item,
            notes: {
              ...currentNotes,
              research: [...currentNotes.research, newResearch],
            },
            lastModified: Date.now(),
          };
        }
        return item;
      })
    );
  }, []);

  const updateResearch = useCallback((docId: string, researchId: string, title: string, url: string) => {
    setItems((prev) =>
      prev.map((item) => {
        if (item.id === docId && item.notes) {
          return {
            ...item,
            notes: {
              ...item.notes,
              research: item.notes.research.map((res) =>
                res.id === researchId ? { ...res, title, url } : res
              ),
            },
            lastModified: Date.now(),
          };
        }
        return item;
      })
    );
  }, []);

  const deleteResearch = useCallback((docId: string, researchId: string) => {
    setItems((prev) =>
      prev.map((item) => {
        if (item.id === docId && item.notes) {
          return {
            ...item,
            notes: {
              ...item.notes,
              research: item.notes.research.filter((res) => res.id !== researchId),
            },
            lastModified: Date.now(),
          };
        }
        return item;
      })
    );
  }, []);

  const reorderCryptItems = useCallback((reorderedItems: CryptItem[]) => {
    // Update order property based on new array position
    const itemsWithNewOrder = reorderedItems.map((item, index) => ({
      ...item,
      order: index,
    }));
    setItems(itemsWithNewOrder);
  }, []);

  const updateWordGoal = useCallback((id: string, goal: number) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id
          ? { ...item, wordGoal: goal, lastModified: Date.now() }
          : item
      )
    );
  }, []);

  const takeSnapshot = useCallback((docId: string) => {
    setItems((prev) =>
      prev.map((item) => {
        if (item.id === docId && item.type === 'tombstone') {
          const snapshot: Snapshot = {
            id: `snapshot_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            content: item.content,
            timestamp: Date.now(),
            wordCount: item.wordCount,
          };
          return {
            ...item,
            snapshots: [...(item.snapshots || []), snapshot],
            lastModified: Date.now(),
          };
        }
        return item;
      })
    );
  }, []);

  const revertToSnapshot = useCallback((docId: string, snapshotId: string) => {
    setItems((prev) =>
      prev.map((item) => {
        if (item.id === docId && item.type === 'tombstone' && item.snapshots) {
          const snapshot = item.snapshots.find((s) => s.id === snapshotId);
          if (snapshot) {
            const wordCount = snapshot.content.trim().split(/\s+/).filter((w) => w.length > 0).length;
            return {
              ...item,
              content: snapshot.content,
              wordCount,
              lastModified: Date.now(),
            };
          }
        }
        return item;
      })
    );
  }, []);

  const deleteSnapshot = useCallback((docId: string, snapshotId: string) => {
    setItems((prev) =>
      prev.map((item) => {
        if (item.id === docId && item.snapshots) {
          return {
            ...item,
            snapshots: item.snapshots.filter((s) => s.id !== snapshotId),
            lastModified: Date.now(),
          };
        }
        return item;
      })
    );
  }, []);

  const reorderItems = useCallback((draggedId: string, targetId: string, position: 'before' | 'after' | 'inside') => {
    setItems((prev) => {
      const draggedItem = prev.find((item) => item.id === draggedId);
      const targetItem = prev.find((item) => item.id === targetId);
      
      if (!draggedItem || !targetItem) {
        return prev;
      }
      
      // Can't drag into itself
      if (draggedId === targetId) return prev;
      

      
      // Step 1: Remove dragged item from its current parent's children
      let updated = prev.map((item) => {
        if (item.children?.includes(draggedId)) {
          return { ...item, children: item.children.filter((id) => id !== draggedId) };
        }
        return item;
      });
      
      // Step 2: Update based on position
      if (position === 'inside' && targetItem.type === 'mausoleum') {
        // Move inside target mausoleum
        updated = updated.map((item) => {
          if (item.id === draggedId) {
            return { ...item, parentId: targetId };
          }
          if (item.id === targetId) {
            const newChildren = [...(item.children || []), draggedId];
            return { ...item, children: newChildren, isExpanded: true };
          }
          return item;
        });
      } else {
        // Move before/after target (same parent as target)
        const newParentId = targetItem.parentId;

        
        // Update dragged item's parentId
        updated = updated.map((item) => {
          if (item.id === draggedId) {
            return { ...item, parentId: newParentId };
          }
          return item;
        });
        
        // Add to parent's children array at correct position
        if (newParentId !== null && newParentId !== undefined) {
          // Has a parent - update parent's children array
          updated = updated.map((item) => {
            if (item.id === newParentId) {
              const targetIndex = (item.children || []).indexOf(targetId);
              if (targetIndex === -1) return item;
              
              const newChildren = [...(item.children || [])];
              const insertIndex = position === 'before' ? targetIndex : targetIndex + 1;
              newChildren.splice(insertIndex, 0, draggedId);
              return { ...item, children: newChildren };
            }
            return item;
          });
        } else {
          // Root level - reorder in main array
          const draggedIndex = updated.findIndex((item) => item.id === draggedId);
          const targetIndex = updated.findIndex((item) => item.id === targetId);
          
          if (draggedIndex !== -1 && targetIndex !== -1) {
            // Remove dragged item
            const [removed] = updated.splice(draggedIndex, 1);
            // Find new target index (may have shifted)
            const newTargetIndex = updated.findIndex((item) => item.id === targetId);
            // Insert at correct position
            const insertIndex = position === 'before' ? newTargetIndex : newTargetIndex + 1;
            updated.splice(insertIndex, 0, removed);
          }
        }
      }
      
      return updated;
    });
  }, []);

  const currentDoc = items.find((item) => item.id === currentDocId && item.type === 'tombstone') || null;
  
  // Calculate total project word count (only tombstones)
  const totalProjectWords = items
    .filter((item) => item.type === 'tombstone')
    .reduce((sum, item) => sum + item.wordCount, 0);

  // Legacy documents array for backward compatibility
  const documents = items
    .filter((item) => item.type === 'tombstone')
    .map((item) => ({
      id: item.id,
      title: item.title,
      content: item.content,
      lastModified: item.lastModified,
      wordCount: item.wordCount,
    }));

  return {
    items,
    documents, // Legacy support
    currentDoc,
    currentDocId,
    totalProjectWords,
    createDoc,
    createMausoleum,
    deleteDoc,
    selectDoc,
    updateTitle,
    updateContent,
    toggleExpand,
    reorderItems,
    reorderCryptItems,
    updateNotes,
    addCharacter,
    updateCharacter,
    deleteCharacter,
    addResearch,
    updateResearch,
    deleteResearch,
    updateWordGoal,
    takeSnapshot,
    revertToSnapshot,
    deleteSnapshot,
  };
}
