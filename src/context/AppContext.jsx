import React, { createContext, useContext, useState, useEffect } from 'react';
import { MOCK_COLLEGES } from '../data/mockData';
import { supabase, isSupabaseConfigured, isThaparEmail } from '../lib/supabase';
import confetti from 'canvas-confetti';
import { filterAndSortSmartListings, calculateListingRelevanceScore } from '../utils/smartSearch';

const AppContext = createContext();

// Helper to generate RFC4122 compliant v4 UUIDs for native cross-device ID matching
const generateUuid = () => {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
};

// Helper to convert legacy non-UUID string IDs to PostgreSQL UUID format
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
    return saved ? JSON.parse(saved) : null;
  });

  const [allStudents, setAllStudents] = useState(() => {
    const saved = localStorage.getItem('notolx_students');
    return saved ? JSON.parse(saved) : [];
  });

  // Listings State
  const [listings, setListings] = useState(() => {
    const saved = localStorage.getItem('notolx_listings');
    if (!saved) return [];
    try {
      const parsed = JSON.parse(saved);
      // Filter out any legacy dummy products (e.g. prod_101)
      return Array.isArray(parsed) ? parsed.filter(item => !String(item.id).startsWith('prod_10')) : [];
    } catch {
      return [];
    }
  });

  // Campus Item Requests State (Wanted Items on Campus)
  const [itemRequests, setItemRequests] = useState(() => {
    const saved = localStorage.getItem('notolx_item_requests');
    if (!saved) return [];
    try {
      const parsed = JSON.parse(saved);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  });

  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);
  const [isCampusRequestsBoardOpen, setIsCampusRequestsBoardOpen] = useState(false);
  const [prefilledRequestQuery, setPrefilledRequestQuery] = useState('');

  // Conversations & Messages State
  const [conversations, setConversations] = useState(() => {
    const saved = localStorage.getItem('notolx_conversations');
    if (!saved) return [];
    try {
      const parsed = JSON.parse(saved);
      return Array.isArray(parsed) ? parsed.filter(c => !String(c.id).startsWith('conv_1') && !String(c.product_id).startsWith('prod_10')) : [];
    } catch {
      return [];
    }
  });

  // Reviews State
  const [reviews, setReviews] = useState(() => {
    const saved = localStorage.getItem('notolx_reviews');
    if (!saved) return [];
    try {
      const parsed = JSON.parse(saved);
      return Array.isArray(parsed) ? parsed.filter(r => !String(r.id).startsWith('rev_')) : [];
    } catch {
      return [];
    }
  });

  // Unified Campus Theme (Vintage Parchment & Maroon)
  const [theme] = useState('vintage');

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', 'vintage');
  }, []);

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
    localStorage.setItem('notolx_item_requests', JSON.stringify(itemRequests));
  }, [itemRequests]);

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
    if (typeof window !== 'undefined') {
      return '';
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
          addToast('Access Denied: Only @thapar.edu email accounts are permitted on notoLX.', 'error');
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
        // 1. Fetch Listings
        const { data: dbListings } = await supabase
          .from('listings')
          .select('*')
          .order('created_at', { ascending: false });

        if (dbListings) {
          setListings(dbListings);
        }

        // 2. Fetch Profiles for seller info
        const { data: dbProfiles } = await supabase.from('profiles').select('*');
        if (dbProfiles && dbProfiles.length > 0) {
          setAllStudents(dbProfiles);
        }

        const { data: dbReviews } = await supabase.from('reviews').select('*');
        if (dbReviews && dbReviews.length > 0) {
          setReviews(dbReviews);
        }

        // 3. Fetch Active Item Requests (Wanted Items)
        const { data: dbRequests } = await supabase
          .from('item_requests')
          .select('*')
          .order('created_at', { ascending: false });

        if (dbRequests) {
          setItemRequests(dbRequests.filter(r => r.status !== 'cancelled'));
        }

        // 4. Fetch Conversations & Messages for logged in user
        if (currentUser?.id) {
          const { data: dbConvs } = await supabase
            .from('conversations')
            .select('*')
            .or(`buyer_id.eq.${currentUser.id},seller_id.eq.${currentUser.id}`)
            .order('updated_at', { ascending: false });

          if (dbConvs && dbConvs.length > 0) {
            const convIds = dbConvs.map(c => c.id);
            const { data: dbMsgs } = await supabase
              .from('messages')
              .select('*')
              .in('conversation_id', convIds)
              .order('created_at', { ascending: true });

            const structuredConvs = dbConvs.map(conv => {
              const convMsgs = (dbMsgs || []).filter(m => m.conversation_id === conv.id);
              return {
                ...conv,
                messages: convMsgs
              };
            });

            setConversations(structuredConvs);
          }
        }
      } catch (err) {
        console.warn('Supabase cross-device fetch warning:', err);
      }

      // Also sync item requests from Express backend if active
      try {
        const reqRes = await fetch(`${getApiBaseUrl()}/api/item-requests`);
        if (reqRes.ok) {
          const reqJson = await reqRes.json();
          if (reqJson && reqJson.requests) {
            setItemRequests(prev => {
              const remoteIds = new Set(reqJson.requests.map(r => r.id));
              const localOnly = prev.filter(r => !remoteIds.has(r.id));
              return [...reqJson.requests, ...localOnly];
            });
          }
        }
      } catch (apiErr) {
        // quiet fallback
      }
    };

    fetchSupabaseData();
    const syncInterval = setInterval(fetchSupabaseData, 2000);

    // Supabase Realtime subscription for cross-device live messages, listings & item requests
    const channel = supabase
      .channel('public:notolx_realtime')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'messages' }, () => fetchSupabaseData())
      .on('postgres_changes', { event: '*', schema: 'public', table: 'conversations' }, () => fetchSupabaseData())
      .on('postgres_changes', { event: '*', schema: 'public', table: 'listings' }, () => fetchSupabaseData())
      .on('postgres_changes', { event: '*', schema: 'public', table: 'item_requests' }, () => fetchSupabaseData())
      .subscribe();

    return () => {
      clearInterval(syncInterval);
      supabase.removeChannel(channel);
    };
  }, [currentUser]);


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

    const listingId = generateUuid();
    const sellerId = currentUser.id;

    const newListing = {
      id: listingId,
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
        const { error } = await supabase.from('listings').insert([newListing]);
        if (error) {
          console.error('Supabase listing insert error:', error.message);
          addToast(`Cloud sync error: ${error.message}`, 'error');
        } else {
          addToast('Item listed live on campus marketplace!', 'success');
        }
      } catch (err) {
        console.error('Supabase listing insert exception:', err);
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

    // Check active campus requests and send email notifications if item matches
    try {
      const activeRequests = itemRequests.filter(req => req.status === 'active');
      const newTitle = (newListing.title || '').toLowerCase();
      const newDesc = (newListing.description || '').toLowerCase();

      const matchedRequests = activeRequests.filter(req => {
        const reqName = (req.item_name || '').toLowerCase().trim();
        if (!reqName) return false;

        // 1. Exact or partial substring match in title or description
        if (newTitle.includes(reqName) || reqName.includes(newTitle)) return true;
        if (newDesc && newDesc.includes(reqName)) return true;

        // 2. Tokenized Smart Search Relevance score
        const score = calculateListingRelevanceScore(newListing, reqName);
        if (score >= 20) return true;

        // 3. Significant word intersection
        const reqWords = reqName.split(/\s+/).filter(w => w.length >= 3);
        const wordMatch = reqWords.some(w => newTitle.includes(w) || (newDesc && newDesc.includes(w)));
        if (wordMatch) return true;

        // 4. Category match
        if (req.category && req.category !== 'all' && req.category === newListing.category) {
          const partialWord = reqWords.some(w => newTitle.includes(w.slice(0, 3)));
          if (partialWord) return true;
        }

        return false;
      });

      if (matchedRequests.length > 0) {
        for (const matchedReq of matchedRequests) {
          try {
            const apiRes = await fetch(`${getApiBaseUrl()}/api/notify-request-match`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                requester_email: matchedReq.requester_email,
                requester_name: matchedReq.requester_name,
                item_name: matchedReq.item_name,
                listing: {
                  id: newListing.id,
                  title: newListing.title,
                  price: newListing.price,
                  campus_location: newListing.campus_location,
                  condition: newListing.condition
                }
              })
            });

            if (apiRes.ok) {
              const resData = await apiRes.json();
              if (resData.sentReal) {
                addToast(`📧 Instant email sent to ${matchedReq.requester_email} for "${matchedReq.item_name}"!`, 'success');
              } else if (resData.previewUrl) {
                addToast(`📧 Match found! Notification generated for ${matchedReq.requester_name} (Logged preview URL)`, 'info');
                console.log(`🔗 [Campus Request Match Preview]: ${resData.previewUrl}`);
              } else {
                addToast(`📢 Matched student request for "${matchedReq.item_name}"! Notification email sent to ${matchedReq.requester_email}`, 'success');
              }
            } else {
              console.warn('Notification endpoint response status:', apiRes.status);
              addToast(`📢 Matched campus request for "${matchedReq.item_name}" (${matchedReq.requester_email})!`, 'info');
            }
          } catch (notifyErr) {
            console.warn('Notification email dispatch error:', notifyErr);
            addToast(`📢 Matched student request for "${matchedReq.item_name}" (${matchedReq.requester_email})!`, 'info');
          }
        }
      }
    } catch (matchErr) {
      console.warn('Error checking request matches:', matchErr);
    }
  };

  // Campus Item Request Handlers (Wanted Items)
  const addItemRequest = async (requestData) => {
    if (!currentUser || !currentUser.id) {
      addToast('Authentication required. Please sign in with your @thapar.edu email to request items.', 'error');
      setIsAuthOpen(true);
      return false;
    }

    const requestId = generateUuid();
    const newRequest = {
      id: requestId,
      requester_id: currentUser.id,
      requester_name: currentUser.full_name || 'Thapar Student',
      requester_email: currentUser.email,
      item_name: requestData.item_name.trim(),
      category: requestData.category || 'all',
      max_budget: requestData.max_budget ? parseFloat(requestData.max_budget) : null,
      description: requestData.description || '',
      campus_location: requestData.campus_location || `${currentUser?.dorm_block || 'Hostel'} / Main Quad`,
      status: 'active',
      created_at: new Date().toISOString()
    };

    setItemRequests(prev => [newRequest, ...prev]);
    setIsRequestModalOpen(false);
    confetti({ particleCount: 50, spread: 50, origin: { y: 0.6 } });
    addToast('Item request posted! Campus community will see it & you\'ll receive an email if listed.', 'success');

    // Sync to Supabase cloud if active
    if (isSupabaseConfigured && supabase) {
      try {
        const { error } = await supabase.from('item_requests').insert([newRequest]);
        if (error) {
          console.warn('Supabase request insert notice:', error.message);
        }
      } catch (err) {
        console.warn('Supabase request insert exception:', err);
      }
    }

    // Sync to Express backend server
    try {
      await fetch(`${getApiBaseUrl()}/api/item-requests`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newRequest)
      });
    } catch (err) {
      console.warn('Express item-request post error:', err);
    }

    return true;
  };

  const deleteItemRequest = async (id) => {
    setItemRequests(prev => prev.filter(item => item.id !== id));
    addToast('Item request removed', 'info');

    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.from('item_requests').delete().eq('id', toUuid(id));
      } catch (err) {
        console.warn('Supabase request delete error:', err);
      }
    }

    try {
      await fetch(`${getApiBaseUrl()}/api/item-requests/${id}`, {
        method: 'DELETE'
      });
    } catch (err) {
      console.warn('Express request delete error:', err);
    }
  };

  const fulfillItemRequest = async (id) => {
    setItemRequests(prev => prev.map(item => item.id === id ? { ...item, status: 'fulfilled' } : item));
    addToast('Item request marked as fulfilled! 🎉', 'success');

    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.from('item_requests').update({ status: 'fulfilled' }).eq('id', toUuid(id));
      } catch (err) {
        console.warn('Supabase request fulfill error:', err);
      }
    }

    try {
      await fetch(`${getApiBaseUrl()}/api/item-requests/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'fulfilled' })
      });
    } catch (err) {
      console.warn('Express request update error:', err);
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

  const markListingStatus = async (id, status) => {
    setListings(prev => {
      const updated = prev.map(item => item.id === id ? { ...item, status } : item);
      localStorage.setItem('notolx_listings', JSON.stringify(updated));
      return updated;
    });

    if (activeProductDetail && activeProductDetail.id === id) {
      setActiveProductDetail(prev => (prev ? { ...prev, status } : null));
    }
    
    if (status === 'sold') {
      confetti({ particleCount: 80, spread: 60, origin: { y: 0.6 } });
      addToast('Item marked as SOLD! Deal complete 🎉', 'success');
      
      const targetListing = listings.find(l => l.id === id);
      if (targetListing) {
        setReviewPendingProduct(targetListing);
      }
    } else if (status === 'reserved') {
      addToast('Item marked as RESERVED for buyer', 'info');
    } else if (status === 'available') {
      addToast('Item marked as AVAILABLE again', 'info');
    }

    // Persist to Supabase cloud if active
    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.from('listings').update({ status }).eq('id', toUuid(id));
      } catch (err) {
        console.warn('Supabase status update error:', err);
      }
    }

    // Persist to Express backend so live 3-second polling retains updated status
    try {
      await fetch(`${getApiBaseUrl()}/api/listings/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
    } catch (err) {
      console.warn('Express listing status PUT error:', err);
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
      const clientMsgId = generateUuid();
      const convId = generateUuid();
      const initialContent = `Hi! Is your ${product.title} still available for ₹${product.price}?`;

      const newConv = {
        id: convId,
        product_id: product.id,
        buyer_id: currentUser.id,
        seller_id: product.seller_id,
        last_message: initialContent,
        updated_at: new Date().toISOString(),
        created_at: new Date().toISOString(),
        messages: [
          {
            id: clientMsgId,
            conversation_id: convId,
            sender_id: currentUser.id,
            content: initialContent,
            status: 'sent',
            created_at: new Date().toISOString()
          }
        ]
      };

      setConversations(prev => [newConv, ...prev]);
      setActiveChat(newConv);

      // Persist to Supabase or Express backend
      if (isSupabaseConfigured && supabase) {
        supabase.from('conversations').insert([{
          id: convId,
          product_id: product.id,
          buyer_id: currentUser.id,
          seller_id: product.seller_id,
          last_message: initialContent
        }]).then(({ error }) => {
          if (error) console.error('Supabase conversation insert notice:', error.message);
          supabase.from('messages').insert([{
            id: clientMsgId,
            conversation_id: convId,
            sender_id: currentUser.id,
            content: initialContent
          }]).then(({ error: msgErr }) => {
            if (msgErr) console.error('Supabase initial message insert notice:', msgErr.message);
          });
        });
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
    const clientMsgId = generateUuid();

    // 2. Add message with 'sent' status immediately to local state & cross-tab sync
    const optimisticMessage = {
      id: clientMsgId,
      conversation_id: conversationId,
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
        const { error } = await supabase.from('messages').insert([{
          id: clientMsgId,
          conversation_id: conversationId,
          sender_id: currentUser.id,
          content: content.trim(),
          offer_price: offerPrice ? parseFloat(offerPrice) : null,
          meetup_spot: meetupSpot || null
        }]);

        await supabase.from('conversations').update({
          last_message: content.trim(),
          updated_at: new Date().toISOString()
        }).eq('id', conversationId);

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
  const submitReview = async ({ product_id, reviewee_id, rating, comment, tags }) => {
    if (!currentUser || !currentUser.id || !reviewee_id) return;

    const reviewId = generateUuid();
    const newReview = {
      id: reviewId,
      product_id: toUuid(product_id),
      reviewer_id: currentUser.id,
      reviewee_id: reviewee_id,
      rating: parseInt(rating),
      comment: comment ? comment.trim() : '',
      tags: tags || [],
      created_at: new Date().toISOString()
    };

    setReviews(prev => [newReview, ...prev.filter(r => !(r.product_id === product_id && r.reviewer_id === currentUser.id))]);

    // Update target student's aggregate rating in local state
    const targetStudentReviews = [...reviews.filter(r => r.reviewee_id === reviewee_id && r.id !== reviewId), newReview];
    const newTotalCount = targetStudentReviews.length;
    const newSum = targetStudentReviews.reduce((sum, r) => sum + r.rating, 0);
    const newAvg = parseFloat((newSum / newTotalCount).toFixed(1));

    setAllStudents(prev => prev.map(student => {
      if (student.id === reviewee_id) {
        return {
          ...student,
          rating_avg: newAvg,
          rating_count: newTotalCount
        };
      }
      return student;
    }));

    setReviewPendingProduct(null);
    addToast('Review & Rating submitted! Thank you for strengthening campus trust.', 'success');

    // Sync to Supabase Cloud Database if active
    if (isSupabaseConfigured && supabase) {
      try {
        const { error: revErr } = await supabase.from('reviews').insert([{
          id: reviewId,
          product_id: toUuid(product_id),
          reviewer_id: currentUser.id,
          reviewee_id: reviewee_id,
          rating: parseInt(rating),
          comment: comment ? comment.trim() : '',
          tags: tags || []
        }]);

        if (revErr) {
          console.warn('Supabase review insert notice:', revErr.message);
        }

        const { error: profErr } = await supabase.from('profiles').update({
          rating_avg: newAvg,
          rating_count: newTotalCount
        }).eq('id', reviewee_id);

        if (profErr) {
          console.warn('Supabase profile rating update notice:', profErr.message);
        }
      } catch (err) {
        console.warn('Supabase review sync exception:', err);
      }
    }
  };

  // Filtered & Sorted Listings Computation (Smart Search Engine)
  const filteredListings = filterAndSortSmartListings(
    listings,
    searchQuery,
    selectedCategory,
    selectedCondition,
    priceRange,
    sortBy,
    currentUser
  );

  return (
    <AppContext.Provider
      value={{
        // Auth & User
        currentUser,
        allStudents,
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

        // Campus Item Requests (Wanted Items)
        itemRequests,
        addItemRequest,
        deleteItemRequest,
        fulfillItemRequest,
        isRequestModalOpen,
        setIsRequestModalOpen,
        isCampusRequestsBoardOpen,
        setIsCampusRequestsBoardOpen,
        prefilledRequestQuery,
        setPrefilledRequestQuery,

        // Toasts & Theme
        toasts,
        addToast,
        theme,

        // Supabase Status
        isSupabaseConfigured
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);
