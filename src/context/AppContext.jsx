import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  MOCK_STUDENTS, 
  MOCK_LISTINGS, 
  MOCK_CONVERSATIONS, 
  MOCK_REVIEWS, 
  MOCK_COLLEGES 
} from '../data/mockData';
import { supabase, isSupabaseConfigured, isThaparEmail } from '../lib/supabase';
import confetti from 'canvas-confetti';

const AppContext = createContext();

// Helper to convert any string ID (e.g. 'usr_1', 'prod_101') to a valid PostgreSQL UUID format
const toUuid = (idStr) => {
  if (!idStr) return '00000000-0000-4000-8000-000000000001';
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  if (uuidRegex.test(idStr)) return idStr;
  let hex = '';
  for (let i = 0; i < idStr.length; i++) {
    hex += idStr.charCodeAt(i).toString(16);
  }
  hex = hex.padEnd(32, '0').slice(0, 32);
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-4${hex.slice(13, 16)}-8${hex.slice(17, 20)}-${hex.slice(20, 32)}`;
};

export const AppProvider = ({ children }) => {
  // Current Authenticated / Active Student User
  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem('notolx_current_user');
    return saved ? JSON.parse(saved) : MOCK_STUDENTS[0];
  });

  const [allStudents, setAllStudents] = useState(() => {
    const saved = localStorage.getItem('notolx_students');
    return saved ? JSON.parse(saved) : MOCK_STUDENTS;
  });

  // Listings State
  const [listings, setListings] = useState(() => {
    const saved = localStorage.getItem('notolx_listings');
    return saved ? JSON.parse(saved) : MOCK_LISTINGS;
  });

  // Conversations & Messages State
  const [conversations, setConversations] = useState(() => {
    const saved = localStorage.getItem('notolx_conversations');
    return saved ? JSON.parse(saved) : MOCK_CONVERSATIONS;
  });

  // Reviews State
  const [reviews, setReviews] = useState(() => {
    const saved = localStorage.getItem('notolx_reviews');
    return saved ? JSON.parse(saved) : MOCK_REVIEWS;
  });

  // Theme State (Light Mode Default vs Dark Gothic Noir)
  const [theme, setTheme] = useState(() => {
    const saved = localStorage.getItem('notolx_theme');
    return saved || 'light';
  });

  const toggleTheme = () => {
    const nextTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(nextTheme);
    localStorage.setItem('notolx_theme', nextTheme);
    document.documentElement.setAttribute('data-theme', nextTheme);
  };

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  // Filter & Search State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedCondition, setSelectedCondition] = useState('all');
  const [selectedCollege, setSelectedCollege] = useState(MOCK_COLLEGES[0]);
  const [priceRange, setPriceRange] = useState({ min: 0, max: 50000 });
  const [sortBy, setSortBy] = useState('newest'); // 'newest', 'price-low', 'price-high', 'popular'

  // Modal Control States
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isCreateListingOpen, setIsCreateListingOpen] = useState(false);
  const [isMyListingsOpen, setIsMyListingsOpen] = useState(false);
  const [editingListing, setEditingListing] = useState(null);
  const [activeProductDetail, setActiveProductDetail] = useState(null);
  const [activeChat, setActiveChat] = useState(() => {
    const savedId = localStorage.getItem('notolx_active_chat_id');
    const savedConvs = localStorage.getItem('notolx_conversations');
    if (savedId && savedConvs) {
      try {
        const convs = JSON.parse(savedConvs);
        return convs.find(c => c.id === savedId) || null;
      } catch (e) {
        return null;
      }
    }
    return null;
  });
  const [reviewPendingProduct, setReviewPendingProduct] = useState(null);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  // Toast System
  const [toasts, setToasts] = useState([]);

  const addToast = (message, type = 'info') => {
    const id = Date.now() + Math.random();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4000);
  };

  // View Mode State (Landing vs Marketplace)
  const [viewMode, setViewModeState] = useState(() => {
    const saved = localStorage.getItem('notolx_view_mode');
    return saved || 'landing';
  });

  const setViewMode = (mode) => {
    setViewModeState(mode);
    localStorage.setItem('notolx_view_mode', mode);
  };

  // Sync state to LocalStorage for persistence across reloads
  useEffect(() => {
    localStorage.setItem('notolx_current_user', JSON.stringify(currentUser));
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem('notolx_listings', JSON.stringify(listings));
  }, [listings]);

  useEffect(() => {
    localStorage.setItem('notolx_conversations', JSON.stringify(conversations));
    if (activeChat) {
      localStorage.setItem('notolx_active_chat_id', activeChat.id);
      const updatedActive = conversations.find(c => c.id === activeChat.id);
      if (updatedActive && updatedActive.messages.length !== activeChat.messages.length) {
        setActiveChat(updatedActive);
      }
    } else {
      localStorage.removeItem('notolx_active_chat_id');
    }
  }, [conversations, activeChat]);

  // Live Real-Time Message Polling Engine (Polls for live incoming messages when active chat modal is open)
  // Dynamic API Base URL for Cross-Device / Cross-Network Server connections
  const getApiBaseUrl = () => {
    if (import.meta.env.VITE_API_URL) return import.meta.env.VITE_API_URL;
    if (typeof window !== 'undefined' && window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1') {
      return window.location.origin;
    }
    return 'http://localhost:5000';
  };

  // Live Real-Time Message Polling Engine (Polls for live incoming messages when active chat modal is open)
  useEffect(() => {
    if (!activeChat) return;

    const syncLiveMessages = async () => {
      // 1. Fetch from Supabase if active
      if (isSupabaseConfigured && supabase) {
        try {
          const { data: dbMsgs } = await supabase
            .from('messages')
            .select('*')
            .eq('conversation_id', activeChat.id)
            .order('created_at', { ascending: true });

          if (dbMsgs && dbMsgs.length > 0) {
            setConversations(prev => prev.map(c => {
              if (c.id === activeChat.id) {
                return { 
                  ...c, 
                  messages: dbMsgs, 
                  last_message: dbMsgs[dbMsgs.length - 1].content,
                  updated_at: dbMsgs[dbMsgs.length - 1].created_at || c.updated_at
                };
              }
              return c;
            }));
          }
        } catch (err) {
          console.warn('Supabase cross-device chat sync error:', err);
        }
      } else {
        // 2. Fetch from Express backend server if available
        try {
          const apiUrl = `${getApiBaseUrl()}/api/conversations`;
          const res = await fetch(apiUrl);
          if (res.ok) {
            const data = await res.json();
            if (data.conversations && data.conversations.length > 0) {
              setConversations(prev => {
                const merged = [...prev];
                data.conversations.forEach(remote => {
                  const idx = merged.findIndex(c => c.id === remote.id);
                  if (idx !== -1) {
                    if (remote.messages.length > merged[idx].messages.length) {
                      merged[idx] = remote;
                    }
                  } else {
                    merged.unshift(remote);
                  }
                });
                return merged;
              });
            }
          }
        } catch (err) {
          // Fallback to storage sync
        }
      }
    };

    const interval = setInterval(syncLiveMessages, 1000);
    return () => clearInterval(interval);
  }, [activeChat]);

  useEffect(() => {
    localStorage.setItem('notolx_reviews', JSON.stringify(reviews));
  }, [reviews]);

  // Real-Time Cross-Tab Live Messaging & Listing Listener (Syncs buyer/seller chat & items instantly across browser tabs/windows)
  useEffect(() => {
    const handleStorageSync = (e) => {
      if (e.key === 'notolx_conversations' && e.newValue) {
        try {
          const updatedConvs = JSON.parse(e.newValue);
          setConversations(updatedConvs);
        } catch (err) {
          console.error('Realtime chat sync parse error:', err);
        }
      }
      if (e.key === 'notolx_listings' && e.newValue) {
        try {
          const updatedListings = JSON.parse(e.newValue);
          setListings(updatedListings);
        } catch (err) {
          console.error('Realtime listings sync parse error:', err);
        }
      }
    };

    window.addEventListener('storage', handleStorageSync);
    return () => window.removeEventListener('storage', handleStorageSync);
  }, []);

  // Supabase Auth Listener for Google OAuth (@thapar.edu domain policy enforcement & automatic redirection)
  useEffect(() => {
    if (!isSupabaseConfigured || !supabase) return;

    // Check initial active session on load
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        const userEmail = session.user.email || '';
        if (isThaparEmail(userEmail)) {
          handleLogin(userEmail, session.user);
        }
      }
    });

    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      if ((event === 'SIGNED_IN' || event === 'INITIAL_SESSION' || event === 'TOKEN_REFRESHED') && session?.user) {
        const userEmail = session.user.email || '';
        if (!isThaparEmail(userEmail)) {
          await supabase.auth.signOut();
          addToast('Access Denied: Only @thapar.edu email accounts are permitted on notOLX.', 'error');
          setIsAuthOpen(true);
          setViewMode('landing');
        } else {
          handleLogin(userEmail, session.user);
          setViewMode('marketplace');
        }
      } else if (event === 'SIGNED_OUT') {
        setCurrentUser(null);
        localStorage.removeItem('notolx_current_user');
      }
    });

    return () => {
      authListener?.subscription?.unsubscribe();
    };
  }, []);

  // Live Supabase Integration & Cross-Device Realtime Subscriptions (Active when .env contains credentials)
  useEffect(() => {
    if (!isSupabaseConfigured || !supabase) return;

    const fetchSupabaseData = async () => {
      try {
        const { data: dbListings } = await supabase
          .from('listings')
          .select('*')
          .order('created_at', { ascending: false });

        if (dbListings && dbListings.length > 0) {
          setListings(prev => {
            const dbIds = new Set(dbListings.map(item => item.id));
            const localOnly = prev.filter(item => !dbIds.has(item.id) && !dbIds.has(toUuid(item.id)));
            return [...dbListings, ...localOnly];
          });
        }

        const { data: dbReviews } = await supabase.from('reviews').select('*');
        if (dbReviews && dbReviews.length > 0) {
          setReviews(dbReviews);
        }

        // Fetch Conversations & Messages for Cross-Device Synchronization
        const { data: dbConvs } = await supabase.from('conversations').select('*');
        const { data: dbMsgs } = await supabase.from('messages').select('*').order('created_at', { ascending: true });

        if (dbConvs && dbConvs.length > 0) {
          const structuredConvs = dbConvs.map(conv => {
            const convMsgs = (dbMsgs || []).filter(m => m.conversation_id === conv.id);
            return {
              ...conv,
              messages: convMsgs.length > 0 ? convMsgs : [
                {
                  id: `msg_init_${conv.id}`,
                  sender_id: conv.buyer_id,
                  receiver_id: conv.seller_id,
                  content: conv.last_message || 'Hi, interested in this item!',
                  status: 'sent',
                  created_at: conv.created_at || new Date().toISOString()
                }
              ]
            };
          });

          setConversations(prev => {
            const merged = [...prev];
            structuredConvs.forEach(remote => {
              const idx = merged.findIndex(c => c.id === remote.id);
              if (idx !== -1) {
                merged[idx] = remote;
              } else {
                merged.unshift(remote);
              }
            });
            return merged;
          });
        }
      } catch (err) {
        console.warn('Supabase cross-device fetch warning, fallback to sandbox store:', err);
      }
    };

    fetchSupabaseData();

    // Supabase Realtime subscription for cross-device live messages & listings
    const channel = supabase
      .channel('public:notolx_realtime')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages' }, payload => {
        const newMsg = payload.new;
        setConversations(prev => prev.map(c => {
          if (c.id === newMsg.conversation_id) {
            if (c.messages.some(m => m.id === newMsg.id)) return c;
            return {
              ...c,
              last_message: newMsg.content,
              updated_at: newMsg.created_at || new Date().toISOString(),
              messages: [...c.messages, newMsg]
            };
          }
          return c;
        }));

        if (activeChat && activeChat.id === newMsg.conversation_id) {
          setActiveChat(prev => {
            if (prev.messages.some(m => m.id === newMsg.id)) return prev;
            return {
              ...prev,
              last_message: newMsg.content,
              messages: [...prev.messages, newMsg]
            };
          });
        }
      })
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'conversations' }, payload => {
        const newConv = payload.new;
        setConversations(prev => {
          if (prev.some(c => c.id === newConv.id)) return prev;
          return [{ ...newConv, messages: newConv.messages || [] }, ...prev];
        });
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'listings' }, payload => {
        if (payload.eventType === 'INSERT') {
          setListings(prev => {
            const exists = prev.some(l => l.id === payload.new.id);
            return exists ? prev : [payload.new, ...prev];
          });
        } else if (payload.eventType === 'UPDATE') {
          setListings(prev => prev.map(l => l.id === payload.new.id ? payload.new : l));
        } else if (payload.eventType === 'DELETE') {
          setListings(prev => prev.filter(l => l.id !== payload.old.id));
        }
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [activeChat]);

  // Persona Switcher (For testing as Buyer or Seller)
  const switchPersona = (studentId) => {
    const student = allStudents.find(s => s.id === studentId);
    if (student) {
      setCurrentUser(student);
      addToast(`Switched active profile to ${student.full_name}`, 'success');
    }
  };

  // Authentication Handlers
  const signInWithGoogle = async () => {
    if (isSupabaseConfigured && supabase) {
      try {
        const { error } = await supabase.auth.signInWithOAuth({
          provider: 'google',
          options: {
            redirectTo: window.location.origin,
            queryParams: {
              hd: 'thapar.edu' // Google Hosted Domain restriction strictly for @thapar.edu
            }
          }
        });
        if (error) {
          addToast(`Google Sign-In Error: ${error.message}`, 'error');
        }
      } catch (err) {
        addToast(`Google Auth Exception: ${err.message}`, 'error');
      }
    } else {
      setIsAuthOpen(true);
    }
  };

  const handleLogout = async () => {
    try {
      if (isSupabaseConfigured && supabase) {
        await supabase.auth.signOut();
      }
    } catch (err) {
      console.error('Supabase signout error:', err);
    }
    setCurrentUser(null);
    localStorage.removeItem('notolx_current_user');
    localStorage.setItem('notolx_view_mode', 'landing');
    addToast('Signed out of Thapar Marketplace.', 'info');
  };

  const handleDeleteAccount = async () => {
    if (!currentUser) return;
    const userId = currentUser.id;

    try {
      if (isSupabaseConfigured && supabase) {
        await supabase.from('listings').delete().eq('seller_id', userId);
        await supabase.from('profiles').delete().eq('id', userId);
        await supabase.auth.signOut();
      }
    } catch (err) {
      console.error('Supabase account deletion error:', err);
    }

    setAllStudents(prev => prev.filter(s => s.id !== userId));
    setListings(prev => prev.filter(l => l.seller_id !== userId));
    setConversations(prev => prev.filter(c => c.buyer_id !== userId && c.seller_id !== userId));
    
    setCurrentUser(null);
    setIsProfileOpen(false);
    localStorage.removeItem('notolx_current_user');
    setViewMode('landing');
    addToast('Your student account and active listings have been permanently deleted.', 'info');
  };

  const handleLogin = async (email, sessionUser = null) => {
    const cleanEmail = (email || '').trim().toLowerCase();

    if (!cleanEmail.endsWith('@thapar.edu')) {
      addToast('Access Denied: Only @thapar.edu email accounts are allowed.', 'error');
      return false;
    }

    const userId = sessionUser ? sessionUser.id : toUuid(`usr_${cleanEmail}`);
    const namePart = cleanEmail.split('@')[0];
    const formattedName = sessionUser?.user_metadata?.full_name || namePart.split('.').map(s => s.charAt(0).toUpperCase() + s.slice(1)).join(' ');

    const studentProfile = {
      id: userId,
      email: cleanEmail,
      full_name: formattedName || 'Thapar Student',
      college_name: 'Thapar Institute of Engineering & Technology',
      college_id: `TU-${userId.substring(0, 4).toUpperCase()}`,
      avatar_url: sessionUser?.user_metadata?.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${namePart}`,
      dorm_block: 'Thapar Hostel',
      major: 'Engineering Student',
      rating_avg: 5.0,
      rating_count: 0,
      verified: true,
      joined_date: 'Just now'
    };

    setAllStudents(prev => {
      const idx = prev.findIndex(s => s.email.toLowerCase() === cleanEmail);
      if (idx !== -1) {
        const copy = [...prev];
        copy[idx] = { ...copy[idx], ...studentProfile };
        return copy;
      }
      return [...prev, studentProfile];
    });

    setCurrentUser(studentProfile);
    setIsAuthOpen(false);
    localStorage.setItem('notolx_view_mode', 'marketplace');
    addToast(`Welcome, ${studentProfile.full_name}! Verified @thapar.edu Student`, 'success');

    // Upsert into Supabase public.profiles table to satisfy foreign key & RLS policies
    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.from('profiles').upsert({
          id: userId,
          email: cleanEmail,
          full_name: studentProfile.full_name,
          college_name: studentProfile.college_name,
          college_id: studentProfile.college_id,
          avatar_url: studentProfile.avatar_url,
          dorm_block: studentProfile.dorm_block
        });
      } catch (err) {
        console.warn('Supabase profile upsert notice:', err);
      }
    }

    return true;
  };

  // Live Marketplace Listings Synchronization (Syncs listings across devices/users)
  useEffect(() => {
    const fetchLiveListings = async () => {
      if (isSupabaseConfigured && supabase) return;

      try {
        const apiUrl = `${getApiBaseUrl()}/api/listings`;
        const res = await fetch(apiUrl);
        if (res.ok) {
          const data = await res.json();
          if (data.listings && data.listings.length > 0) {
            setListings(prev => {
              const merged = [...prev];
              data.listings.forEach(remote => {
                const idx = merged.findIndex(l => l.id === remote.id);
                if (idx !== -1) {
                  merged[idx] = { ...merged[idx], ...remote };
                } else {
                  merged.unshift(remote);
                }
              });
              return merged;
            });
          }
        }
      } catch (err) {
        // Fallback to local storage
      }
    };

    fetchLiveListings();
    const interval = setInterval(fetchLiveListings, 3000);
    return () => clearInterval(interval);
  }, []);

  // Listing Handlers (Create, Edit, Delete, Status Change)
  const addListing = async (listingData) => {
    if (!currentUser || !currentUser.id) {
      addToast('Authentication required. Please sign in with your @thapar.edu email to list items.', 'error');
      setIsAuthOpen(true);
      return false;
    }

    const rawId = `prod_${Date.now()}`;
    const sellerId = currentUser.id;

    const newListing = {
      id: rawId,
      seller_id: sellerId,
      title: listingData.title,
      description: listingData.description,
      price: parseFloat(listingData.price),
      original_price: listingData.original_price ? parseFloat(listingData.original_price) : null,
      category: listingData.category,
      condition: listingData.condition,
      images: listingData.images && listingData.images.length > 0 
        ? listingData.images 
        : ['https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?auto=format&fit=crop&w=800&q=80'],
      campus_location: listingData.campus_location || `${currentUser?.dorm_block || 'Hostel'} / Main Quad`,
      status: 'available',
      views_count: 1,
      created_at: new Date().toISOString()
    };

    setListings(prev => [newListing, ...prev]);
    setIsCreateListingOpen(false);
    setSelectedCategory('all');
    setSelectedCondition('all');
    setSearchQuery('');
    setPriceRange({ min: 0, max: 50000 });
    setViewMode('marketplace');
    addToast('Item listed on campus marketplace!', 'success');

    // Sync to Supabase cloud if active
    if (isSupabaseConfigured && supabase) {
      try {
        const supabasePayload = {
          ...newListing,
          id: toUuid(rawId),
          seller_id: toUuid(sellerId)
        };
        const { error } = await supabase.from('listings').insert([supabasePayload]);
        if (error) {
          console.warn('Supabase insert notice:', error.message);
        }
      } catch (err) {
        console.warn('Supabase insert error:', err);
      }
    }

    // Always sync to Express backend server for cross-device/user access
    try {
      await fetch(`${getApiBaseUrl()}/api/listings`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newListing)
      });
    } catch (err) {
      console.warn('Express listing post error:', err);
    }
  };

  const updateListing = async (id, updatedFields) => {
    setListings(prev => prev.map(item => item.id === id ? { ...item, ...updatedFields } : item));
    setEditingListing(null);
    if (activeProductDetail && activeProductDetail.id === id) {
      setActiveProductDetail(prev => ({ ...prev, ...updatedFields }));
    }
    addToast('Listing updated successfully', 'info');

    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.from('listings').update(updatedFields).eq('id', toUuid(id));
      } catch (err) {
        console.warn('Supabase update error:', err);
      }
    }

    try {
      await fetch(`${getApiBaseUrl()}/api/listings/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedFields)
      });
    } catch (err) {
      console.warn('Express listing PUT error:', err);
    }
  };

  const deleteListing = async (id) => {
    setListings(prev => prev.filter(item => item.id !== id));
    if (activeProductDetail && activeProductDetail.id === id) {
      setActiveProductDetail(null);
    }
    addToast('Listing deleted from marketplace', 'info');

    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.from('listings').delete().eq('id', toUuid(id));
      } catch (err) {
        console.warn('Supabase delete error:', err);
      }
    }

    try {
      await fetch(`${getApiBaseUrl()}/api/listings/${id}`, {
        method: 'DELETE'
      });
    } catch (err) {
      console.warn('Express listing DELETE error:', err);
    }
  };

  const markListingStatus = (id, status) => {
    setListings(prev => prev.map(item => item.id === id ? { ...item, status } : item));
    if (activeProductDetail && activeProductDetail.id === id) {
      setActiveProductDetail(prev => ({ ...prev, status }));
    }
    
    if (status === 'sold') {
      confetti({ particleCount: 80, spread: 60, origin: { y: 0.6 } });
      addToast('Item marked as SOLD! Deal complete 🎉', 'success');
      
      // Trigger review modal if transacted item was bought by active user or sold by active user
      const targetListing = listings.find(l => l.id === id);
      if (targetListing) {
        setReviewPendingProduct(targetListing);
      }
    } else if (status === 'reserved') {
      addToast('Item marked as RESERVED for buyer', 'info');
    }
  };

  // Chat & Messaging Handlers (Throttling & Rate-Limiting Protection)
  const lastSendTimeRef = React.useRef(0);

  const startOrOpenChat = (product) => {
    const existingConv = conversations.find(c => {
      if (c.product_id !== product.id) return false;
      const isBuyer = c.buyer_id === currentUser.id;
      const isSeller = c.seller_id === currentUser.id;
      const buyerStudent = allStudents.find(s => s.id === c.buyer_id);
      const sellerStudent = allStudents.find(s => s.id === c.seller_id);
      const emailMatch = (buyerStudent && buyerStudent.email?.toLowerCase() === currentUser.email?.toLowerCase()) ||
                         (sellerStudent && sellerStudent.email?.toLowerCase() === currentUser.email?.toLowerCase());
      return isBuyer || isSeller || emailMatch;
    });

    if (existingConv) {
      setActiveChat(existingConv);
    } else {
      const clientMsgId = `msg_client_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
      const newConv = {
        id: `conv_${Date.now()}`,
        product_id: product.id,
        buyer_id: currentUser.id,
        seller_id: product.seller_id,
        last_message: `Hi, I'm interested in your ${product.title}`,
        updated_at: new Date().toISOString(),
        messages: [
          {
            id: clientMsgId,
            sender_id: currentUser.id,
            receiver_id: product.seller_id,
            content: `Hi! Is your ${product.title} still available for ₹${product.price}?`,
            status: 'sent',
            created_at: new Date().toISOString()
          }
        ]
      };

      setConversations(prev => [newConv, ...prev]);
      setActiveChat(newConv);

      // Persist to Supabase or Express backend
      if (isSupabaseConfigured && supabase) {
        supabase.from('conversations').insert({
          id: toUuid(newConv.id),
          product_id: toUuid(product.id),
          buyer_id: toUuid(currentUser.id),
          seller_id: toUuid(product.seller_id),
          last_message: newConv.last_message
        }).then(({ error }) => {
          if (error) console.error('Supabase conversation insert notice:', error.message);
          supabase.from('messages').insert({
            id: toUuid(clientMsgId),
            conversation_id: toUuid(newConv.id),
            sender_id: toUuid(currentUser.id),
            content: newConv.messages[0].content
          }).then(({ error: msgErr }) => {
            if (msgErr) console.error('Supabase initial message insert notice:', msgErr.message);
          });
        });
      } else {
        fetch(`${getApiBaseUrl()}/api/conversations`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            product_id: product.id,
            buyer_id: currentUser.id,
            seller_id: product.seller_id,
            initial_message: newConv.messages[0].content
          })
        }).catch(err => console.error('Express conversation POST error:', err));
      }
    }
  };

  const sendMessage = async (conversationId, content, offerPrice = null, meetupSpot = null) => {
    // 1. Rate Limiting Protection (500ms throttle against rapid spam / double clicks)
    const now = Date.now();
    if (now - lastSendTimeRef.current < 400) {
      console.warn('Realtime Chat: Rate limit throttled duplicate message submission');
      return;
    }
    lastSendTimeRef.current = now;

    const conv = conversations.find(c => c.id === conversationId);
    if (!conv) {
      console.error('Realtime Chat Error: Target conversation not found', conversationId);
      return;
    }

    const receiverId = conv.buyer_id === currentUser.id ? conv.seller_id : conv.buyer_id;
    const clientMsgId = `msg_${now}_${Math.random().toString(36).substring(2, 7)}`;

    // 2. Add message with 'sent' status immediately to local state & cross-tab sync
    const optimisticMessage = {
      id: clientMsgId,
      sender_id: currentUser.id,
      receiver_id: receiverId,
      content: content.trim(),
      offer_price: offerPrice ? parseFloat(offerPrice) : null,
      meetup_spot: meetupSpot,
      status: 'sent',
      created_at: new Date().toISOString()
    };

    setConversations(prev => prev.map(c => {
      if (c.id === conversationId) {
        if (c.messages.some(m => m.id === clientMsgId)) return c;
        return {
          ...c,
          last_message: content.trim(),
          updated_at: optimisticMessage.created_at,
          messages: [...c.messages, optimisticMessage]
        };
      }
      return c;
    }));

    if (activeChat && activeChat.id === conversationId) {
      setActiveChat(prev => ({
        ...prev,
        last_message: content.trim(),
        messages: prev.messages.some(m => m.id === clientMsgId) 
          ? prev.messages 
          : [...prev.messages, optimisticMessage]
      }));
    }

    // Helper to update message status in state
    const updateMsgStatus = (msgId, newStatus) => {
      setConversations(prev => prev.map(c => {
        if (c.id === conversationId) {
          return {
            ...c,
            messages: c.messages.map(m => m.id === msgId ? { ...m, status: newStatus } : m)
          };
        }
        return c;
      }));
      if (activeChat && activeChat.id === conversationId) {
        setActiveChat(prev => ({
          ...prev,
          messages: prev.messages.map(m => m.id === msgId ? { ...m, status: newStatus } : m)
        }));
      }
    };

    // 3. Sync to Supabase or Express backend DB (graceful fallback)
    if (isSupabaseConfigured && supabase) {
      try {
        const { error } = await supabase.from('messages').insert({
          id: toUuid(clientMsgId),
          conversation_id: toUuid(conversationId),
          sender_id: toUuid(currentUser.id),
          content: content.trim(),
          offer_price: offerPrice ? parseFloat(offerPrice) : null,
          meetup_spot: meetupSpot || null
        });
        if (error) {
          console.warn('Supabase remote insert notice:', error.message || error);
        }
        updateMsgStatus(clientMsgId, 'sent');
      } catch (err) {
        console.warn('Supabase real-time send exception:', err);
        updateMsgStatus(clientMsgId, 'sent');
      }
    } else {
      try {
        await fetch(`${getApiBaseUrl()}/api/messages`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            client_msg_id: clientMsgId,
            conversation_id: conversationId,
            sender_id: currentUser.id,
            receiver_id: receiverId,
            content: content.trim(),
            offer_price: offerPrice ? parseFloat(offerPrice) : null,
            meetup_spot: meetupSpot
          })
        });
        updateMsgStatus(clientMsgId, 'sent');
      } catch (err) {
        console.warn('Express server unreachable, using local store:', err);
        updateMsgStatus(clientMsgId, 'sent');
      }
    }
  };

  // Review Handlers
  const submitReview = ({ product_id, reviewee_id, rating, comment, tags }) => {
    const newReview = {
      id: `rev_${Date.now()}`,
      product_id,
      reviewer_id: currentUser.id,
      reviewee_id,
      rating: parseInt(rating),
      comment,
      tags: tags || [],
      created_at: new Date().toISOString()
    };

    setReviews(prev => [newReview, ...prev]);

    // Update target student's aggregate rating
    setAllStudents(prev => prev.map(student => {
      if (student.id === reviewee_id) {
        const studentReviews = reviews.filter(r => r.reviewee_id === reviewee_id);
        const newTotalCount = studentReviews.length + 1;
        const newSum = studentReviews.reduce((sum, r) => sum + r.rating, 0) + parseInt(rating);
        const newAvg = (newSum / newTotalCount).toFixed(1);

        return {
          ...student,
          rating_avg: parseFloat(newAvg),
          rating_count: newTotalCount
        };
      }
      return student;
    }));

    setReviewPendingProduct(null);
    addToast('Review & Rating submitted! Thank you for strengthening campus trust.', 'success');
  };

  // Filtered & Sorted Listings Computation
  const filteredListings = listings.filter(item => {
    // Search Filter
    const matchesSearch = searchQuery === '' || 
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.campus_location.toLowerCase().includes(searchQuery.toLowerCase());

    // Category Filter
    const matchesCategory = selectedCategory === 'all' 
      ? true 
      : selectedCategory === 'my_listings'
      ? item.seller_id === currentUser?.id
      : item.category === selectedCategory;

    // Condition Filter
    const matchesCondition = selectedCondition === 'all' || item.condition === selectedCondition;

    // Price Range Filter
    const matchesPrice = item.price >= priceRange.min && item.price <= priceRange.max;

    return matchesSearch && matchesCategory && matchesCondition && matchesPrice;
  }).sort((a, b) => {
    if (sortBy === 'price-low') return a.price - b.price;
    if (sortBy === 'price-high') return b.price - a.price;
    if (sortBy === 'popular') return (b.views_count || 0) - (a.views_count || 0);
    return new Date(b.created_at) - new Date(a.created_at); // newest
  });

  return (
    <AppContext.Provider
      value={{
        // Auth & User
        currentUser,
        allStudents,
        switchPersona,
        handleLogin,
        signInWithGoogle,
        handleLogout,
        handleDeleteAccount,
        viewMode,
        setViewMode,
        selectedCollege,
        setSelectedCollege,
        isAuthOpen,
        setIsAuthOpen,
        isProfileOpen,
        setIsProfileOpen,

        // Data & Filters
        listings: filteredListings,
        rawListings: listings,
        searchQuery,
        setSearchQuery,
        selectedCategory,
        setSelectedCategory,
        selectedCondition,
        setSelectedCondition,
        priceRange,
        setPriceRange,
        sortBy,
        setSortBy,

        // Actions
        addListing,
        updateListing,
        deleteListing,
        markListingStatus,

        // Modals
        isCreateListingOpen,
        setIsCreateListingOpen,
        isMyListingsOpen,
        setIsMyListingsOpen,
        editingListing,
        setEditingListing,
        activeProductDetail,
        setActiveProductDetail,

        // Chat & Messages
        conversations,
        activeChat,
        setActiveChat,
        startOrOpenChat,
        sendMessage,

        // Reviews
        reviews,
        submitReview,
        reviewPendingProduct,
        setReviewPendingProduct,

        // Toasts & Theme
        toasts,
        addToast,
        theme,
        toggleTheme,

        // Supabase Status
        isSupabaseConfigured
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);
