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
  const [priceRange, setPriceRange] = useState({ min: 0, max: 500 });
  const [sortBy, setSortBy] = useState('newest'); // 'newest', 'price-low', 'price-high', 'popular'

  // Modal Control States
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isCreateListingOpen, setIsCreateListingOpen] = useState(false);
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
  useEffect(() => {
    if (!activeChat) return;

    const syncLiveMessages = async () => {
      // 1. Fetch from Express backend server if available
      try {
        const res = await fetch('http://localhost:5000/api/conversations');
        if (res.ok) {
          const data = await res.json();
          if (data.conversations && data.conversations.length > 0) {
            setConversations(prev => {
              // Merge remote server conversations with local state
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
    };

    const interval = setInterval(syncLiveMessages, 1000);
    return () => clearInterval(interval);
  }, [activeChat]);

  useEffect(() => {
    localStorage.setItem('notolx_reviews', JSON.stringify(reviews));
  }, [reviews]);

  // Real-Time Cross-Tab Live Messaging Listener (Syncs buyer/seller chat instantly across browser tabs/windows)
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
    };

    window.addEventListener('storage', handleStorageSync);
    return () => window.removeEventListener('storage', handleStorageSync);
  }, []);

  // Supabase Auth Listener for Google OAuth (@thapar.edu domain policy enforcement & automatic redirection)
  useEffect(() => {
    if (!isSupabaseConfigured || !supabase) return;

    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      if ((event === 'SIGNED_IN' || event === 'INITIAL_SESSION' || event === 'TOKEN_REFRESHED') && session?.user) {
        const userEmail = session.user.email || '';
        if (!isThaparEmail(userEmail)) {
          // Reject non @thapar.edu accounts immediately
          await supabase.auth.signOut();
          addToast('Access Denied: Only @thapar.edu email accounts are permitted on notOLX.', 'error');
          setIsAuthOpen(true);
          setViewMode('landing');
        } else {
          // Successfully logged in via @thapar.edu Google account - redirect to main marketplace
          handleLogin(userEmail);
          setViewMode('marketplace');
        }
      }
    });

    return () => {
      authListener?.subscription?.unsubscribe();
    };
  }, []);

  // Live Supabase Integration & Realtime Subscriptions (Active when .env contains credentials)
  useEffect(() => {
    if (!isSupabaseConfigured || !supabase) return;

    const fetchSupabaseData = async () => {
      try {
        const { data: dbListings } = await supabase.from('listings').select('*');
        if (dbListings && dbListings.length > 0) {
          setListings(dbListings);
        }

        const { data: dbReviews } = await supabase.from('reviews').select('*');
        if (dbReviews && dbReviews.length > 0) {
          setReviews(dbReviews);
        }
      } catch (err) {
        console.warn('Supabase fetch error, fallback to sandbox store:', err);
      }
    };

    fetchSupabaseData();

    // Supabase Realtime subscription for live messages & listings
    const channel = supabase
      .channel('public:notolx_realtime')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages' }, payload => {
        const newMsg = payload.new;
        setConversations(prev => prev.map(c => {
          if (c.id === newMsg.conversation_id) {
            return {
              ...c,
              last_message: newMsg.content,
              messages: [...c.messages, newMsg]
            };
          }
          return c;
        }));
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'listings' }, payload => {
        if (payload.eventType === 'INSERT') {
          setListings(prev => [payload.new, ...prev]);
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
  }, []);

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

  const handleLogin = (email) => {
    const cleanEmail = (email || '').trim().toLowerCase();

    if (!cleanEmail.endsWith('@thapar.edu')) {
      addToast('Access Denied: Only @thapar.edu email accounts are allowed.', 'error');
      return false;
    }

    const existing = allStudents.find(s => s.email.toLowerCase() === cleanEmail);
    if (existing) {
      setCurrentUser(existing);
      setIsAuthOpen(false);
      localStorage.setItem('notolx_view_mode', 'marketplace');
      addToast(`Welcome back, ${existing.full_name}!`, 'success');
      return true;
    } else {
      // Create new student profile for Thapar University
      const namePart = cleanEmail.split('@')[0];
      const formattedName = namePart.split('.').map(s => s.charAt(0).toUpperCase() + s.slice(1)).join(' ');
      
      const newStudent = {
        id: `usr_${Date.now()}`,
        email: cleanEmail,
        full_name: formattedName || 'Thapar Student',
        college_name: 'Thapar Institute of Engineering & Technology',
        college_id: `TU-${Math.floor(1000 + Math.random() * 9000)}`,
        avatar_url: `https://api.dicebear.com/7.x/avataaars/svg?seed=${namePart}`,
        dorm_block: 'Thapar Hostel',
        major: 'Engineering Student',
        rating_avg: 5.0,
        rating_count: 0,
        verified: true,
        joined_date: 'Just now'
      };

      setAllStudents(prev => [...prev, newStudent]);
      setCurrentUser(newStudent);
      setIsAuthOpen(false);
      localStorage.setItem('notolx_view_mode', 'marketplace');
      addToast(`Account created! Verified student for Thapar Institute of Engineering & Technology`, 'success');
      return true;
    }
  };

  // Listing Handlers (Create, Edit, Delete, Status Change)
  const addListing = async (listingData) => {
    const newListing = {
      id: `prod_${Date.now()}`,
      seller_id: currentUser.id,
      title: listingData.title,
      description: listingData.description,
      price: parseFloat(listingData.price),
      original_price: listingData.original_price ? parseFloat(listingData.original_price) : null,
      category: listingData.category,
      condition: listingData.condition,
      images: listingData.images && listingData.images.length > 0 
        ? listingData.images 
        : ['https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?auto=format&fit=crop&w=800&q=80'],
      campus_location: listingData.campus_location || `${currentUser.dorm_block} / Main Quad`,
      status: 'available',
      views_count: 1,
      created_at: new Date().toISOString()
    };

    setListings(prev => [newListing, ...prev]);
    setIsCreateListingOpen(false);
    addToast('Item listed on campus marketplace!', 'success');

    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.from('listings').insert([newListing]);
      } catch (err) {
        console.warn('Supabase insert error:', err);
      }
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
        await supabase.from('listings').update(updatedFields).eq('id', id);
      } catch (err) {
        console.warn('Supabase update error:', err);
      }
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
        await supabase.from('listings').delete().eq('id', id);
      } catch (err) {
        console.warn('Supabase delete error:', err);
      }
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

  // Chat & Messaging Handlers
  const startOrOpenChat = (product) => {
    const existingConv = conversations.find(
      c => c.product_id === product.id && (c.buyer_id === currentUser.id || c.seller_id === currentUser.id)
    );

    if (existingConv) {
      setActiveChat(existingConv);
    } else {
      // Create new conversation between Buyer and Seller
      const newConv = {
        id: `conv_${Date.now()}`,
        product_id: product.id,
        buyer_id: currentUser.id,
        seller_id: product.seller_id,
        last_message: `Hi, I'm interested in your ${product.title}`,
        updated_at: new Date().toISOString(),
        messages: [
          {
            id: `msg_${Date.now()}`,
            sender_id: currentUser.id,
            content: `Hi! Is your ${product.title} still available for ₹${product.price}?`,
            created_at: new Date().toISOString()
          }
        ]
      };

      setConversations(prev => [newConv, ...prev]);
      setActiveChat(newConv);

      // Persist to Supabase if configured
      if (isSupabaseConfigured && supabase) {
        supabase.from('conversations').insert({
          product_id: product.id,
          buyer_id: currentUser.id,
          seller_id: product.seller_id,
          last_message: newConv.last_message
        }).then(({ data, error }) => {
          if (error) console.warn('Supabase conversation insert error:', error);
        });
      } else {
        // Persist to local Express server DB
        fetch('http://localhost:5000/api/conversations', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            product_id: product.id,
            buyer_id: currentUser.id,
            seller_id: product.seller_id,
            initial_message: newConv.messages[0].content
          })
        }).catch(() => {});
      }
    }
  };

  const sendMessage = async (conversationId, content, offerPrice = null, meetupSpot = null) => {
    const newMessage = {
      id: `msg_${Date.now()}`,
      sender_id: currentUser.id,
      content: content,
      offer_price: offerPrice ? parseFloat(offerPrice) : null,
      meetup_spot: meetupSpot,
      created_at: new Date().toISOString()
    };

    // Update local and cross-tab state immediately
    setConversations(prev => prev.map(conv => {
      if (conv.id === conversationId) {
        const updatedMessages = [...conv.messages, newMessage];
        return {
          ...conv,
          last_message: content,
          updated_at: newMessage.created_at,
          messages: updatedMessages
        };
      }
      return conv;
    }));

    if (activeChat && activeChat.id === conversationId) {
      setActiveChat(prev => ({
        ...prev,
        last_message: content,
        messages: [...prev.messages, newMessage]
      }));
    }

    // Persist message to Supabase Realtime database if active
    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.from('messages').insert({
          conversation_id: conversationId,
          sender_id: currentUser.id,
          content: content,
          offer_price: offerPrice ? parseFloat(offerPrice) : null,
          meetup_spot: meetupSpot
        });
      } catch (err) {
        console.warn('Supabase message send error:', err);
      }
    } else {
      // Persist to Express backend DB
      try {
        await fetch('http://localhost:5000/api/messages', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            conversation_id: conversationId,
            sender_id: currentUser.id,
            content: content,
            offer_price: offerPrice ? parseFloat(offerPrice) : null,
            meetup_spot: meetupSpot
          })
        });
      } catch (err) {
        console.warn('Express message post error:', err);
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
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;

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
