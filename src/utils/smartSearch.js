/**
 * Smart Search Engine for notoLX Campus Marketplace
 * Provides tokenized fuzzy matching, campus synonym expansion, and relevance scoring.
 */

// Campus Synonym & Keyword Dictionary
const SYNONYM_GROUPS = [
  ['cycle', 'bike', 'bicycle', 'sprint', 'hero', 'gear cycle'],
  ['calculator', 'calc', 'casio', 'classwiz', 'scientific', 'fx991ex', 'fx-991ex', 'maths', 'math'],
  ['textbook', 'book', 'notes', 'coursework', 'dsa', 'algo', 'c++', 'weiss', 'study', 'engineering'],
  ['fridge', 'refrigerator', 'mini fridge', 'kettle', 'iron', 'appliance', 'hostel'],
  ['mouse', 'keyboard', 'headphone', 'laptop', 'charger', 'tech', 'electronics', 'gadget'],
  ['lab coat', 'lab', 'coat', 'apron', 'chemistry', 'attire'],
  ['gym', 'dumbbell', 'weights', 'sports', 'racket', 'badminton', 'cricket']
];

// Common stop words to filter out from search queries
const STOP_WORDS = new Set(['a', 'an', 'the', 'in', 'on', 'at', 'for', 'to', 'of', 'and', 'is', 'with', 'my', 'or']);

/**
 * Expand query tokens with related synonyms
 */
const expandTokensWithSynonyms = (tokens) => {
  const expanded = new Set(tokens);

  tokens.forEach(token => {
    SYNONYM_GROUPS.forEach(group => {
      if (group.some(term => term.includes(token) || token.includes(term))) {
        group.forEach(synonym => expanded.add(synonym));
      }
    });
  });

  return Array.from(expanded);
};

/**
 * Tokenize and normalize search text
 */
export const tokenizeSearchQuery = (query) => {
  if (!query || typeof query !== 'string') return [];
  
  const rawTokens = query
    .toLowerCase()
    .replace(/[^\w\s]/g, ' ')
    .trim()
    .split(/\s+/);

  return rawTokens.filter(token => token.length > 0 && !STOP_WORDS.has(token));
};

/**
 * Compute relevance score for a marketplace listing based on search query
 * @param {Object} item - Marketplace listing object
 * @param {String} query - User search prompt
 * @returns {Number} Relevance score (0 = no match)
 */
export const calculateListingRelevanceScore = (item, query) => {
  if (!query || !query.trim()) return 1; // Default match when no query
  if (!item) return 0;

  const rawQuery = query.toLowerCase().trim();
  const queryTokens = tokenizeSearchQuery(query);
  if (queryTokens.length === 0) return 1;

  const expandedTokens = expandTokensWithSynonyms(queryTokens);

  const title = (item.title || '').toLowerCase();
  const description = (item.description || '').toLowerCase();
  const category = (item.category || '').toLowerCase();
  const location = (item.campus_location || '').toLowerCase();
  const condition = (item.condition || '').toLowerCase();
  const sellerName = (item.seller_name || '').toLowerCase();

  let totalScore = 0;

  // 1. Direct Full Query Substring Match (Highest priority)
  if (title.includes(rawQuery)) totalScore += 150;
  if (category.includes(rawQuery)) totalScore += 100;
  if (description.includes(rawQuery)) totalScore += 40;
  if (location.includes(rawQuery)) totalScore += 30;

  // 2. Token-by-Token Match Scoring
  queryTokens.forEach(token => {
    // Exact word in title
    if (title.includes(token)) totalScore += 60;
    // Category match
    if (category.includes(token)) totalScore += 50;
    // Description match
    if (description.includes(token)) totalScore += 20;
    // Location match
    if (location.includes(token)) totalScore += 15;
    // Condition match
    if (condition.includes(token)) totalScore += 10;
    // Seller name match
    if (sellerName.includes(token)) totalScore += 15;
  });

  // 3. Synonym & Related Term Scoring
  expandedTokens.forEach(synonymToken => {
    if (!queryTokens.includes(synonymToken)) {
      if (title.includes(synonymToken)) totalScore += 35;
      if (category.includes(synonymToken)) totalScore += 30;
      if (description.includes(synonymToken)) totalScore += 15;
    }
  });

  return totalScore;
};

/**
 * Filter and sort listings using Smart Search relevance scoring
 */
export const filterAndSortSmartListings = (listings, searchQuery, selectedCategory, selectedCondition, priceRange, sortBy, currentUser = null) => {
  if (!listings || !Array.isArray(listings)) return [];

  const searchActive = Boolean(searchQuery && searchQuery.trim());

  // 1. Calculate relevance scores & apply filters
  const scoredItems = listings.map(item => {
    const score = calculateListingRelevanceScore(item, searchQuery);
    return { item, score };
  }).filter(({ item, score }) => {
    // If search active, item must have score > 0
    if (searchActive && score <= 0) return false;

    // Category Filter
    const matchesCategory = selectedCategory === 'all' 
      ? true 
      : selectedCategory === 'my_listings'
      ? (item.seller_id === currentUser?.id || (currentUser?.email && item.seller_email && item.seller_email.toLowerCase() === currentUser.email.toLowerCase()))
      : item.category === selectedCategory;

    // Condition Filter
    const matchesCondition = selectedCondition === 'all' || item.condition === selectedCondition;

    // Price Range Filter
    const itemPrice = parseFloat(item.price) || 0;
    const matchesPrice = itemPrice >= priceRange.min && itemPrice <= priceRange.max;

    return matchesCategory && matchesCondition && matchesPrice;
  });

  // 2. Sort Items
  scoredItems.sort((a, b) => {
    // When search is active, rank primarily by Smart Relevance Score
    if (searchActive && a.score !== b.score) {
      return b.score - a.score;
    }

    // User-selected Sorting
    if (sortBy === 'price-low') return a.item.price - b.item.price;
    if (sortBy === 'price-high') return b.item.price - a.item.price;
    if (sortBy === 'popular') return (b.item.views_count || 0) - (a.item.views_count || 0);
    
    // Default: Newest first
    return new Date(b.item.created_at) - new Date(a.item.created_at);
  });

  return scoredItems.map(entry => entry.item);
};
